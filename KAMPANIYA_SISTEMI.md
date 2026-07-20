# 🎁 Kampaniya Sistemi - Tam Bələdçi

## ✅ Hazırlanan Funksionallıqlar

### 1. **Database Schema** ✅
- `campaigns` - Kampaniya məlumatları
- `campaign_participants` - İştirakçı məlumatları və çeklər
- Statuslar: DRAFT, ACTIVE, ENDED, CANCELLED
- İştirak statusları: PENDING, APPROVED, REJECTED

### 2. **Backend (Server Actions)** ✅

#### İstifadəçi üçün (`/actions/campaigns.ts`):
- ✅ `getActiveCampaigns()` - Aktiv kampaniyaları gətir
- ✅ `getCampaignBySlug()` - Tək kampaniya
- ✅ `participateInCampaign()` - Kampaniyaya iştirak et
- ✅ `getUserCampaignParticipations()` - İstifadəçinin iştirakları
- ✅ `checkUserParticipation()` - Dublikat yoxlama

#### Admin üçün (`/actions/admin.ts`):
- ✅ `getAdminCampaigns()` - Bütün kampaniyalar
- ✅ `getAdminCampaignDetails()` - Kampaniya detalları + iştirakçılar
- ✅ `createCampaign()` - Yeni kampaniya yarat
- ✅ `updateCampaign()` - Kampaniya yenilə
- ✅ `deleteCampaign()` - Kampaniya sil
- ✅ `approveCampaignParticipation()` - İştirakı təsdiq et
- ✅ `rejectCampaignParticipation()` - İştirakı rədd et
- ✅ `getAdminCampaignParticipants()` - İştirakçı siyahısı

### 3. **Frontend Səhifələri** ✅

#### İstifadəçi tərəfi:
- ✅ `/campaigns` - Bütün aktiv kampaniyalar
- ✅ `CampaignCard` - Kampaniya kartı komponenti
- ✅ `CampaignParticipationModal` - İştirak formu (5 addım):
  1. Qeydiyyat yoxlaması
  2. Ad və telefon formu
  3. Ödəniş məlumatları (kart kopyalama)
  4. Çek yükləmə
  5. Uğur mesajı
- ✅ `/profile` - Kampaniya tab əlavə edildi

#### Admin tərəfi:
- ✅ `/admin/campaigns` - Kampaniya siyahısı
- ✅ `/admin/campaigns/new` - Yeni kampaniya yarat
- ✅ `/admin/campaigns/[id]` - Kampaniya detalları və iştirakçılar
- ✅ Admin navigation-da "Kampaniyalar" linki

---

## 🚀 İstifadə Qaydası

### 📱 **İstifadəçi tərəfindən:**

#### 1. Kampaniyalara baxmaq:
```
http://localhost:3000/campaigns
```
- Aktiv kampaniyaların siyahısı görünür
- Hər kartda: başlıq, qiymət, iştirakçı sayı, qalan gün

#### 2. Kampaniyaya iştirak:
1. **"İştirak et"** düyməsinə bas
2. **Qeydiyyat:** Avtomatik yoxlanır, yoxdursa qeydiyyat pəncərəsi açılır
3. **Məlumatlar:** Ad və telefon nömrəsi daxil et
4. **Ödəniş:** Kart məlumatlarını gör, kart nömrəsini kopyala
5. **Çek:** Bank tətbiqində ödənişi et, çeki çək və yüklə
6. **Təsdiq gözlə:** İştirakınız yoxlanacaq

#### 3. İştirak statusunu yoxla:
```
http://localhost:3000/profile
```
- **Kampaniyalar** tab-ı seç
- Statuslar:
  - 🟡 **Gözləmədə** - Çek yoxlanır
  - 🟢 **Təsdiqləndi** - İştirak aktiv
  - 🔴 **Rədd edildi** - Səbəb göstərilir

---

### 👨‍💼 **Admin tərəfindən:**

#### 1. Admin Panel-ə daxil ol:
```
http://localhost:3000/admin
```
Email: `admin@bronev.az` (və ya yaratdığınız admin)
Parol: admin parolunuz

#### 2. Kampaniya yarat:
1. Sol menuda **"Kampaniyalar"** seç
2. **"Yeni Kampaniya"** düyməsinə bas
3. Formu doldur:
   - **Başlıq:** Məs: "1 Manata 1 Günlük Kirayə Ev"
   - **Slug:** Avtomatik yaranır (URL üçün)
   - **Açıqlama:** Qısa məlumat
   - **Mükafat:** Məs: "1 günlük pulsuz qalma"
   - **Əlaqəli Ev:** (İstəyə görə) property seç
   - **İştirak Haqqı:** AZN ilə (məs: 1)
   - **Çəkiliş Tarixi:** Tarix seç
   - **Ödəniş Məlumatları:**
     - Kart nömrəsi
     - Kart sahibi
     - Bank adı
   - **Maksimum İştirakçı:** (İstəyə görə)
   - **Şərtlər və Qaydalar:** (İstəyə görə)
   - **Status:** 
     - 📝 Qaralama (görünməz)
     - ✅ Aktiv (dərhal yayımlanır)

4. **"Kampaniya Yarat"** düyməsinə bas

#### 3. İştirakçıları idarə et:
1. Kampaniya siyahısından kampaniyaya **"Bax"** düyməsi
2. İştirakçı siyahısı görünür:
   - Ad, telefon, bilet nömrəsi
   - İştirak tarixi
   - Çek şəkli (klikləyib böyüdə bilərsiniz)
   - Status

