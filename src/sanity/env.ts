// Sanity connection details. projectId + dataset are NOT secrets (they only grant
// read access to published content), so they're safe to expose. Set them once in
// .env (see .env.example). Read via import.meta.env in the browser/Astro build and
// process.env under the Sanity CLI (seed import / deploy).
const env = (key: string): string | undefined =>
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.[key]) ||
  (typeof process !== 'undefined' ? process.env?.[key] : undefined);

export const projectId = env('PUBLIC_SANITY_PROJECT_ID') || 'onnxvbsi';
export const dataset = env('PUBLIC_SANITY_DATASET') || 'production';
export const apiVersion = '2024-12-01';
