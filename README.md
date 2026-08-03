# bjr-website

Personal site for Benjamin Rutter. A small multi-page site with a built-in CMS.

Built with **Next.js 16** + **Payload CMS 3** (Payload runs inside the Next.js app) and
**Tailwind CSS v4**. Content is stored in **Postgres** and edited through the admin panel.

> Next is pinned to **16.2.6** deliberately. Next 15.4.11 has a `global-not-found` ESM bug
> that 500s `/admin`. Do not downgrade without re-testing the admin panel.

## Routes

| Route           | Content source                          | Notes                                                     |
| --------------- | --------------------------------------- | --------------------------------------------------------- |
| `/`             | `home` global                           | Hero, statement, socials, section panels                  |
| `/work`         | `work` global + `work-items` collection | Studio story, grid filtered by type, advisory block        |
| `/work/<slug>`  | `work-items` collection                 | Per-item write-up, cover image, gallery                   |
| `/about`        | `about` global                          | Long-form bio and "what I help with"                      |
| `/writing`      | `writing` global + beehiiv API          | Hidden from the nav unless beehiiv is configured          |
| `/contact`      | `contact` global                        | Contact form, email, socials                              |
| `/admin`        | Payload                                 | The CMS                                                   |

The nav is **not** CMS-editable. Its items map 1:1 to directories in the app router, and
routes with nothing behind them are dropped server-side in `src/app/(frontend)/layout.tsx`
so the nav never leads somewhere empty.

## Content model

- `site-settings` — name, avatar, socials, footer text, fallback SEO. Shared by every route.
- `home`, `about`, `work`, `writing`, `contact` — one global per page, each with its own SEO
  tab (title, description, keywords, share image) that falls back to Site Settings.
- `work-items` — a collection. Companies, ventures, projects and involvements share it,
  because the difference between them is a relationship rather than a different shape of
  content. The `type` field drives the filter pills on /work, and a pill only appears once
  that type has entries.
- `contact-submissions` — messages from the contact form. Admin-read only.
- `media` — uploads.

Every field ships a `defaultValue`, so a fresh database renders real copy rather than blanks.

## Getting started

```bash
pnpm install
```

```bash
cp .env.example .env
```

Create the database and set `PAYLOAD_SECRET` to a long random string:

```bash
createdb bjr_website
```

Then:

```bash
pnpm dev
```

- Site: http://localhost:3000 (falls back to 3001+ if the port is taken — check the log,
  don't assume)
- Admin: http://localhost:3000/admin (create the first admin user on first visit)

## Useful scripts

```bash
pnpm dev
```

```bash
pnpm build
```

```bash
pnpm payload generate:types
```

```bash
pnpm payload migrate:create <name>
```

```bash
pnpm payload migrate
```

## Gotchas worth knowing

**Dev and production must both be Postgres.** Payload migrations are
dialect-specific, so a migration generated against SQLite will not apply to
Postgres. Create a local database once with `createdb bjr_website` and point
`DATABASE_URI` at it.

**After changing a global's field shape, delete `.next`.** Page content is read through
`unstable_cache` (`src/app/(frontend)/lib/content.ts`). A cached entry survives a dev server
restart, so pages can keep rendering the *old* field shape while the REST API returns the new
one. `rm -rf .next/cache` is not enough under Turbopack — remove the whole `.next` directory.
In production the 300s revalidate window means this self-heals.

**richText `defaultValue` must be a function, not a static value.** Payload bakes a static
default into the column DDL, where apostrophes in the Lexical JSON break the generated SQL.
Write `defaultValue: () => lexicalParagraphs([...])`.

**Schema push is dev-only.** `push` is enabled only when `NODE_ENV !== 'production'`. In
production it can hang the container on an interactive "created or renamed?" prompt with no
TTY. Production applies committed migrations instead.

**Never regenerate an existing migration once it has run in production.** Payload tracks
migrations by filename in the `payload_migrations` table. Regenerating produces a new
timestamped name, so production treats it as unrun, tries to apply it, and dies on
`type "..." already exists` — taking the whole container down, because migrations run before
the server starts. Always add a new migration instead:

