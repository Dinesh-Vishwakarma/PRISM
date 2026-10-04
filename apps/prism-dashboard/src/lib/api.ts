/**
 * PRISM Dashboard API configuration
 * Defaults to the production Railway backend if NEXT_PUBLIC_API_URL is not set.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://prism-production-fd7b.up.railway.app"
).replace(/\/+$/, ""); // Ensure no trailing slash
