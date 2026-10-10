import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { routes } from '@/data/club'
import { breadcrumbLd, JsonLdScript } from '@/lib/seo'
import { Reveal, Typewriter } from './motion'

/** Shared frame for every section route: breadcrumb, typed title, content, previous/next. */
export function Page({
  path,
  title,
  lede,
  jsonLd,
  children,
}: {
  path: string
  title: string
  lede?: string
  jsonLd?: object
  children: ReactNode
}) {
  const index = routes.findIndex((item) => item.href === path)
  const current = routes[index]
  const prev = routes[index - 1] ?? { href: '/', label: 'Home' }
  const next = routes[index + 1] ?? { href: '/register', label: 'Register' }

  return (
    <article className="page-top" aria-labelledby="page-title">
      <div className="wrap">
        <header className="page-head">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">
                <span className="crumbs__addr">{current.addr}</span>
                {current.label}
              </li>
            </ol>
          </nav>
          <Typewriter id="page-title" text={title} />
          {lede && (
            <Reveal>
              <p className="lede">{lede}</p>
            </Reveal>
          )}
        </header>

        {children}

        <nav className="pager" aria-label="More sections">
          <Link href={prev.href} className="pager__link">
            <ArrowLeft size={18} aria-hidden="true" />
            <span>
              <small>Previous</small>
              {prev.label}
            </span>
          </Link>
          <Link href={next.href} className="pager__link pager__link--next">
            <span>
              <small>Next</small>
              {next.label}
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </nav>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript(breadcrumbLd(path, current.label))} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript(jsonLd)} />}
    </article>
  )
}
