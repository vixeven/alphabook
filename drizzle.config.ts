import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  driver: "mysql2",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
} satisfies Config;
