const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = "postgresql://neondb_owner:npg_RKTWu5vPiL0k@ep-patient-leaf-a1oxfqf9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

async function main() {
  try {
    const nulls = await sql`
      SELECT id, unverifiable_count FROM verifications WHERE unverifiable_count IS NULL;
    `;
    console.log('Rows with NULL unverifiable_count:', nulls.length);
    if (nulls.length > 0) {
      console.log('Sample IDs:', nulls.slice(0, 5).map(r => r.id));
    }
  } catch (error) {
    console.error('Error querying database:', error);
  }
}

main();
