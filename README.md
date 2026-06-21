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
pnpm dev               # start dev server
pnpm build             # production build
pnpm start             # run the production build
pnpm generate:types    # regenerate src/payload-types.ts after schema changes
```

## Deployment (VPS)

The SQLite file and uploaded media persist on disk, so a standard `pnpm build` →
`pnpm start` behind a reverse proxy works. Keep `bjr.db` and the `media/` directory on
persistent storage and back them up.
