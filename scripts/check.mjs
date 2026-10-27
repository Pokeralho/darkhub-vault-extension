// Checks the extension without a browser: JS syntax, manifest shape, files it references, pt/en string parity.
// Usage: node scripts/check.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const dir = new URL('../extension/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const errors = []
const fail = (msg) => errors.push(msg)

for (const f of readdirSync(dir).filter((f) => f.endsWith('.js'))) {
  try { execFileSync(process.execPath, ['--check', join(dir, f)], { stdio: 'pipe' }) } catch (e) { fail(`${f}: ${e.stderr}`) }
}

const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))
if (manifest.manifest_version !== 3) fail('manifest_version must be 3')
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) fail('version must be x.y.z')
if (!manifest.key) fail('key is required (it fixes the Chrome extension ID the native host allows)')
if (manifest.browser_specific_settings?.gecko?.id !== 'vault@darkhub.app') fail('gecko id must stay vault@darkhub.app')
const allowed = new Set(['nativeMessaging', 'storage', 'tabs'])
for (const p of manifest.permissions || []) if (!allowed.has(p)) fail(`new permission "${p}": update this check and the README security section`)

const referenced = [
  manifest.background?.service_worker, ...(manifest.background?.scripts || []), manifest.action?.default_popup,
  ...Object.values(manifest.icons || {}), ...Object.values(manifest.action?.default_icon || {}),
  ...(manifest.content_scripts || []).flatMap((c) => [...(c.js || []), ...(c.css || [])])
].filter(Boolean)
for (const f of new Set(referenced)) if (!existsSync(join(dir, f))) fail(`manifest references missing file ${f}`)

const popup = readFileSync(join(dir, 'popup.js'), 'utf8')
const block = (lang) => popup.match(new RegExp(`\\n  ${lang}: \\{([\\s\\S]*?)\\n  \\}`))?.[1] || ''
const keys = (lang) => new Set([...block(lang).matchAll(/^\s+(\w+):/gm)].map((m) => m[1]))
const pt = keys('pt'), en = keys('en')
if (!pt.size || !en.size) fail('popup.js: STRINGS.pt / STRINGS.en not found')
for (const k of pt) if (!en.has(k)) fail(`popup.js: "${k}" has pt text but no en text`)
for (const k of en) if (!pt.has(k)) fail(`popup.js: "${k}" has en text but no pt text`)

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'))
  process.exit(1)
}
console.log(`ok: ${manifest.name} ${manifest.version}, ${pt.size} strings in pt and en`)
