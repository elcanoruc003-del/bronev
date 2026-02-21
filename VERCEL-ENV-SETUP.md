# Vercel Environment Variables Konfiqurasiyası

## Cloudinary Şəkil Yükləmə üçün Lazımi Environment Variables

Vercel Dashboard-da aşağıdakı environment variable-ları əlavə edin:

### 1. Vercel Dashboard-a keçin
https://vercel.com/elcanoruc003-dels-projects/bronev/settings/environment-variables

### 2. Aşağıdakı variable-ları əlavə edin:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dyfuasdbm
CLOUDINARY_API_KEY=526295514959981
NEXT_PUBLIC_PHONE_NUMBER=0777670031
NEXT_PUBLIC_WHATSAPP_NUMBER=994777670031
```

### 3. Hər variable üçün:
- **Name**: Variable adı (məsələn: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
- **Value**: Variable dəyəri (məsələn: dyfuasdbm)
- **Environment**: Production, Preview, Development (hamısını seçin)

### 4. Save düyməsinə klikləyin

### 5. Redeploy edin
- Deployments tab-a keçin
- Ən son deployment-ın yanındakı "..." menusunu açın
- "Redeploy" seçin

## Qeyd:
- `NEXT_PUBLIC_` prefix-i olan variable-lar browser-də əlçatandır
- `CLOUDINARY_API_KEY` server-side üçündür (unsigned preset üçün lazım deyil, amma widget tələb edir)
- Redeploy etdikdən sonra şəkil yükləmə işləməlidir

## Test:
1. https://bron-ev.com/admin
2. Yeni Ev əlavə et
3. Şəkil yüklə düyməsinə klikləyin
4. Artıq "Unknown API key" xətası olmamalıdır
