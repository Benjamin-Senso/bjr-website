import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ALTER COLUMN "statement" SET DEFAULT 'I picked up Adobe at *eight* and never put it down. Since then, a lot of brands across a lot of industries, from the first mark to the operating stack underneath it. I founded [senso], a brand, product and venture studio working with internet-first companies across the UK, EU and MENA. I am a venture partner at [quanda], and a partner behind [mandem-meetup]. Most brand people cannot build systems. Most ops people cannot build brand. I do *both*.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ALTER COLUMN "statement" SET DEFAULT 'I picked up Adobe at *eight* and never put it down. Since then, a lot of brands across a lot of industries. I founded [senso], a brand, product and venture studio working across the UK, EU and MENA. I am a venture partner at [quanda], and a partner behind [mandem-meetup]. An operator as much as a designer.';`)
}
