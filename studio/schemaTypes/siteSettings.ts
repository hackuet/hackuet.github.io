import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'membership', title: 'Membership' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'short', title: 'Short name', type: 'string', group: 'identity', validation: (r) => r.required().max(12), description: 'The logo word and title prefix, e.g. "HACK".' }),
    defineField({ name: 'name', title: 'Full name', type: 'string', group: 'identity', validation: (r) => r.required() }),
    defineField({ name: 'university', title: 'University', type: 'string', group: 'identity', validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'identity', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, group: 'identity', validation: (r) => r.required().max(300), description: 'One paragraph used in search results and social cards.' }),
    defineField({ name: 'founded', title: 'Founded (year)', type: 'number', group: 'identity', validation: (r) => r.integer().min(1900).max(2100), description: 'Optional. Shown in structured data and llms.txt once set.' }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (r) => r.required().email() }),
    defineField({ name: 'room', title: 'Room / meeting place', type: 'string', group: 'contact', validation: (r) => r.required() }),
    defineField({ name: 'address', title: 'Address', type: 'string', group: 'contact', validation: (r) => r.required() }),
    defineField({ name: 'mapUrl', title: 'Map link', type: 'url', group: 'contact', validation: (r) => r.required() }),
    defineField({ name: 'meets', title: 'Weekly session', type: 'string', group: 'membership', validation: (r) => r.required(), description: 'Shown as "Meets …", e.g. "Thursdays, 5:00 PM".' }),
    defineField({ name: 'intake', title: 'Intake label', type: 'string', group: 'membership', validation: (r) => r.required(), description: 'e.g. "Spring 2027 intake".' }),
    defineField({ name: 'intakeCloses', title: 'Intake closes', type: 'string', group: 'membership', validation: (r) => r.required(), description: 'Free-text date, e.g. "30 November 2026".' }),
    defineField({ name: 'keywords', title: 'Topics / keywords', type: 'array', of: [{ type: 'string' }], group: 'seo', description: 'Domains the club is known for; used in search metadata.' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
