import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { Card } from "antd";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { getSearchHistory, type SearchHistoryEntry } from "utils/searchHistory";
import { Footer } from "~/components/Footer";
import { SiteTitle } from "~/components/SiteTitle";

export const meta: MetaFunction = () => {
  return [{ title: "Search History - Gospel Library Semantic Search" }];
};

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHistory(getSearchHistory());
    setIsLoaded(true);
  }, []);

  function onEntryClick(entry: SearchHistoryEntry) {
    const params = new URLSearchParams({
      q: entry.search,
      volumes: entry.volumes.join(","),
    });

    navigate(`/search?${params.toString()}`);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-6">
      <main>
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute top-6 left-6 text-gray-500 text-3xl"
        >
          <MdArrowBack />
        </button>

        <div className="max-w-2xl mx-auto">
          <SiteTitle />

          <h2 className="mt-8 text-xl font-semibold text-gray-700">
            Search History
          </h2>
        </div>

        <div className="mx-auto mt-6 max-w-2xl">
          {isLoaded && history.length === 0 ? (
            <p className="text-center text-gray-500">
              You haven&apos;t searched anything yet.
            </p>
          ) : (
            history.map((entry, index) => (
              <Card
                size="small"
                key={index}
                className="mb-4 cursor-pointer shadow hover:shadow-lg transition-all duration-200"
                hoverable
                onClick={() => onEntryClick(entry)}
              >
                {entry.search}
              </Card>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
