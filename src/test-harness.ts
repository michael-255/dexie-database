import { addLog, createCloudDB, getWriting, listWritings, saveWriting } from './db'

const app = document.getElementById('app')!

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  children: (Node | string)[] = [],
) {
  const node = document.createElement(tag)
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v))
  children.forEach((c) => node.append(c instanceof Node ? c : document.createTextNode(c)))
  return node
}

const output = el('pre', { id: 'output', style: 'padding:12px;background:#f6f8fa' })

function logOut(value: unknown) {
  output.textContent = JSON.stringify(value, null, 2)
}

// Optional: wire cloud via query params for quick tests
// ?dbUrl=...&requireAuth=true
const params = new URLSearchParams(location.search)
const dbUrl = params.get('dbUrl') || undefined
const requireAuth = params.get('requireAuth') === 'true'

// If cloud params are provided, create a cloud-enabled instance.
if (dbUrl) {
  // Replace default export `db` usage with a cloud-enabled instance if requested.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).cloudDb = createCloudDB({
    applicationUrl: location.origin,
    databaseUrl: dbUrl,
    requireAuth,
  })
}

const btnAddLog = el('button', { id: 'addLog' }, ['Add Log'])
btnAddLog.onclick = async () => {
  const id = await addLog({ createdAt: Date.now(), level: 'info', message: 'Hello from UI' })
  logOut({ addedLogId: id })
}

const btnSaveWriting = el('button', { id: 'saveWriting' }, ['Save Writing'])
let lastWritingId: string | undefined
btnSaveWriting.onclick = async () => {
  lastWritingId = await saveWriting({
    title: 'Demo',
    content: 'Content',
    tags: ['ui'],
    createdAt: Date.now(),
  })
  logOut({ savedWritingId: lastWritingId })
}

const btnGetWriting = el('button', { id: 'getWriting' }, ['Get Last Writing'])
btnGetWriting.onclick = async () => {
  if (!lastWritingId) return logOut({ error: 'No writing saved yet' })
  const doc = await getWriting(lastWritingId)
  logOut(doc)
}

const btnListWritings = el('button', { id: 'listWritings' }, ['List Writings'])
btnListWritings.onclick = async () => {
  const items = await listWritings()
  logOut(items)
}

const toolbar = el('div', { style: 'display:flex; gap:8px; padding:12px' }, [
  btnAddLog,
  btnSaveWriting,
  btnGetWriting,
  btnListWritings,
])

app.append(toolbar, output)
