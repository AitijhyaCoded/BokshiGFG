const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const DATABASE_URL = "postgresql://neondb_owner:npg_RKTWu5vPiL0k@ep-patient-leaf-a1oxfqf9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

async function main() {
  try {
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'verifications';
    `;
    let output = 'Columns in verifications table:\n';
    columns.forEach(col => {
      output += `- ${col.column_name}: ${col.data_type}\n`;
    });
    fs.writeFileSync('db-schema-output.txt', output);
    console.log('Schema output written to db-schema-output.txt');
  } catch (error) {
    const errorMsg = 'Error querying database: ' + error.message;
    fs.writeFileSync('db-schema-output.txt', errorMsg);
    console.error(errorMsg);
  }
}

main();
