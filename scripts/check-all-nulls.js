const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = "postgresql://neondb_owner:npg_RKTWu5vPiL0k@ep-patient-leaf-a1oxfqf9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

async function main() {
  try {
    const counts = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(id) as id_count,
        COUNT(original_text) as original_text_count,
        COUNT(accuracy) as accuracy_count,
        COUNT(true_count) as true_count_count,
        COUNT(partial_count) as partial_count_count,
        COUNT(false_count) as false_count_count,
        COUNT(unverifiable_count) as unverifiable_count_count,
        COUNT(ai_reasoning) as ai_reasoning_count,
        COUNT(verified_claims) as verified_claims_count,
        COUNT(created_at) as created_at_count
      FROM verifications;
    `;
    console.log('Column counts (should all match total if NOT NULL):');
    console.table(counts);
    
    const rows = counts[0];
    const total = parseInt(rows.total);
    for (const [key, value] of Object.entries(rows)) {
      if (key !== 'total' && parseInt(value) !== total) {
        console.warn(`Column ${key.replace('_count', '')} has ${total - parseInt(value)} NULL values!`);
      }
    }
  } catch (error) {
    console.error('Error querying database:', error);
  }
}

main();
