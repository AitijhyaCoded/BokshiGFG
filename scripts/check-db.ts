import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  try {
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'verifications';
    `;
    console.log('Columns in verifications table:');
    console.table(columns);
  } catch (error) {
    console.error('Error querying database:', error);
  }
}

main();
