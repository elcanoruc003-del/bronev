// Provides `process` and `Buffer` types without requiring @types/node
// to be installed. Removed once node_modules is set up (skipLibCheck handles the rest).

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL?: string;
    SESSION_SECRET?: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_ADSENSE_ID?: string;
    NEXT_PUBLIC_WHATSAPP_NUMBER?: string;
    NEXT_PUBLIC_PHONE_NUMBER?: string;
    [key: string]: string | undefined;
  };
};
