import { auth } from "@/lib/auth";
import { type NextRequest } from "next/server";

export default auth.middleware({
  loginUrl: "/login",
});

export const config = {
  matcher: [
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)",
  ],
};
