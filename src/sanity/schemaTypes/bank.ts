import { defineField, defineType } from 'sanity';

// A Nigerian bank/fintech. Powers per-bank templating + filtering of the guides.
export const bank = defineType({
  name: 'bank',
  title: 'Bank',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', description: 'Short name, e.g. "GTBank"', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'fullName', type: 'string', description: 'e.g. "Guaranty Trust Bank"' }),
    defineField({
      name: 'statementPasswordFormat', type: 'text', rows: 2,
      description: 'How the statement PDF password is formed, e.g. "Date of birth, DDMMYYYY".',
    }),
    defineField({ name: 'notes', type: 'text', rows: 3, description: 'Quirks of this bank’s statement/SMS format.' }),
  ],
  preview: { select: { title: 'name', subtitle: 'fullName' } },
});
