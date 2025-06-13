import { getVersesAndVolumes } from "utils/db.server";
import { upsertDocuments } from "utils/pinecone.server";

const scriptures = await getVersesAndVolumes();
await upsertDocuments(scriptures);
