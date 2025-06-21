import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { ConfigProvider } from "antd";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { queryPineconeIndex } from "utils/pinecone.server";
import { SearchResult } from "utils/types";
import { getFullName, getUrl, queryVerseData } from "utils/db.server";
import { SearchHeader } from "~/components/SearchHeader";
import { SearchBar } from "~/components/SearchBar";
import { SearchResults } from "~/components/SearchResults";
import { Footer } from "~/components/Footer";

/*
Other name ideas:
* Scripturally
* Agape AI
* An hundredth part
* iNephi
* LiahonAI
*/

export const meta: MetaFunction = () => {
  return [{ title: "Gospel Library Semantic Search" }];
};

// export async function loader() {
//   const volumes = await getVolumes();

//   return { volumes };
// }

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
  const fetcher = useFetcher<SearchResult[]>();

  const testResults =
    process.env.NODE_ENV === "development"
      ? [
          {
            text: "Test scripture",
            name: "This is a test scripture",
            url: "https://www.google.com",
          },
        ]
      : [];

  const [results, setResults] = useState<SearchResult[]>(testResults);

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const results = fetcher.data as SearchResult[];
      setResults(results);
    }
  }, [fetcher.data, fetcher.state]);

  const themeColor = "#007DA5";

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
            <SearchBar fetcher={fetcher} />
          </div>

          <SearchResults results={results} isLoading={isLoading} />
        </main>

        <Footer />
      </div>
    </ConfigProvider>
  );
}
