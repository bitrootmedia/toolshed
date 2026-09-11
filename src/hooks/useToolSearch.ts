import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { tools } from "../tools/registry";
import type { ToolDefinition } from "../lib/types";

const fuse = new Fuse(tools, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "keywords", weight: 0.35 },
    { name: "description", weight: 0.15 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
});

export function useToolSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo<ToolDefinition[]>(() => {
    if (!query.trim()) return tools;
    return fuse.search(query).map((r) => r.item);
  }, [query]);

  return { query, setQuery, results };
}
