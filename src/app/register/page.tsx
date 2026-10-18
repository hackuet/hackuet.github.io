import Link from 'next/link'
import { Reveal, Typewriter } from '@/components/motion'
import { RegisterForm } from '@/components/RegisterForm'
import { getClub, getRegistrationOptions } from '@/data/site'
import { breadcrumbLd, JsonLdScript, pageMeta } from '@/lib/seo'

export async function generateMetadata() {
  const club = await getClub()
  return pageMeta({
    title: 'Register',
    description: `Join ${club.name}. Registration for the ${club.intake} is free, open to every KUET department, and closes ${club.intakeCloses}.`,
    path: '/register',
    short: club.short,
  })
}

export default async function RegisterPage() {
  const [club, options] = await Promise.all([getClub(), getRegistrationOptions()])

  return (
    <article className="page-top" aria-labelledby="register-title">
      <div className="wrap">
        <header className="page-head">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">
                <span className="crumbs__addr">0x0A</span>Register
              </li>
            </ol>
          </nav>
          <Typewriter id="register-title" text={`Join ${club.short}.`} />
          <Reveal>
            <p className="lede">
              Open to every KUET department, no experience needed. {club.intake} closes {club.intakeCloses}.
            </p>
          </Reveal>
        </header>
        <RegisterForm club={club} options={options} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript(breadcrumbLd('/register', 'Register'))} />
    </article>
  )
}