import { FetcherWithComponents, useLoaderData } from "@remix-run/react";
import { Input, Tag } from "antd";
import { useState, useMemo } from "react";
import { SearchResult } from "utils/types";
import { loader } from "~/routes/_index";
import { TypeAnimation } from "react-type-animation";
import { EXAMPLE_SEARCHES, shuffle } from "utils/helpers";

interface SearchBarProps {
  fetcher: FetcherWithComponents<SearchResult[]>;
}

export function SearchBar({ fetcher }: SearchBarProps) {
  const data = useLoaderData<typeof loader>();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>(
    data.volumes.map((volume) => volume.volume_lds_url)
  );

  const sequence = useMemo(() => {
    const shuffled = shuffle(EXAMPLE_SEARCHES);
    return shuffled.flatMap((text) => [text, 1500, "", 500]);
  }, [isFocused]);

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
  }

  return (
    <div className="mt-12">
      <div className="relative">
        <Input.Search
          size="large"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={"[&_input]:bg-transparent"}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 z-10">
          {!isFocused && search.trim() === "" && (
            <TypeAnimation sequence={sequence} speed={65} repeat={Infinity} />
          )}
        </div>
      </div>

      <p className="mt-4 text-md text-gray-500">
        Select volumes to include in the search
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
