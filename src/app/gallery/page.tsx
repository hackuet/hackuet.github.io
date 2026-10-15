import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { EmptyState, Media } from '@/components/ui'
import { getGallery, getSiteSettings } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({
    title: 'Photo gallery',
    description: `Photos from ${club.name}: workshops, builds and club events at KUET.`,
    path: '/gallery',
    club,
  })
}

export default async function GalleryPage() {
  const gallery = await getGallery()
  return (
    <Page
      path="/gallery"
      title="Workshops, builds and club days."
      lede="Photos from the club’s sessions, projects and ceremonies."
    >
      {gallery.length ? (
        <ul className="mosaic">
          {gallery.map((photo, i) => (
            <Reveal as="li" key={photo.id} delay={(i % 2) * 80}>
              <figure>
                <div className="mosaic__frame">
                  <Media image={photo.image} alt={photo.title} seed={photo.seed} hue={photo.hue} />
                </div>
                <figcaption>
                  {photo.title}
                  <span>{photo.date}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      ) : (
        <EmptyState title="No photos yet" body="Photos from sessions, builds and club events will appear here." />
      )}
    </Page>
  )
}
