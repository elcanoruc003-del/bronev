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
NEXT_PUBLIC_PHONE_NUMBER=0777670031
NEXT_PUBLIC_WHATSAPP_NUMBER=994777670031
```

## 3. Test Etmək

1. https://bron-ev.com/admin giriş edin
2. "Yeni Ev" düyməsinə klikləyin
3. Formu doldurun
4. "Şəkilləri seçin" düyməsinə klikləyin
5. Kompüterdən birdən çoxlu şəkil seçin (max 30 şəkil)
6. Şəkillər avtomatik yüklənəcək
7. "Ev Əlavə Et" düyməsinə klikləyin

## Yeni Xüsusiyyətlər

✅ **Branding**: Sayt adı "BronEv" olaraq yeniləndi
✅ **Zəng düyməsi**: WhatsApp ilə yanaşı telefon zəngi düyməsi əlavə edildi
✅ **Şəkil yükləmə**: 
   - Max 30 şəkil eyni anda yüklənə bilər
   - Birdən çoxlu şəkil seçmək mümkündür
   - Dəstəklənən formatlar: JPG, PNG, WEBP
   - Max fayl ölçüsü: 10MB
✅ **Dizayn təkmilləşdirildi**: Daha peşəkar və mobil-uyğun görünüş

## Qeydlər

- Upload preset **unsigned** olmalıdır ki, client-side yükləmə işləsin
- Cloudinary cloud name: `dyfuasdbm`
- Şəkillər avtomatik olaraq property-yə əlavə olunur
- Hər şəkil üçün order (sıra) avtomatik təyin edilir
