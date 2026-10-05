# Assignment Manager

Kullanıcının kayıt girebildiği, listeleyebildiği ve **güncellenebilir** kayıtları düzenleyebildiği tek sayfalık React uygulaması (mülakat test case'i).

## Özellikler

- **Code**: ilk 2 karakter harf + son 3 rakam, max 5 karakter, zorunlu, benzersiz. Hover'da pattern ipucu gösterilir.
- **Name**: max 12 karakter, zorunlu.
- **Assign Date**: `DD/MM/YYYY`, zorunlu, takvimde geçerli tarih kontrolü, yazarken otomatik `/` maskesi. Hover'da pattern ipucu gösterilir.
- **Is Updatable?**: checkbox.
- **Save / Update** ve **Clean** butonları (MUI ikonlarıyla).
- Datagrid:
  - Satıra tıklayınca form alanları satırla dolar.
  - `Is Updatable?` işaretli olmayan satırlar **gri** ve **tıklanamaz** (`aria-disabled`, `not-allowed` imleç).
  - Güncellenebilir satır seçilince `Save` butonu **Update** olur; Update sonrası kayıt grid'de güncellenir ve form `Save` moduna döner.
  - **Clean** tüm alanları temizler, seçimi kaldırır, buton `Save` olur.
- Generic bileşenler: `FormTextField` (name, pattern, tips, disabled, maxLength, validate, transform ...) ve `ActionButton` (label, action, tips, renk, disabled, ikon ...).
- Kayıtlar `localStorage` içinde saklanır (sayfa yenilenince kaybolmaz).
- UX/erişilebilirlik: klavye ile satır seçimi (Tab/Enter/Space), inline hata mesajları, boş durum ekranı, bildirim (snackbar), responsive iki kolonlu yerleşim.

## Teknolojiler ve sürümler

| Teknoloji                   | Sürüm     |
| --------------------------- | --------- |
| React / React DOM           | 19.x      |
| TypeScript                  | 7.x       |
| Redux Toolkit / React-Redux | 2.x / 9.x |
| React Hook Form             | 7.x       |
| MUI (Material UI) + Icons   | 7.x       |
| Vite                        | 8.x       |
| Node.js (önerilen)          | 22 LTS    |

## Kurulum ve çalıştırma

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # üretim derlemesi (tsc + vite build)
npm run preview    # derlenmiş uygulamayı önizle
npm run typecheck
```

### Docker

```bash
docker compose up --build   # http://localhost:8080
```

## Proje yapısı

```
src/
  components/   FormTextField, ActionButton, AssignmentForm, AssignmentGrid
  store/        Redux store, assignmentsSlice, typed hooks
  types/        Assignment tipleri
  utils/        doğrulama ve tarih maskesi yardımcıları
  theme.ts      MUI teması
```

## Tasarım kararları

- **State**: kayıtlar ve seçili satır Redux'ta; form durumu react-hook-form'da. Seçim değişince form `reset` ile senkronize edilir.
- **Doğrulama**: kurallar `utils/validation.ts` içinde merkezi; alan bileşeni kuralları parametre olarak alır.
- **Code benzersizliği**: aynı kod iki kez kaydedilemez (güncellerken kendi kaydı hariç). Kod kaydedilirken büyük harfe normalize edilir.
