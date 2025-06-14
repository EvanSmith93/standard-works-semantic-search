import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { ConfigProvider } from "antd";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { queryPineconeIndex } from "utils/pinecone.server";
import { SearchResult } from "utils/types";
import {
  getFullName,
  getUrl,
  getVolumes,
  queryVerseData,
} from "utils/db.server";
import { SearchHeader } from "~/components/SearchHeader";
import { SearchBar } from "~/components/SearchBar";
import { SearchResults } from "~/components/SearchResults";
import { Footer } from "~/components/Footer";

export const meta: MetaFunction = () => {
  return [{ title: "Gospel Library Semantic Search" }];
};

export async function loader() {
  const volumes = await getVolumes();

  return {
    volumes,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const { search, volumes } = await request.json();

  const bestVerseIds = await queryPineconeIndex(search, volumes, 5);

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
  const data = useLoaderData<typeof loader>();

  const fetcher = useFetcher();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>(
    data.volumes.map((volume) => volume.volume_lds_url)
  );
  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const results = fetcher.data as SearchResult[];
      setResults(results);
    }
  }, [fetcher.data, fetcher.state]);

  function handleSearch() {
    if (search.trim() === "" || selectedVolumes.length === 0) {
      return;
    }

    fetcher.submit(
      { search, volumes: selectedVolumes },
      { method: "POST", encType: "application/json" }
    );
    setSearch("");
  }

  const themeColor = "#007DA5";

  const volumeOptions = data.volumes.map((volume) => ({
    label: volume.volume_title,
    value: volume.volume_lds_url,
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColor,
          colorLink: themeColor,
        },
      }}
    >
      <div className="min-h-screen flex flex-col justify-between p-6">
        <main>
          <SearchHeader />

          <div className="max-w-2xl mx-auto text-center">
            <SearchBar
              setSearch={setSearch}
              handleSearch={handleSearch}
              selectedVolumes={selectedVolumes}
              setSelectedVolumes={setSelectedVolumes}
              volumeOptions={volumeOptions}
            />
          </div>

          <SearchResults results={results} isLoading={isLoading} />
        </main>

        <Footer />
      </div>
    </ConfigProvider>
  );
}
