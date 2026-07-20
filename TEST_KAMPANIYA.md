# 🧪 Kampaniya Sistemini Test Et

## ✅ Sürətli Test Addımları

### 1️⃣ **Server işləyir?**
```bash
✅ Server artıq işləyir: http://localhost:3000
```

---

### 2️⃣ **Admin Yarat (Əgər yoxdursa)**

Yeni terminal açın və:

```bash
# Admin yaratmaq
$env:ADMIN_EMAIL="admin@bronev.az"
$env:ADMIN_PASSWORD="admin123456"
npx tsx scripts/create-admin.ts
```

**Nəticə:**
```
✅ Admin user created/updated successfully!
📧 Email: admin@bronev.az
🔑 Password: admin123456
```

---

### 3️⃣ **Admin Panel Test**

#### a) Admin Login:
1. Brauzerdə aç: **http://localhost:3000/admin**
2. Login məlumatları:
   - Email: `admin@bronev.az`
   - Parol: `admin123456`
3. **"Daxil Ol"** düyməsinə bas

✅ Giriş uğurlu olduqda admin dashboard görünməlidir

#### b) Kampaniya yaratmaq:
1. Sol menuda **"Kampaniyalar"** linkini tap və klik et
2. **"Yeni Kampaniya"** düyməsinə bas
3. Formu doldur:

**Test məlumatları:**
```
Başlıq: 1 Manata Villa Çəkilişi
Slug: 1-manata-villa-cekilisi (avtomatik)
Açıqlama: Şansınızı sınayın və 1 AZN-ə villa qazanın!
Mükafat: 1 günlük pulsuz qalma
Əlaqəli Ev: (heç biri və ya seçin)
İştirak Haqqı: 1
Çəkiliş Tarixi: 2026-08-15
Kart Nömrəsi: 1234567890123456
Kart Sahibi: Test Admin
Bank: Kapital Bank
Maksimum İştirakçı: (boş burax və ya 100)
Status: ✅ Aktiv (Dərhal yayımla)
```

4. **"Kampaniya Yarat"** düyməsinə bas

✅ Uğurlu mesaj görünməli və `/admin/campaigns` səhifəsinə yönləndirilməlisiniz

---

### 4️⃣ **Public Kampaniya Səhifəsi Test**

#### a) Kampaniya görünür?
1. Brauzerdə aç: **http://localhost:3000/campaigns**
2. Yaratdığınız kampaniyanı görürsünüzmü?

✅ Kampaniya kartı görünməli:
- Başlıq
- Açıqlama
- İştirak haqqı (1 AZN)
- İştirakçı sayı (0)
- "İştirak et" düyməsi

---

### 5️⃣ **İstifadəçi Qeydiyyatı və İştirak**

#### a) Qeydiyyat:
1. **"İştirak et"** düyməsinə bas
2. Qeydiyyat pəncərəsi açılmalıdır
3. **"Qeydiyyat"** tab-ını seç
4. Məlumatları daxil et:
```
Ad: Test İstifadəçi
Email və ya Telefon: test@test.com
Parol: test123456
```
5. **"Qeydiyyat"** düyməsinə bas

✅ Qeydiyyat uğurlu və avtomatik giriş olmalıdır

#### b) İştirak formu:
Modal yenidən açılacaq və addım-addım davam edəcək:

**Addım 1: Ad və Telefon**
```
Ad və Soyad: Test İstifadəçi
Telefon: +994501234567
```
**"Növbəti: Ödəniş"** düyməsinə bas

**Addım 2: Ödəniş Məlumatları**
- Kart nömrəsini görürsünüz
- Kopyala düyməsi ilə kopyalaya bilərsiniz
- **"Ödəniş Edildi"** düyməsinə bas

**Addım 3: Çek Yükləmə**
- Hər hansı bir şəkil faylı seçin (test üçün screenshot və ya başqa şəkil)
- Şəkil yüklənəcək
- **"Göndər və Tamamla"** düyməsinə bas

**Addım 4: Uğur**
✅ "Uğurlu!" mesajı görünməlidir
- **"Profilə Get"** düyməsinə bas

---

### 6️⃣ **Profil səhifəsi yoxlama**

Profil səhifəsində (`/profile`):
1. **"Kampaniyalar"** tab-ını seç
2. İştirakınızı görməlisiniz:
   - Kampaniya adı
   - Bilet nömrəsi (TKT-XXXXX-0001)
   - Status: 🟡 Gözləmədə

✅ İştirak məlumatları düzgün görünməlidir

---

### 7️⃣ **Admin İştirakı Təsdiq Et**

#### a) Admin panelə qayıt:
1. **http://localhost:3000/admin** 
2. Sol menuda **"Kampaniyalar"**
3. Kampaniyanızda **"Bax"** düyməsinə klik

#### b) İştirakçı siyahısı:
- İştirakçı məlumatları görünür
- Çek şəkli görünür (klikləyib böyüdə bilərsiniz)
- Status: 🟡 Gözləmədə

#### c) Təsdiq et:
1. **"Təsdiq et"** düyməsinə bas
2. ✅ Status dəyişməli: 🟢 Təsdiqləndi

---

### 8️⃣ **Yenidən Profilə Bax**

1. İstifadəçi profilinə qayıt: **http://localhost:3000/profile**
2. **"Kampaniyalar"** tab
3. Status yeniləndi: 🟢 Təsdiqləndi

✅ Sistem tam işləyir!

---

## 📊 Database Yoxlama (İstəyə görə)

Prisma Studio ilə database-ə baxın:

```bash
npx prisma studio
```

Brauzer açacaq: **http://localhost:5555**

**Yoxla:**
- `campaigns` - Kampaniyanız var?
- `campaign_participants` - İştirakçınız var?
- Status düzgündür?

---

## ✅ Test Checklist

- [ ] Server işləyir (http://localhost:3000)
- [ ] Admin yaradıldı
- [ ] Admin panel login işləyir
- [ ] Yeni kampaniya yaradıldı
- [ ] Kampaniya `/campaigns` səhifəsində görünür
- [ ] İstifadəçi qeydiyyatı işləyir
- [ ] İştirak formu işləyir (5 addım)
- [ ] Çek yükləmə işləyir
- [ ] Profildə kampaniya görünür
- [ ] Admin iştirakçıları görür
- [ ] Çek şəkli görünür
- [ ] Təsdiq funksiyası işləyir
- [ ] Status yenilənməsi işləyir

---

## 🎯 Nəticə

**Əgər bütün yuxarıdakılar işləyirsə:**

🎉 **Kampaniya sistemi tam hazırdır və işləyir!**

Artıq istifadə edə bilərsiniz:
- Kampaniya yarat
- İstifadəçilər iştirak etsin
- Admin təsdiq etsin
- Qalib seçin (manual olaraq)

---

## 🚨 Problem Varsa?

### Console log yoxla:
- Browser console (F12)
- Terminal server logs

### Database yoxla:
```bash
npx prisma studio
```

### Server yenidən başlat:
```bash
# Terminal-da Ctrl+C
npm run dev
```

---

**İndi test edə bilərsiniz!** 🚀
