import { client } from './client';

// Shared projection of the author byline used on every article/guide.
const AUTHOR = `author->{ name, role, credentials, "photo": photo{ ..., "alt": alt }, bio }`;

const GUIDE_FIELDS = `
  _id, _type, title, titleTag, "slug": slug.current, targetKeyword, metaDescription,
  directAnswer, heroImage{ ..., "alt": alt }, body, commonProblems, faqs,
  publishedAt, updatedAt,
  ${AUTHOR},
  "bank": bank->{ name, "slug": slug.current, fullName },
  "relatedGuides": relatedGuides[]->{ title, "slug": slug.current, targetKeyword, _type }
`;

const ARTICLE_FIELDS = `
  _id, _type, title, titleTag, "slug": slug.current, targetKeyword, metaDescription,
  directAnswer, heroImage{ ..., "alt": alt }, body, faqs, publishedAt, updatedAt,
  ${AUTHOR},
  "relatedGuides": relatedGuides[]->{ title, "slug": slug.current, targetKeyword, _type }
`;

export async function getAllGuideSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "guide" && defined(slug.current)]{ "slug": slug.current }`);
}

export async function getGuide(slug: string) {
  return client.fetch(`*[_type == "guide" && slug.current == $slug][0]{ ${GUIDE_FIELDS} }`, { slug });
}

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "article" && defined(slug.current)]{ "slug": slug.current }`);
}

export async function getArticle(slug: string) {
  return client.fetch(`*[_type == "article" && slug.current == $slug][0]{ ${ARTICLE_FIELDS} }`, { slug });
}

// For index/listing pages.
export async function getGuideList() {
  return client.fetch(`*[_type == "guide"] | order(publishedAt desc){
    title, "slug": slug.current, metaDescription, directAnswer,
    "bank": bank->{ name }, publishedAt
  }`);
}

export async function getArticleList() {
  return client.fetch(`*[_type == "article"] | order(publishedAt desc){
    title, "slug": slug.current, metaDescription, publishedAt
  }`);
}
