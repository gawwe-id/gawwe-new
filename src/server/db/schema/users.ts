import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import {
  languageClassEnrollments,
  languageClasses,
  payments,
  profileAgencies,
  profileParticipants,
} from ".";

// users Table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    role: text("role"),
    profileCompletion: integer().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    nameIndex: index("users_name_idx").on(table.name),
  })
);

// User Relations
export const userRelations = relations(users, ({ one, many }) => ({
  profileParticipants: one(profileParticipants, {
    fields: [users.id],
    references: [profileParticipants.userId],
  }),
  profileAgencys: one(profileAgencies, {
    fields: [users.id],
    references: [profileAgencies.userId],
  }),
  languageClasses: many(languageClasses),
  enrollments: many(languageClassEnrollments),
  payments: many(payments),
}));

// User type
export type User = typeof users.$inferSelect;

// Drizzle Zod Schema
export const insertUserSchema = createInsertSchema(users);
export const selectUsersSchema = createSelectSchema(users);
export const userUpdateSchema = createUpdateSchema(users);
