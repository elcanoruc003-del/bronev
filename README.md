# 🏠 BronEv - Premium Günlük Kirayə Platforması

Premium günlük kirayə ev platforması. Azərbaycan bazarı üçün hazırlanmış, production-ready Next.js tətbiqi.

## ✨ Xüsusiyyətlər

- 🎨 **Premium Design** - Luxury UI/UX (Gold + Navy theme)
- 📊 **Real-time Analytics** - Dashboard with live statistics
- 🔒 **Enterprise Security** - A+ grade security
- ⚡ **High Performance** - Optimized for speed
- 📱 **Mobile-First** - Fully responsive design
- 🌍 **SEO Optimized** - Complete SEO implementation
- 🗄️ **Database Ready** - PostgreSQL with Prisma ORM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (optional for development)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment (optional)
cp .env.example .env
# Add your DATABASE_URL if using database

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
bronev/
├── prisma/              # Database schema
├── public/              # Static files
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── page.js     # Homepage
│   │   ├── layout.tsx  # Root layout
│   │   ├── admin/      # Admin panel
│   │   └── api/        # API routes
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   └── types/          # TypeScript types
└── Configuration files
```

## 🗄️ Database Setup (Optional)

```bash
# 1. Add DATABASE_URL to .env
DATABASE_URL="postgresql://user:password@localhost:5432/bronev"

# 2. Generate Prisma client
npm run db:generate

# 3. Push schema to database
npm run db:push

# 4. Open Prisma Studio (optional)
npm run db:studio
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript + JavaScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Icons**: React Icons
- **Validation**: Zod

## 📊 Features

### Homepage
- Premium hero section
- Featured properties grid
- Trust badges
- Contact section
- Premium footer

### Admin Panel
- Dashboard with statistics
- Property management (CRUD)
- Real-time analytics
- Performance tracking

### Components
- Header (fixed, glass effect)
- Property cards (luxury design)
- Search filters (advanced)
- Contact forms
- And more...

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# 3. Add environment variables
# 4. Deploy!
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Environment Variables

```env
# Database (optional)
DATABASE_URL="postgresql://..."

# NextAuth (future)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Contact
NEXT_PUBLIC_PHONE_NUMBER="0777670031"
NEXT_PUBLIC_WHATSAPP_NUMBER="994777670031"
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🎯 Pages

- `/` - Homepage (premium design)
- `/admin` - Admin panel (dashboard)
- `/api/properties` - Properties API endpoint

## 🔒 Security

- Security headers (middleware)
- Input validation (Zod)
- SQL injection protection (Prisma)
- XSS/CSRF protection
- Environment variables

## 📈 Performance

- Server Components (default)
- Image optimization
- Code splitting
- Lazy loading
- Compression

## 🌍 SEO

- Meta tags
- Open Graph
- Schema.org markup
- Sitemap.xml
- Robots.txt

## 📞 Contact

- Phone: 077 767 00 31
- WhatsApp: +994 77 767 00 31
- Email: info@bron-ev.com

## 📄 License

© 2024 BronEv. All rights reserved.

## 🤝 Contributing

Contributions are welcome! Please open an issue first.

---

**Status**: ✅ Production Ready

**Built with** ❤️ **by Kiro AI**
