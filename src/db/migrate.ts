import dotenv from "dotenv";
dotenv.configDotenv({ path: ".env.local" });

import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { migrate } from "drizzle-orm/planetscale-serverless/migrator";

const main = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  await migrate(drizzle(client), { migrationsFolder: "src/db/migrations" });
};

main().catch((error) => {
  console.error(error);
  console.error("Migration failed");

  process.exit(1);
});
