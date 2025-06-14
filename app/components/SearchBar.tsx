import { FetcherWithComponents, useLoaderData } from "@remix-run/react";
import { Input, Tag } from "antd";
import { useState } from "react";
import { SearchResult } from "utils/types";
import { loader } from "~/routes/_index";

interface SearchBarProps {
  fetcher: FetcherWithComponents<SearchResult[]>;
}

export function SearchBar({ fetcher }: SearchBarProps) {
  const data = useLoaderData<typeof loader>();

  const [search, setSearch] = useState("");
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>(
    data.volumes.map((volume) => volume.volume_lds_url)
  );

  const volumeOptions = data.volumes.map((volume) => ({
    label: volume.volume_title,
    value: volume.volume_lds_url,
  }));

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

  return (
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
  );
}
