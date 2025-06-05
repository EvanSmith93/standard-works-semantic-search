import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";
import { QueryResult } from "./types";

const INDEX_NAME = "standard-works-semantic-search";
const NAMESPACE = "__default__";
const MODEL_NAME = "llama-text-embed-v2";
const PINECONE_HOST = process.env.PINECONE_HOST!;

export async function createPineconeIndex() {
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const existingIndexes = (await pc.listIndexes()).indexes ?? [];

  if (!existingIndexes.map((index) => index.name).includes(INDEX_NAME)) {
    await pc.createIndexForModel({
      name: INDEX_NAME,
      cloud: "aws",
      region: "us-east-1",
      embed: {
        model: MODEL_NAME,
        fieldMap: { text: "text" },
      },
      waitUntilReady: true,
    });
    console.log(`✅ Created index ${INDEX_NAME}`);
  } else {
    console.log(`ℹ️  Index "${INDEX_NAME}" already exists; skipping creation.`);
  }
}

export async function queryPineconeIndex(
  search: string
): Promise<QueryResult[]> {
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  const namespace = pc.index(INDEX_NAME, PINECONE_HOST).namespace(NAMESPACE);

  const searchWithId = await namespace.searchRecords({
    query: {
      topK: 2,
      inputs: { text: search },
    },
    fields: ["text", "category"],
  });

  console.log(
    searchWithId.result.hits.map(
      (hit) => `${hit._id} - ${hit._score} - ${JSON.stringify(hit.fields)}\n\n`
    )
  );

  return searchWithId.result.hits.map((hit) => ({
    id: hit._id,
    text: (hit.fields as { text: string }).text,
  }));
}
