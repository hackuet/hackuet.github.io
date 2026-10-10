import type { Member } from '@/data/club'
import { Media } from './ui'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

/** Committee portraits. Hovering or focusing a portrait reveals name, title, department and batch;
    on touch screens, where there is no hover, the details are always shown. */
export function TeamGrid({ members }: { members: Member[] }) {
  return (
    <ul className="team">
      {members.map((m) => (
        <li key={m.id}>
          <article className="member" tabIndex={0} aria-label={`${m.name}, ${m.title}, ${m.department} ${m.batch}`}>
            <div className="member__photo">
              <Media image={m.image} alt={`Portrait of ${m.name}`} seed={m.seed} hue={m.hue} />
              {!m.image && (
                <span className="member__initials" aria-hidden="true">
                  {initials(m.name)}
                </span>
              )}
              <div className="member__info">
                <p className="member__title">{m.title}</p>
                <h2 className="member__name">{m.name}</h2>
                <dl>
                  <div>
                    <dt>Dept.</dt>
                    <dd>{m.department}</dd>
                  </div>
                  <div>
                    <dt>Batch</dt>
                    <dd>{m.batch}</dd>
                  </div>
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
