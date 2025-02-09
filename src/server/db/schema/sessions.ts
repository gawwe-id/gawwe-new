import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

import { users } from ".";

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Session type
export type Session = typeof sessions.$inferSelect;
