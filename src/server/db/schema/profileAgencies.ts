import { index, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from ".";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// Profile Agency Table
export const profileAgencies = pgTable(
  "profile_agencies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    displayName: varchar("display_name").notNull(),
    imageUrl: varchar("image_url").notNull(),
    phone: varchar("phone").notNull(),
    bio: varchar("bio").notNull(),
    address: varchar("address").notNull(),
    province: varchar("province").notNull(),
    regency: varchar("regency").notNull(),
    district: varchar("district").notNull(),
    village: varchar("village").notNull(),
    postalCode: varchar("postal_code").notNull(),
  },
  (table) => ({
    displayNameIdx: index("profile_agencies_display_name_idx").on(
      table.displayName
    ),
    userIdIdx: index("profile_agencies_user_id_idx").on(table.userId),
  })
);

// ProfileAgencies Type
export type ProfileAgencies = typeof profileAgencies.$inferSelect;
export type NewProfileAgencies = typeof profileAgencies.$inferInsert;

// Drizzle Zod Schema
export const insertProfileAgencySchema = createInsertSchema(
  profileAgencies
).omit({ id: true });

export const selectProfileAgencySchema = createSelectSchema(profileAgencies);
export const updateProfileAgencySchema = createUpdateSchema(profileAgencies);
