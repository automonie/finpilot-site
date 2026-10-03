# Automonie website (Astro + Sanity)

Marketing and content site for Automonie at automonie.com. Writers publish from the
browser through Sanity Studio at `/studio`, with no GitHub access or commands needed.
Every SEO field is required by the schema, so a page can't be published half-optimised.
The output is static and built for search and AI-citation visibility.

- **Site:** Astro (static output) on Vercel
- **CMS:** Sanity (free tier, hosted auth), Studio embedded at `/studio`
- **Content types:** `guide` (bank-statement guides), `article` (blog), `bank`, `author`
- **Tools:** money quizzes, budget calculator, cost-of-living calculator
- **Shared chrome:** `src/components/Nav.astro`, `src/layouts/BaseLayout.astro`,
  `public/assets/site.css` and `site.js`

## Local development

```bash
npm install
npm run dev        # http://localhost:4321, Studio at /studio
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server and Studio |
| `npm run build` | Static production build |
| `npm run preview` | Serve the production build |
| `npm run seed` | Import `sanity/seed.ndjson` (author, banks, template guide) |

`.env` needs `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` (see `.env.example`).
The same two variables are set in Vercel.

## Deployment

Vercel builds the `astro-site` branch of the site repository. Publishing in Sanity
triggers a Vercel deploy hook (webhook filter: `_type == "guide" || _type == "article"`),
so a published page is live in about two minutes.

The Android download link on `/download` is updated automatically after each mobile
build by `finpilot-mobile/scripts/sync-apk-link.mjs`.

## Writing a guide

Open `/studio`, then **Guides** and **+**. Every field must be filled before publishing:

- **Title (H1)** and **Title tag**. The title tag is what shows in Google; keep it under 60 characters.
- **Target keyword**, one per page.
- **Direct answer**: answer the question in one or two sentences, with no introduction.
  This is what search engines and AI assistants quote.
- **Meta description**, **hero image with alt text**, **body**, **2+ common problems**,
  **3+ FAQs**, **2+ related guides**, **author**.

The GTBank guide is the template to copy.

## Access

Writers are invited from sanity.io/manage under Members with the **Editor** role.
