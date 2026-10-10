import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { HeroCarousel } from '@/components/HeroCarousel'
import { Reveal } from '@/components/motion'
import { SectionHead } from '@/components/ui'
import { club, history, mission, routes, vision } from '@/data/club'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: `${club.short}: ${club.name} | FPGA, GPU and chip design at KUET`,
  description: club.description,
  path: '/',
})

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      <section id="history" className="section" aria-labelledby="history-title">
        <div className="wrap split">
          <SectionHead id="history-title" addr="0x01" label="History" title={history.title} />
          <div>
            <Reveal>
              <p className="lede">{history.lede}</p>
            </Reveal>
            <ol className="timeline">
              {history.milestones.map((m, i) => (
                <Reveal as="li" key={m.year} delay={i * 60}>
                  <span className="timeline__year">{m.year}</span>
                  <div>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="band">
        <section id="mission" className="section" aria-labelledby="mission-title">
          <div className="wrap split">
            <SectionHead id="mission-title" addr="0x02" label="Mission" title="What we are here to do." />
            <div>
              <Reveal>
                <p className="statement">{mission.statement}</p>
              </Reveal>
              <ol className="rows rows--numbered">
                {mission.commitments.map((c, i) => (
                  <Reveal as="li" key={c.title} delay={i * 60}>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="vision" className="section section--flush" aria-labelledby="vision-title">
          <div className="wrap split">
            <SectionHead id="vision-title" addr="0x03" label="Vision" title="Where this is going." />
            <div>
              <Reveal>
                <p className="statement">{vision.statement}</p>
              </Reveal>
              <ol className="rows rows--numbered">
                {vision.goals.map((g, i) => (
                  <Reveal as="li" key={g.title} delay={i * 60}>
                    <h3>{g.title}</h3>
                    <p>{g.body}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>

      <section className="section" aria-labelledby="explore-title">
        <div className="wrap split">
          <SectionHead id="explore-title" addr="0x04" label="Explore" title="See the work and the people." />
          <ul className="rows index">
            {routes.map((item, i) => (
              <Reveal as="li" key={item.href} delay={i * 50}>
                <Link href={item.href}>
                  <span className="index__addr">{item.addr}</span>
                  <span className="index__label">{item.label}</span>
                  <span className="index__blurb">{item.blurb}</span>
                  <ArrowRight size={20} aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="section closing" aria-labelledby="contact-title">
        <div className="wrap split">
          <SectionHead id="contact-title" addr="0x09" label="Contact" title="Come by, or write to us.">
            <p className="section-head__note">
              {club.intake} is open until {club.intakeCloses}.
            </p>
            <Link href="/register" className="btn btn--primary">
              Register
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </SectionHead>
          <ul className="rows contact">
            <Reveal as="li">
              <a href={`mailto:${club.email}`}>
                <span className="contact__label">Email</span>
                <span className="contact__value">{club.email}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </Reveal>
            <Reveal as="li" delay={60}>
              <a href={club.mapUrl} target="_blank" rel="noreferrer">
                <span className="contact__label">Visit</span>
                <span className="contact__value">
                  {club.room}
                  <small>{club.address}</small>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
                <span className="sr-only">(opens map in a new tab)</span>
              </a>
            </Reveal>
            <Reveal as="li" delay={120}>
              <div>
                <span className="contact__label">Sessions</span>
                <span className="contact__value">
                  {club.meets}
                  <small>Open to every department. Walk in, no booking.</small>
                </span>
              </div>
            </Reveal>
          </ul>
        </div>
      </section>
    </>
  )
}
