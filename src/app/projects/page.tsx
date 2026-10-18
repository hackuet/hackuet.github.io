import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { Media } from '@/components/ui'
import { getClub, getProjects, getRoutes } from '@/data/site'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata() {
  const club = await getClub()
  return pageMeta({
    title: 'Projects',
    description: `Hardware, robotics and IoT systems built by members of ${club.name} at KUET.`,
    path: '/projects',
    short: club.short,
  })
}

export default async function ProjectsPage() {
  const [projects, routes] = await Promise.all([getProjects(), getRoutes()])

  return (
    <Page
      path="/projects"
      title="What members have built."
      lede="Member-built hardware, robotics and IoT systems."
      routes={routes}
    >
      <ul className="mosaic">
        {projects.map((project, i) => (
          <Reveal as="li" key={project.id} delay={(i % 2) * 80}>
            <figure>
              <div className="mosaic__frame">
                <Media image={project.image} alt={project.title} seed={project.seed} hue={project.hue} />
              </div>
              <figcaption>
                {project.title}
                {project.links.length > 0 ? (
                  <span>
                    {project.links.map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </span>
                ) : null}
              </figcaption>
            </figure>
            {project.body ? <p className="mosaic__body">{project.body}</p> : null}
          </Reveal>
        ))}
      </ul>
    </Page>
  )
}