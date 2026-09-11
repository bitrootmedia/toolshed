# Toolshed

A fast, frontend-only collection of small utility tools (à la
[it-tools.tech](https://it-tools.tech)) — React + TypeScript + Vite +
Tailwind. Everything runs client-side, nothing is ever sent to a server.

## Develop

```bash
npm install
npm run dev
```

## Adding a new tool

Each tool lives in its own folder under `src/tools/<tool-id>/` and is
registered once in `src/tools/registry.ts`. That registry is the single
source of truth — routing, the sidebar nav, the home page grid, and search
are all generated from it, so adding a tool is:

1. Create `src/tools/<tool-id>/<ToolName>.tsx` as the **default export** of
   a component with no props (see `line-wrapper/LineWrapper.tsx`).
2. Add an entry to the `tools` array in `src/tools/registry.ts`:
   ```ts
   {
     id: "my-tool",
     name: "My Tool",
     description: "One sentence for the card and sidebar.",
     keywords: ["synonyms", "for search"],
     category: "Text", // reuse a category or introduce a new one
     icon: SomeLucideIcon,
     component: lazy(() => import("./my-tool/MyTool")),
   }
   ```

That's it — the tool gets its own route (`/#/tools/my-tool`), shows up in
the sidebar under its category, appears on the home page, is searchable
(fuzzy, via Fuse.js), and is code-split so its bundle only loads when
visited.

Shared bits worth reusing inside a tool: `<CopyButton text={...} />` for
copy-to-clipboard, and the Tailwind input/textarea classes used in
`LineWrapper.tsx` for visual consistency (light/dark aware).

## Structure

```
src/
  tools/
    registry.ts        # the single source of truth for all tools
    line-wrapper/
      LineWrapper.tsx
  components/           # Layout, Sidebar, SearchBox, ToolCard, CopyButton, ThemeToggle
  hooks/
    useToolSearch.ts    # Fuse.js-backed fuzzy search over the registry
  lib/
    theme.tsx           # light/dark theme context (persisted, system-aware)
    types.ts
  pages/
    Home.tsx
    ToolPage.tsx
```

Routing uses `HashRouter`, so the built site can be deployed to any static
host (GitHub Pages, S3, Netlify, etc.) with zero server configuration.
