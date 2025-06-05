import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Card, Input } from "antd";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { queryPineconeIndex } from "utils/pinecone.server";
import { SearchResult } from "utils/types";
import { getFullName, getUrl, queryVerseData } from "utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const { search } = await request.json();
  console.log(search);

  const bestVerseIds = await queryPineconeIndex(search);

  const results = await Promise.all(
    bestVerseIds.map(async (verse) => {
      const data = await queryVerseData(Number(verse.id));

      const url = getUrl(data);
      const name = getFullName(data);

      return {
        text: verse.text,
        name,
        url,
      };
    })
  );

  return results;
}

export default function Index() {
  const fetcher = useFetcher();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const results = fetcher.data as SearchResult[];
      setResults(results);
    }
  }, [fetcher.data, fetcher.state]);

  function handleSearch() {
    fetcher.submit({ search }, { method: "POST", encType: "application/json" });
    setSearch("");
  }

  function handleClick(result: SearchResult) {
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="p-6">
      <div className="mx-auto w-[50%]">
        <span>
          <Input.Search
            placeholder="Search"
            className="mb-6 mt-12"
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
          />
        </span>
        {results.map((result, index) => (
          <Card
            title={result.name}
            size="small"
            key={index}
            className="mb-4 cursor-pointer"
            hoverable
            onClick={() => handleClick(result)}
          >
            {result.text}
          </Card>
        ))}
      </div>
    </div>
  );
}
