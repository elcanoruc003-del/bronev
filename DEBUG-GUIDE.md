# Production-Level Admin Panel Debugging Guide

## 🔍 XƏTA ANALİZİ (Prioritet Sırası)

### 1. **Database Connection Issues** (Ən Yüksək Prioritet)
```typescript
// src/lib/prisma.ts - Production-safe initialization
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
```

**Səbəblər:**
- DATABASE_URL environment variable yoxdur
- Connection pool exhausted
- Network timeout
- SSL certificate issues

**Həll:**
- Vercel-də environment variables yoxla
- Connection string-də `?sslmode=require` var
- Neon dashboard-da connection limits yoxla

---

### 2. **Prisma Client Initialization** (Yüksək Prioritet)
```typescript
// SƏHV ❌
const prisma = new PrismaClient();

// DÜZGÜN ✅
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'minimal',
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Niyə vacibdir:**
- Serverless environment-də hər request yeni instance yaradır
- Memory leak və connection pool exhaustion
- Cold start zamanı multiple initialization

---

### 3. **Server Actions Error Handling** (Orta Prioritet)
```typescript
// SƏHV ❌
export async function loginAdmin(email: string, password: string) {
  const user = await authenticateUser(email, password);
  return { success: true, user };
}

// DÜZGÜN ✅
async function safeServerAction<T>(
  action: () => Promise<T>,
  errorMessage: string = 'Xəta baş verdi'
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    console.error(`Server action error: ${errorMessage}`, error);
    return { 
      success: false, 
      error: errorMessage,
    };
  }
}

export async function loginAdmin(email: string, password: string) {
  return safeServerAction(async () => {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email və parol tələb olunur');
    }

    // Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Verilənlər bazası əlçatan deyil');
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      throw new Error('Email və ya parol səhvdir');
    }

    return { user };
  }, 'Giriş zamanı xəta baş verdi');
}
```

---

### 4. **Auth Token Validation** (Orta Prioritet)
```typescript
// SƏHV ❌
export function verifySessionToken(token: string): AuthUser | null {
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  return JSON.parse(decoded);
}

