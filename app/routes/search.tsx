import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { SearchResult } from "utils/types";
import { queryPineconeIndex } from "utils/pinecone.server";
import { getFullName, getUrl, queryVerseData } from "utils/db.server";
import { VOLUMES } from "utils/helpers";
import { addToSearchHistory } from "utils/searchHistory";
import { SearchBar } from "~/components/SearchBar";
import { SearchResults } from "~/components/SearchResults";
import { Footer } from "~/components/Footer";
import { HistoryButton } from "~/components/HistoryButton";
import { SiteTitle } from "~/components/SiteTitle";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.search
        ? `${data.search} - Gospel Library Semantic Search`
        : "Gospel Library Semantic Search",
    },
  ];
};

const RESULTS_PER_PAGE = 5;
const MAX_LOAD_MORE_CLICKS = 2;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("q")?.trim() ?? "";
  const volumesParam = url.searchParams.get("volumes");

  const allVolumes = VOLUMES.map((volume) => volume.volume_lds_url);
  const volumes = volumesParam
    ? volumesParam.split(",").filter((v) => allVolumes.includes(v))
    : allVolumes;

  if (search === "" || volumes.length === 0) {
    throw redirect("/");
  }

  const skipParam = parseInt(url.searchParams.get("skip") ?? "0", 10);
  const skip = Math.min(
    Math.max(Number.isNaN(skipParam) ? 0 : skipParam, 0),
    RESULTS_PER_PAGE * MAX_LOAD_MORE_CLICKS
  );

  // Pinecone has no offset, so fetch skip + page size and slice off the skipped results
  const bestVerseIds = (
    await queryPineconeIndex(search, volumes, skip + RESULTS_PER_PAGE)
  ).slice(skip);

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

  return { results, search, volumes };
}

export default function Search() {
  const { results, search, volumes } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const fetcher = useFetcher<typeof loader>();

  const [moreResults, setMoreResults] = useState<SearchResult[]>([]);

  const isLoading = navigation.state === "loading";

  useEffect(() => {
    addToSearchHistory(search, volumes);
    setMoreResults([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, volumes.join(",")]);

  useEffect(() => {
    if (!fetcher.data) return;
    const newResults = fetcher.data.results;
    setMoreResults((prev) => [...prev, ...newResults]);
  }, [fetcher.data]);

  function onLoadMore() {
    const params = new URLSearchParams({
      q: search,
      volumes: volumes.join(","),
      skip: String(results.length + moreResults.length),
    });
    fetcher.load(`/search?${params.toString()}`);
  }

  // Show the button until 2 extra pages are loaded; a partial page
  // (length not a multiple of RESULTS_PER_PAGE) means there are no more results.
  const showLoadMore =
    !isLoading &&
    results.length === RESULTS_PER_PAGE &&
    moreResults.length < RESULTS_PER_PAGE * MAX_LOAD_MORE_CLICKS &&
    moreResults.length % RESULTS_PER_PAGE === 0;

  return (
    <div className="min-h-screen flex flex-col justify-between p-6">
      <main>
        <HistoryButton className="absolute top-6 right-6" />
        <div className="max-w-2xl mx-auto text-center">
          <SiteTitle />

          <SearchBar
            key={`${search}-${volumes.join(",")}`}
            initialSearch={search}
            initialVolumes={volumes}
            showSuggestions={false}
          />
        </div>

        <SearchResults
          results={[...results, ...moreResults]}
          isLoading={isLoading}
          showLoadMore={showLoadMore}
          isLoadingMore={fetcher.state !== "idle"}
          onLoadMore={onLoadMore}
        />
      </main>

      <Footer />
    </div>
  );
}
