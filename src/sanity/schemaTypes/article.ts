import { defineField, defineType } from 'sanity';
import { CharCount } from '../components/CharCount';

// General blog posts (e.g. the "Financial Blindness" pillar). Same SEO discipline
// as a guide, minus the bank + common-problems fields.
export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fieldsets: [{ name: 'seo', title: 'SEO — all required', options: { collapsible: false } }],
  fields: [
    defineField({ name: 'title', title: 'Title (H1)', type: 'string', validation: (r) => r.required().max(70) }),
    defineField({
      name: 'titleTag', title: 'Title tag (<title>)', type: 'string', fieldset: 'seo',
      description: 'Under 60 characters.', components: { input: CharCount },
      validation: (r) => r.required().max(60),
    }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({
      name: 'targetKeyword', title: 'Target keyword', type: 'string', fieldset: 'seo',
      description: 'One keyword per page.', validation: (r) => r.required(),
    }),
    defineField({
      name: 'metaDescription', title: 'Meta description', type: 'text', rows: 2, fieldset: 'seo',
      description: 'Max 155 characters.', components: { input: CharCount },
      validation: (r) => r.required().max(155),
    }),
    defineField({
      name: 'directAnswer', title: '★ Direct answer', type: 'text', rows: 3, fieldset: 'seo',
      description: 'Answer the question completely in 1–2 sentences — what Google and AI assistants quote. No introduction here.',
      components: { input: CharCount },
      validation: (r) => r.required().max(320),
    }),
    defineField({
      name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: (r) => r.required() })],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'body', title: 'Body', type: 'richBody', validation: (r) => r.required() }),
    defineField({
      name: 'faqs', title: 'FAQs', type: 'array', of: [{ type: 'faq' }],
      validation: (r) => r.required().min(3).error('Add at least 3 FAQs.'),
    }),
    defineField({
      name: 'relatedGuides', title: 'Related reading', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'guide' }, { type: 'article' }] }],
      validation: (r) => r.required().min(2).error('Link at least 2 related pieces.'),
    }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }], validation: (r) => r.required() }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'updatedAt', title: 'Last updated', type: 'datetime' }),
  ],
  preview: { select: { title: 'title', subtitle: 'targetKeyword', media: 'heroImage' } },
});
