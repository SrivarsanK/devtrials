import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes — accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/public(.*)",
]);

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
  "/zones(.*)",
  "/history(.*)",
  "/claims(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 1. Handle Unauthenticated Users
  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Handle Authenticated Users
  if (userId) {
    const pathname = req.nextUrl.pathname;
    
    // Check if onboarding is complete from session claims (requires JWT template)
    let isOnboardingComplete = !!(sessionClaims as any)?.metadata?.onboardingComplete;

    // A. If we think onboarding is NOT complete, or we are at /onboarding, 
    // we double check against the Clerk API to handle stale tokens or missing JWT templates.
    if (!isOnboardingComplete || pathname.startsWith("/onboarding")) {
      try {
        // We only do this for protected routes to save API calls
        if (isProtectedRoute(req)) {
          const client = await clerkClient();
          const user = await client.users.getUser(userId);
          isOnboardingComplete = !!user.publicMetadata?.onboardingComplete;
        }
      } catch (e) {
        console.error("Clerk API error in middleware:", e);
      }
    }

    // B. Handle Sign-in/Sign-up page access for logged-in users
    if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
      return NextResponse.redirect(new URL(isOnboardingComplete ? "/dashboard" : "/onboarding", req.url));
    }

    // C. Enforce Onboarding: Redirect to /onboarding if not complete
    if (!isOnboardingComplete && !pathname.startsWith("/onboarding") && isProtectedRoute(req)) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // D. Prevent Access to Onboarding: Redirect to /dashboard if already complete
    if (isOnboardingComplete && pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
