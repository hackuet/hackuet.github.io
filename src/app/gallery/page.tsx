import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { Media } from '@/components/ui'
import { club, gallery } from '@/data/club'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Photo gallery',
  description: `Photos from ${club.name}: weekly Verilog sessions, hardware sprints, soldering clinics and contest days at KUET.`,
  path: '/gallery',
})

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
