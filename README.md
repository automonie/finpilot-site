# Automonie web — Astro + Sanity

Marketing + content site for Automonie. **Writers publish from a browser (Sanity Studio at `/studio`) — no GitHub, no commands.** Every SEO field is required, so a badly-optimised page can't be published. Static output, built for search and AI-citation visibility.

- **Site:** Astro (static) → Vercel
- **CMS:** Sanity (free tier, hosted auth)
- **Studio:** embedded at `automonie.com/studio`
- **Content types:** `guide` (bank-statement guides — the SEO wedge), `article` (blog, e.g. the "Financial Blindness" pillar), `bank`, `author`

---

## What I (Claude) built vs. what needs your accounts

**Built (in this repo):** the whole Astro site, the Sanity schemas with SEO-enforcing validation, the guide/article templates with `Article` + `FAQPage` JSON-LD, robots.txt (AI crawlers allowed), sitemap, brand styles, and seed content (author + 12 banks + a template GTBank guide).

**You must do (needs your login — I can't create accounts or change DNS):** create the Sanity project, deploy to Vercel, point DNS, wire the publish webhook, invite the writer. Steps below — ~20 minutes, one time.

---

## 1. Create the Sanity project (once)

```bash
cd automonie-web
npm install
npx sanity login            # opens the browser — log in / sign up
npx sanity init --env       # pick "Create new project", name it "Automonie",
                            # dataset "production", and it writes .env for you
```

This gives you a **project ID**. Confirm `.env` now has:

```
PUBLIC_SANITY_PROJECT_ID=<your id>
PUBLIC_SANITY_DATASET=production
```

(If `sanity init` didn't write `.env`, copy `.env.example` → `.env` and paste the id.)

## 2. Seed the starter content

```bash
npm run seed                # imports author + banks + the GTBank template guide
```

Then open the Studio locally and **add the two images the seed can't include** (a hero image on the GTBank guide, a photo on the author) — they need uploading through the editor:

```bash
npm run dev                 # → http://localhost:4321  (Studio at /studio)
```

## 3. Deploy to Vercel

- Push this repo to GitHub, then import it at **vercel.com/new**.
- In Vercel → Project → **Settings → Environment Variables**, add `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` (same values as `.env`).
- Deploy. Note the production URL.

## 4. Publish pipeline (webhook → auto-rebuild)

1. Vercel → Project → **Settings → Git → Deploy Hooks** → create one (e.g. "sanity-publish"). Copy the URL.
2. **sanity.io/manage** → your project → **API → Webhooks → Create**:
   - URL: the Vercel deploy hook
   - Trigger on: **Create, Update, Delete**
   - Filter: `_type == "guide" || _type == "article"`
3. Now: writer clicks **Publish** → Vercel rebuilds → live in ~1–2 min.

## 5. Point the domain

- Vercel → Project → **Settings → Domains** → add `automonie.com` (and `www`, redirecting to the apex).
- At your DNS provider, follow Vercel's records. **Leave `app.automonie.com` untouched** (that's the app).
- Verify: HTTPS, `www` → apex redirect, and pick trailing-slash on/off (Vercel default is fine — keep it consistent).

## 6. Invite the writer

- **sanity.io/manage** → project → **Members → Invite** → Oreoluwa's email, role **Editor** (not Administrator).
- Send her `automonie.com/studio`. She logs in with email, writes, hits **Publish**. She never sees GitHub.

---

## Writing a guide (for the writer)

Go to `/studio` → **Guides → +**. Fill every field (the form won't let you publish otherwise):

- **Title (H1)** and **Title tag** — the title tag is what shows in Google (keep it under 60).
- **Target keyword** — one per page.
- **★ Direct answer** — answer the question in 1–2 sentences. This is the single most important field: it's what Google and AI assistants quote. No introduction.
- **Meta description**, **hero image (with alt)**, **body**, **2+ common problems**, **3+ FAQs**, **2+ related guides**, **author**.

Copy the GTBank guide as your template.

---

## Local commands

| Command | What |
|---|---|
| `npm run dev` | Dev server + Studio at `/studio` |
| `npm run build` | Static production build |
| `npm run preview` | Preview the build |
| `npm run seed` | Import `sanity/seed.ndjson` |
| `npx sanity deploy` | (optional) also host the Studio at `<project>.sanity.studio` |

## Still to migrate (next chunk)

The old `finpilot-site` still owns some pages. To fully replace it: port `privacy`, `terms`, the honest feature pages (drop wallet/auto-savings — flag-hidden at launch), and the **download page** (which must carry the APK link the mobile build syncs). Until cutover, keep the old site live.
