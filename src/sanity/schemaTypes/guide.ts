import { defineField, defineType } from 'sanity';
import { CharCount } from '../components/CharCount';

// Bank-statement guides, the main content type and the site's SEO wedge. Every
// field that affects ranking or AI-citation is REQUIRED, so the form itself makes
// it impossible to publish a badly-optimised page.
export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  // The SEO fields are grouped so their importance is obvious in the editor.
  fieldsets: [
    { name: 'seo', title: 'SEO, all required', options: { collapsible: false } },
  ],
  fields: [
    defineField({
      name: 'title', title: 'Title (H1)', type: 'string',
      description: 'The on-page headline. Max 70 characters.',
      validation: (r) => r.required().max(70),
    }),
    defineField({
      name: 'titleTag', title: 'Title tag (<title>)', type: 'string',
      fieldset: 'seo',
      description: 'What shows in the search result + browser tab. Keep it under 60 characters or Google truncates it.',
      components: { input: CharCount },
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'targetKeyword', title: 'Target keyword', type: 'string',
      fieldset: 'seo',
      description: 'ONE keyword this page should rank for, e.g. "download gtbank statement". One page, one keyword.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'metaDescription', title: 'Meta description', type: 'text', rows: 2,
      fieldset: 'seo',
      description: 'The 1–2 line summary under the title in search results. Max 155 characters.',
      components: { input: CharCount },
      validation: (r) => r.required().max(155),
    }),
    defineField({
      name: 'directAnswer', title: '★ Direct answer', type: 'text', rows: 3,
      fieldset: 'seo',
      description: 'Answer the question completely in 1–2 sentences. This appears before anything else on the page and is what Google and AI assistants quote. Do NOT write an introduction here.',
      components: { input: CharCount },
      validation: (r) => r.required().max(320),
    }),
    defineField({
      name: 'bank', title: 'Bank', type: 'reference', to: [{ type: 'bank' }],
      description: 'Optional, links this guide to a bank for filtering + templating.',
    }),
    defineField({
      name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: (r) => r.required() })],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'body', title: 'Body', type: 'richBody', validation: (r) => r.required() }),
    defineField({
      name: 'commonProblems', title: 'Common problems', type: 'array', of: [{ type: 'problemSolution' }],
      validation: (r) => r.required().min(2).error('Add at least 2 common problems.'),
    }),
    defineField({
      name: 'faqs', title: 'FAQs', type: 'array', of: [{ type: 'faq' }],
      description: 'Powers the FAQ rich-result on Google. At least 3.',
      validation: (r) => r.required().min(3).error('Add at least 3 FAQs.'),
    }),
    defineField({
      name: 'relatedGuides', title: 'Related guides', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'guide' }] }],
      description: 'Internal links keep readers on-site and spread ranking. At least 2.',
      validation: (r) => r.required().min(2).error('Link at least 2 related guides.'),
    }),
    defineField({
      name: 'author', type: 'reference', to: [{ type: 'author' }],
      description: 'Required, finance content must show a credentialed author (E-E-A-T).',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'updatedAt', title: 'Last updated', type: 'datetime', description: 'Bump this whenever you meaningfully edit the guide.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'targetKeyword', media: 'heroImage' } },
});
