import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAddAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAssignmentsQuery,
  useUpdateAssignmentMutation,
} from '../api/assignmentsApi';
import type { ApiError } from '../api/fakeServer';
import { useI18n } from '../i18n/I18nProvider';
import { createAssignmentSchema } from '../schema/assignmentSchema';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAssignments, selectHighlightedId, selectSelectedAssignment } from '../store/selectors';
import { highlightAssignment, selectAssignment } from '../store/uiSlice';
import { EMPTY_FORM_VALUES, type Assignment, type AssignmentFormValues } from '../types/assignment';
import { toAssignmentInput, toFormValues } from '../utils/adapters';

export interface Notification {
  message: string;
  severity: 'success' | 'info' | 'error';
  undo?: () => void;
}

const HIGHLIGHT_MS = 2500;

/** Sayfanın tüm iş mantığı: form, seçim, kirli-form koruması, kısayollar, geri alma. */
export function useAssignmentWorkspace(formPanelRef: RefObject<HTMLElement | null>) {
  const { t } = useI18n();
  const dispatch = useAppDispatch();

  const { isLoading, isError, refetch } = useGetAssignmentsQuery();
  const items = useAppSelector(selectAssignments);
  const selected = useAppSelector(selectSelectedAssignment);
  const highlightedId = useAppSelector(selectHighlightedId);
  const selectedId = selected?.id ?? null;

  const [addAssignment] = useAddAssignmentMutation();
  const [updateAssignment] = useUpdateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  const schema = useMemo(() => createAssignmentSchema({ t, items, selectedId }), [t, items, selectedId]);
  const form = useForm<AssignmentFormValues>({
    defaultValues: EMPTY_FORM_VALUES,
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });
  const { reset, setFocus, setValue, getValues, handleSubmit, formState } = form;
  const { isDirty, isSubmitting } = formState;

  const [notification, setNotification] = useState<Notification | null>(null);
  const [pendingAction, setPendingAction] = useState<{ run: () => void } | null>(null);

  const notify = useCallback((n: Notification) => setNotification(n), []);
  const closeNotification = useCallback(() => setNotification(null), []);

  // Başarılı işlem sonrası satır vurgusunu kısa süre sonra kaldır
  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => dispatch(highlightAssignment(null)), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlightedId, dispatch]);

  /** Kaydedilmemiş değişiklik varsa onay iste, yoksa doğrudan çalıştır. */
  const guard = useCallback(
    (action: () => void) => {
      if (isDirty) setPendingAction({ run: action });
      else action();
    },
    [isDirty],
  );

  const resetToNew = useCallback(() => {
    dispatch(selectAssignment(null));
    reset(EMPTY_FORM_VALUES);
  }, [dispatch, reset]);

  const enterEdit = useCallback(
    (row: Assignment) => {
      dispatch(selectAssignment(row.id));
      reset(toFormValues(row));
      // Mobilde form ekran dışında kalabilir: düzenleme başlayınca forma kaydır
      if (window.matchMedia?.('(max-width: 899.95px)').matches) {
        formPanelRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      }
    },
    [dispatch, reset, formPanelRef],
  );

  const selectRow = useCallback(
    (row: Assignment) => {
      if (!row.isUpdatable || row.id === selectedId) return;
      guard(() => enterEdit(row));
    },
    [guard, enterEdit, selectedId],
  );

  /** "Clean" butonu: formu sıfırlar; kirli form varsa Geri al sunar. */
  const clean = useCallback(() => {
    const draft = isDirty ? getValues() : null;
    const previousId = selectedId;
    const base = selected ? toFormValues(selected) : EMPTY_FORM_VALUES;
    resetToNew();
    if (draft) {
      notify({
        message: t('formCleaned'),
        severity: 'info',
        undo: () => {
          if (previousId) dispatch(selectAssignment(previousId));
          reset(base);
          (Object.keys(draft) as (keyof AssignmentFormValues)[]).forEach((k) =>
            setValue(k, draft[k] as never, { shouldDirty: true }),
          );
          notify({ message: t('restored'), severity: 'success' });
        },
      });
    }
  }, [isDirty, getValues, selectedId, selected, resetToNew, notify, t, dispatch, reset, setValue]);

  /** Esc: düzenlemeyi iptal et (kirliyse onayla). */
  const cancelEdit = useCallback(() => {
    if (!selectedId && !isDirty) return;
    guard(resetToNew);
  }, [selectedId, isDirty, guard, resetToNew]);

  const afterSuccess = useCallback(
    (id: string) => {
      resetToNew();
      dispatch(highlightAssignment(id));
      setTimeout(() => setFocus('code'), 0);
    },
    [resetToNew, dispatch, setFocus],
  );

  const handleError = useCallback(
    (e: unknown) => {
      const error = e as ApiError | undefined;
      if (error?.code === 'DUPLICATE_CODE') {
        form.setError('code', { message: t('errCodeDuplicate') });
      } else {
        notify({ message: t('saveError'), severity: 'error' });
      }
    },
    [form, notify, t],
  );

  const onValid = useCallback(
    async (values: AssignmentFormValues) => {
      const input = toAssignmentInput(values);
      try {
        if (selected) {
          const previous = selected;
          const next = { id: selected.id, ...input };
          await updateAssignment(next).unwrap();
          afterSuccess(next.id);
          notify({
            message: t('updated', { code: input.code }),
            severity: 'success',
            undo: () => {
              updateAssignment(previous)
                .unwrap()
                .then(() => {
                  dispatch(highlightAssignment(previous.id));
                  notify({ message: t('restored'), severity: 'info' });
                })
                .catch(handleError);
            },
          });
        } else {
          const created = await addAssignment(input).unwrap();
          afterSuccess(created.id);
          notify({
            message: t('saved', { code: created.code }),
            severity: 'success',
            undo: () => {
              deleteAssignment(created.id)
                .unwrap()
                .then(() => notify({ message: t('deleted', { code: created.code }), severity: 'info' }))
                .catch(handleError);
            },
          });
        }
      } catch (e) {
        handleError(e);
      }
    },
    [
      selected,
      updateAssignment,
      addAssignment,
      deleteAssignment,
      afterSuccess,
      notify,
      t,
      dispatch,
      handleError,
    ],
  );

  const submit = handleSubmit(onValid);

  // Klavye kısayolları: Ctrl/Cmd+S kaydet, Esc iptal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (pendingAction) return; // onay diyaloğu açıkken kısayol çalışmaz
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void submit();
      } else if (e.key === 'Escape' && !e.defaultPrevented) {
        cancelEdit();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [submit, cancelEdit, pendingAction]);

  // Sekme kapatılırken kirli form uyarısı
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  return {
    form,
    items,
    isLoading,
    isError,
    refetch,
    selected,
    selectedId,
    highlightedId,
    isEditMode: selected !== null,
    isDirty,
    isSubmitting,
    submit,
    clean,
    selectRow,
    notification,
    closeNotification,
    confirmOpen: pendingAction !== null,
    confirmDiscard: () => {
      pendingAction?.run();
      setPendingAction(null);
    },
    keepEditing: () => setPendingAction(null),
  };
}

export type AssignmentWorkspace = ReturnType<typeof useAssignmentWorkspace>;
