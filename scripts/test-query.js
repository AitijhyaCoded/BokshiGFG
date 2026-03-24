const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const DATABASE_URL = "postgresql://neondb_owner:npg_RKTWu5vPiL0k@ep-patient-leaf-a1oxfqf9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

async function main() {
  try {
    // Exact query from the error message
    const result = await sql`
      select "id", "original_text", "accuracy", "true_count", "partial_count", "false_count", "unverifiable_count", "ai_reasoning", "verified_claims", "created_at" 
      from "verifications" "verifications" 
      order by "verifications"."created_at" desc 
      limit 100
    `;
    console.log('Query successful, rows returned:', result.length);
    fs.writeFileSync('query-test-output.txt', 'Query successful, rows: ' + result.length);
  } catch (error) {
    const errorMsg = 'Query failed: ' + error.message;
    console.error(errorMsg);
    fs.writeFileSync('query-test-output.txt', errorMsg);
  }
}

main();
