# 🚀 BronEv - Tez Başlanğıc

## ⚡ 3 Dəqiqədə İşə Salın

### 1️⃣ Quraşdırma

```bash
# Dependencies yüklə
npm install
```

### 2️⃣ İşə Sal

```bash
# Development server başlat
npm run dev
```

### 3️⃣ Açın

Brauzerinizə daxil olun: **http://localhost:3000**

---

## ✅ Hazır! Sayt İşləyir

Sayt tam işlək vəziyyətdədir və heç bir əlavə konfiqurasiya tələb etmir.

### 📱 Əsas Səhifələr

- **Ana Səhifə**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:3000/api/properties

---

## 🎯 Admin Panel Girişi

Admin panelə daxil olmaq üçün:

1. http://localhost:3000/admin ünvanına gedin
2. İstənilən istifadəçi adı və parol daxil edin (demo rejim)
3. "Daxil Ol" düyməsinə basın

---

## 🗄️ Database (İstəyə Bağlı)

Sayt database olmadan da işləyir. Əgər database istifadə etmək istəyirsinizsə:

### Addım 1: Environment File Yaradın

```bash
cp .env.example .env
```

### Addım 2: Database URL Əlavə Edin

`.env` faylında:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bronev"
```

### Addım 3: Database Quraşdırın

```bash
# Prisma client generate et
npm run db:generate

# Database schema push et
npm run db:push
```

---

## 📞 Əlaqə Məlumatlarını Dəyişdirin

`.env` faylında (və ya `.env.example`-dan kopyalayın):

```env
NEXT_PUBLIC_PHONE_NUMBER="0777670031"
NEXT_PUBLIC_WHATSAPP_NUMBER="994777670031"
```

---

## 🎨 Dizayn Xüsusiyyətləri

✅ Premium gold + navy rəng palitrası
✅ Tam responsive (mobil-first)
✅ Glass effect header
✅ Smooth animations
✅ Modern UI/UX

---

## 📊 Admin Panel Xüsusiyyətləri

✅ Dashboard statistikası
✅ Ev əlavə et / redaktə et / sil
✅ Real-time baxış sayı
✅ Sorğu tracking
✅ Status idarəsi

---

## 🔧 Əlavə Komandalar

```bash
# Production build
npm run build

# Production server
npm start

# Lint check
npm run lint

# Prisma Studio (database GUI)
npm run db:studio
```

---

## 🚀 Production Deployment

### Vercel (Tövsiyə edilir)

1. GitHub-a push edin
2. [vercel.com](https://vercel.com) saytında import edin
3. Deploy edin - Hazır! 🎉

Ətraflı məlumat üçün: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📁 Əsas Fayllar

```
bronev/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Ana səhifə
│   │   ├── layout.tsx        # Root layout
│   │   └── admin/page.tsx    # Admin panel
│   ├── components/           # React komponentlər
│   ├── lib/                  # Utility funksiyalar
│   └── types/                # TypeScript types
├── prisma/schema.prisma      # Database schema
├── .env.example              # Environment nümunə
└── package.json              # Dependencies
```

---

## 🎯 Növbəti Addımlar

1. ✅ Saytı işə salın (`npm run dev`)
2. ✅ Ana səhifəni yoxlayın
3. ✅ Admin panelə daxil olun
4. ✅ Dizaynı öyrənin
5. 📝 Öz məlumatlarınızı əlavə edin
6. 🚀 Production-a deploy edin

---

## 💡 Məsləhətlər

- **Database olmadan**: Sayt tam işləyir, sadəcə data statikdir
- **Database ilə**: Real data, CRUD əməliyyatları, statistika
- **Production**: Vercel + Supabase (hər ikisi pulsuz plan təklif edir)

---

## 🆘 Kömək Lazımdır?

- 📖 Ətraflı dokumentasiya: [README.md](./README.md)
- 🚀 Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🏗️ Arxitektura: [.kiro/steering/project-architecture.md](./.kiro/steering/project-architecture.md)

---

## ✨ Xüsusiyyətlər

✅ Next.js 14 (App Router)
✅ TypeScript
✅ Tailwind CSS
✅ Prisma ORM
✅ PostgreSQL
✅ SEO Optimized
✅ Premium UI/UX
✅ Admin Panel
✅ Real-time Analytics
✅ Mobile Responsive
✅ Production Ready

---

**Uğurlar! 🎉**

Saytınız hazırdır və istifadəyə tam hazırdır!
