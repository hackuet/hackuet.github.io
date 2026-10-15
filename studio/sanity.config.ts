import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

const SINGLETONS = new Set(['siteSettings', 'homeStory', 'registrationOptions', 'navigation'])

export default defineConfig({
  name: 'default',
  title: 'HACK KUET',
  projectId: 'ky8bcwum',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) =>
      SINGLETONS.has(context.schemaType)
        ? prev.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : prev,
    newDocumentOptions: (prev) =>
      prev.filter((template) => !SINGLETONS.has(template.templateId.replace(/^template-/, ''))),
  },
})
