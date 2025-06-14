import { Card, Spin } from "antd";
import { SearchResult } from "utils/types";

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  function onResultClick(result: SearchResult) {
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto mt-6 max-w-2xl">
      {isLoading ? (
        <div className="flex justify-center my-8">
          <Spin size="large" />
        </div>
      ) : (
        results.map((result, index) => (
          <Card
            title={result.name}
            size="small"
            key={index}
            className="mb-4 cursor-pointer shadow hover:shadow-lg transition-all duration-200"
            hoverable
            onClick={() => onResultClick(result)}
          >
            {result.text}
          </Card>
        ))
      )}
    </div>
  );
}
