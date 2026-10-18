import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

const SINGLETONS = new Set(['siteSettings', 'homeStory', 'registrationOptions', 'navigation'])

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  'ky8bcwum'

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  'production'

export default defineConfig({
  name: 'default',
  title: 'HACK KUET',
  projectId,
  dataset,
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
