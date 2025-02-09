import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { users } from "."

// Reset Token Table (For Change Password)
export const resetTokens = pgTable(
  "reset_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token").notNull(),
    tokenExpiresAt: timestamp("token_expires_at").notNull(),
  },
  (table) => ({
    userIdIdx: index("reset_tokens_user_id_idx").on(table.userId),
    tokenIdx: index("reset_tokens_token_idx").on(table.token),
  }),
)

// ResetToken type
export type ResetToken = typeof resetTokens.$inferSelect
