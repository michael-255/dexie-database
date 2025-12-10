import Dexie, { type Table } from 'dexie'
import dexieCloud, { type DexieCloudTable } from 'dexie-cloud-addon'
import { type LogEntry } from './tables/logs.js'
import { type WritingEntry } from './tables/writings.js'

class AppDB extends Dexie {
  logs!: Table<LogEntry, number, Omit<LogEntry, 'id'>>
  writings!: DexieCloudTable<WritingEntry, 'id'>

  constructor() {
    super('SharedAppDatabase', {
      addons: [dexieCloud],
      cache: 'immutable', // TODO
    })

    this.version(1).stores({
      logs: '++id, created_at',
      writings: '@id, created_at, category, *search_terms',
    })

    this.cloud.configure({
      unsyncedTables: ['logs'],
      databaseUrl: import.meta.env.VITE_DB_URL,
      tryUseServiceWorker: true,
      requireAuth: true,
    })
  }
}

export const db = new AppDB()
