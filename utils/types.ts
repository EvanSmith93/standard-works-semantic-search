import { Generated } from "kysely";

export interface Database {
  verses: VersesTable;
  chapters: ChaptersTable;
  books: BooksTable;
  volumes: VolumesTable;
}

export interface VersesTable {
  id: Generated<number>;
  chapter_id: number;
  verse_number: number;
  scripture_text: string;
}

export interface ChaptersTable {
  id: Generated<number>;
  book_id: number;
  chapter_number: number;
}

export interface BooksTable {
  id: Generated<number>;
  volume_id: number;
  book_title: string;
  book_long_title: string;
  book_subtitle: string;
  book_short_title: string;
  book_lds_url: string;
}

export interface VolumesTable {
  id: Generated<number>;
  volume_title: string;
  volume_long_title: string;
  volume_subtitle: string;
  volume_short_title: string;
  volume_lds_url: string;
}

// export type Person = Selectable<PersonTable>;
// export type NewPerson = Insertable<PersonTable>;
// export type PersonUpdate = Updateable<PersonTable>;

// export type Pet = Selectable<PetTable>;
// export type NewPet = Insertable<PetTable>;
// export type PetUpdate = Updateable<PetTable>;

export type QueryResult = { id: string, text: string };

export type SearchResult = { text: string; name: string, url: string };