import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from '../env';

// Read-only client used at build time to pull published content into static pages.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});
