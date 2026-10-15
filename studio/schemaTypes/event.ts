import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  orderings: [
    { title: 'Date, newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  fields: [
    defineField({ name: 'date', title: 'Date (ISO)', type: 'date', validation: (r) => r.required(), description: 'Used for sorting and upcoming/past status.' }),
    defineField({ name: 'when', title: 'Display text', type: 'string', validation: (r) => r.required(), description: 'What visitors read, e.g. "13 to 14 Nov 2026" or "20 Aug 2026, 5:00 PM".' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'place', title: 'Place', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'when' } },
})
