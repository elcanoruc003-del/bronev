# 🔑 Yeni Admin Yaratmaq

## Production-da admin yoxdur!

Local database-də admin və kampaniya yoxdur, amma saytda görünür.
Bu o deməkdir ki **production database fərqlidir**.

---

## ✅ YENİ ADMİN YARAT

### Yol 1: Vercel CLI ilə (TÖVSİYYƏ)

```bash
# 1. Vercel CLI quraşdır (əgər yoxdursa)
npm i -g vercel

# 2. Login ol
vercel login

# 3. Production-da command işlət
vercel env pull .env.production
```

Sonra local-dan production DB-yə admin yarat:
```powershell
$env:DATABASE_URL="PRODUCTION_DATABASE_URL_HERE"
$env:ADMIN_EMAIL="admin@bronev.az"  
$env:ADMIN_PASSWORD="güclü_parol_123"
npx tsx scripts/create-admin.ts
```

---

### Yol 2: Vercel Dashboard (ASAN)

#### a) Vercel dashboard-a get:
```
https://vercel.com/dashboard
```

#### b) Project seç → Settings → Environment Variables

#### c) Bu variables əlavə et:
```
ADMIN_EMAIL = admin@bronev.az
ADMIN_PASSWORD = güclü_parol_123
```

#### d) Deployments → Latest → **Redeploy**

#### e) Build logs-da görəcəksiniz ki admin yaradılır

---

### Yol 3: Database birbaşa (Prisma Studio)

#### a) Vercel dashboard → Settings → Environment Variables
`DATABASE_URL` kopyala

#### b) Local .env faylında temporary olaraq production URL qoy:
```env
# TEMPORARY - Production DB
DATABASE_URL="production_neon_url_here"
```

#### c) Admin yarat:
```powershell
$env:ADMIN_EMAIL="admin@bronev.az"
$env:ADMIN_PASSWORD="güclü_parol_123"
npx tsx scripts/create-admin.ts
```

#### d) Local .env-i geri qaytar!

---

## 🔍 Production Database URL Tap

### Vercel Dashboard:
1. Project seç
2. Settings → Environment Variables
3. `DATABASE_URL` variable-ı tap
4. Value-nu göstər və kopyala

### Neon Dashboard:
1. https://console.neon.tech/
2. Project seç
3. Connection string kopyala

---

## 📝 TÖVSİYYƏ EDİLƏN PAROL

```
Email: admin@bronev.az
Parol: Bronev2026!Admin
```

Və ya daha güclü:
```
Email: admin@bronev.az
Parol: Br0n3v$2026#Adm!n
```

---

## ✅ Admin Yaradıldıqdan Sonra

### Test et:
```
https://bronev.com/admin
```

Login:
- Email: admin@bronev.az
- Parol: (yaratdığınız parol)

---

## 🎯 Köhnə Kampaniya Problemi

Saytda görünən **"1 Manata 1 Günlük Kirayə Ev Şansı"** kampaniyası:
- Production database-də var
- Local database-də yoxdur

**Bu normaldır!** Production və local fərqli database-lərdir.

Admin yaradıb login olanda bu kampaniyanı edit/delete edə bilərsiniz.

---

## 🚨 VACİB QEYD

**LOCAL və PRODUCTION database fərqlidir!**

- Local: Developer test database
- Production: Real sayt database

Dəyişiklik etdikdə hər ikisində etməlisiniz və ya yalnız production-da işləyin.

---

**İndi Vercel dashboard-a gedib DATABASE_URL-i tapın və admin yaradın!**
