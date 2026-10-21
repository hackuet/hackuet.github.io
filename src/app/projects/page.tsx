import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { EmptyState, Media } from '@/components/ui'
import { getProjects, getSiteSettings } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({
    title: 'Projects',
    description: `Member-built hardware from ${club.name}: embedded systems, robotics and IoT projects.`,
    path: '/projects',
    club,
  })
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <Page
      path="/projects"
      title="Built by members, on real benches."
      lede="Robots, wearables, monitoring systems and other devices HACK members have designed and prototyped."
    >
      {projects.length ? (
        <ul className="projects page-body">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.id} delay={i * 60}>
              <article className="project">
                <div className="project__frame">
                  <Media image={project.images[0]} alt={project.title} seed={project.seed} hue={project.hue} />
                </div>
                <h2>{project.title}</h2>
                <p>{project.body}</p>
                {project.images.length > 1 && (
                  <div className="project__more">
                    {project.images.slice(1).map((src) => (
                      <img key={src} className="media" src={src} alt="" loading="lazy" decoding="async" />
                    ))}
                  </div>
                )}
                {project.links.length > 0 && (
                  <div className="project__links">
                    {project.links.map((link) => (
                      <a key={link.url} className="btn btn--secondary btn--sm" href={link.url} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
      ) : (
        <EmptyState title="No projects published yet" body="Member projects will appear here as they are documented." />
      )}
    </Page>
  )
}
