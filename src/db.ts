import Dexie, { type Table } from 'dexie'
import { dexieCloud } from 'dexie-cloud-addon'

// Example domain types. Adjust as needed for your shared module.
export type Log = {
  id?: string
  createdAt: number
  level: 'info' | 'warn' | 'error'
  message: string
  meta?: Record<string, unknown>
}

export type Writing = {
  id?: string
  title: string
  content: string
  tags?: string[]
  createdAt: number
  updatedAt?: number
}

// Dexie Cloud options can be passed at runtime from the host app.
export type CloudConfig = {
  applicationUrl: string
  databaseUrl?: string
  requireAuth?: boolean
}

// Shared Dexie Cloud DB class
export class DexieCloudDB extends Dexie {
  logs!: Table<Log, string>
  writings!: Table<Writing, string>

  constructor(name = 'shared-db', cloud?: CloudConfig) {
    super(name)

    if (cloud) {
      // Initialize Dexie Cloud addon; configuration can be applied by host apps.
      this.use(dexieCloud as any)
      // Hosts can call `(db as any).cloud.configure({...})` with their settings.
    }

    this.version(1).stores({
      // string id (UUID) recommended with Dexie Cloud
      logs: 'id, createdAt, level',
      writings: 'id, title, createdAt, updatedAt',
    })
  }

  // Convenience: ensure auth when Cloud is enabled
  async ensureAuth() {
    // `dexie-cloud-addon` exposes `cloud` on DB instance
    const cloudApi = (this as any).cloud
    if (!cloudApi) return
    const session = await cloudApi.currentUser()
    if (!session?.isAuthenticated) {
      await cloudApi.openLoginPage()
    }
  }
}

// Default instance without cloud (host apps can create their own with cloud)
export const db = new DexieCloudDB('shared-db')

// Helper to create a cloud-enabled instance for host apps
export function createCloudDB(config: CloudConfig, name = 'shared-db') {
  return new DexieCloudDB(name, config)
}

// Example utility functions
export async function addLog(entry: Omit<Log, 'id'>) {
  return db.logs.add({ ...entry, id: crypto.randomUUID() })
}

export async function saveWriting(doc: Omit<Writing, 'id'> & { id?: string }) {
  const id = doc.id ?? crypto.randomUUID()
  const now = Date.now()
  const record: Writing = {
    id,
    title: doc.title,
    content: doc.content,
    tags: doc.tags ?? [],
    createdAt: doc.createdAt ?? now,
    updatedAt: now,
  }
  await db.writings.put(record)
  return id
}

export async function getWriting(id: string) {
  return db.writings.get(id)
}

export async function listWritings() {
  return db.writings.orderBy('createdAt').reverse().toArray()
}
