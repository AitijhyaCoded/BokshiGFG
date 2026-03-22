import { pgTable, serial, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Auth ID
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const verifications = pgTable('verifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  originalText: text('original_text').notNull(),
  accuracy: integer('accuracy').notNull(),
  documentSummary: text('document_summary'),
  verifiedClaims: jsonb('verified_claims').notNull(),
  stats: jsonb('stats').notNull(), // e.g. { trueCount, partialCount, falseCount }
  aiReasoning: text('ai_reasoning'),
  images: jsonb('images'), // array of strings
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertVerificationSchema = createInsertSchema(verifications);
export const selectVerificationSchema = createSelectSchema(verifications);

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type Verification = z.infer<typeof selectVerificationSchema>;
export type NewVerification = z.infer<typeof insertVerificationSchema>;
