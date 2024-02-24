import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";

export const client = new Client({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

const db = drizzle(client);

export default db;
