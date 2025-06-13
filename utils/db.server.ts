import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import { Database } from "./types";

export const db = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: new SQLite("./public/lds-scriptures-sqlite.db"),
  }),
});

export async function queryVerseData(verseId: number) {
  const response = await db
    .selectFrom("verses")
    .where("verses.id", "=", verseId)
    .innerJoin("chapters", "verses.chapter_id", "chapters.id")
    .innerJoin("books", "chapters.book_id", "books.id")
    .innerJoin("volumes", "books.volume_id", "volumes.id")
    .select([
      "volumes.volume_lds_url",
      "books.book_lds_url",
      "books.book_title",
      "chapters.chapter_number",
      "verses.verse_number",
    ])
    .execute();

  console.log(response);

  if (!response.length) {
    throw Error("Verse not found");
  }

  return response[0];
}

export function getUrl(data: Awaited<ReturnType<typeof queryVerseData>>) {
  return `https://churchofjesuschrist.org/study/scriptures/${data.volume_lds_url}/${data.book_lds_url}/${data.chapter_number}?id=p${data.verse_number}#p${data.verse_number}`;
}

export function getFullName(data: Awaited<ReturnType<typeof queryVerseData>>) {
  return `${data.book_title} ${data.chapter_number}:${data.verse_number}`;
}

export async function getVolumes() {
  return await db
    .selectFrom("volumes")
    .select(["volumes.volume_lds_url", "volumes.volume_title"])
    .execute();
}

export async function getVersesAndVolumes() {
  return await db
    .selectFrom("verses")
    .innerJoin("chapters", "verses.chapter_id", "chapters.id")
    .innerJoin("books", "chapters.book_id", "books.id")
    .innerJoin("volumes", "books.volume_id", "volumes.id")
    .select(["volumes.volume_lds_url", "verses.id", "verses.scripture_text"])
    // .where("verses.id", ">=", 31290)
    .execute();
}
