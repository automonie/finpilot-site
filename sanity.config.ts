import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { projectId, dataset } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';
import { deskStructure } from './src/sanity/structure';

// The Sanity Studio config. Mounted inside the Astro site at /studio (see
// astro.config.mjs) so writers get a plain URL — no local install, no GitHub.
export default defineConfig({
  name: 'automonie',
  title: 'Automonie',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(), // GROQ playground for debugging queries
  ],
  schema: { types: schemaTypes },
});
