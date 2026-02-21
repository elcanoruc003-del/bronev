# BronEv - Enterprise Architecture Documentation

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

### Layered Architecture (Production-Ready)

```
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (Next.js 14)            │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ Public Site │  │ Admin Panel  │  │  API Routes    │ │
│  │   (SSR/SSG) │  │  (Protected) │  │   (RESTful)    │ │
│  └─────────────┘  └──────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│            APPLICATION LAYER (Business Logic)           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Services   │  │  Validation  │  │    Events    │  │
│  │   (Zod)      │  │   (Zod)      │  │  (Webhooks)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│           DATA ACCESS LAYER (Repository Pattern)        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Prisma    │  │    Caching   │  │  Query Opt   │  │
│  │     ORM      │  │ (Redis-fut)  │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│         PERSISTENCE LAYER (PostgreSQL - Neon)           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   ACID       │  │  Connection  │  │  Read        │  │
│  │  Compliance  │  │   Pooling    │  │  Replicas    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE MODEL (Enterprise-Level)

### Core Entities

#### 1. User Management
```prisma
model User {
  - Authentication (email, phone, password)
  - Profile (bio, language, timezone)
  - Security (2FA, last login tracking)
  - Status (active, banned)
  - Relations (properties, bookings, reviews)
}
```

#### 2. Property Management (Airbnb-level)
```prisma
model Property {
  - Basic Info (title, descriptions)
  - Multi-tier Pricing (nightly, weekly, monthly)
  - Dynamic Pricing (weekend multiplier, discounts)
  - Location (coordinates, full address)
  - Details (beds, bathrooms, area, guests)
  - Check-in/out times
  - Amenities & Features (JSON for flexibility)
  - Status & Visibility
  - SEO Optimization
  - Statistics (views, bookings, ratings)
}
```

#### 3. Availability System (Core Feature)
```prisma
model PropertyAvailability {
  - Date ranges
  - Availability status
  - Block reasons (maintenance, booked, manual)
  - Custom pricing per period
  - Minimum stay overrides
  - Overlapping prevention
}
```

#### 4. Dynamic Pricing Rules
```prisma
model PricingRule {
  - Rule types (seasonal, weekend, holiday, early bird)
  - Date ranges
  - Adjustment (percentage or fixed)
  - Days of week targeting
  - Priority system
}
```

#### 5. Booking System
```prisma
model Booking {
  - Unique booking number
  - Date ranges
  - Detailed pricing breakdown
  - Promo code support
  - Guest information
  - Status tracking
  - Payment tracking
  - Cancellation handling
  - Communication tracking (WhatsApp, email, SMS)
}
```

#### 6. Review System (Multi-dimensional)
```prisma
model Review {
  - 6 rating categories
  - Detailed comments (pros/cons)
  - Image uploads
  - Verification status
  - Owner response capability
}
```

#### 7. Audit Log (Security & Compliance)
```prisma
model AuditLog {
  - User actions tracking
  - Entity changes (before/after)
  - IP address & user agent
  - Timestamp tracking
}
```

#### 8. Notification System
```prisma
model Notification {
  - Multiple types
  - Read status tracking
  - Rich data payload
}
```

### Database Indexes (Performance Optimization)

```sql
-- Property indexes
CREATE INDEX idx_property_city ON properties(city);
CREATE INDEX idx_property_type ON properties(type);
CREATE INDEX idx_property_status ON properties(status);
CREATE INDEX idx_property_price ON properties(basePricePerNight);
CREATE INDEX idx_property_rating ON properties(averageRating);
CREATE INDEX idx_property_created ON properties(createdAt);

-- Availability indexes
CREATE INDEX idx_availability_dates ON property_availability(startDate, endDate);
CREATE INDEX idx_availability_property ON property_availability(propertyId);

