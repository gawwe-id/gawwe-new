import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Event Types Table
export const eventTypes = pgTable("event_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code").notNull(),
  name: varchar("name").notNull(),
})

// EventType Type
export type EventType = typeof eventTypes.$inferInsert

// Drizzle Zod Schema
export const createEventTypeSchema = createInsertSchema(eventTypes).omit({
  id: true,
})

export const insertEventTypeSchema = createInsertSchema(eventTypes)
export const selectEventTypeSchema = createSelectSchema(eventTypes)
