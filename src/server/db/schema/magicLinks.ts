import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const magicLinks = pgTable("magic_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

// MagicLink type
export type MagicLink = typeof magicLinks.$inferSelect;

// Drizzle Zod Schema
export const createMagicLinkSchema = createInsertSchema(magicLinks).omit({ id: true });
export const insertMagicLinkSchema = createInsertSchema(magicLinks);
export const selectMagicLinkSchema = createSelectSchema(magicLinks);