import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "privacy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Privacy' NOT NULL,
  	"intro" varchar DEFAULT 'What this site collects, why, and what you can ask me to do about it.',
  	"last_updated" varchar DEFAULT 'August 2026',
  	"body" jsonb,
  	"meta_title" varchar DEFAULT 'Privacy',
  	"meta_description" varchar DEFAULT 'What benjaminrutter.com collects, why, and how to ask for it to be removed.',
  	"keywords" varchar DEFAULT 'privacy, cookies, data protection',
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home" ALTER COLUMN "meta_description" SET DEFAULT 'Benjamin Rutter builds brands and the businesses behind them. Founder of Senso Studio, working with internet-first companies across the UK, EU and MENA.';
  ALTER TABLE "home" ALTER COLUMN "keywords" SET DEFAULT 'Benjamin Rutter, Senso Studio, brand studio, founder, brand and product, UK, UAE';
  ALTER TABLE "about" ALTER COLUMN "meta_description" SET DEFAULT 'How Benjamin Rutter got from picking up design tools at eight to running a brand, product and venture studio across two jurisdictions.';
  ALTER TABLE "about" ALTER COLUMN "keywords" SET DEFAULT 'Benjamin Rutter about, brand designer, operator, founder story, Senso Studio';
  ALTER TABLE "work" ALTER COLUMN "meta_description" SET DEFAULT 'Senso Studio, the ventures around it, and advisory work with founders and operators. Brand, product and the operational systems underneath.';
  ALTER TABLE "work" ALTER COLUMN "keywords" SET DEFAULT 'Benjamin Rutter work, Senso Studio, Signet, ventures, brand and product, advisory';
  ALTER TABLE "writing" ALTER COLUMN "meta_description" SET DEFAULT 'Occasional notes from Benjamin Rutter on building brands, and the businesses behind them.';
  ALTER TABLE "writing" ALTER COLUMN "keywords" SET DEFAULT 'Benjamin Rutter writing, brand notes, founder newsletter';
  ALTER TABLE "contact" ALTER COLUMN "meta_description" SET DEFAULT 'Get in touch about brand and product work, advisory and consulting, or a venture you want a partner on.';
  ALTER TABLE "contact" ALTER COLUMN "keywords" SET DEFAULT 'contact Benjamin Rutter, brand consultancy, advisory, Senso Studio enquiries';
  ALTER TABLE "privacy" ADD CONSTRAINT "privacy_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "privacy_og_image_idx" ON "privacy" USING btree ("og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "privacy" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "privacy" CASCADE;
  ALTER TABLE "home" ALTER COLUMN "meta_description" DROP DEFAULT;
  ALTER TABLE "home" ALTER COLUMN "keywords" DROP DEFAULT;
  ALTER TABLE "about" ALTER COLUMN "meta_description" DROP DEFAULT;
  ALTER TABLE "about" ALTER COLUMN "keywords" DROP DEFAULT;
  ALTER TABLE "work" ALTER COLUMN "meta_description" DROP DEFAULT;
  ALTER TABLE "work" ALTER COLUMN "keywords" DROP DEFAULT;
  ALTER TABLE "writing" ALTER COLUMN "meta_description" DROP DEFAULT;
  ALTER TABLE "writing" ALTER COLUMN "keywords" DROP DEFAULT;
  ALTER TABLE "contact" ALTER COLUMN "meta_description" DROP DEFAULT;
  ALTER TABLE "contact" ALTER COLUMN "keywords" DROP DEFAULT;`)
}
