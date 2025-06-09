import SqliteDatabase from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import * as schema from "./schema"

/**
 * Build a Drizzle client from a SQLite database URL.
 *
 * @param url - The SQLite database URL.
 * @returns A Drizzle client.
 */
export function getDb(url = "sqlite.db") {
  const sqlite = new SqliteDatabase(url)
  return drizzle({ client: sqlite, schema })
}

export type DatabaseClient = ReturnType<typeof getDb>
