import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { classes, users } from "."
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Payments Table
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    classId: uuid("class_id").references(() => classes.id, {
      onDelete: "cascade",
    }),
    transactionId: uuid("transaction_id").unique(),
    amount: integer("amount").notNull(),
    currency: varchar("currency"),
    status: varchar("status"),
    paymentMethod: varchar("payment_method").notNull(),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("payments_user_id_idx").on(table.userId),
    classIdIdx: index("payments_class_id_idx").on(table.classId),
    transactionIdx: index("payments_transaction_id_idx").on(
      table.transactionId,
    ),
  }),
)

// Payment Type
export type Payment = typeof payments.$inferInsert

// Drizzle Zod Schema
export const createPaymentSchema = createInsertSchema(payments).omit({
  id: true,
})

export const insertPaymentSchema = createInsertSchema(payments)
export const selectPaymentSchema = createSelectSchema(payments)
