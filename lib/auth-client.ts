import { createAuthClient } from "@neondatabase/auth";

export const authClient = createAuthClient(process.env.NEXT_PUBLIC_AUTH_URL || "https://ep-patient-leaf-a1oxfqf9.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth");
