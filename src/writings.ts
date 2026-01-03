import Dexie, { type Table } from 'dexie'
import dexieCloud, { type DexieCloudTable } from 'dexie-cloud-addon'
import { type LogEntry, type WritingEntry } from './schemas'

class WritingDatabase extends Dexie {
  logs!: Table<LogEntry, number, Omit<LogEntry, 'id'>>
  writings!: DexieCloudTable<WritingEntry, 'id'>

  constructor() {
    super('WritingDatabase', { addons: [dexieCloud] })

    this.version(1).stores({
      logs: '++id, created_at',
      writings: '@id, created_at, category, *search_terms',
    })

    this.cloud.configure({
      unsyncedTables: ['logs'],
      databaseUrl: import.meta.env.VITE_DB_URL,
      requireAuth: true,
      customLoginGui: true,
    })
  }
}

export const db = new WritingDatabase()

// Writings helpers
export async function addWriting(entry: Omit<WritingEntry, 'id'>) {
  return db.writings.add(entry)
}

export async function deleteWriting(id: WritingEntry['id']) {
  return db.writings.delete(id)
}

export async function listWritings() {
  return db.writings.toArray()
}
