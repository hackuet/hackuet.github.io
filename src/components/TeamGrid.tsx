import type { Member } from '@/lib/types'
import { getHueFromName, getNameSeed } from './DieArt'
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
      {members.map((m) => {
        const hue = getHueFromName(m.name)
        const seed = getNameSeed(m.name)
        return (
          <li key={m.id}>
            <article className="member" tabIndex={0} aria-label={`${m.name}, ${m.title}${m.designation ? `, ${m.designation}` : ''}${m.batch ? `, batch ${m.batch}` : ''}`}>
              <div className="member__photo">
                <Media image={m.image} alt={`Portrait of ${m.name}`} seed={seed} hue={hue} />
                {!m.image && (
                  <span className="member__initials" aria-hidden="true">
                    {m.initials ?? getInitials(m.name)}
                  </span>
                )}
              <div className="member__info">
                <h2 className="member__name">{m.name}</h2>
                {m.designation && <p className="member__designation">{m.designation}</p>}
                {/* The role is printed under the portrait (member__role), so the
                    plate carries only the facts that are not visible elsewhere. */}
                {(m.department || m.batch) && (
                  <dl>
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
                )}
              </div>
            </div>
            <p className="member__role" aria-hidden="true">
              {m.title}
            </p>
          </article>
        </li>
      )
    })}
    </ul>
  )
}
