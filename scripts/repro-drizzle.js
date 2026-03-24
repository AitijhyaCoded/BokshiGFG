const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { pgTable, text, timestamp, integer, uuid, jsonb } = require('drizzle-orm/pg-core');
const { desc } = require('drizzle-orm');

// Mock schema
const verifications = pgTable('verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalText: text('original_text').notNull(),
  accuracy: integer('accuracy').notNull(),
  trueCount: integer('true_count').notNull(),
  partialCount: integer('partial_count').notNull(),
  falseCount: integer('false_count').notNull(),
  unverifiableCount: integer('unverifiable_count').notNull().default(0),
  aiReasoning: text('ai_reasoning').notNull(),
  verifiedClaims: jsonb('verified_claims').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const DATABASE_URL = "postgresql://neondb_owner:npg_RKTWu5vPiL0k@ep-patient-leaf-a1oxfqf9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema: { verifications } });

async function main() {
  try {
    const history = await db.query.verifications.findMany({
      orderBy: [desc(verifications.createdAt)],
      limit: 100,
    });
    console.log('Results found:', history.length);
  } catch (error) {
    console.error('Failed with findMany:', error.message);
    if (error.query) console.error('Query:', error.query);
    if (error.params) console.error('Params:', error.params);
  }
}

main();
