import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { users } from "."

// Profile Document Participant Table
export const profileDocumentParticipants = pgTable(
  "profile_document_participants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    gradsCertificateUrl: varchar("grads_certificate_url"),
    transcriptUrl: varchar("transcript_url"),
    birthCertificateUrl: varchar("birth_certificate_url"),
    familyCardUrl: varchar("family_card_url"),
    idCardUrl: varchar("id_card_url"),
    healthCertificateUrl: varchar("health_certificate_url"),
    passportPhotoUrl: varchar("passport_photo_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("profile_document_participants_user_id_idx").on(
      table.userId,
    ),
  }),
)

// ProfileDocumentParticipant Type
export type ProfileDocumentParticipant =
  typeof profileDocumentParticipants.$inferInsert
