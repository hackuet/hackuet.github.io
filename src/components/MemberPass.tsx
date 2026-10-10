import { tracks } from '@/data/club'
import { passId, type Registration } from '@/lib/registration'
import { DieArt, type Hue } from './DieArt'
import { Mark } from './ui'

const HUES: Hue[] = ['navy', 'blue', 'cyan', 'sky']

/** The pass a member receives. Its artwork is generated from their roll number, so no two match. */
export function MemberPass({ data, issued }: { data: Registration; issued: boolean }) {
  const rollOk = /^\d{7}$/.test(data.roll)
  const seed = rollOk ? Number(data.roll) : 1
  const hue = HUES[seed % HUES.length]
  const track = tracks.find((t) => t.id === data.track)
  const bars = (rollOk ? data.roll : '0000000').split('').flatMap((d) => [1 + (Number(d) % 3), 1 + (Number(d) % 2)])

  return (
    <div className={`pass${issued ? ' is-issued' : ''}`}>
      <div className="pass__art">
        <DieArt seed={seed} hue={rollOk ? hue : 'sky'} />
      </div>
      <div className="pass__body">
        <div className="pass__top">
          <span className="pass__brand">
            <Mark size={20} />
            HACK
          </span>
          <span className="pass__status">{issued ? 'Issued' : 'Preview'}</span>
        </div>
        <p className="pass__name">{data.name.trim() || 'Your name'}</p>
        <dl className="pass__rows">
          <div>
            <dt>Roll</dt>
            <dd>{data.roll || '—'}</dd>
          </div>
          <div>
            <dt>Dept.</dt>
            <dd>{data.department || '—'}</dd>
          </div>
          <div>
            <dt>Batch</dt>
            <dd>{data.batch || '—'}</dd>
          </div>
          <div className="pass__wide">
            <dt>Track</dt>
            <dd>{track?.title ?? '—'}</dd>
          </div>
        </dl>
        <div className="pass__foot">
          <span className="pass__id">{rollOk ? passId(data.roll) : 'HACK-••-•••••'}</span>
          <span className="pass__bars" aria-hidden="true">
            {bars.map((w, i) => (
              <i key={i} style={{ width: w }} />
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}
