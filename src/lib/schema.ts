// JSON-LD builders. These are what earn rich results on Google and make the pages
// citable by AI assistants, so every guide/article emits Article + FAQPage.
const SITE = 'https://automonie.com';

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Automonie',
  url: SITE,
  logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
};

type Author = { name?: string; credentials?: string } | null | undefined;

export function articleSchema(opts: {
  title: string; description: string; path: string; image?: string;
  author?: Author; publishedAt?: string; updatedAt?: string;
}) {
  const { title, description, path, image, author, publishedAt, updatedAt } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    ...(image ? { image: [image] } : {}),
    ...(author?.name ? { author: { '@type': 'Person', name: author.name, description: author.credentials } } : {}),
    publisher: PUBLISHER,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': new URL(path, SITE).href },
  };
}

export function faqSchema(faqs?: { question: string; answer: string }[]) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: new URL(c.path, SITE).href,
    })),
  };
}
