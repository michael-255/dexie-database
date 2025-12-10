import Dexie, { type Table } from 'dexie'
import dexieCloud, { type DexieCloudTable } from 'dexie-cloud-addon'
import { type LogEntry } from './tables/logs.js'
import { type WritingEntry } from './tables/writings.js'

export const db = new Dexie('shared-app-database', { addons: [dexieCloud] }) as Dexie & {
  logs: Table<LogEntry, number, Omit<LogEntry, 'id'>>
  writings: DexieCloudTable<WritingEntry, 'id'>
}

db.version(1).stores({
  logs: '++id, created_at',
  writings: '@id, created_at, category, *search_terms',
})

db.cloud.configure({
  databaseUrl: import.meta.env.VITE_DB_URL,
})
