import { FetcherWithComponents, useLoaderData } from "@remix-run/react";
import { Input, Tag } from "antd";
import { useState, useMemo } from "react";
import { SearchResult } from "utils/types";
import { loader } from "~/routes/_index";
import { TypeAnimation } from "react-type-animation";
import { shuffle } from "utils/helpers";

const EXAMPLE_SEARCHES = [
  "Lehi partakes of the fruit of the tree of life",
  "How can I be more pure in heart?",
  "God creates the animals",
  "What are the signs of the Savior's coming?",
  "Captain Moroni makes the title of liberty",
  "Do not be afraid",
  "What tribe was Jesus from?",
  "Jesus heals the blind man",
  "What are the three degrees of glory?",
  "Joseph Smith sees two personages",
  "How old did Moses live to be?",
  "Faith without works is dead",
  "How does repentance work?",
  "Justification versus sanctification",
  "Christ's Atonement",
  "Faith is like a little seed",
  "What is charity?",
  "Moses parts the Red Sea",
  "When did Matthew become a disciple?",
  "Paul is commanded to go to Damascus",
  "Why does God call prophets?",
  "Sacrament prayers",
  "How can I find peace?",
  "What does it mean to be a disciple of Christ?",
  "Nephi agrees to do whatever the Lord asks of him",
  "Don't hide your light",
  "Which apostle walked on water?",
];

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
    setSearch("");
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
