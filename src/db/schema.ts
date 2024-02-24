import { mysqlTable, serial } from "drizzle-orm/mysql-core";

export const todo = mysqlTable("books", {
  id: serial("id").primaryKey(),
});
