# 🚀 Production Deployment - Kampaniya Sistemi

## ✅ Kod GitHub-a Push Olundu

Kod artıq GitHub repository-də:
```
https://github.com/elcanoruc003-del/bronev
Branch: main
Commit: feat: Add complete campaign system
```

---

## 📋 Deployment Addımları (Vercel/Netlify/Railway)

### 1️⃣ **GitHub-dan Avtomatik Deploy**

Saytınız hansı platformada host olunur?
- Vercel
- Netlify  
- Railway
- Başqa

**Avtomatik deployment olacaq çünki:**
- ✅ Kod main branch-ə push olundu
- ✅ Platform avtomatik detect edəcək
- ✅ Build başlayacaq

---

### 2️⃣ **Environment Variables (VACİB!)**

Platform dashboard-da bu environment variables əlavə edilməlidir:

#### **Database (Neon):**
```env
DATABASE_URL=postgresql://neondb_owner:npg_gvRpDoIm8Zj9@ep-round-grass-a9xpx3us-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### **Session Secret:**
```env
SESSION_SECRET=bronev_secret_key_2026_random_chars_here_change_this_in_production_32plus
```

#### **Cloudinary (Image Upload):**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dyfaadbtm
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
```

#### **Contact Info:**
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=994777670031
NEXT_PUBLIC_PHONE_NUMBER=0777670031
NEXT_PUBLIC_ADSENSE_ID=ca-pub-8507882047909859
```

---

### 3️⃣ **Vercel Deployment (Ən Asan)**

#### a) Vercel Dashboard-a get:
```
https://vercel.com/dashboard
```

#### b) Project seç:
- `bronev` proyektini tap

#### c) Settings → Environment Variables:
1. Yuxarıdakı bütün variables-i əlavə et
2. Environment seç: **Production**
3. Save

#### d) Database Migration (VACİB!):
Vercel-də migration olmur avtomatik. İki yol:

**Yol 1: Prisma Data Platform (Tövsiyə)**
```bash
# Local-dan production DB-yə migrate
npx prisma migrate deploy
```

**Yol 2: Prisma db push (Sürətli)**
```bash
# Build command-ə əlavə edin:
prisma generate && prisma db push && next build
```

#### e) Redeploy:
1. Deployments tab
2. Son deployment-ə bas
3. **Redeploy** düyməsi
4. Gözlə (2-3 dəqiqə)

---

### 4️⃣ **Railway Deployment**

#### a) Railway Dashboard:
```
https://railway.app/dashboard
```

#### b) Project Settings → Variables:
- Yuxarıdakı environment variables əlavə et

#### c) Build Settings:
```
Build Command: npm run build
Start Command: npm start
```

#### d) Database Migration:
Railway environment-də:
```bash
npx prisma migrate deploy
```

---

### 5️⃣ **Build Command Yoxlaması**

`package.json`-da build command:
```json
"scripts": {
  "build": "prisma generate && next build"
}
```

✅ Artıq düzgündür!

---

## 🔍 Deployment Yoxlama

### Deploy bitdikdən sonra:

#### 1. **Saytınız açılır?**
```
https://your-domain.com
```

#### 2. **Campaigns səhifəsi işləyir?**
```
https://your-domain.com/campaigns
```

#### 3. **Admin panel açılır?**
```
https://your-domain.com/admin
```

#### 4. **Database connection işləyir?**
- Admin login test et
- Əgər error varsa: Environment variables yoxla

---

## 🐛 Problem Həlli

### ❌ **"DATABASE_URL not found" error:**
**Səbəb:** Environment variable əlavə edilməyib

**Həll:**
1. Platform dashboard → Settings → Environment Variables
2. `DATABASE_URL` əlavə et
3. Redeploy

---

### ❌ **"Prisma Client not generated" error:**
**Səbəb:** Build command-də `prisma generate` yoxdur

**Həll:**
1. `package.json` yoxla:
```json
"build": "prisma generate && next build"
```
2. Commit və push et
3. Avtomatik redeploy olacaq

---

### ❌ **Database tables yoxdur:**
**Səbəb:** Migration run edilməyib

**Həll 1 (Tövsiyə):**
```bash
# Local-dan production DB-yə
npx prisma migrate deploy
```

**Həll 2:**
Build command-ə əlavə et:
```json
"build": "prisma generate && prisma db push && next build"
```

⚠️ **DİQQƏT:** `db push` schema-nı force edir. Production-da diqqətli!

---

### ❌ **Image upload işləmir:**
**Səbəb:** Cloudinary environment variables yoxdur

**Həll:**
1. Cloudinary dashboard: https://console.cloudinary.com/
2. Settings → API Keys
3. Copy: API Key və API Secret
4. Platform environment variables-ə əlavə et:
```
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```
5. Redeploy

---

## ✅ Final Checklist

Deployment-dən sonra yoxla:

- [ ] Ana səhifə açılır
- [ ] `/campaigns` səhifəsi açılır
- [ ] Kampaniyalar görünür (əvvəl admin yaradacaq)
- [ ] `/admin` login işləyir
- [ ] Admin kampaniya yarada bilir
- [ ] İstifadəçi qeydiyyatdan keçə bilir
- [ ] İştirak formu işləyir
- [ ] Çek yükləmə işləyir (Cloudinary)
- [ ] Admin iştirakçıları görür
- [ ] Təsdiq/Rədd funksiyası işləyir

---

## 🔐 Təhlükəsizlik (Production)

### 1. **SESSION_SECRET dəyişdir:**
Yeni güclü secret generate et:
```bash
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

Production environment variable-ə əlavə et.

### 2. **Admin parol güclü olsun:**
İlk admin yaradanda güclü parol seç.

### 3. **.env faylı commit etmə:**
✅ `.gitignore`-də var, problem yoxdur.

---

## 📊 Monitoring

### Deploy log yoxla:
Platform dashboard → Deployments → Logs

### Runtime log yoxla:
- Vercel: Functions → Logs
- Railway: Deployments → View Logs

### Database yoxla:
```bash
# Prisma Studio (local-dan production DB)
npx prisma studio
```

---

## 🎯 İlk Admin Yaratmaq (Production)

### Yol 1: Platform Console (Railway)
```bash
# Railway console-dan
npx tsx scripts/create-admin.ts
```

Environment variables set et:
```bash
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=strong_password_here
```

### Yol 2: Prisma Studio
```bash
# Local-dan production DB-yə connect
npx prisma studio
```

1. `users` table-ə get
2. Manual admin user əlavə et
3. Password bcrypt hash olmalıdır

### Yol 3: API endpoint yarat (sonra sil)
Temporary admin creation endpoint (development only)

---

## 🚀 DEPLOYMENT BAŞARIYLA TAMAMLANACAQ!

### Növbəti Addımlar:

1. ✅ **Deploy gözlə** (5-10 dəqiqə)
2. ✅ **Environment variables yoxla**
3. ✅ **İlk admin yarat**
4. ✅ **İlk kampaniya yarat**
5. ✅ **Test et**

### Saytınız hazır olduqda:

```
🌐 https://your-domain.com/campaigns
```

**Kampaniya sistemi LIVE olacaq!** 🎉

---

## 📞 Problem Varsa

1. **Build logs yoxla** (platformada)
2. **Runtime logs yoxla**
3. **Environment variables yoxla**
4. **Database connection test et**
5. **Cloudinary connection test et**

---

**Uğurlar! Production deployment mükəmməl keçsin! 🚀**
