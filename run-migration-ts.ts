import { sql } from "drizzle-orm";
import { db } from "./lib/db";

async function main() {
  try {
    console.log("Running migration...");
    await db.execute(sql`ALTER TABLE verifications ADD COLUMN IF NOT EXISTS unverifiable_count integer NOT NULL DEFAULT 0;`);
    console.log("Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

main();