```bash
pnpm payload migrate:create <what_changed>
```

Deleting and regenerating `src/migrations/*` is only safe *before* the first production
deploy.

**Renaming or moving a field triggers an interactive "created or renamed?" prompt** during
`payload migrate:create`, which hangs with no TTY. Answer it in an interactive terminal.

**The database schema must not depend on environment variables.** The cloud storage plugin
injects a `prefix` column into `media` when a prefix is configured, but only while the plugin
is enabled. That made migrations generated locally (R2 off) disagree with production (R2 on),
and every upload failed with `column "prefix" does not exist`. No prefix is configured for
this reason. If you add a plugin that changes fields conditionally, check
`pnpm payload migrate:create` reports "No schema changes detected" both with and without the
relevant env vars set.

## Analytics and consent

Google Tag Manager loads only when `GTM_ID` is set, so dev and preview environments stay out
of your analytics by simply not setting it. Configure GA4 as a tag **inside** GTM rather than
adding a second GA4 tag here, or every pageview is counted twice.

Google Consent Mode v2 initialises with `ad_storage`, `ad_user_data`, `ad_personalization` and
`analytics_storage` all **denied** (`src/app/(frontend)/components/ConsentDefaults.tsx`), so
no measurement cookies are set until a visitor accepts. The banner writes the choice to
`localStorage` and pushes a consent update; the defaults script replays a stored acceptance on
later page loads, before the container runs.

The consent script is `beforeInteractive` and must stay that way. If it loads after the
container, tags fire once with no consent signal and set cookies regardless.

## Database migrations

- **Dev** uses schema push, so local changes sync automatically.
- **Production** uses migrations. After changing any collection or global, run
  `pnpm payload migrate:create <name>` and commit `src/migrations/`, or production goes stale.
  The container runs `payload migrate` on every start.

## Deployment (Dokploy)

Deployed as a **Docker Compose** application on a self-hosted Dokploy VPS. Dokploy's Traefik
terminates TLS and routes to the container over the shared `dokploy-network`, so
`docker-compose.yml` publishes **no host ports** — it only `expose`s 3000.

**One-time setup in Dokploy:**

1. Create a Compose application pointing at this repository.
2. Set these in the **Environment** tab:
   - `DATABASE_URI` — the Postgres connection string. Dokploy supplies this
     automatically when a Postgres service is attached to the app.
   - `PAYLOAD_SECRET` — `openssl rand -base64 32`
   - `NEXT_PUBLIC_SERVER_URL` — the public origin, e.g. `https://your-domain.com`, no
     trailing slash
   - `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` — optional; without both, `/writing`
     stays hidden
   - `RESEND_API_KEY` and `EMAIL_FROM` — optional; forwards contact form messages by email.
     Resend is preferred over SMTP on a VPS because it is plain HTTPS, so it is unaffected by
     hosts that block outbound SMTP ports. `EMAIL_FROM`'s domain must be verified in Resend.
     `SMTP_*` is used as a fallback when no Resend key is set. Without either, messages are
     still stored under Messages in the CMS.
   - `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` — optional, but
     all four together. Media then lives in R2 rather than on the container filesystem.
   - `R2_PUBLIC_URL` — optional, and only useful as a **build arg**. next/image bakes its
     allowed remote hosts into the build output, so setting this at runtime alone leaves the
     host unallowlisted and images fail. Leave it unset to serve media through this server,
     which is the simpler default.
3. In the **Domains** tab add the domain, service `web`, container port `3000`, HTTPS on
   with Let's Encrypt.
4. Point DNS at the VPS before deploying, or certificate issuance fails:
   - `A` record, `@` → server IP
   - `A` record (or `CNAME` to the apex), `www` → server IP
5. Deploy. Migrations run on start and create the schema in the empty database.
6. Visit `/admin` and create the admin user. **Do this promptly** — the first-user route is
   open until someone claims it.

**Back up Postgres.** All content lives there. Dokploy can back a database service up to S3
on a schedule; set it, then do one restore drill, because a backup you have never restored is
not a backup.

The `bjr-data` volume only holds uploaded media, and only when R2 is not configured. With R2
set up, the container is stateless.
