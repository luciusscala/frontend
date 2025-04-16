import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not signed in, allow access to auth pages
  if (!session) {
    if (request.nextUrl.pathname.startsWith("/auth")) {
      return res;
    }
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Check if email is verified
  const { data: user } = await supabase.auth.getUser();
  const isEmailVerified = user?.user?.email_confirmed_at !== null;

  // If email is not verified, redirect to verification page
  if (!isEmailVerified && !request.nextUrl.pathname.startsWith("/verify-email")) {
    return NextResponse.redirect(new URL("/verify-email", request.url));
  }

  // If email is verified and trying to access verification page, redirect to home
  if (isEmailVerified && request.nextUrl.pathname.startsWith("/verify-email")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
