import Link from 'next/link'
import { club, nav } from '@/data/club'
import { HomeLink } from './HomeLink'
import { Mark } from './ui'

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div className="footer__about">
          <HomeLink className="brand brand--light" label={`${club.short}: home`}>
            <Mark />
            <span className="brand__word">{club.short}</span>
          </HomeLink>
          <p>{club.name}</p>
          <p className="footer__muted">{club.tagline}</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <p className="footer__label">Explore</p>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/register">Register</Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="footer__label">Find us</p>
          <address className="footer__address">
            {club.room}
            <br />
            {club.address}
            <br />
            <a href={`mailto:${club.email}`}>{club.email}</a>
          </address>
        </div>
      </div>
      <div className="wrap footer__base">
        <p>
          © {new Date().getFullYear()} {club.name}
        </p>
        <p className="footer__credit">
          Made with <span aria-label="love">🤍</span> by{' '}
          <a className="footer__maker" href="https://github.com/ettisafxrup" target="_blank" rel="noopener noreferrer">
            @ettisafxrup
            <span className="sr-only"> on GitHub (opens in a new tab)</span>
          </a>
        </p>
        <p>Meets {club.meets}</p>
      </div>
    </footer>
  )
}
