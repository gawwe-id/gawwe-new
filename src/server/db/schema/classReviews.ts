import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { classes, users } from "."
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// classes Review Table
export const classReviews = pgTable(
  "class_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    classId: uuid("class_id")
      .references(() => classes.id, {
        onDelete: "cascade",
      })
      .notNull(),
    reviewText: varchar("review_text").notNull(),
    rating: integer("rating").notNull(),
    reviewedAt: timestamp("reviewed_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("class_reviews_user_id_idx").on(table.userId),
    classIdIdx: index("class_reviews_class_id_idx").on(table.classId),
  }),
)

// ClassReview Type
export type ClassReview = typeof classReviews.$inferInsert

// Drizzle Zod Schema
export const createClassReviewsSchema = createInsertSchema(classReviews).omit({
  id: true,
})

export const insertClassReviewsSchema = createInsertSchema(classReviews)
export const selectClassReviewsSchema = createSelectSchema(classReviews)
