import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

const HUES = [
  { title: 'Navy', value: 'navy' },
  { title: 'Blue', value: 'blue' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Sky', value: 'sky' },
]

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero slides',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'art', title: 'Placeholder artwork' },
  ],
  fields: [
    orderRankField({ type: 'heroSlide' }),
    defineField({ name: 'label', title: 'Tick label', type: 'string', group: 'content', validation: (r) => r.required(), description: 'Short word shown on the carousel tick, e.g. "Learn".' }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Heading', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'figure', title: 'Figure caption', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Image', type: 'image', group: 'content', options: { hotspot: true } }),
    defineField({ name: 'seed', title: 'Artwork seed', type: 'number', group: 'art', initialValue: 11, validation: (r) => r.required().integer() }),
    defineField({ name: 'hue', title: 'Artwork colour', type: 'string', group: 'art', options: { list: HUES, layout: 'radio' }, initialValue: 'navy', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'label' }, prepare: (s) => ({ title: s.title ?? '', subtitle: s.label ?? '' }) },
})
