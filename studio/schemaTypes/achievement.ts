import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

export const achievement = defineType({
  name: 'achievement',
  title: 'Achievements',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'achievement' }),
    defineField({ name: 'year', title: 'Year', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'event', title: 'Event / venue', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'result', title: 'Result', type: 'string', validation: (r) => r.required(), description: 'e.g. "Champion", "Paper accepted".' }),
  ],
  preview: { select: { title: 'title', subtitle: 'result' } },
})
