import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } }

export default function NotFound() {
  return (
    <section className="page-top" aria-labelledby="nf-title">
      <div className="wrap">
        <header className="page-head">
          <p className="addr">
            <span>0x404</span>Address not mapped
          </p>
          <h1 id="nf-title">Nothing lives at this address.</h1>
          <p className="lede">The link may be old, or the page has not been built yet.</p>
          <div className="register__actions">
            <Link href="/" className="btn btn--primary">
              Go to home
            </Link>
            <Link href="/register" className="btn btn--secondary">
              Register
            </Link>
          </div>
        </header>
      </div>
    </section>
  )
}
