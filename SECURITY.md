# Security policy

## Current security model

This project is intentionally a static showcase website. It has no authentication,
database, API routes, file uploads, contact-form submission, cookies, analytics,
or user-generated HTML. Keeping those features out is the strongest defense for
this use case because it removes the server-side attack surface entirely.

The production configuration adds:

- A restrictive Content Security Policy (CSP). Next.js emits inline React
  bootstrap data, so production permits inline framework scripts while still
  blocking inline event handlers, external origins, objects, frames, forms,
  and all unapproved connections.
- Subresource Integrity (SRI) for every external production JavaScript asset.
- HTTPS-only transport enforcement through HSTS.
- Clickjacking protection through CSP and `X-Frame-Options`.
- MIME-sniffing, referrer, browser-permission, and cross-origin isolation policies.
- No framework-identifying `X-Powered-By` header or production source maps.
- Exact dependency versions and a committed lockfile.

## Routine checks

Run these before every deployment and after dependency updates:

```bash
npm run lint
npm run build
npm run security:audit
npm run security:audit:production
```

Review dependency updates regularly. Do not add third-party scripts, analytics,
remote fonts, embedded social feeds, forms, uploads, or API routes without also
updating the CSP and performing a new security review.

## Deployment safeguards

- Keep HTTPS enabled and never bypass Vercel's TLS redirect.
- Protect the Vercel, Git provider, domain registrar, and email accounts with MFA.
- Use least-privilege team access and remove unused collaborators promptly.
- Enable automatic domain renewal and a registrar/domain transfer lock.
- Never commit `.env` files, API keys, passwords, or tokens.
- Keep production and preview secrets separate if secrets are added later.
- Set `SITE_URL` only to the final HTTPS origin; invalid or non-HTTPS values stop
  the build instead of producing unsafe or incorrect canonical metadata.
- Review deployment logs and dependency alerts after every release.

## Reporting a vulnerability

Do not publish suspected vulnerabilities publicly. Report them privately to the
site owner with the affected URL, reproduction steps, and impact.
