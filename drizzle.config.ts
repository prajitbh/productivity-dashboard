import "dotenv/config";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// dotenv's default import only loads a file named ".env" — this project
// uses ".env.local" (matching Next.js convention), so load that explicitly.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
});
