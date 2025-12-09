# Dexie Database

The Dexie database for several projects.

## TODO

- Walkthrough Dexie Cloud setup for database and syncing.
  - Get it connected to your Dexie Cloud account.
- Create and organize `logs` table code based on `self-pilot-app` usage.
- Test encryption and syncing features.
- Test creating `search_terms` for writiings.
  - Natural: <https://www.npmjs.com/package/natural?activeTab=readme>

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
