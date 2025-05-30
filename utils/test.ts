import { db } from "./db.server";

const res = await db
  .selectFrom("verses")
  .where("id", "=", 10)
  .selectAll()
  .executeTakeFirst();

console.log(res);
