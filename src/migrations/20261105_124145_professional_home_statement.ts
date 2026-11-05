import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ALTER COLUMN "statement" SET DEFAULT 'Founder of [senso], venture partner at [quanda], and a partner behind [mandem-meetup]. Brand, product and the operations underneath, across the UK, EU and MENA.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ALTER COLUMN "statement" SET DEFAULT 'I picked up Adobe at *eight* and never put it down. Since then, many brands across many industries, from the first logomark to the operating stack underneath. I founded [senso], am a venture partner at [quanda], and a partner behind [mandem-meetup]. I also build cool things.';`)
}
