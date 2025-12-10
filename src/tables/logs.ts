import type Dexie from 'dexie'
import z from 'zod'

export const logLevels = z.enum(['Debug', 'Info', 'Warn', 'Error'])

export const logEntrySchema = z.object({
  id: z.number().nonnegative().optional(),
  created_at: z.iso.datetime().default(() => new Date().toISOString()),
  level: logLevels,
  label: z.string(),
  details: z.any(),
})

export type LogEntry = z.infer<typeof logEntrySchema>

function sanitizeDetails(details: unknown): unknown {
  if (details instanceof Error) {
    return { name: details.name, message: details.message, stack: details.stack }
  }
  if (details && typeof details === 'object') {
    return details
  }
  return { value: details }
}

export async function logAdd(db: Dexie, entry: LogEntry): Promise<void> {
  logEntrySchema.omit({ id: true }).parse(entry)

  const log = {
    ...entry,
    details: sanitizeDetails(entry.details),
  }

  await db.table('logs').add(log)
}
