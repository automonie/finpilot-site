import { defineField, defineType } from 'sanity';

// Reusable object shapes used inside guides/articles.

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'answer', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'question' } },
});

export const problemSolution = defineType({
  name: 'problemSolution',
  title: 'Common problem',
  type: 'object',
  fields: [
    defineField({ name: 'problem', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'solution', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'problem' } },
});

// Portable-text body with inline images (each image requires alt text).
export const richBody = defineType({
  name: 'richBody',
  title: 'Body',
  type: 'array',
  of: [
    { type: 'block' },
    {
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt', type: 'string', title: 'Alternative text',
          description: 'Describe the image for screen readers and SEO.',
          validation: (r) => r.required(),
        }),
        defineField({ name: 'caption', type: 'string' }),
      ],
    },
  ],
});