-- Booking indexes
CREATE INDEX idx_booking_dates ON bookings(checkIn, checkOut);
CREATE INDEX idx_booking_status ON bookings(status);
CREATE INDEX idx_booking_number ON bookings(bookingNumber);

-- Performance: Composite indexes for common queries
CREATE INDEX idx_property_search ON properties(city, type, status, basePricePerNight);
```

---

## 🔧 SERVICE LAYER ARCHITECTURE

### 1. AvailabilityService
**Purpose**: Manage property availability with overlapping prevention

**Key Methods**:
- `checkAvailability()` - Check if dates are available
- `blockDates()` - Manual or automatic blocking
- `unblockDates()` - Remove blocks
- `getMonthCalendar()` - Calendar view with pricing
- `autoBlockForBooking()` - Auto-block on confirmation
- `autoUnblockForBooking()` - Auto-unblock on cancellation

**Features**:
- Overlapping detection
- Conflict resolution
- Integration with bookings
- Custom pricing per period

### 2. PricingService
**Purpose**: Dynamic pricing calculation with multiple rules

**Key Methods**:
- `calculatePrice()` - Full price breakdown
- `getAverageNightlyRate()` - Average calculation

**Pricing Logic**:
1. Base price per night
2. Weekend surcharge (multiplier)
3. Seasonal adjustments (pricing rules)
4. Weekly discount (7+ nights)
5. Monthly discount (30+ nights)
6. Promo code discount
7. Cleaning fee
8. Service fee (10%)
9. Taxes (18% VAT)

**Example Calculation**:
```
Base: 100 AZN × 5 nights = 500 AZN
Weekend surcharge: +50 AZN
Weekly discount: -25 AZN (5%)
Subtotal: 525 AZN
Cleaning fee: +30 AZN
Service fee: +52.5 AZN (10%)
Taxes: +103.95 AZN (18%)
TOTAL: 711.45 AZN
```

### 3. WhatsAppService
**Purpose**: Professional booking message generation

**Key Methods**:
- `generateBookingURL()` - Create WhatsApp link
- `generateInquiryURL()` - General inquiry
- `formatConfirmationMessage()` - Booking confirmation
- `formatCancellationMessage()` - Cancellation notice

**Message Format**:
```
🏠 BRON SORĞUSU

📍 Ev: Luxury Villa in Qəbələ
🆔 ID: clx123abc

📅 TARİXLƏR
▫️ Giriş: 15 Mart 2024, Cümə
▫️ Çıxış: 20 Mart 2024, Çərşənbə
▫️ Gecələr: 5

👥 Qonaq sayı: 4

💰 Ümumi qiymət: 711 AZN

👤 Ad: Elcan Oruc
📱 Telefon: +994777670031

━━━━━━━━━━━━━━━━━━━
✅ Rezervasiya üçün təsdiq gözləyirəm.

