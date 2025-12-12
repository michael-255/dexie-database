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
      databaseUrl: import.meta.env.VITE_DB_URL,
      requireAuth: true,
    })
  }
}

export const db = new WritingDatabase()
