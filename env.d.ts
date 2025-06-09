// env.d.ts (or types/env.d.ts, or declarations.d.ts)

declare module '@env' {
  export const DEV_BASE_URL_PRIMARY: string;
  export const DEV_BASE_URL_SECONDARY: string;
  export const PROD_BASE_URL: string;
  export const API_TIMEOUT: string; // .env variables are typically strings
  export const PROD_API_TIMEOUT: string; // .env variables are typically strings

  // Add any other environment variables you expect to use from your .env file
  // For example:
  // export const MY_API_KEY: string;
}