import z from 'zod'

export const writingEntrySchema = z.object({
  id: z.uuid().optional(),
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
