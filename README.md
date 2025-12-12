# Dexie Database

The Dexie database for several projects.

## TODO

- Don't use `logs` table. Just store the last 100 logs in `localStorage` on that device.

- Walkthrough Dexie Cloud setup for database and syncing.
  - Get it connected to your Dexie Cloud account.
- Create and organize `logs` table code based on `self-pilot-app` usage.
- Test encryption and syncing features.
- Test creating `search_terms` for writiings.
  - Natural: <https://www.npmjs.com/package/natural?activeTab=readme>

```ts
import Dexie, { type Table } from 'dexie'
import dexieCloud, { type DexieCloudTable } from 'dexie-cloud-addon'
import { type LogEntry, type WritingEntry } from './schemas'

class SelfPilotDatabase extends Dexie {
  logs!: Table<LogEntry, number, Omit<LogEntry, 'id'>>
  writings!: DexieCloudTable<WritingEntry, 'id'>

  constructor() {
    super('SelfPilotDatabase', { addons: [dexieCloud] })

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

export const db = new SelfPilotDatabase()

function defineWritingsApi(db: SelfPilotDatabase) {
  return {
    //
    addWriting: async (writing: Omit<WritingEntry, 'id' | 'created_at'>) => {
      const id = crypto.randomUUID()
      await db.writings.add({
        ...writing,
        id,
        created_at: new Date().toISOString(),
      })
      return id
    },
    //
    deleteWriting: async (id: string) => {
      await db.writings.delete(id)
    },
  }
}

export const writingsApi = defineWritingsApi(db)
```

## Final Steps

- Use as a module and build:

```json
// Import in other projects
"dependencies": {
  "dexie-database": "file:../dexie-database"
}
```

```json
"main": "dist/index.js",
"types": "dist/index.d.ts",
"files": ["dist"],
"scripts": {
  "prepare": "npm run build"
}
```
