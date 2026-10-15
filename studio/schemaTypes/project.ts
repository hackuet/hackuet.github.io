import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineArrayMember, defineField, defineType } from 'sanity'

const HUES = [
  { title: 'Navy', value: 'navy' },
  { title: 'Blue', value: 'blue' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Sky', value: 'sky' },
]

export const project = defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Project', default: true },
    { name: 'art', title: 'Placeholder artwork' },
  ],
  fields: [
    orderRankField({ type: 'project' }),
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Description', type: 'text', rows: 4, group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'images', title: 'Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], group: 'content', description: 'The first photo is the card cover; any further photos appear below it.' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'projectLink',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({ name: 'seed', title: 'Artwork seed', type: 'number', group: 'art', initialValue: 301, validation: (r) => r.required().integer() }),
    defineField({ name: 'hue', title: 'Artwork colour', type: 'string', group: 'art', options: { list: HUES, layout: 'radio' }, initialValue: 'blue', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', media: 'images.0' } },
})
