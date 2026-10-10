'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { club, nav } from '@/data/club'
import { HomeLink } from './HomeLink'

const DESKTOP = '(min-width: 1024px)'

export function Header() {
  const pathname = usePathname() ?? '/'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Any navigation closes the menu, including the browser's back button.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // While the menu is open the page behind it is locked: no scroll, no focus, no clicks.
  useEffect(() => {
    if (!open) return
    const behind = [document.getElementById('main'), document.querySelector('footer')]
    const desktop = window.matchMedia(DESKTOP)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDesktop = () => desktop.matches && setOpen(false)
    document.body.style.overflow = 'hidden'
    behind.forEach((el) => el?.setAttribute('inert', ''))
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onDesktop)
    return () => {
      document.body.style.overflow = ''
      behind.forEach((el) => el?.removeAttribute('inert'))
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onDesktop)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`header${scrolled || open ? ' is-raised' : ''}`}>
      <div className="wrap header__in">
        <HomeLink className="brand" onNavigate={close} label={`${club.short}, ${club.name}: home`}>
          <Image className="brand__logo" src="/logo.svg" alt="" width={383} height={286} priority />
          <span className="brand__text">
            <span className="brand__word">{club.short}</span>
            <span className="brand__sub">KUET</span>
          </span>
        </HomeLink>

        <nav className="nav" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <Link
            href="/register"
            className="btn btn--primary btn--sm"
            aria-current={isCurrent('/register') ? 'page' : undefined}
            onClick={close}
          >
            Register
          </Link>
          <button
            type="button"
            className="icon-btn header__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="menu" hidden={!open}>
        <nav className="wrap menu__in" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
            >
              <span className="menu__addr">{item.addr}</span>
              {item.label}
            </Link>
          ))}
          <p className="menu__note">
            {club.intake} closes {club.intakeCloses}.
          </p>
        </nav>
      </div>
    </header>
  )
}
