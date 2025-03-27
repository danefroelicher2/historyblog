import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

      // Exchange the auth code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error.message);
        // Redirect to an error page if there's an issue
        return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
      }

      // Success! Redirect to the confirmation page
      return NextResponse.redirect(
        new URL("/auth/confirmed", requestUrl.origin)
      );
    }

    // If no code is provided, redirect to home
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  } catch (error) {
    console.error("Error in auth callback:", error);
    // Fallback to home page if something unexpected happens
    return NextResponse.redirect(new URL("/", request.url));
  }
}
