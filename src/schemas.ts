import z from 'zod'

//
// Logs
//

export const logLevelsEnum = z.enum(['Debug', 'Info', 'Warn', 'Error'])

export const logEntrySchema = z.object({
  created_at: z.iso.datetime().default(() => new Date().toISOString()),
  level: logLevelsEnum,
  label: z.string(),
  details: z.unknown().transform((details) => {
    if (details instanceof Error) {
      return { name: details.name, message: details.message, stack: details.stack }
    }
    if (details && typeof details === 'object') {
      return details
    }
    return { value: details }
  }),
})

export type LogEntry = z.infer<typeof logEntrySchema>

//
// Writings
//

export const writingCategoriesEnum = z.enum([
  'Journaling',
  'Weekly Review',
  'Yearly Review',
  'Goals & Planning',
  'Brainstorming',
  'Creative',
  'Other',
])

export const writingEntrySchema = z.object({
  id: z.uuid().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  category: writingCategoriesEnum,
  subject: z.string().min(1).max(100),
  body: z.string().min(1).max(10000),
  search_terms: z.array(z.string()),
})

export type WritingEntry = z.infer<typeof writingEntrySchema>
