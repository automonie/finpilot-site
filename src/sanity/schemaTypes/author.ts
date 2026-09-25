import { defineField, defineType } from 'sanity';

// Finance content is YMYL, Google (and AI assistants) hold it to a higher
// expertise bar, so every article must show a credentialed author. All fields
// required so the byline can never be skipped.
export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string', description: 'e.g. "Financial analyst"', validation: (r) => r.required() }),
    defineField({
      name: 'credentials', type: 'text', rows: 2,
      description: 'Real qualifications, e.g. "Economics (Babcock University), financial modelling". Shown on every article.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photo', type: 'image', options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', validation: (r) => r.required() })],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'bio', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});
