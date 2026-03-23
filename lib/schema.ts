import { pgTable, text, timestamp, integer, uuid, jsonb } from 'drizzle-orm/pg-core';

export const verifications = pgTable('verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalText: text('original_text').notNull(),
  accuracy: integer('accuracy').notNull(),
  trueCount: integer('true_count').notNull(),
  partialCount: integer('partial_count').notNull(),
  falseCount: integer('false_count').notNull(),
  aiReasoning: text('ai_reasoning').notNull(),
  verifiedClaims: jsonb('verified_claims').notNull().$type<any[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
