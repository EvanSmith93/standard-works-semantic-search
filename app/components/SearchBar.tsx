import { Input, Tag } from "antd";

interface VolumeOption {
  label: string;
  value: string;
}

interface SearchBarProps {
  setSearch: (value: string) => void;
  handleSearch: () => void;
  selectedVolumes: string[];
  setSelectedVolumes: (volumes: string[]) => void;
  volumeOptions: VolumeOption[];
}

export function SearchBar({
  setSearch,
  handleSearch,
  selectedVolumes,
  setSelectedVolumes,
  volumeOptions,
}: SearchBarProps) {
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
