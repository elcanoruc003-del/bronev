/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="node" />

// Extend ProcessEnv for type-safe env vars
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly DATABASE_URL?: string;
    readonly SESSION_SECRET?: string;
    readonly NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
    readonly CLOUDINARY_API_KEY?: string;
    readonly CLOUDINARY_API_SECRET?: string;
    readonly NEXT_PUBLIC_GA_ID?: string;
    readonly NEXT_PUBLIC_ADSENSE_ID?: string;
    readonly NEXT_PUBLIC_WHATSAPP_NUMBER?: string;
    readonly NEXT_PUBLIC_PHONE_NUMBER?: string;
    readonly ADMIN_EMAIL?: string;
    readonly ADMIN_PASSWORD?: string;
    readonly ADMIN_PHONE?: string;
  }
}
