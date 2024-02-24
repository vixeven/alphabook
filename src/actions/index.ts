"use server";
import { sql } from "drizzle-orm";
import db from "@/db";

export const getVersion = async () => {
  const result = await db.execute(sql`SELECT VERSION() AS version`);
  const { version } = result.rows[0] as { version: string };

  return version;
};
