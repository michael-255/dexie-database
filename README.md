# Dexie Database

The Dexie database for several projects.

## TODO

- Walkthrough Dexie Cloud setup for database and syncing.
  - Get it connected to your Dexie Cloud account.
- Create and organize `logs` table code based on `self-pilot-app` usage.
- Test encryption and syncing features.
- Test creating `search_terms` for writiings.
  - Natural: <https://www.npmjs.com/package/natural?activeTab=readme>

## Schemas

```ts
// Logs
export const logEntrySchema = z.object({
  autoId: z.number().optional(), // PK auto-incremented by Dexie
  created_at: z.iso.datetime(),
  level: z.enum(['Info', 'Warning', 'Error', 'Debug']),
  label: z.string(),
  details: z.any(),
})

export type LogEntry = z.infer<typeof logEntrySchema>

// Writings
export const writingEntrySchema = z.object({
  id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  category: z.enum([
    'Journaling',
    'Weekly Review',
    'Yearly Review',
    'Goals & Planning',
    'Brainstorming',
    'Creative',
    'Other',
  ]),
  subject: z.string().min(1).max(100),
  body: z.string().min(1).max(10000),
  search_terms: z.array(z.string()),
})

export type WritingEntry = z.infer<typeof writingEntrySchema>
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
