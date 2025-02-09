import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// roles Table
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code").notNull(),
  name: varchar("name").notNull(),
})

// Role Type
export type Role = typeof roles.$inferInsert

// Drizzle Zod Schema
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true })

export const selectRolesSchema = createSelectSchema(roles)