3. **Gözləmədə** iştirakçılar üçün:
   - ✅ **Təsdiq et** - İştirak təsdiqlənir
   - ❌ **Rədd et** - Səbəb yazın və rədd edin

#### 4. Statistika:
- Ümumi iştirakçı sayı
- Gözləmədə olan sayı
- Təsdiqlənmiş sayı
- Rədd edilmiş sayı

---

## 🔧 Texniki Detallar

### Database Struktur:

#### `campaigns` table:
```sql
- id (String, PK)
- title (String) - Kampaniya adı
- description (String) - Açıqlama
- slug (String, unique) - URL slug
- propertyId (String, nullable) - Əlaqəli ev
- prizeDescription (String) - Mükafat açıqlaması
- participationFee (Int) - Qəpik ilə (100 = 1 AZN)
- cardNumber (String) - Kart nömrəsi
- cardHolder (String) - Kart sahibi
- bankName (String) - Bank
- drawDate (DateTime) - Çəkiliş tarixi
- winnerUserId (String) - Qalib
- status (CampaignStatus) - Status
- featuredImage (String) - Şəkil
- termsAndConditions (Text) - Şərtlər
- maxParticipants (Int) - Limit
- createdAt, updatedAt
```

#### `campaign_participants` table:
```sql
- id (String, PK)
- campaignId (String, FK)
- userId (String, FK)
- participantName (String) - Ad
- participantPhone (String) - Telefon
- receiptImage (String) - Çek şəkli URL
- status (ParticipationStatus) - PENDING/APPROVED/REJECTED
- submittedAt (DateTime) - İştirak tarixi
- reviewedAt (DateTime) - Yoxlanma tarixi
- reviewedBy (String) - Admin ID
- rejectionReason (String) - Rədd səbəbi
- ticketNumber (String, unique) - Bilet nömrəsi
```

### API Endpoints:
- `/api/upload-image` - Çek şəkil yükləmə (mövcud)

### Təhlükəsizlik:
- ✅ Qeydiyyatlı istifadəçi yoxlaması
- ✅ Dublikat iştirak yoxlaması
- ✅ Admin səlahiyyət yoxlaması
- ✅ File upload validation (image only, 5MB max)
- ✅ Unique ticket number generation
- ✅ Transaction safety

---

## 📝 Test Addımları

### 1. **İstifadəçi Test:**
```bash
# Server işləyir (http://localhost:3000)

1. Brauzerə get: http://localhost:3000/campaigns
2. Kampaniya görürsənmi? (Əvvəl admin yaratsın)
3. "İştirak et" düyməsinə bas
4. Qeydiyyat/giriş et
5. Formu doldur və çek yüklə
6. Profile get və kampaniya statusuna bax
```

### 2. **Admin Test:**
```bash
1. Admin panel: http://localhost:3000/admin
2. Login ol
3. "Kampaniyalar" menyusuna get
4. "Yeni Kampaniya" yarat
5. Formu doldur və status = ACTIVE seç
6. Yarat və public səhifəyə bax (yuxarıdakı test)
7. Admin paneldə kampaniya detalarına bax
8. İştirakçıları təsdiq/rədd et
```

### 3. **Database Check:**
```bash
# Prisma Studio ilə yoxla
npx prisma studio

# Və ya SQL ilə
SELECT * FROM campaigns;
SELECT * FROM campaign_participants;
```

---

## 🎨 UI/UX Xüsusiyyətlər

- ✨ Modern gradient dizayn
- 📱 Tam responsive (mobil + desktop)
- 🎭 Animasiyalı kartlar
- 🖼️ Çek şəkil preview və zoom
- 📋 Kart nömrəsi kopyalama funksiyası
- 🎫 Unique bilet nömrəsi göstərilməsi
- 🔔 Real-time status dəyişikliyi
- 💳 Multi-step form (addım-addım)

---

## 🐛 Problem Həlli

### Database connection error:
```bash
# .env faylını yoxlayın
DATABASE_URL="postgresql://..."

# Migration et
npx prisma db push
npx prisma generate
```

### Image upload problem:
```bash
# Cloudinary config yoxlayın
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Port məşğuldur:
```bash
# Köhnə prosesi öldür
taskkill /PID <PID> /F

# Server yenidən başlat
npm run dev
```

---

## 🎯 Əlavə Funksionallıq İdeyaları

Gələcəkdə əlavə edilə bilər:
- [ ] Email bildirişləri (təsdiq/rədd)
- [ ] SMS bildirişləri
- [ ] Çəkiliş funksiyası (random qalib seçmə)
- [ ] Kampaniya statistika və analytics
- [ ] Sosial media paylaşma
- [ ] Kampaniya şəkil yükləmə
- [ ] Çoxlu qaliblər
- [ ] İştirakçı eksport (Excel/CSV)

---

## 📞 Dəstək

Problem olduqda:
1. Console log-lara baxın (browser + server)
2. Prisma Studio ilə database yoxlayın
3. `.env` faylının düzgün olduğundan əmin olun

---

**✅ SİSTEM HAZIRDIR VƏ İŞLƏYİR!**

Server: http://localhost:3000
Kampaniyalar: http://localhost:3000/campaigns
Admin: http://localhost:3000/admin
