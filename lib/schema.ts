import { pgTable, text, timestamp, integer, uuid, jsonb } from 'drizzle-orm/pg-core';

export const verifications = pgTable('verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalText: text('original_text').notNull(),
  accuracy: integer('accuracy').notNull(),
  trueCount: integer('true_count').notNull(),
  partialCount: integer('partial_count').notNull(),
  falseCount: integer('false_count').notNull(),
  unverifiableCount: integer('unverifiable_count').notNull().default(0),
  aiReasoning: text('ai_reasoning').notNull(),
  verifiedClaims: jsonb('verified_claims').notNull().$type<any[]>(),
  textForensics: jsonb('text_forensics').$type<any>(),
  imageForensics: jsonb('image_forensics').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
