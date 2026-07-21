-- Kampaniya Cədvəllərini Təhlükəsiz Əlavə Et
-- Bu SQL, mövcud məlumatları silmədən yalnız yeni cədvəllər yaradır

-- Əvvəlcə yoxla ki, cədvəllər mövcud deyilsə
DO $$ 
BEGIN
    -- Campaigns cədvəli
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'campaigns') THEN
        CREATE TABLE "campaigns" (
            "id" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "slug" TEXT NOT NULL,
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
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "endedAt" TIMESTAMP(3),
            CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "campaigns_slug_key" UNIQUE ("slug"),
            CONSTRAINT "campaigns_propertyId_fkey" FOREIGN KEY ("propertyId") 
                REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE
        );
        
        RAISE NOTICE 'campaigns cədvəli yaradıldı';
    ELSE
        RAISE NOTICE 'campaigns cədvəli artıq mövcuddur';
    END IF;

    -- Campaign Participants cədvəli
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'campaign_participants') THEN
        CREATE TABLE "campaign_participants" (
            "id" TEXT NOT NULL,
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
            "ticketNumber" TEXT,
            CONSTRAINT "campaign_participants_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "campaign_participants_ticketNumber_key" UNIQUE ("ticketNumber"),
            CONSTRAINT "campaign_participants_campaignId_userId_key" UNIQUE ("campaignId", "userId"),
            CONSTRAINT "campaign_participants_campaignId_fkey" FOREIGN KEY ("campaignId") 
                REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "campaign_participants_userId_fkey" FOREIGN KEY ("userId") 
                REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
        
        RAISE NOTICE 'campaign_participants cədvəli yaradıldı';
    ELSE
        RAISE NOTICE 'campaign_participants cədvəli artıq mövcuddur';
    END IF;
END $$;

-- İndekslər əlavə et
CREATE INDEX IF NOT EXISTS "campaigns_status_idx" ON "campaigns"("status");
CREATE INDEX IF NOT EXISTS "campaigns_slug_idx" ON "campaigns"("slug");
CREATE INDEX IF NOT EXISTS "campaigns_propertyId_idx" ON "campaigns"("propertyId");
CREATE INDEX IF NOT EXISTS "campaigns_drawDate_idx" ON "campaigns"("drawDate");

CREATE INDEX IF NOT EXISTS "campaign_participants_campaignId_idx" ON "campaign_participants"("campaignId");
CREATE INDEX IF NOT EXISTS "campaign_participants_userId_idx" ON "campaign_participants"("userId");
CREATE INDEX IF NOT EXISTS "campaign_participants_status_idx" ON "campaign_participants"("status");
CREATE INDEX IF NOT EXISTS "campaign_participants_submittedAt_idx" ON "campaign_participants"("submittedAt");

-- Yoxla ki, cədvəllər yaradıldı
SELECT 
    'campaigns' as table_name, 
    COUNT(*) as row_count 
FROM "campaigns"
UNION ALL
SELECT 
    'campaign_participants' as table_name, 
    COUNT(*) as row_count 
FROM "campaign_participants";
