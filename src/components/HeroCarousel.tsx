'use client'

import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { slides } from '@/data/club'
import { LazyBackground } from './LazyBackground'
import { Typewriter } from './motion'
import { Media } from './ui'

export function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const touchX = useRef<number | null>(null)
  const count = slides.length
  const paused = userPaused || focusWithin

  const go = (next: number) => setIndex(((next % count) + count) % count)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }
  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      className={`hero${paused ? ' is-paused' : ''}`}
      aria-roledescription="carousel"
      aria-label="About the club"
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false)
      }}
    >
      <LazyBackground variant="hero" />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <div className="hero__slides" aria-live={paused ? 'polite' : 'off'}>
            {slides.map((slide, i) => {
              return (
                <div
                  key={slide.id}
                  className={`hero__slide${i === index ? ' is-active' : ''}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}: ${slide.label}`}
                  aria-hidden={i !== index}
                >
                  <p className="addr addr--light">{slide.eyebrow}</p>
                  <Typewriter
                    as={i === 0 ? 'h1' : 'h2'}
                    className="hero__title"
                    text={slide.title}
                    active={i === index}
                    speed={22}
                  />
                  <p className="hero__body">{slide.body}</p>
                </div>
              )
            })}
          </div>

          <div className="hero__cta">
            <Link href="/register" className="btn btn--primary btn--lg">
              Register
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/#contact" className="btn btn--secondary btn--lg">
              Contact us
            </Link>
          </div>
        </div>

        <figure className="hero__figure">
          <div className="hero__art">
            {slides.map((slide, i) => (
              <Media
                key={slide.id}
                className={i === index ? 'is-active' : ''}
                image={slide.image}
                alt=""
                seed={slide.seed}
                hue={slide.hue}
              />
            ))}
          </div>
          <figcaption>
            <span>FIG. {String(index + 1).padStart(2, '0')}</span>
            {slides[index].figure}
          </figcaption>
        </figure>
      </div>

      <div className="wrap hero__bar">
        <div className="hero__ticks">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={`hero__tick${i === index ? ' is-active' : ''}`}
              aria-label={`Show slide ${i + 1}: ${slide.label}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
            >
              <span className="hero__tick-track">
                {i === index && (
                  // The fill's animation is the autoplay clock: when it ends, advance.
                  <span key={index} className="hero__tick-fill" onAnimationEnd={() => go(index + 1)} />
                )}
              </span>
              <span className="hero__tick-label">
                <span>{String(i + 1).padStart(2, '0')}</span>
                {slide.label}
              </span>
            </button>
          ))}
        </div>
        <div className="hero__controls">
          <button
            type="button"
            className="icon-btn icon-btn--light"
            onClick={() => setUserPaused((v) => !v)}
            aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
          >
            {userPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>
          <button type="button" className="icon-btn icon-btn--light" onClick={() => go(index - 1)} aria-label="Previous slide">
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className="icon-btn icon-btn--light" onClick={() => go(index + 1)} aria-label="Next slide">
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
