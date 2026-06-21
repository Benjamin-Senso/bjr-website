# bjr-website

Personal website for Benjamin Rutter — a minimal single-page site with a built-in CMS.

Built with **Next.js 15** + **Payload CMS 3** (Payload runs inside the Next.js app) and
**Tailwind CSS v4**. Content is stored in **SQLite** and edited through the admin panel.

## Stack

- **Frontend:** `src/app/(frontend)` — the public one-pager
- **CMS / admin:** `src/app/(payload)` — Payload admin at `/admin` (generated, don't edit)
- **Content model:** a single `Home` global (`src/globals/Home.ts`) holds everything on the
  page — name, bio, social links, ventures, footer, and SEO. Edit it at `/admin`.
- **Database:** SQLite (`bjr.db`), configured in `src/payload.config.ts`

## Getting started

```bash
pnpm install
cp .env.example .env   # then set PAYLOAD_SECRET to a long random string
pnpm dev
```

- Site: http://localhost:3000
- Admin / CMS: http://localhost:3000/admin (create the first admin user on first visit)

The page is seeded with placeholder content via field defaults — open the **Home Page**
global in the admin to replace it with real copy.

## Design

Black background, soft off-white text. The purple accent (`#9B8BC8`) is reserved for CTAs
and interactive links. Tokens live in `src/app/(frontend)/styles.css`.

## Useful scripts

```bash
pnpm dev                       # start dev server
pnpm build                     # production build
pnpm start                     # run the production build
pnpm generate:types            # regenerate src/payload-types.ts after schema changes
pnpm payload migrate:create    # create a DB migration after changing collections/globals
pnpm payload migrate           # apply pending migrations
```

## Database migrations

- **Dev** uses schema push (auto-syncs the local `bjr.db` as you edit fields) — no action needed.
- **Production** uses migrations. Whenever you change a collection/global, run
  `pnpm payload migrate:create <name>` and commit the generated files in `src/migrations/`.
  The Docker container runs `payload migrate` on every start, so deploys apply them automatically.

## Deployment (Docker, VPS)

The app ships with a `Dockerfile` and `docker-compose.yml`. The SQLite database and uploaded
media live in `/app/data` inside the container, backed by a named volume (`bjr-data`) so they
persist across restarts and redeploys.

```bash
# On the VPS:
echo "PAYLOAD_SECRET=$(openssl rand -hex 32)" > .env   # one-time, keep this safe
docker compose up -d --build
```

- App is served on port **3000** (put a reverse proxy / TLS in front, e.g. Caddy or nginx).
- On first boot, migrations create the schema; visit `/admin` to create the admin user.
- **Back up** the `bjr-data` volume (the `bjr.db` file + `media/`) regularly.
- To update: pull the new code and re-run `docker compose up -d --build`.
