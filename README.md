# Dexie Database

The Dexie database for several projects.

## TODO

**Notes:** Mess around more with Dexie Cloud and take notes of what you'll need to do to set it up
for other projects.

- How can I reuse a specific DB in another project?
- How do I generate the `dexie-cloud.key` for an existing DB and project?
- How to use `realmId` so data is linked to a specific user
- How to use `realmId` to share data between users when you want too

**Setup Dexie Cloud Database Module**

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

// --------------------------------

export function useLogs() {
  function addLog() {
    // db.logs.add({ ... } )
  }

  function getLogs() {
    // db.logs.where(...).toArray()
  }

  return {
    addLog,
    getLogs,
    // etc...
  }
}

// --------------------------------

export function useWritings() {
  function addWriting() {
    // db.writings.add({ ... } )
  }

  function deleteWriting() {
    // db.writings.delete(id)
  }

  return {
    addWriting,
    deleteWriting,
    // etc...
  }
}
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
