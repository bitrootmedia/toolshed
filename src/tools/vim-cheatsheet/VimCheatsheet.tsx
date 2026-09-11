import { useMemo, useState } from "react";
import { CopyButton } from "../../components/CopyButton";

interface CheatEntry {
  keys: string;
  description: string;
}

interface CheatGroup {
  title: string;
  entries: CheatEntry[];
}

const GROUPS: CheatGroup[] = [
  {
    title: "Modes",
    entries: [
      { keys: "i", description: "Insert before cursor" },
      { keys: "a", description: "Insert after cursor" },
      { keys: "I", description: "Insert at start of line" },
      { keys: "A", description: "Insert at end of line" },
      { keys: "o", description: "Open new line below and insert" },
      { keys: "O", description: "Open new line above and insert" },
      { keys: "v", description: "Visual mode (character-wise)" },
      { keys: "V", description: "Visual mode (line-wise)" },
      { keys: "Ctrl+v", description: "Visual mode (block-wise)" },
      { keys: "Esc", description: "Return to normal mode" },
    ],
  },
  {
    title: "Movement",
    entries: [
      { keys: "h j k l", description: "Left, down, up, right" },
      { keys: "w", description: "Next word" },
      { keys: "b", description: "Previous word" },
      { keys: "e", description: "End of word" },
      { keys: "0", description: "Start of line" },
      { keys: "^", description: "First non-blank character of line" },
      { keys: "$", description: "End of line" },
      { keys: "gg", description: "Go to first line" },
      { keys: "G", description: "Go to last line" },
      { keys: ":n", description: "Go to line n" },
      { keys: "Ctrl+f", description: "Page down" },
      { keys: "Ctrl+b", description: "Page up" },
      { keys: "%", description: "Jump to matching bracket" },
    ],
  },
  {
    title: "Editing",
    entries: [
      { keys: "x", description: "Delete character under cursor" },
      { keys: "dd", description: "Delete (cut) line" },
      { keys: "dw", description: "Delete word" },
      { keys: "d$", description: "Delete to end of line" },
      { keys: "yy", description: "Yank (copy) line" },
      { keys: "yw", description: "Yank word" },
      { keys: "p", description: "Paste after cursor" },
      { keys: "P", description: "Paste before cursor" },
      { keys: "u", description: "Undo" },
      { keys: "Ctrl+r", description: "Redo" },
      { keys: "r{char}", description: "Replace character under cursor" },
      { keys: "cc", description: "Change (replace) line" },
      { keys: "cw", description: "Change word" },
      { keys: ".", description: "Repeat last change" },
    ],
  },
  {
    title: "Search & replace",
    entries: [
      { keys: "/pattern", description: "Search forward" },
      { keys: "?pattern", description: "Search backward" },
      { keys: "n", description: "Repeat search in same direction" },
      { keys: "N", description: "Repeat search in opposite direction" },
      { keys: ":%s/old/new/g", description: "Replace all occurrences in file" },
      { keys: ":%s/old/new/gc", description: "Replace all, with confirmation" },
      { keys: "*", description: "Search word under cursor forward" },
    ],
  },
  {
    title: "Files & windows",
    entries: [
      { keys: ":w", description: "Save" },
      { keys: ":q", description: "Quit" },
      { keys: ":wq", description: "Save and quit" },
      { keys: ":q!", description: "Quit without saving" },
      { keys: ":e filename", description: "Open a file" },
      { keys: ":sp filename", description: "Split window horizontally" },
      { keys: ":vsp filename", description: "Split window vertically" },
      { keys: "Ctrl+w w", description: "Switch between windows" },
    ],
  },
];

export default function VimCheatsheet() {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((group) => ({
      ...group,
      entries: group.entries.filter(
        (e) =>
          e.keys.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q),
      ),
    })).filter((group) => group.entries.length > 0);
  }, [query]);

  return (
    <div className="flex flex-col gap-5">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter commands…"
        spellCheck={false}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
      />

      {filteredGroups.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No commands match "{query}".
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {group.title}
              </h3>
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                {group.entries.map((entry, i) => (
                  <div
                    key={entry.keys}
                    className={[
                      "flex items-center justify-between gap-4 px-3 py-2.5",
                      i > 0 ? "border-t border-slate-100 dark:border-slate-800" : "",
                      "bg-white dark:bg-slate-900",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <code className="shrink-0 rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {entry.keys}
                      </code>
                      <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                        {entry.description}
                      </span>
                    </div>
                    <CopyButton text={entry.keys} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
