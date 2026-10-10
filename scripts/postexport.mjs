// Next's static export writes per-segment prefetch payloads into folders
// (achievements/__next.achievements/__PAGE__.txt) but the client requests them with a
// dotted name (achievements/__next.achievements.__PAGE__.txt). Hosts with no rewrite layer
// would answer 404 for every link prefetch, so this copies each payload to the name asked for.

import { cpSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'out'
let copied = 0

function flatten(dir, target) {
  for (const name of readdirSync(dir)) {
    const from = join(dir, name)
    const to = `${target}.${name}`
    if (statSync(from).isDirectory()) flatten(from, to)
    else if (!existsSync(to)) {
      cpSync(from, to)
      copied += 1
    }
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (!statSync(path).isDirectory()) continue
    if (name.startsWith('__next.')) flatten(path, path)
    else if (name !== '_next') walk(path)
  }
}

if (existsSync(OUT)) {
  walk(OUT)
  console.log(`postexport: wrote ${copied} prefetch file(s)`)
}
