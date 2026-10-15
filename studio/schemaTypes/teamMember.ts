import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

const HUES = [
  { title: 'Navy', value: 'navy' },
  { title: 'Blue', value: 'blue' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Sky', value: 'sky' },
]

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Executive board',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Member', default: true },
    { name: 'art', title: 'Placeholder artwork' },
  ],
  fields: [
    orderRankField({ type: 'teamMember' }),
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Role', type: 'string', group: 'content', validation: (r) => r.required(), description: 'e.g. "President".' }),
    defineField({ name: 'department', title: 'Department', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'batch', title: 'Batch', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Portrait', type: 'image', group: 'content', options: { hotspot: true }, description: 'Until a portrait is added, generated artwork is shown.' }),
    defineField({ name: 'seed', title: 'Artwork seed', type: 'number', group: 'art', initialValue: 211, validation: (r) => r.required().integer() }),
    defineField({ name: 'hue', title: 'Artwork colour', type: 'string', group: 'art', options: { list: HUES, layout: 'radio' }, initialValue: 'navy', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'title', media: 'image' } },
})
