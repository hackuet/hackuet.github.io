import { defineArrayMember, defineField, defineType } from 'sanity'

const KEYS = [
  { title: 'About', value: 'about' },
  { title: 'Projects', value: 'projects' },
  { title: 'Achievements', value: 'achievements' },
  { title: 'Events', value: 'events' },
  { title: 'Gallery', value: 'gallery' },
  { title: 'Executive Board', value: 'executive-board' },
  { title: 'Contact', value: 'contact' },
]

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'navItem',
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: 'Section',
              type: 'string',
              options: { list: KEYS },
              validation: (r) => r.required(),
              description: 'Which page this label belongs to. Page addresses are fixed in code; only the words change here.',
            }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'blurb', title: 'Short description', type: 'string', description: 'One line, shown on the home page index and in llms.txt.' }),
          ],
          preview: { select: { title: 'label', subtitle: 'key' } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: 'Navigation' }) },
})
