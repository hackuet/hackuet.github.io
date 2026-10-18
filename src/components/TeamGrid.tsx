import type { Member } from '@/data/club'
import { Media } from './ui'

export function getInitials(name: string): string {
  const clean = name.replace(/^(Dr\.|Md\.|Mohammad|Engr\.)\s+/i, '').trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'HK'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Committee portraits. Hovering or focusing a portrait reveals name, title, department and batch;
    on touch screens, where there is no hover, the details are always shown. */
export function TeamGrid({ members }: { members: Member[] }) {
  return (
    <ul className="team">
      {members.map((m) => (
        <li key={m.id}>
          <article className="member" tabIndex={0} aria-label={`${m.name}, ${m.title}${m.designation ? `, ${m.designation}` : ''}${m.batch ? `, batch ${m.batch}` : ''}`}>
            <div className="member__photo">
              <Media image={m.image} alt={`Portrait of ${m.name}`} seed={m.seed} hue={m.hue} />
              {!m.image && (
                <span className="member__initials" aria-hidden="true">
                  {m.initials ?? getInitials(m.name)}
                </span>
              )}
              <div className="member__info">
                <p className="member__title">{m.title}</p>
                <h2 className="member__name">{m.name}</h2>
                <dl>
                  {m.designation && (
                    <div>
                      <dt>Designation</dt>
                      <dd>{m.designation}</dd>
                    </div>
                  )}
                  {m.department && (
                    <div>
                      <dt>Dept.</dt>
                      <dd>{m.department}</dd>
                    </div>
                  )}
                  {m.batch && (
                    <div>
                      <dt>Batch</dt>
                      <dd>{m.batch}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            <p className="member__role" aria-hidden="true">
              {m.title}
            </p>
          </article>
        </li>
      ))}
    </ul>
  )
}
