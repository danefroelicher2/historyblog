import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  return res;
}

// Specify which paths should trigger this middleware
export const config = {
  matcher: [
    // Exclude files with extensions, api routes, and _next paths
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
