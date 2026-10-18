import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem().title('Home story').id('homeStory').child(S.document().schemaType('homeStory').documentId('homeStory')),
      S.listItem().title('Registration options').id('registrationOptions').child(S.document().schemaType('registrationOptions').documentId('registrationOptions')),
      S.listItem().title('Navigation').id('navigation').child(S.document().schemaType('navigation').documentId('navigation')),
      S.divider(),
      orderableDocumentListDeskItem({ type: 'heroSlide', title: 'Hero slides', S, context }),
      orderableDocumentListDeskItem({ type: 'project', title: 'Projects', S, context }),
      S.documentTypeListItem('event').title('Events'),
      orderableDocumentListDeskItem({ type: 'achievement', title: 'Achievements', S, context }),
      orderableDocumentListDeskItem({ type: 'galleryPhoto', title: 'Gallery', S, context }),
      orderableDocumentListDeskItem({ type: 'teamMember', title: 'Executive board', S, context }),
    ])
