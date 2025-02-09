import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Notifications Table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  content: varchar("content").notNull(),
  notificationType: varchar("notification_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  sendAt: timestamp("send_at"),
  isGlobal: boolean("is_global").default(false),
})

// Notification Type
export type Notification = typeof notifications.$inferInsert

// Drizzle Zod Schema
export const createNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
})

export const insertNotificationSchema = createInsertSchema(notifications)
export const selectNotificationSchema = createSelectSchema(notifications)
