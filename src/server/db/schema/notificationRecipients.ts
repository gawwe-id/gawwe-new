import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { notifications, users } from "."
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// notifications Recipients Table
export const notificationRecipients = pgTable(
  "notification_recipients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    notificationId: uuid("notification_id")
      .references(() => notifications.id, {
        onDelete: "cascade",
      })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    receivedAt: timestamp("received_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("notification_recipients_user_id_idx").on(table.userId),
    notificationIdIdx: index("notification_recipients_notification_id_idx").on(
      table.notificationId,
    ),
  }),
)

// NotificationRecipient Type
export type NotificationRecipient = typeof notificationRecipients.$inferInsert

// Drizzle Zod Schema
export const createNotificationRecipientSchema = createInsertSchema(
  notificationRecipients,
).omit({ id: true })

export const insertNotificationRecipientSchema = createInsertSchema(
  notificationRecipients,
)
export const selectNotificationRecipientSchema = createSelectSchema(
  notificationRecipients,
)
