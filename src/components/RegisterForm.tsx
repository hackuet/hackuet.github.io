'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { batches, club, departments, tracks } from '@/data/club'
import {
  clearPass,
  emptyRegistration,
  loadPass,
  submitRegistration,
  validate,
  validateField,
  type Errors,
  type IssuedPass,
  type Registration,
} from '@/lib/registration'
import dynamic from 'next/dynamic'
import { MemberPass } from './MemberPass'

// The confirm dialog is only needed after a pass exists, so its code is fetched on demand.
const Modal = dynamic(() => import('./Modal').then((m) => m.Modal), { ssr: false })
import { Notice } from './ui'

type Status = 'loading' | 'form' | 'submitting' | 'issued'

function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="field__optional">Optional</span>}
      </label>
      {children}
      {error ? (
        <p className="field__error" id={`${id}-msg`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="field__hint" id={`${id}-msg`}>
            {hint}
          </p>
        )
      )}
    </div>
  )
}

export function RegisterForm() {
  const [status, setStatus] = useState<Status>('loading')
  const [values, setValues] = useState<Registration>(emptyRegistration)
  const [errors, setErrors] = useState<Errors>({})
  const [pass, setPass] = useState<IssuedPass | null>(null)
  const [failed, setFailed] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const justIssued = useRef(false)

  useEffect(() => {
    const saved = loadPass()
    setPass(saved)
    setStatus(saved ? 'issued' : 'form')
  }, [])

  useEffect(() => {
    if (status === 'issued' && justIssued.current) {
      justIssued.current = false
      resultRef.current?.focus()
    }
  }, [status])

  const set = <K extends keyof Registration>(field: K, value: Registration[K]) => {
    const next = { ...values, [field]: value }
    setValues(next)
    // Once a field has shown an error, re-check it on every keystroke so the message clears promptly.
    if (errors[field]) setErrors((e) => ({ ...e, [field]: validateField(field, next) }))
  }

  const check = (field: keyof Registration) => {
    setErrors((e) => {
      const next = { ...e, [field]: validateField(field, values) }
      if (field === 'batch' && values.roll) next.roll = validateField('roll', values)
      return next
    })
  }

  const props = (field: keyof Registration) => ({
    id: `reg-${field}`,
    name: field,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': `reg-${field}-msg`,
    onBlur: () => check(field),
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    const found = validate(values)
    setErrors(found)
    const first = (Object.keys(values) as (keyof Registration)[]).find((f) => found[f])
    if (first) {
      const target = first === 'track' ? 'reg-track-fpga' : `reg-${first}`
      document.getElementById(target)?.focus()
      return
    }
    setFailed(false)
    setStatus('submitting')
    try {
      const issued = await submitRegistration(values)
      justIssued.current = true
      setPass(issued)
      setStatus('issued')
    } catch {
      setFailed(true)
      setStatus('form')
    }
  }

  const remove = () => {
    clearPass()
    setConfirming(false)
    setPass(null)
    setValues(emptyRegistration)
    setErrors({})
    setStatus('form')
  }

  if (status === 'loading') {
    return (
      <div className="register__grid" aria-busy="true" aria-label="Loading registration">
        <div className="skeleton-stack">
          <div className="skeleton" style={{ height: 52 }} />
          <div className="skeleton" style={{ height: 52 }} />
          <div className="skeleton" style={{ height: 52 }} />
          <div className="skeleton" style={{ height: 140 }} />
        </div>
        <div className="skeleton" style={{ height: 380 }} />
      </div>
    )
  }

  if (status === 'issued' && pass) {
    const firstName = pass.name.split(' ')[0]
    return (
      <div className="register__grid">
        <div className="register__result">
          <Notice tone="success" title="Registration saved">
            <p>Your pass is stored in this browser. Bring your student ID to the first session.</p>
          </Notice>
          <h2 ref={resultRef} tabIndex={-1}>
            You’re in, {firstName}.
          </h2>
          <ol className="steps">
            <li>
              <strong>Come to the next session.</strong> {club.meets}, {club.room}.
            </li>
            <li>
              <strong>Show this pass.</strong> A committee member will confirm your membership on the spot.
            </li>
            <li>
              <strong>Pick up a board.</strong> You will be paired with a senior on your chosen track.
            </li>
          </ol>
          <div className="register__actions">
            <Link href="/" className="btn btn--primary">
              Back to home
            </Link>
            <a href={`mailto:${club.email}?subject=${encodeURIComponent(`Question about my registration (${pass.id})`)}`} className="btn btn--secondary">
              Ask a question
            </a>
            <button type="button" className="btn btn--ghost" onClick={() => setConfirming(true)}>
              Remove registration
            </button>
          </div>
        </div>
        <aside className="register__pass" aria-label="Your member pass">
          <MemberPass data={pass} issued />
        </aside>

        {confirming && <Modal
          open
          onClose={() => setConfirming(false)}
          title="Remove this registration?"
          actions={
            <>
              <button type="button" className="btn btn--secondary" onClick={() => setConfirming(false)}>
                Keep it
              </button>
              <button type="button" className="btn btn--danger" onClick={remove}>
                Remove
              </button>
            </>
          }
        >
          <p>
            Pass {pass.id} will be deleted from this browser and the form will be cleared. You can register again at any
            time before {club.intakeCloses}.
          </p>
        </Modal>}
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <div className="register__grid">
      <form className="form" onSubmit={onSubmit} noValidate aria-label="Club registration">
        {failed && (
          <Notice tone="error" title="We couldn’t save your registration">
            <p>
              Your browser blocked local storage, which happens in some private windows. Nothing was lost: allow storage
              or open a normal window, then submit again.
            </p>
          </Notice>
        )}

        <Field id="reg-name" label="Full name" error={errors.name}>
          <input
            {...props('name')}
            className="input"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </Field>

        <div className="form__row">
          <Field id="reg-department" label="Department" error={errors.department}>
            <select
              {...props('department')}
              className="input"
              value={values.department}
              onChange={(e) => set('department', e.target.value)}
            >
              <option value="">Select</option>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field id="reg-batch" label="Batch" error={errors.batch}>
            <select {...props('batch')} className="input" value={values.batch} onChange={(e) => set('batch', e.target.value)}>
              <option value="">Select</option>
              {batches.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="reg-roll" label="Roll number" hint="7 digits, as printed on your student ID." error={errors.roll}>
          <input
            {...props('roll')}
            className="input input--mono"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={7}
            value={values.roll}
            onChange={(e) => set('roll', e.target.value.replace(/\D/g, ''))}
          />
        </Field>

        <div className="form__row">
          <Field id="reg-email" label="Email" error={errors.email}>
            <input
              {...props('email')}
              className="input"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Field>
          <Field id="reg-phone" label="Mobile" optional error={errors.phone}>
            <input
              {...props('phone')}
              className="input"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </Field>
        </div>

        <fieldset className={`field choice${errors.track ? ' has-error' : ''}`} aria-describedby="reg-track-msg">
          <legend>Which track do you want to start with?</legend>
          <div className="choice__grid">
            {tracks.map((t) => (
              <label key={t.id} className="choice__item">
                <input
                  type="radio"
                  name="track"
                  id={`reg-track-${t.id}`}
                  value={t.id}
                  checked={values.track === t.id}
                  onChange={() => set('track', t.id)}
                />
                <span>
                  <strong>{t.title}</strong>
                  <small>{t.note}</small>
                </span>
              </label>
            ))}
          </div>
          {errors.track ? (
            <p className="field__error" id="reg-track-msg">
              {errors.track}
            </p>
          ) : (
            <p className="field__hint" id="reg-track-msg">
              You can switch tracks later.
            </p>
          )}
        </fieldset>

        <Field
          id="reg-note"
          label="Anything you want to build?"
          optional
          hint={`${values.note.length}/300`}
          error={errors.note}
        >
          <textarea
            {...props('note')}
            className="input"
            rows={3}
            value={values.note}
            onChange={(e) => set('note', e.target.value)}
          />
        </Field>

        <div className="form__submit">
          <button type="submit" className="btn btn--primary btn--lg" aria-busy={submitting} aria-disabled={submitting}>
            {submitting && <span className="spinner" aria-hidden="true" />}
            {submitting ? 'Saving…' : 'Get my member pass'}
          </button>
          <p className="field__hint">
            Membership is free. This prototype has no server: your details stay in this browser.
          </p>
        </div>
        <p className="sr-only" role="status">
          {submitting ? 'Saving your registration' : ''}
        </p>
      </form>

      <aside className="register__pass" aria-label="Member pass preview">
        <MemberPass data={values} issued={false} />
        <p className="field__hint">Your pass fills in as you type.</p>
      </aside>
    </div>
  )
}
