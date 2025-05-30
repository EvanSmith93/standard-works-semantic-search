import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import { Database } from "./types";

export const db = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: new SQLite("./public/lds-scriptures-sqlite.db"),
  }),
});
