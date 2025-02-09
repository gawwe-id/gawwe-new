import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { users } from "."

// Profile Document Agency Table
export const profileDocumentAgencies = pgTable(
  "profile_document_agencies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name"),
    certificateUrl: varchar("certificate_url"),
    year: integer("year"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    nameIdx: index("profile_document_agencies_name_idx").on(table.name),
    userIdIdx: index("profile_document_agencies_user_id_idx").on(table.userId),
  }),
)

// ProfileDocumentAgency Type
export type ProfileDocumentAgency = typeof profileDocumentAgencies.$inferInsert
