# bjr-website

Personal site for Benjamin Rutter. A small multi-page site with a built-in CMS.

Built with **Next.js 16** + **Payload CMS 3** (Payload runs inside the Next.js app) and
**Tailwind CSS v4**. Content is stored in **SQLite** and edited through the admin panel.

> Next is pinned to **16.2.6** deliberately. Next 15.4.11 has a `global-not-found` ESM bug
> that 500s `/admin`. Do not downgrade without re-testing the admin panel.

## Routes

| Route       | Content source                        | Notes                                            |
| ----------- | ------------------------------------- | ------------------------------------------------ |
| `/`         | `home` global                         | Hero, statement, socials, section panels         |
| `/work`     | `work` global + `ventures` collection | Studio story, project panels, All/Projects/Ventures filter |
| `/about`    | `about` global                        | Long-form bio and "what I help with"             |
| `/ventures` | `ventures-page` global + collection   | Hidden from the nav until a venture exists       |
| `/writing`  | `writing` global + beehiiv API        | Hidden from the nav unless beehiiv is configured |
| `/contact`  | `contact` global                      | Email and socials                                |
| `/admin`    | Payload                               | The CMS                                          |

The nav is **not** CMS-editable. Its items map 1:1 to directories in the app router, and
routes with nothing behind them are dropped server-side in `src/app/(frontend)/layout.tsx`
so the nav never leads somewhere empty.

## Content model

- `site-settings` — name, avatar, socials, footer text, fallback SEO. Shared by every route.
- `home`, `about`, `work`, `ventures-page`, `writing`, `contact` — one global per page, each
  with its own SEO tab that falls back to Site Settings.
- `ventures` — a collection, because ventures are recurring content added over time.
- `media` — uploads.

Every field ships a `defaultValue`, so a fresh database renders real copy rather than blanks.

## Getting started

```bash
pnpm install
```

```bash
cp .env.example .env
```

Set `PAYLOAD_SECRET` to a long random string, then:

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

**After changing a global's field shape, delete `.next`.** Page content is read through
`unstable_cache` (`src/app/(frontend)/lib/content.ts`). A cached entry survives a dev server
restart, so pages can keep rendering the *old* field shape while the REST API returns the new
one. `rm -rf .next/cache` is not enough under Turbopack — remove the whole `.next` directory.
In production the 300s revalidate window means this self-heals.

**richText `defaultValue` must be a function, not a static value.** Payload bakes a static
default into the SQLite column DDL, and apostrophes in the Lexical JSON break the generated
SQL (`SQLITE_ERROR: near "s"`). Write `defaultValue: () => lexicalParagraphs([...])`.

**Schema push is dev-only.** `push` is enabled only when `NODE_ENV !== 'production'`. In
production it can hang the container on an interactive "created or renamed?" prompt with no
TTY. Production applies committed migrations instead.

**Renaming or moving a field triggers that same interactive prompt** during
`payload migrate:create`. Pre-launch, the fastest fix is to delete `src/migrations/*` and the
local `bjr.db`, then regenerate a single clean initial migration.

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
   - `PAYLOAD_SECRET` — `openssl rand -base64 32`
   - `NEXT_PUBLIC_SERVER_URL` — the public origin, e.g. `https://your-domain.com`, no
     trailing slash
   - `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` — optional; without both, `/writing`
     stays hidden
3. In the **Domains** tab add the domain, service `web`, container port `3000`, HTTPS on
   with Let's Encrypt.
4. Point DNS at the VPS before deploying, or certificate issuance fails:
   - `A` record, `@` → server IP
   - `A` record (or `CNAME` to the apex), `www` → server IP
5. Deploy. Migrations run on start and create the schema on the empty volume.
6. Visit `/admin` and create the admin user. **Do this promptly** — the first-user route is
   open until someone claims it.

**The volume is the thing that bites.** The SQLite database *and* all uploaded media live in
the `bjr-data` volume at `/app/data`. A redeploy without it mounted comes up as an empty CMS
with no images. Configure Dokploy's S3 backups for it, and do one restore drill — a backup
you have never restored is not a backup.
