# 🚨 DATABASE RECOVERY - CRITICAL ADDIMLAR

## Vəziyyət
- Production database BOŞ (0 ev, 0 bron)
- Əvvəllər 150 ev var idi
- `production_old_2026-07` branch-də məlumatlar saxlanılıb (Neon-da)

## ⚡ TƏCILI ADDIMLAR

### 1. Neon-dan Köhnə Database Connection String-i Götür

1. Neon Dashboard-a gir: https://console.neon.tech
2. **production_old_2026-07** branch-i seç (soldakı branch dropdown-dan)
3. Connection String-i kopyala (Connection Details bölməsindən)
4. String belə görünməlidir:
   ```
   postgresql://neondb_owner:PAROL@HOST-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

### 2. Köhnə Database-də 150 Ev Olduğunu Yoxla

1. Köhnə connection string-i buraya yapışdır:

```bash
# .env faylında DATABASE_URL-i MÜVƏQQƏTI dəyişdir
DATABASE_URL="BURAYA_production_old_2026-07_STRING_YAPISHDIR"
```

2. Yoxlama skriptini işlət:

```bash
npm install
npx prisma generate
npx tsx scripts/check-database.ts
```

3. Nəticədə 150 ev göstərməlidir. Əgər göstərirsə, davam et!

### 3. Vercel-də DATABASE_URL-i Yenilə

1. Vercel Dashboard-a gir: https://vercel.com
2. Proyektə gir: bronev
3. Settings → Environment Variables
4. DATABASE_URL-i tap
5. Edit düyməsinə bas
6. **Köhnə connection string-i yapışdır** (production_old_2026-07-dən)
7. Yadda saxla

### 4. Kampaniya Cədvəllərini SAFELY Əlavə Et

**⚠️ DİQQƏT: `migrate dev` İSTİFADƏ ETMƏYİN - O, database-i sıfırlayır!**

İki üsul:

#### Üsul A: Prisma DB Push (Təhlükəsiz)

```bash
# Vercel-dəki yeni DATABASE_URL ilə
npx prisma db push
```

Bu, cəmi kampaniya cədvəllərini əlavə edəcək, mövcud məlumatlar toxunulmaz qalacaq.

#### Üsul B: Manual SQL (Ən Təhlükəsiz)

Əgər `db push` işləməsə, SQL faylı ilə əlavə et:

```sql
-- campaigns cədvəli
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "propertyId" TEXT,
    "prizeDescription" TEXT NOT NULL,
    "participationFee" INTEGER NOT NULL DEFAULT 100,
    "cardNumber" TEXT,
    "cardHolder" TEXT,
    "bankName" TEXT,
    "drawDate" DATE,
    "winnerUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featuredImage" TEXT,
    "termsAndConditions" TEXT,
    "maxParticipants" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    CONSTRAINT "campaigns_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL
);

-- campaign_participants cədvəli
CREATE TABLE "campaign_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "participantPhone" TEXT NOT NULL,
    "receiptImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "rejectionReason" TEXT,
    "ticketNumber" TEXT UNIQUE,
    CONSTRAINT "campaign_participants_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE,
    CONSTRAINT "campaign_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "campaign_participants_campaignId_userId_unique" UNIQUE ("campaignId", "userId")
);

-- İndekslər
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");
CREATE INDEX "campaigns_slug_idx" ON "campaigns"("slug");
CREATE INDEX "campaigns_propertyId_idx" ON "campaigns"("propertyId");
CREATE INDEX "campaigns_drawDate_idx" ON "campaigns"("drawDate");

CREATE INDEX "campaign_participants_campaignId_idx" ON "campaign_participants"("campaignId");
CREATE INDEX "campaign_participants_userId_idx" ON "campaign_participants"("userId");
CREATE INDEX "campaign_participants_status_idx" ON "campaign_participants"("status");
CREATE INDEX "campaign_participants_submittedAt_idx" ON "campaign_participants"("submittedAt");
```

### 5. Vercel-də Redeploy Et

```bash
# Local-dan Vercel-ə push et
git push origin main

# Və ya Vercel dashboard-dan manual redeploy et
```

### 6. Admin Şifrəsini Yoxla/Sıfırla

Əgər admin panelə giriş etməsən:

```bash
# Production database URL ilə
npx tsx scripts/reset-admin-password.ts
```

Admin login məlumatları:
- Email: `admin@bronev.com`
- Şifrə: `aframe345Bron`

### 7. Yoxla ki, Hər şey İşləyir

1. https://bronev.com - 150 ev görsənməlidir
2. Admin panel: https://bronev.com/admin - giriş edə bilməlidir
3. Kampaniyalar: https://bronev.com/campaigns - açılmalıdır

## 🎯 İNDİKİ ADDIM

**Sənə lazım olan:** production_old_2026-07 branch-indən connection string.

Onu götürüb buraya yapışdır, mən yoxlayım 150 ev olduğunu təsdiq edim.
