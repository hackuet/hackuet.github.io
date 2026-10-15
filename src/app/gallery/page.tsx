import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { Media } from '@/components/ui'
import { club, gallery } from '@/data/club'
import { getSiteSettings } from '@/lib/content'
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

export default function GalleryPage() {
  return (
    <Page
      path="/gallery"
      title="Thursdays in Room 304, and beyond."
      lede="Sessions, builds and contest days from the last two years."
    >
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
    </Page>
  )
}
