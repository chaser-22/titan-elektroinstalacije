# Titan Elektroinstalacije

One-page showcase website for Titan Elektroinstalacije, built with Next.js and prepared for deployment on Vercel.

## Open locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production check

```bash
npm run lint
npm run build
```

## Placeholder checklist

The first version intentionally uses placeholder content. Before the final launch, replace:

- `LOGO` blocks with the original Titan logo.
- `Naglašena usluga` cards with the three priority services.
- `PROJECT PHOTO` blocks with optimized project photographs.
- `TEAM PHOTO` with a team or on-site photograph.
- The temporary About paragraph with the approved company story.
- `email@placeholder.me` with the confirmed email address.
- `PLACEHOLDER, CRNA GORA` with the confirmed service area.
- The metadata in `app/layout.tsx` after the exact business name and domain are known.

The main content lives in `app/page.tsx`, and all visual styling is in `app/globals.css`.

## Vercel

Import this folder into a Vercel project or connect its Git repository. Vercel will detect Next.js automatically. The custom domain can be added later without changing the site code.

Preview builds deliberately emit `noindex` metadata and a blocking `robots.txt`
until the final domain exists. When the HTTPS domain is ready, set the Vercel
environment variable below and rebuild:

```bash
SITE_URL=https://<final-domain>
```

`SITE_URL` must be the HTTPS origin only, without a path, query, or hash. Once it
is configured, the production build emits indexing metadata and a canonical URL.

## Security

The site is deliberately static and uses no backend, forms, cookies, analytics, or user-generated content. Production security headers, a restrictive Content Security Policy, Subresource Integrity, exact dependency versions, and repeatable audit commands are configured. See `SECURITY.md` before adding integrations or deploying changes.
