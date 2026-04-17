import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes — accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/:lang",
  "/:lang/sign-in(.*)",
  "/:lang/sign-up(.*)",
  "/api/public(.*)",
]);

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/:lang/dashboard(.*)",
  "/:lang/onboarding(.*)",
  "/:lang/zones(.*)",
  "/:lang/history(.*)",
  "/:lang/claims(.*)",
  "/:lang/settings(.*)",
]);

import { locales, defaultLocale } from "./app/[lang]/dictionaries";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const { userId, sessionClaims } = await auth();

  // 1. Handle Locale Redirection
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Skip redirection for API routes to allow next.config.ts rewrites to handle them
  if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) {
    return NextResponse.next();
  }

  if (!pathnameHasLocale) {
    // Detect locale (simplified: default to 'en' for now or check headers)
    const locale = defaultLocale; 
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  }

  // 2. Handle Unauthenticated Users
  const isPublic = isPublicRoute(req);
  if (!userId && !isPublic) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Handle Authenticated Users
  if (userId) {
    // Extract locale from pathname for correct redirection targets
    const locale = pathname.split('/')[1];
    const internalPath = pathname.replace(`/${locale}`, '') || '/';
    
    // Check if onboarding is complete from session claims
    let isOnboardingComplete = !!(sessionClaims as any)?.metadata?.onboardingComplete;

    if (!isOnboardingComplete || internalPath.startsWith("/onboarding")) {
      try {
        if (isProtectedRoute(req)) {
          const client = await clerkClient();
          const user = await client.users.getUser(userId);
          isOnboardingComplete = !!user.publicMetadata?.onboardingComplete;
        }
      } catch (e) {
        console.error("Clerk API error in middleware:", e);
      }
    }

    // Handle Sign-in/Sign-up page access for logged-in users
    if (internalPath.startsWith("/sign-in") || internalPath.startsWith("/sign-up")) {
      return NextResponse.redirect(new URL(`/${locale}${isOnboardingComplete ? "/dashboard" : "/onboarding"}`, req.url));
    }

    // Enforce Onboarding
    if (!isOnboardingComplete && !internalPath.startsWith("/onboarding") && !internalPath.startsWith("/payment-status") && isProtectedRoute(req)) {
      return NextResponse.redirect(new URL(`/${locale}/onboarding`, req.url));
    }

    // Prevent Access to Onboarding
    if (isOnboardingComplete && internalPath.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
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
