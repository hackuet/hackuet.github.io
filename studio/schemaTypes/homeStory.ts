import { defineArrayMember, defineField, defineType } from 'sanity'

const milestone = defineArrayMember({
  name: 'milestone',
  type: 'object',
  fields: [
    defineField({ name: 'year', title: 'Year', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'year' } },
})

const storyItem = defineArrayMember({
  name: 'storyItem',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title' } },
})

export const homeStory = defineType({
  name: 'homeStory',
  title: 'Home story (history, mission, vision)',
  type: 'document',
  groups: [
    { name: 'history', title: 'History', default: true },
    { name: 'mission', title: 'Mission' },
    { name: 'vision', title: 'Vision' },
  ],
  fields: [
    defineField({ name: 'historyTitle', title: 'History heading', type: 'string', group: 'history', validation: (r) => r.required() }),
    defineField({ name: 'historyLede', title: 'History lead paragraph', type: 'text', rows: 3, group: 'history', validation: (r) => r.required() }),
    defineField({ name: 'milestones', title: 'Milestones', type: 'array', of: [milestone], group: 'history' }),
    defineField({ name: 'missionStatement', title: 'Mission statement', type: 'text', rows: 3, group: 'mission', validation: (r) => r.required() }),
    defineField({ name: 'missionItems', title: 'Mission items', type: 'array', of: [storyItem], group: 'mission' }),
    defineField({ name: 'visionStatement', title: 'Vision statement', type: 'text', rows: 3, group: 'vision', validation: (r) => r.required() }),
    defineField({ name: 'visionItems', title: 'Vision items', type: 'array', of: [storyItem], group: 'vision' }),
  ],
  preview: { prepare: () => ({ title: 'Home story' }) },
})
