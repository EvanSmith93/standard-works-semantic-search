import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Card, Input } from "antd";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { queryPineconeIndex } from "utils/pinecone.server";
import { QueryResult } from "utils/types";

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
  const results = queryPineconeIndex(search);

  return results;
}

export default function Index() {
  const fetcher = useFetcher();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<QueryResult[]>([]);

  function handleSearch() {
    fetcher.submit({ search }, { method: "POST", encType: "application/json" });
    setSearch("");
  }

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const results = fetcher.data as QueryResult[];
      setResults(results);
    }
  }, [fetcher.data, fetcher.state]);

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
          <Card title="Testing" size="small" key={index} className="mb-4">
            {result.text}
          </Card>
        ))}
      </div>
    </div>
  );
}
