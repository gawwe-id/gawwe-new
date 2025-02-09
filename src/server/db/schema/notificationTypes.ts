import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

export const notificationTypes = pgTable("notification_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code").notNull(),
  name: varchar("name").notNull(),
})

// notificationType Type
export type NotificationType = typeof notificationTypes.$inferInsert
