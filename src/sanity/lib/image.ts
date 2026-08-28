import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from './client';

const builder = imageUrlBuilder(client);

// Build a Sanity CDN URL for an image (served as WebP, sized on demand).
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max');
}
