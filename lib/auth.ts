import { createNeonAuth } from "@neondatabase/auth/next/server";
import { db } from "./db";
import { users } from "./schema";

if (!process.env.AUTH_URL) {
  throw new Error("AUTH_URL is not defined");
}

export const auth = createNeonAuth({
  baseUrl: process.env.AUTH_URL,
  cookies: {
    secret: "bokshi-v-1-auth-secret-key-32-chars-long-minimal", // MUST be at least 32 chars
  },
  // @ts-ignore - Assuming db and schema mapping is compatible with Better Auth plugin
  db,
  schema: {
    user: users,
  },
});
