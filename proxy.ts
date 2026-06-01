import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the exact internal routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/home(.*)",
  "/social-share(.*)",
  "/video-share(.*)",
  "/api/video-upload(.*)",
  "/api/image-upload(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is protected, enforce Clerk authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
