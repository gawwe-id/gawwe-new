import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { educationLevels, users } from ".";

// Profile Participants Table
export const profileParticipants = pgTable(
  "profile_participants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    imageUrl: varchar("image_url").notNull(),
    gender: varchar("gender").notNull(),
    birthDate: varchar("birth_date").notNull(),
    phone: varchar("phone").notNull(),
    address: varchar("address").notNull(),
    province: varchar("province").notNull(),
    regency: varchar("regency").notNull(),
    district: varchar("district").notNull(),
    village: varchar("village").notNull(),
    postalCode: varchar("postal_code").notNull(),
    educationLevelId: uuid("education_level_id")
      .references(() => educationLevels.id)
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("profile_participants_user_id_idx").on(table.userId),
  })
);

// ProfileParticipant Type
export type ProfileParticipant = typeof profileParticipants.$inferSelect;

// Drizzle Zod Schema
export const insertProfileParticipantSchema = createInsertSchema(
  profileParticipants
).omit({ id: true });

export const selectProfileParticipantSchema =
  createSelectSchema(profileParticipants);

export const updateProfileParticipantSchema =
  createUpdateSchema(profileParticipants);