// DÜZGÜN ✅
export function verifySessionToken(token: string): AuthUser | null {
  try {
    if (!token) return null;

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(decoded);

    // Check expiration
    if (payload.exp && payload.exp < Date.now()) {
      console.warn('Session token expired');
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
```

---

### 5. **Middleware Protection** (Aşağı Prioritet)
```typescript
// SƏHV ❌
export function middleware(request: NextRequest) {
  if (pathname.startsWith('/admin')) {
    // Blocking check
    const user = await getCurrentUser(); // ❌ Cannot use await in middleware
  }
}

// DÜZGÜN ✅
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('bronev_session');
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Basic validation (no async DB calls)
    try {
      const decoded = Buffer.from(session.value, 'base64').toString('utf-8');
      const user = JSON.parse(decoded);
      
      if (!user.role || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}
```

---

## 🛠️ DEBUG PLANI

### Step 1: Vercel Logs Yoxla
```bash
# Vercel CLI ilə
vercel logs bron-ev --follow

# Və ya Vercel Dashboard:
# https://vercel.com/your-project/deployments/[deployment-id]/logs
```

**Axtarılacaq xətalar:**
- `PrismaClientInitializationError`
- `Connection timeout`
- `ECONNREFUSED`
- `Authentication failed`

---

### Step 2: Environment Variables Yoxla
```bash
# Vercel dashboard-da:
Settings → Environment Variables

# Tələb olunan:
DATABASE_URL=postgresql://...
NEXT_PUBLIC_PHONE_NUMBER=0777670031
NEXT_PUBLIC_WHATSAPP_NUMBER=994777670031
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dyfuasdbm
```

---

### Step 3: Database Connection Test
```typescript
// Test script: scripts/test-db.ts
import { prisma, checkDatabaseConnection } from '../src/lib/prisma';

async function testConnection() {
  console.log('Testing database connection...');
  
  const isConnected = await checkDatabaseConnection();
  console.log('Connection status:', isConnected);

  if (isConnected) {
    const userCount = await prisma.users.count();
    console.log('User count:', userCount);
  }
}

testConnection();
```

```bash
# Run test
npx tsx scripts/test-db.ts
```

---

### Step 4: Admin User Yoxla
```bash
# Create admin if not exists
npx tsx scripts/create-admin.ts

# Output:
# ✅ Admin user created: admin@bronev.com
# 📧 Email: admin@bronev.com
# 🔑 Password: admin123
```

---

### Step 5: Local Test
```bash
# Build locally
npm run build

# Start production server
npm start

# Test admin panel
# http://localhost:3000/admin
```

---

## 🔒 DEFENSIVE CODING PATTERNS

### Pattern 1: Input Validation
```typescript
export async function deleteProperty(propertyId: string) {
  return safeServerAction(async () => {
    // ✅ Validate input
    if (!propertyId) {
      throw new Error('Property ID tələb olunur');
    }

    // ✅ Check if exists before delete
    const exists = await prisma.properties.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });

    if (!exists) {
      throw new Error('Ev tapılmadı');
    }

    await prisma.properties.delete({
      where: { id: propertyId },
    });

    return true;
  }, 'Ev silinərkən xəta baş verdi');
}
```

---

### Pattern 2: Database Connection Check
```typescript
export async function getAdminProperties() {
  return safeServerAction(async () => {
    // ✅ Check connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Verilənlər bazası əlçatan deyil');
    }

    const properties = await prisma.properties.findMany({
      // ... query
    });

    return properties;
  }, 'Evlər yüklənərkən xəta baş verdi');
}
```

---

### Pattern 3: Non-Blocking Operations
```typescript
export async function authenticateUser(email: string, password: string) {
  // ... authentication logic

  // ✅ Non-blocking last login update
  prisma.users
    .update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })
    .catch((err) => console.error('Failed to update last login:', err));

  return user;
}
```

---

### Pattern 4: Timeout Protection
```typescript
export async function getDashboardMetrics() {
  return safeServerAction(async () => {
    // ✅ Add timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );

    const metricsPromise = AnalyticsService.getDashboardMetrics();

    const metrics = await Promise.race([metricsPromise, timeoutPromise]);
    return metrics;
  }, 'Statistika yüklənərkən xəta baş verdi');
}
```

---

### Pattern 5: Graceful Degradation
```typescript
export async function getCurrentAdmin() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const user = verifySessionToken(token);
    if (!user) {
      cookies().delete(SESSION_COOKIE);
      return null;
    }

    // ✅ If DB check fails, still return cached user
    try {
      const isConnected = await checkDatabaseConnection();
      if (!isConnected) {
        console.warn('DB unavailable, using cached session');
        return user; // Graceful degradation
      }

      const dbUser = await prisma.users.findUnique({
        where: { id: user.id },
      });

      if (!dbUser || !dbUser.isActive) {
        cookies().delete(SESSION_COOKIE);
        return null;
      }
    } catch (dbError) {
      console.error('DB check failed:', dbError);
      return user; // Fallback to cached
    }

    return user;
  } catch (error) {
    console.error('Get current admin error:', error);
    return null;
  }
}
```

---

## 📊 MONITORING & LOGGING

### Production Logging
```typescript
// src/lib/logger.ts
export const logger = {
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
};
```

### Usage
```typescript
export async function loginAdmin(email: string, password: string) {
  try {
    logger.info('Login attempt', { email });
    
    const user = await authenticateUser(email, password);
    
    if (!user) {
      logger.warn('Login failed', { email });
      return { success: false, error: 'Invalid credentials' };
    }

    logger.info('Login successful', { email, userId: user.id });
    return { success: true, user };
  } catch (error) {
    logger.error('Login error', error);
    return { success: false, error: 'Login failed' };
  }
}
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Environment variables set in Vercel
- [ ] DATABASE_URL correct and accessible
- [ ] Admin user created in production DB
- [ ] Build successful locally
- [ ] No TypeScript errors
- [ ] Prisma client generated
- [ ] Error boundaries in place
- [ ] Logging configured
- [ ] Middleware protecting correct routes
- [ ] Session cookie settings correct (httpOnly, secure, sameSite)

---

## 🚨 COMMON ERRORS & SOLUTIONS

### Error: "PrismaClientInitializationError"
**Səbəb:** DATABASE_URL yoxdur və ya səhvdir
**Həll:** Vercel environment variables yoxla

### Error: "Connection timeout"
**Səbəb:** Database əlçatan deyil
**Həll:** Neon dashboard-da database status yoxla

### Error: "Invalid session token"
**Səbəb:** Token expired və ya corrupt
**Həll:** Cookie-ni sil və yenidən login ol

### Error: "User not found"
**Səbəb:** Admin user yaradılmayıb
**Həll:** `npx tsx scripts/create-admin.ts` run et

---

## 📞 SUPPORT

Əgər problem davam edirsə:
1. Vercel logs-u yoxla
2. Browser console-u yoxla
3. Network tab-da failed requests yoxla
4. Database connection test et
