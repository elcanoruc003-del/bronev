# Cloudinary Şəkil Yükləmə Konfiqurasiyası

## 1. Cloudinary Upload Preset Yaratmaq

1. [Cloudinary Dashboard](https://cloudinary.com/console) açın
2. **Settings** → **Upload** bölməsinə keçin
3. **Upload presets** bölməsində **Add upload preset** düyməsinə klikləyin
4. Aşağıdakı parametrləri təyin edin:
   - **Preset name**: `bronev_preset`
   - **Signing mode**: `Unsigned` (vacibdir!)
   - **Folder**: `bronev/properties` (istəyə bağlı)
   - **Use filename**: `Yes`
   - **Unique filename**: `Yes`
   - **Overwrite**: `No`
5. **Save** düyməsinə klikləyin

## 2. Vercel Environment Variables

Vercel dashboard-da aşağıdakı environment variable-ları əlavə edin:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dyfuasdbm
```

## 3. Test Etmək

1. https://bron-ev.com/admin giriş edin
2. "Yeni Ev" düyməsinə klikləyin
3. Formu doldurun
4. "Şəkil yüklə" düyməsinə klikləyin
5. Şəkilləri seçin və yükləyin
6. "Ev Əlavə Et" düyməsinə klikləyin

## Qeydlər

- Upload preset **unsigned** olmalıdır ki, client-side yükləmə işləsin
- Cloudinary cloud name artıq konfiqurasiya edilib: `dyfuasdbm`
- Çoxlu şəkil eyni anda yükləyə bilərsiniz (max 10)
- Şəkillər avtomatik olaraq property-yə əlavə olunur
