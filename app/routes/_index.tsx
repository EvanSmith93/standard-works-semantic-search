import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Card, ConfigProvider, Input, Tag } from "antd";
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
import { FaGithub } from "react-icons/fa";

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

  function handleClick(result: SearchResult) {
    window.open(result.url, "_blank", "noopener,noreferrer");
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
          <a
            href="https://github.com/EvanSmith93/standard-works-semantic-search"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-6 right-6 text-gray-500 text-3xl"
            aria-label="GitHub Repository"
          >
            <FaGithub />
          </a>

          <div className="max-w-2xl mx-auto text-center mt-24">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#005175] to-[#01B6D1] bg-clip-text text-transparent leading-tight">
              Gospel Library
              <br />
              Semantic Search
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Search the entire Latter-day Saint standard works using natural
              language. Great for studying the scriptures by theme or idea, or
              just finding that one verse you forget the reference to.
            </p>

            <div className="mt-12">
              <Input.Search
                placeholder="Search"
                size="large"
                onChange={(e) => setSearch(e.target.value)}
                onSearch={handleSearch}
              />

              <p className="mt-4 text-md text-gray-500">
                Volumes included in the search
              </p>
              <div className="mt-4 mx-auto max-w-lg">
                {volumeOptions.map((volume) => (
                  <Tag.CheckableTag
                    key={volume.value}
                    checked={selectedVolumes.includes(volume.value)}
                    onChange={(checked) => {
                      const next = checked
                        ? [...selectedVolumes, volume.value]
                        : selectedVolumes.filter((v) => v !== volume.value);
                      setSelectedVolumes(next);
                    }}
                    className="text-sm mb-2"
                  >
                    {volume.label}
                  </Tag.CheckableTag>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 w-[50%]">
            {results.map((result, index) => (
              <Card
                title={result.name}
                size="small"
                key={index}
                className="mb-4 cursor-pointer shadow hover:shadow-lg transition-all duration-200"
                hoverable
                onClick={() => handleClick(result)}
              >
                {result.text}
              </Card>
            ))}
          </div>
        </main>

        <footer className="mt-24 text-center text-sm text-gray-500">
          <p>
            Not an official website of The Church of Jesus Christ of Latter-day
            Saints
          </p>
        </footer>
      </div>
    </ConfigProvider>
  );
}
