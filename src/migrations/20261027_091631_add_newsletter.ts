import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "newsletter_promises" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE "newsletter" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Notes from the work' NOT NULL,
  	"blurb" varchar DEFAULT 'Occasional writing on brand, product and the operations underneath. Sent when there is something worth sending, not on a schedule.',
  	"button_label" varchar DEFAULT 'Subscribe',
  	"footnote" varchar,
  	"show_on_home" boolean DEFAULT true,
  	"show_on_about" boolean DEFAULT true,
  	"show_after_articles" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home" ALTER COLUMN "statement" SET DEFAULT 'I picked up Adobe at *eight* and never put it down. Since then, a lot of brands across a lot of industries. I founded [senso], a brand, product and venture studio working across the UK, EU and MENA. I am a venture partner at [quanda], and a partner behind [mandem-meetup]. An operator as much as a designer.';
  ALTER TABLE "writing" ALTER COLUMN "heading" SET DEFAULT 'Journal';
  ALTER TABLE "writing" ALTER COLUMN "meta_title" SET DEFAULT 'Journal';
  ALTER TABLE "newsletter_promises" ADD CONSTRAINT "newsletter_promises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "newsletter_promises_order_idx" ON "newsletter_promises" USING btree ("_order");
  CREATE INDEX "newsletter_promises_parent_id_idx" ON "newsletter_promises" USING btree ("_parent_id");
  ALTER TABLE "writing" DROP COLUMN "subscribe_heading";
  ALTER TABLE "writing" DROP COLUMN "subscribe_blurb";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_promises" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "newsletter_promises" CASCADE;
  DROP TABLE "newsletter" CASCADE;
  ALTER TABLE "home" ALTER COLUMN "statement" SET DEFAULT 'Founder of Senso Studio, a brand, product and venture studio working with internet-first companies across the UK, EU and MENA. An operator as much as a designer.';
  ALTER TABLE "writing" ALTER COLUMN "heading" SET DEFAULT 'Writing';
  ALTER TABLE "writing" ALTER COLUMN "meta_title" SET DEFAULT 'Writing';
  ALTER TABLE "writing" ADD COLUMN "subscribe_heading" varchar DEFAULT 'Subscribe to the newsletter';
  ALTER TABLE "writing" ADD COLUMN "subscribe_blurb" varchar DEFAULT 'Occasional notes on building brands, and the businesses behind them.';`)
}
