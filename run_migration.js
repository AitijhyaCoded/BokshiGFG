const fs = require('fs');
const envStr = fs.readFileSync('.env', 'utf8');
envStr.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    process.env[match[1]] = val;
  }
});
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql('ALTER TABLE verifications ADD COLUMN IF NOT EXISTS unverifiable_count integer NOT NULL DEFAULT 0;')
  .then(res => {
    console.log('Success:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
