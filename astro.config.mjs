import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sanity from '@sanity/astro';

// Public Sanity connection details (project id + dataset are NOT secrets — they
// only allow reading published content). Set them in a .env file; see .env.example.
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'replaceme';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';

// https://astro.build/config
export default defineConfig({
  // Required for correct absolute URLs in the sitemap + canonical tags.
  site: 'https://automonie.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sanity({
      projectId,
      dataset,
      apiVersion: '2024-12-01',
      useCdn: true,
      // Embed the Sanity Studio at /studio so writers get a plain URL — no local
      // install, no GitHub. (It's a client-rendered route inside the static site.)
      studioBasePath: '/studio',
    }),
    react(), // required by the embedded Studio
    sitemap(),
  ],
  image: {
    // Allow optimising the Sanity CDN images at build time.
    domains: ['cdn.sanity.io'],
  },
});
