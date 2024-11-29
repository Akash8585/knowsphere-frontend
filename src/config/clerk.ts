export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string,
};

if (!clerkConfig.publishableKey) {
  throw new Error('Missing Clerk Publishable Key');
}