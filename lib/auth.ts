// lib/auth.ts
import { serverUrl } from "@/enviroment";
import { usernameClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const betterAuthClient = createAuthClient({
  baseURL:serverUrl,
  plugins: [usernameClient(), nextCookies()],
  
});
