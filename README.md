# Assignment Manager

Kullanıcının kayıt girebildiği, listeleyebildiği ve **güncellenebilir** kayıtları düzenleyebildiği tek sayfalık React uygulaması (mülakat test case'i).

![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF) ![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6) ![Tests](https://img.shields.io/badge/tests-26%20passing-brightgreen)

## Şartname karşılığı

| #     | Beklenti                                                                               | Durum |
| ----- | -------------------------------------------------------------------------------------- | ----- |
| 1a    | **Code**: 2 harf + 3 rakam, max 5, zorunlu, hover'da pattern ipucu                     | ✅    |
| 1b    | **Name**: max 12 karakter, zorunlu                                                     | ✅    |
| 1c    | **Assign Date**: `DD/MM/YYYY`, zorunlu, hover'da pattern ipucu                         | ✅    |
| 1d    | **Is Updatable?** checkbox                                                             | ✅    |
| 2     | **Save/Update** ve **Clean** butonları (MUI ikonlu)                                    | ✅    |
| 3     | Datagrid                                                                               | ✅    |
| E1    | Save ile grid dolar                                                                    | ✅    |
| E2    | Satıra tıklayınca input'lar dolar                                                      | ✅    |
| E3    | `Is Updatable?` seçili değilse satır gri ve tıklanamaz                                 | ✅    |
| E4    | Güncellenebilir satırda `Save` → `Update`                                              | ✅    |
| E5    | Update grid'de kaydı günceller                                                         | ✅    |
| E6    | Clean 4 alanı temizler, buton `Save` olur                                              | ✅    |
| E7    | Generic input bileşeni (`FormTextField`: name, pattern, tips, disabled, maxLength ...) | ✅    |
| E8    | Generic buton bileşeni (`ActionButton`: label, action, tips, renk, disabled, ikon ...) | ✅    |
| E9–10 | UI kütüphanesi + ikonlar, UI/UX kuralları (MUI)                                        | ✅    |

## Şartnamenin ötesinde

**Mühendislik**

- **Tarih ISO saklanır** (`YYYY-MM-DD`), `DD/MM/YYYY` sadece gösterim/girişte; tek dönüşüm noktası `utils/adapters.ts`. Sıralama bu sayede doğru çalışır.
- **Zod şeması tek doğruluk kaynağı** (`schema/assignmentSchema.ts`), `zodResolver` ile react-hook-form'a bağlı. Code benzersizliği de şemada.
- **İş mantığı hook'ta** (`useAssignmentWorkspace`), bileşenler sadece görünüm. Memoize edilmiş `createSelector` seçicileri.
- **Fake API katmanı**: RTK Query + `fakeBaseQuery`. Gecikme, benzersizlik hatası (409 benzeri), **iyimser güncelleme + otomatik geri alma**, loading/error durumları. Gerçek REST API'ye geçiş için sadece `api/fakeServer.ts` değişir.
- **Testler** (Vitest + React Testing Library, 26 test): şartname maddelerine birebir eşlenmiş senaryolar + UX ekstraları.
- **Kalite kapıları**: ESLint 10 (flat config, react-hooks), Prettier, Husky (`pre-commit`: lint-staged, `commit-msg`: commitlint/conventional commits, `pre-push`: typecheck + test), GitHub Actions CI (format, lint, typecheck, test, build, docker build).
- `ErrorBoundary`, vendor chunk ayrımı (bundle uyarısı yok), Docker'da **root olmayan** nginx + güvenlik başlıkları + read-only compose.

**UI/UX**

- **Kirli form koruması**: değişiklik varken başka satıra geçilirse "Değişiklikler atılsın mı?" diyaloğu; formda "Kaydedilmemiş değişiklikler" etiketi; sekme kapatırken tarayıcı uyarısı.
- **Düzenleme modu belirgin**: "AB123 düzenleniyor · Esc ile iptal" bandı. Mobilde satır seçilince forma otomatik kaydırma.
- **Kısayollar**: `Ctrl/Cmd + S` kaydet, `Esc` iptal. Kayıttan sonra odak `Code` alanına döner.
- **Geri al (Undo)**: Save, Update ve Clean sonrası snackbar'da.
- **Gri satır tek başına yeterli değil**: kilit ikonu + hover açıklaması ("Bu kayıt güncellenemez: ...") + `aria-disabled`.
- **Anlık geri bildirim**: Name karakter sayacı (`8/12`), Code otomatik büyük harf, tarihte otomatik `/` maskesi ve takvim butonu (yazarak da girilebilir).
- **Satır vurgusu**: kaydedilen/güncellenen satır kısa süre yanar (`prefers-reduced-motion`'a saygılı).
- **Grid**: kolon sıralama, arama, "sadece güncellenebilirler" filtresi, sayfalama, boş/sonuçsuz durum, skeleton yükleme, `aria-live` sonuç duyurusu, klavyeyle satır seçimi.
- **Karanlık mod** ve **TR/EN** dil desteği (tercihler kalıcı; ilk açılışta sistem ayarı).

## Teknolojiler ve sürümler

| Teknoloji                                 | Sürüm                                                       |
| ----------------------------------------- | ----------------------------------------------------------- |
| React / React DOM                         | 19.x                                                        |
| TypeScript                                | 6.0.x (typescript-eslint henüz TS 7'yi desteklemediği için) |
| Redux Toolkit (+ RTK Query) / React-Redux | 2.x / 9.x                                                   |
| React Hook Form + @hookform/resolvers     | 7.x / 5.x                                                   |
| Zod                                       | 4.x                                                         |
| MUI (Material UI) + Icons                 | 7.x                                                         |
| Vite                                      | 8.x                                                         |
| Vitest + Testing Library                  | 5.x                                                         |
| ESLint / Prettier                         | 10.x / 3.x                                                  |
| Node.js (önerilen)                        | 22 LTS                                                      |

## Kurulum ve çalıştırma

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # testleri çalıştır
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run build        # üretim derlemesi
npm run preview      # derlenmiş uygulamayı önizle
```

İlk açılışta demo için 3 örnek kayıt (biri güncellenemez) yüklenir. Sıfırlamak için tarayıcıda `localStorage` temizlenebilir.

### Docker

```bash
docker compose up --build   # http://localhost:8080
```

## Proje yapısı

```
src/
  api/          fakeServer (gecikmeli sahte backend), assignmentsApi (RTK Query)
  components/   FormTextField, ActionButton, AssignmentForm, AssignmentGrid, ConfirmDialog, ...
  hooks/        useAssignmentWorkspace (form + seçim + undo + kısayollar)
  i18n/         TR/EN çeviriler ve provider
  schema/       Zod doğrulama şeması
  store/        Redux store, ui slice, selector'lar
  theme/        MUI teması + karanlık mod provider'ı
  utils/        tarih yardımcıları, adapter'lar, doğrulama sabitleri
  test/         test kurulumu ve yardımcıları
```

## Tasarım kararları

- **Sunucu durumu RTK Query'de, arayüz durumu (seçili/vurgulanan satır) `ui` slice'ında**, form durumu react-hook-form'da. Her biri kendi işine uygun aracın elinde.
- **Seçim → form senkronu imperatif** (`reset`): effect zincirleri yerine açık çağrı, böylece kirli-form koruması ve Undo öngörülebilir kalır.
- **Resolver varken** `FormTextField` içindeki RHF kuralları devre dışı kalır (yalnızca resolver'sız kullanımda geçerli); kurallar Zod şemasında toplanır. `pattern` yine HTML özniteliği olarak yansır.
- **Zod `superRefine`** ile benzersizlik; sunucu da aynı kuralı uygular (yarış durumlarında `DUPLICATE_CODE` hatası forma yansıtılır).

## Gelecek iyileştirmeler

- Gerçek REST API'ye geçiş (`fakeServer` yerine `fetchBaseQuery`) ve MSW ile entegrasyon testleri
- Silme işlemi arayüzü (API'de `deleteAssignment` hazır, şu an yalnızca Undo kullanıyor)
- Playwright ile uçtan uca testler, Storybook ile bileşen kataloğu
- Sanallaştırılmış (virtualized) grid ve sunucu taraflı sayfalama
