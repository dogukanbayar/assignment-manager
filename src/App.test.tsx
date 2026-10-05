import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from './test/utils';

type User = ReturnType<typeof renderApp>['user'];

const field = (name: RegExp) => screen.getByLabelText(name) as HTMLInputElement;
const checkbox = () => screen.getByRole('checkbox', { name: /is updatable\?/i });
const row = (code: string) => screen.getByText(code).closest('tr') as HTMLElement;

async function fillAndSave(user: User, code: string, name: string, date: string, updatable: boolean) {
  await user.clear(field(/^code/i));
  await user.type(field(/^code/i), code);
  await user.clear(field(/^name/i));
  await user.type(field(/^name/i), name);
  await user.clear(field(/assign date/i));
  await user.type(field(/assign date/i), date);
  if (updatable !== (checkbox() as HTMLInputElement).checked) await user.click(checkbox());
  await user.click(screen.getByRole('button', { name: /^save$/i }));
}

describe('Assignment Manager — spec scenarios', () => {
  it('1: renders 4 inputs and Save/Clean buttons with constraints', () => {
    renderApp();
    expect(field(/^code/i)).toHaveAttribute('maxlength', '5');
    expect(field(/^name/i)).toHaveAttribute('maxlength', '12');
    expect(checkbox()).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^clean$/i })).toBeInTheDocument();
  });

  it('1a/1c: shows pattern tips on hover', async () => {
    const { user } = renderApp();
    await user.hover(field(/^code/i));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(/2 letters \+ 3 digits/i);
  });

  it('validates required fields, code pattern and date', async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    expect(await screen.findByText('Code is required')).toBeInTheDocument();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Assign Date is required')).toBeInTheDocument();

    await user.type(field(/^code/i), 'A1234');
    await user.type(field(/assign date/i), '31022025');
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    expect(await screen.findByText(/first 2 characters must be letters/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid date/i)).toBeInTheDocument();
  });

  it('E1: Save fills the datagrid (date shown as DD/MM/YYYY)', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'ab123', 'Ahmet', '14032025', true);
    const r = await waitFor(() => row('AB123'));
    expect(within(r).getByText('Ahmet')).toBeInTheDocument();
    expect(within(r).getByText('14/03/2025')).toBeInTheDocument();
    expect(field(/^code/i)).toHaveValue(''); // form cleaned after save
  });

  it('E3: non-updatable rows are grey and not clickable', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'CD456', 'Zeynep', '02072025', false);
    const r = await waitFor(() => row('CD456'));
    expect(r).toHaveAttribute('aria-disabled', 'true');
    await user.click(r);
    expect(field(/^code/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument();
  });

  it('E2/E4/E5: clicking an updatable row fills inputs, Save becomes Update, Update changes the row', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'AB123', 'Ahmet', '14032025', true);
    await waitFor(() => row('AB123'));

    await user.click(row('AB123'));
    expect(field(/^code/i)).toHaveValue('AB123');
    expect(field(/^name/i)).toHaveValue('Ahmet');
    expect(field(/assign date/i)).toHaveValue('14/03/2025');
    expect(checkbox()).toBeChecked();
    expect(screen.getByRole('button', { name: /^update$/i })).toBeInTheDocument();

    await user.clear(field(/^name/i));
    await user.type(field(/^name/i), 'Mehmet');
    await user.click(screen.getByRole('button', { name: /^update$/i }));

    await waitFor(() => expect(within(row('AB123')).getByText('Mehmet')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument();
  });

  it('E6: Clean clears inputs and switches back to Save', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'AB123', 'Ahmet', '14032025', true);
    await waitFor(() => row('AB123'));
    await user.click(row('AB123'));
    await user.click(screen.getByRole('button', { name: /^clean$/i }));
    expect(field(/^code/i)).toHaveValue('');
    expect(field(/^name/i)).toHaveValue('');
    expect(field(/assign date/i)).toHaveValue('');
    expect(checkbox()).not.toBeChecked();
    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument();
  });
});

describe('Assignment Manager — UX extras', () => {
  it('rejects duplicate codes', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'AB123', 'Ahmet', '14032025', true);
    await waitFor(() => row('AB123'));
    await fillAndSave(user, 'ab123', 'Baska', '15032025', true);
    expect(await screen.findByText('This code already exists')).toBeInTheDocument();
  });

  it('asks before discarding unsaved changes when switching rows', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'AB123', 'Ahmet', '14032025', true);
    await waitFor(() => row('AB123'));
    await fillAndSave(user, 'EF789', 'Ali', '21112025', true);
    await waitFor(() => row('EF789'));

    await user.click(row('AB123'));
    await user.type(field(/^name/i), 'X'); // dirty
    await user.click(row('EF789'));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/discard changes\?/i)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /keep editing/i }));
    expect(field(/^code/i)).toHaveValue('AB123');

    await user.click(row('EF789'));
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: /discard changes/i }),
    );
    await waitFor(() => expect(field(/^code/i)).toHaveValue('EF789'));
  });

  it('Esc cancels editing', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'AB123', 'Ahmet', '14032025', true);
    await waitFor(() => row('AB123'));
    await user.click(row('AB123'));
    await user.keyboard('{Escape}');
    expect(field(/^code/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument();
  });

  it('Ctrl+S saves the form', async () => {
    const { user } = renderApp();
    await user.type(field(/^code/i), 'AB123');
    await user.type(field(/^name/i), 'Ahmet');
    await user.type(field(/assign date/i), '14032025');
    await user.keyboard('{Control>}s{/Control}');
    await waitFor(() => row('AB123'));
  });

  it('Undo reverts a save', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'AB123', 'Ahmet', '14032025', true);
    await waitFor(() => row('AB123'));
    await user.click(await screen.findByRole('button', { name: /^undo$/i }));
    await waitFor(() => expect(screen.queryByText('AB123', { selector: 'td' })).not.toBeInTheDocument());
  });

  it('Undo reverts an update', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'AB123', 'Ahmet', '14032025', true);
    await waitFor(() => row('AB123'));
    await user.click(row('AB123'));
    await user.clear(field(/^name/i));
    await user.type(field(/^name/i), 'Mehmet');
    await user.click(screen.getByRole('button', { name: /^update$/i }));
    await waitFor(() => within(row('AB123')).getByText('Mehmet'));
    await user.click(await screen.findByRole('button', { name: /^undo$/i }));
    await waitFor(() => within(row('AB123')).getByText('Ahmet'));
  });

  it('filters the grid with the updatable switch and search', async () => {
    const { user } = renderApp();
    await fillAndSave(user, 'AB123', 'Ahmet', '14032025', true);
    await waitFor(() => row('AB123'));
    await fillAndSave(user, 'CD456', 'Zeynep', '02072025', false);
    await waitFor(() => row('CD456'));

    await user.click(screen.getByRole('switch', { name: /updatable only/i }));
    expect(screen.queryByText('CD456')).not.toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: /updatable only/i }));
    await user.type(screen.getByRole('searchbox'), 'zeyn');
    expect(screen.queryByText('AB123')).not.toBeInTheDocument();
    expect(screen.getByText('CD456')).toBeInTheDocument();
  });
});
