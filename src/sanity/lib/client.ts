import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from '../env';

// A read token authenticates the build's content fetches. It's needed because
// token-less public reads on this project return empty; authenticated reads work.
// Set SANITY_API_READ_TOKEN in .env (local) and in Vercel env vars. It's a
// build-time secret (static output), so it never ships to the browser.
const token =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.SANITY_API_READ_TOKEN) ||
  (typeof process !== 'undefined' ? process.env?.SANITY_API_READ_TOKEN : undefined);

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // authenticated reads → always fresh
  perspective: 'published',
  token: token || undefined,
});
