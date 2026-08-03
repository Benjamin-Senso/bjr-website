import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_work_items_type" AS ENUM('company', 'venture', 'project', 'involvement');
  CREATE TYPE "public"."enum_work_items_status" AS ENUM('active', 'building', 'exited');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('instagram', 'x', 'youtube', 'linkedin', 'tiktok', 'threads', 'github', 'facebook', 'email', 'website');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "work_items_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "work_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"cover_image_id" integer,
  	"type" "enum_work_items_type" DEFAULT 'venture' NOT NULL,
  	"role" varchar,
  	"description" varchar,
  	"body" jsonb,
  	"url" varchar,
  	"year" varchar,
  	"status" "enum_work_items_status",
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"handled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"work_items_id" integer,
  	"contact_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" DEFAULT 'website' NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"profile_image_id" integer,
  	"name" varchar DEFAULT 'Benjamin Rutter' NOT NULL,
  	"footer_text" varchar DEFAULT '© 2026 Benjamin Rutter',
  	"meta_title_suffix" varchar DEFAULT 'Benjamin Rutter',
  	"meta_description" varchar DEFAULT 'Benjamin Rutter builds brands and the businesses behind them. Founder of Senso Studio, a brand, product and venture studio working with internet-first companies across the UK, EU and MENA.',
  	"keywords" varchar DEFAULT 'Benjamin Rutter, Senso Studio, brand studio, product studio, venture studio, brand strategy, brand identity, advisory, consultancy, founder, UK, UAE, MENA',
  	"job_title" varchar DEFAULT 'Founder, Senso Studio',
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_links_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "home_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"bio" varchar DEFAULT 'I build brands, and the businesses behind them.' NOT NULL,
  	"statement" varchar DEFAULT 'Founder of Senso Studio, a brand, product and venture studio working with internet-first companies across the UK, EU and MENA. An operator as much as a designer.',
  	"meta_title" varchar DEFAULT 'Benjamin Rutter',
  	"meta_description" varchar,
  	"keywords" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_help_with" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "about_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'About' NOT NULL,
  	"intro" varchar DEFAULT 'An operator as much as a designer.',
  	"body" jsonb,
  	"portrait_id" integer,
  	"meta_title" varchar DEFAULT 'About',
  	"meta_description" varchar,
  	"keywords" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "work_advisory_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "work" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Work' NOT NULL,
  	"intro" varchar DEFAULT 'The studio, the ventures around it, and advisory work with founders and operators.',
  	"body" jsonb,
  	"studio_url" varchar DEFAULT 'https://sensostudio.co',
  	"studio_link_label" varchar DEFAULT 'Visit Senso Studio',
  	"advisory_enabled" boolean DEFAULT true,
  	"advisory_heading" varchar DEFAULT 'Advisory and consultancy',
  	"advisory_body" varchar DEFAULT 'Alongside the studio I take on a small number of advisory and consulting engagements. Usually founders and operators who need brand and product that pulls commercial weight, and the operational spine to run it.',
  	"advisory_cta_label" varchar DEFAULT 'Start a conversation',
  	"advisory_cta_url" varchar DEFAULT '/contact',
  	"meta_title" varchar DEFAULT 'Work',
  	"meta_description" varchar,
  	"keywords" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "writing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Writing' NOT NULL,
  	"intro" varchar DEFAULT 'Occasional notes on building brands, and the businesses behind them.',
  	"show_subscribe" boolean DEFAULT true,
  	"subscribe_heading" varchar DEFAULT 'Subscribe to the newsletter',
  	"subscribe_blurb" varchar DEFAULT 'Occasional notes on building brands, and the businesses behind them.',
  	"post_limit" numeric DEFAULT 10,
  	"meta_title" varchar DEFAULT 'Writing',
  	"meta_description" varchar,
  	"keywords" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Contact' NOT NULL,
  	"intro" varchar DEFAULT 'Studio work, advisory and consulting, or a venture you want a partner on. If you are building something and want brand and product that pulls commercial weight, get in touch.',
  	"show_form" boolean DEFAULT true,
  	"form_heading" varchar DEFAULT 'Send a message',
  	"email" varchar,
  	"availability" varchar,
  	"show_socials" boolean DEFAULT true,
  	"meta_title" varchar DEFAULT 'Contact',
  	"meta_description" varchar,
  	"keywords" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_items_gallery" ADD CONSTRAINT "work_items_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work_items_gallery" ADD CONSTRAINT "work_items_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_items" ADD CONSTRAINT "work_items_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_work_items_fk" FOREIGN KEY ("work_items_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_links_tags" ADD CONSTRAINT "home_links_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_links" ADD CONSTRAINT "home_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_links" ADD CONSTRAINT "home_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_help_with" ADD CONSTRAINT "about_help_with_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_facts" ADD CONSTRAINT "about_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work_advisory_points" ADD CONSTRAINT "work_advisory_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work" ADD CONSTRAINT "work_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "writing" ADD CONSTRAINT "writing_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact" ADD CONSTRAINT "contact_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "work_items_gallery_order_idx" ON "work_items_gallery" USING btree ("_order");
  CREATE INDEX "work_items_gallery_parent_id_idx" ON "work_items_gallery" USING btree ("_parent_id");
  CREATE INDEX "work_items_gallery_image_idx" ON "work_items_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "work_items_slug_idx" ON "work_items" USING btree ("slug");
  CREATE INDEX "work_items_cover_image_idx" ON "work_items" USING btree ("cover_image_id");
  CREATE INDEX "work_items_updated_at_idx" ON "work_items" USING btree ("updated_at");
  CREATE INDEX "work_items_created_at_idx" ON "work_items" USING btree ("created_at");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_work_items_id_idx" ON "payload_locked_documents_rels" USING btree ("work_items_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_profile_image_idx" ON "site_settings" USING btree ("profile_image_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE INDEX "home_links_tags_order_idx" ON "home_links_tags" USING btree ("_order");
  CREATE INDEX "home_links_tags_parent_id_idx" ON "home_links_tags" USING btree ("_parent_id");
  CREATE INDEX "home_links_order_idx" ON "home_links" USING btree ("_order");
  CREATE INDEX "home_links_parent_id_idx" ON "home_links" USING btree ("_parent_id");
  CREATE INDEX "home_links_image_idx" ON "home_links" USING btree ("image_id");
  CREATE INDEX "home_og_image_idx" ON "home" USING btree ("og_image_id");
  CREATE INDEX "about_help_with_order_idx" ON "about_help_with" USING btree ("_order");
  CREATE INDEX "about_help_with_parent_id_idx" ON "about_help_with" USING btree ("_parent_id");
  CREATE INDEX "about_facts_order_idx" ON "about_facts" USING btree ("_order");
  CREATE INDEX "about_facts_parent_id_idx" ON "about_facts" USING btree ("_parent_id");
  CREATE INDEX "about_portrait_idx" ON "about" USING btree ("portrait_id");
  CREATE INDEX "about_og_image_idx" ON "about" USING btree ("og_image_id");
  CREATE INDEX "work_advisory_points_order_idx" ON "work_advisory_points" USING btree ("_order");
  CREATE INDEX "work_advisory_points_parent_id_idx" ON "work_advisory_points" USING btree ("_parent_id");
  CREATE INDEX "work_og_image_idx" ON "work" USING btree ("og_image_id");
  CREATE INDEX "writing_og_image_idx" ON "writing" USING btree ("og_image_id");
  CREATE INDEX "contact_og_image_idx" ON "contact" USING btree ("og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "work_items_gallery" CASCADE;
  DROP TABLE "work_items" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_links_tags" CASCADE;
  DROP TABLE "home_links" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "about_help_with" CASCADE;
  DROP TABLE "about_facts" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "work_advisory_points" CASCADE;
  DROP TABLE "work" CASCADE;
  DROP TABLE "writing" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TYPE "public"."enum_work_items_type";
  DROP TYPE "public"."enum_work_items_status";
  DROP TYPE "public"."enum_site_settings_socials_platform";`)
}
