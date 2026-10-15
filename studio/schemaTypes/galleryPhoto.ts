import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

const HUES = [
  { title: 'Navy', value: 'navy' },
  { title: 'Blue', value: 'blue' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Sky', value: 'sky' },
]

const CATEGORIES = [
  { title: 'Workshop', value: 'workshop' },
  { title: 'Project', value: 'project' },
  { title: 'Farewell', value: 'farewell' },
  { title: 'Other', value: 'other' },
]

export const galleryPhoto = defineType({
  name: 'galleryPhoto',
  title: 'Gallery',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Photo', default: true },
    { name: 'art', title: 'Placeholder artwork' },
  ],
  fields: [
    orderRankField({ type: 'galleryPhoto' }),
    defineField({ name: 'title', title: 'Caption', type: 'string', group: 'content', validation: (r) => r.required(), description: 'Doubles as the image alt text.' }),
    defineField({ name: 'date', title: 'Date label', type: 'string', group: 'content', validation: (r) => r.required(), description: 'Free text, e.g. "October 2026".' }),
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'content', options: { list: CATEGORIES } }),
    defineField({ name: 'image', title: 'Photo', type: 'image', group: 'content', options: { hotspot: true } }),
    defineField({ name: 'seed', title: 'Artwork seed', type: 'number', group: 'art', initialValue: 101, validation: (r) => r.required().integer() }),
    defineField({ name: 'hue', title: 'Artwork colour', type: 'string', group: 'art', options: { list: HUES, layout: 'radio' }, initialValue: 'sky', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'date', media: 'image' } },
})
