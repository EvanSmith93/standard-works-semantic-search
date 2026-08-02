const STORAGE_KEY = "searchHistory";
const MAX_ENTRIES = 100;

export interface SearchHistoryEntry {
  search: string;
  volumes: string[];
  timestamp: number;
}

export function getSearchHistory(): SearchHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(search: string, volumes: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  const history = getSearchHistory().filter(
    (entry) =>
      entry.search !== search || entry.volumes.join(",") !== volumes.join(","),
  );

  history.unshift({ search, volumes, timestamp: Date.now() });

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history.slice(0, MAX_ENTRIES)),
    );
  } catch {
    // Ignore write failures (e.g. storage disabled or full)
  }
}
