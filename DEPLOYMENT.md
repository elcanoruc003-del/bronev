# BronEv - Deployment Guide

## 🚀 Production Deployment

### 1. Vercel Deployment (Tövsiyə edilir)

#### Addımlar:

1. **GitHub-a push edin**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/bronev.git
git push -u origin main
```

2. **Vercel-ə daxil olun**
- [vercel.com](https://vercel.com) saytına daxil olun
- "Import Project" seçin
- GitHub repository-nizi seçin

3. **Environment Variables əlavə edin**
```env
DATABASE_URL=your_postgresql_url
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secret_key
NEXT_PUBLIC_WHATSAPP_NUMBER=994777670031
NEXT_PUBLIC_PHONE_NUMBER=0777670031
```

4. **Deploy edin**
- "Deploy" düyməsinə basın
- 2-3 dəqiqə gözləyin
- Hazırdır! 🎉

### 2. Database Setup (PostgreSQL)

#### Supabase (Tövsiyə edilir - Pulsuz)

1. [supabase.com](https://supabase.com) saytına daxil olun
2. Yeni project yaradın
3. Database URL-ni kopyalayın
4. Vercel-də `DATABASE_URL` əlavə edin

#### Railway (Alternativ)

1. [railway.app](https://railway.app) saytına daxil olun
2. PostgreSQL database yaradın
3. Connection string-i kopyalayın

#### Neon (Alternativ)

1. [neon.tech](https://neon.tech) saytına daxil olun
2. Database yaradın
3. Connection string-i əldə edin

### 3. Database Migration

Vercel-də deploy etdikdən sonra:

```bash
# Local-da test edin
npm run db:generate
npm run db:push

# Production-da avtomatik işləyəcək
```

### 4. Image Hosting

#### Cloudinary (Tövsiyə edilir)

1. [cloudinary.com](https://cloudinary.com) saytına daxil olun
2. Account yaradın (pulsuz plan)
3. API credentials əldə edin
4. Environment variables əlavə edin:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Domain Setup

#### Custom Domain

1. Vercel dashboard-da "Domains" seçin
2. Domain əlavə edin (məs: bron-ev.com)
3. DNS records əlavə edin:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 6. SSL Certificate

Vercel avtomatik SSL certificate təmin edir (Let's Encrypt).

### 7. Performance Monitoring

#### Vercel Analytics

```bash
npm install @vercel/analytics
```

`src/app/layout.tsx`-da:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 8. Error Monitoring

#### Sentry (Optional)

```bash
npm install @sentry/nextjs
```

### 9. SEO Setup

#### Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console) saytına daxil olun
2. Domain əlavə edin
3. Sitemap submit edin: `https://bron-ev.com/sitemap.xml`

#### Google Analytics

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 10. Backup Strategy

#### Database Backup

Supabase avtomatik backup edir. Manual backup üçün:

```bash
pg_dump $DATABASE_URL > backup.sql
```

### 11. Security Checklist

- ✅ Environment variables təhlükəsiz saxlanılır
- ✅ Database connection encrypted
- ✅ HTTPS enabled
- ✅ Security headers configured
- ✅ Rate limiting (future)
- ✅ Input validation
- ✅ SQL injection protection

### 12. Post-Deployment

#### Test edin:

1. Homepage yüklənir?
2. Search işləyir?
3. Admin panel açılır?
4. Images yüklənir?
5. Mobile responsive?
6. SEO meta tags düzgün?

#### Performance Test:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### 13. Maintenance

#### Weekly:
- Database backup yoxlayın
- Error logs yoxlayın
- Performance metrics yoxlayın

#### Monthly:
- Dependencies update edin
- Security patches tətbiq edin
- Analytics review edin

### 14. Scaling

#### Horizontal Scaling:
- Vercel avtomatik scale edir
- Database connection pooling

#### Vertical Scaling:
- Database plan upgrade
- CDN əlavə edin (Cloudflare)

### 15. Cost Estimation

#### Free Tier (Başlanğıc):
- Vercel: Free
- Supabase: Free (500MB)
- Cloudinary: Free (25GB)
- **Total: $0/month**

#### Production (Orta):
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Cloudinary: $89/month
- **Total: ~$134/month**

### 16. Support

Problemlə qarşılaşsanız:

1. Vercel logs yoxlayın
2. Database connection test edin
3. Environment variables yoxlayın
4. GitHub Issues açın

---

**Uğurlar! 🚀**

Suallarınız varsa: info@bron-ev.com