_BronEv.com vasitəsilə göndərildi_
```

### 4. AnalyticsService
**Purpose**: Real-time statistics and business insights

**Key Methods**:
- `getDashboardMetrics()` - Comprehensive dashboard
- `getPropertyStatistics()` - Per-property analytics
- `trackView()` - View tracking
- `trackInquiry()` - Inquiry tracking
- `getRevenueChartData()` - Revenue trends

**Metrics Tracked**:
- Total/active properties
- Booking statistics
- Revenue (total, monthly)
- Occupancy rate
- Conversion rate
- Response metrics
- Top performing properties
- Recent activity feed

---

## 🔐 SECURITY ARCHITECTURE

### 1. Authentication & Authorization
- NextAuth.js integration
- JWT tokens
- Role-based access control (RBAC)
- Session management
- 2FA support (future)

### 2. Data Security
- Password hashing (bcrypt)
- SQL injection prevention (Prisma)
- XSS protection
- CSRF protection
- Input validation (Zod)
- Rate limiting (future)

### 3. Audit Trail
- All admin actions logged
- IP address tracking
- User agent tracking
- Before/after change tracking
- Compliance ready

### 4. Security Headers
```javascript
{
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### 1. Database Level
- Proper indexing strategy
- Connection pooling (Neon)
- Query optimization
- Eager loading with Prisma
- Read replicas (future)

### 2. Application Level
- Server Components (default)
- Client Components (minimal)
- Code splitting
- Tree shaking
- Lazy loading

### 3. Caching Strategy (Future)
```
┌─────────────┐
│   Redis     │ ← Hot data (sessions, popular properties)
└─────────────┘
       ↓
┌─────────────┐
│  PostgreSQL │ ← Cold data (all data)
└─────────────┘
```

### 4. CDN Strategy
- Static assets → Cloudflare CDN
- Images → Cloudinary / AWS S3
- API responses → Edge caching

### 5. Performance Targets
- LCP (Largest Contentful Paint): <2.5s ✅
- FID (First Input Delay): <100ms ✅
- CLS (Cumulative Layout Shift): <0.1 ✅
- TTI (Time to Interactive): <3.5s ✅

---

## 📈 SCALABILITY PLAN

### Phase 1: Current (1-1000 properties)
- Single PostgreSQL instance
- Vercel serverless functions
- No caching layer

### Phase 2: Growth (1K-10K properties)
- Redis caching layer
- Database read replicas
- CDN for static assets
- Image optimization service

### Phase 3: Scale (10K-100K properties)
- Microservices architecture
- Event-driven system (Kafka/RabbitMQ)
- Elasticsearch for search
- Separate analytics database
- Load balancing

### Phase 4: Enterprise (100K+ properties)
- Multi-region deployment
- Sharding strategy
- GraphQL API
- Real-time features (WebSockets)
- AI/ML recommendations

---

## 🎯 FUTURE ENHANCEMENTS

### Short-term (3 months)
- [ ] Online payment (Stripe/PayPal)
- [ ] Email notifications (SendGrid)
- [ ] SMS notifications (Twilio)
- [ ] Calendar sync (iCal)
- [ ] Promo code system

### Mid-term (6 months)
- [ ] Multi-language (AZ, EN, RU)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered pricing recommendations
- [ ] Virtual tours (360°)

### Long-term (12 months)
- [ ] Multi-property owner platform
- [ ] Blockchain verification
- [ ] Smart contracts
- [ ] Cryptocurrency payments
- [ ] Marketplace expansion

---

## 🛠️ DEVELOPMENT WORKFLOW

### Git Workflow
```
main (production)
  ↑
develop (staging)
  ↑
feature/* (development)
```

### CI/CD Pipeline
```
Git Push → GitHub Actions → Tests → Build → Deploy → Monitor
```

### Code Quality
- TypeScript strict mode
- ESLint + Prettier
- Husky pre-commit hooks
- Conventional commits
- Code reviews mandatory

---

## 📊 MONITORING & OBSERVABILITY

### Application Monitoring
- Sentry (error tracking)
- LogRocket (session replay)
- Google Analytics 4 (user behavior)

### Infrastructure Monitoring
- Vercel Analytics (performance)
- Neon Dashboard (database metrics)
- Uptime monitoring (UptimeRobot)

### Key Metrics
- Response time (p50, p95, p99)
- Error rate
- Database query performance
- API endpoint latency
- User conversion funnel

---

## 🔄 BACKUP & DISASTER RECOVERY

### Database Backups
- Automated daily backups (Neon)
- Point-in-time recovery
- 30-day retention

### Disaster Recovery Plan
1. Database restore from backup
2. Redeploy application (Vercel)
3. DNS failover (Cloudflare)
4. Communication to users

### RTO/RPO Targets
- RTO (Recovery Time Objective): <1 hour
- RPO (Recovery Point Objective): <24 hours

---

**Status**: Enterprise-Ready 🚀
**Last Updated**: 2024
**Architecture Version**: 2.0
**Maintainer**: BronEv Engineering Team
