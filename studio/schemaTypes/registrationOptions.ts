import { defineArrayMember, defineField, defineType } from 'sanity'

export const registrationOptions = defineType({
  name: 'registrationOptions',
  title: 'Registration options',
  type: 'document',
  fields: [
    defineField({
      name: 'departments',
      title: 'Departments',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
      description: 'Shown in the registration form dropdown, exactly as written here.',
    }),
    defineField({
      name: 'batches',
      title: 'Batches',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
      description: 'e.g. "2k25". Roll-number validation derives its prefix from the last two characters, so keep the 2kNN shape.',
    }),
    defineField({
      name: 'tracks',
      title: 'Tracks',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'track',
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'ID',
              type: 'string',
              validation: (r) => r.required().regex(/^[a-z0-9-]+$/, { name: 'lowercase id' }),
              description: 'Stable identifier stored inside member passes. Do not change once members have registered (e.g. "embedded").',
            }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'note', title: 'Note', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'id' } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: 'Registration options' }) },
})
