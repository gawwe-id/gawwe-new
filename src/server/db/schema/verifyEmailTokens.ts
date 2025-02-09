import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { users } from "."

// Verify Email Token Table
export const verifyEmailTokens = pgTable(
  "verify_email_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token").notNull(),
    tokenExpiresAt: timestamp("token_expires_at").notNull(),
  },
  (table) => ({
    userIdIdx: index("verify_email_tokens_user_id_idx").on(table.userId),
    tokenIdx: index("verify_email_tokens_token_idx").on(table.token),
  }),
)

// VerifyEmailToken type
export type VerifyEmailToken = typeof verifyEmailTokens.$inferSelect
