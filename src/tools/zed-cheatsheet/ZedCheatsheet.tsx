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
    title: "Find in file",
    entries: [
      { keys: "Cmd+F", description: "Open the search bar for the current file" },
      { keys: "Cmd+E", description: "Use the current selection as the search query" },
      { keys: "Cmd+Alt+L", description: "Search only inside the current selection" },
      { keys: "Enter / Shift+Enter", description: "Next / previous match (while in the search bar)" },
      { keys: "Cmd+G / Cmd+Shift+G", description: "Next / previous match" },
      { keys: "Alt+Enter", description: "Select all matches — turns them into multiple cursors" },
      { keys: "Up / Down", description: "Cycle through previous search queries" },
      { keys: "Tab", description: "Jump from the search bar back into the editor" },
      { keys: "Esc", description: "Close the search bar" },
    ],
  },
  {
    title: "Search options (in any search bar)",
    entries: [
      { keys: "Cmd+Alt+C", description: "Toggle case-sensitive" },
      { keys: "Cmd+Alt+W", description: "Toggle whole word" },
      { keys: "Cmd+Alt+X", description: "Toggle regex" },
      { keys: "Cmd+Shift+H", description: "Toggle the replace field" },
      { keys: "Enter (in replace field)", description: "Replace the current match and move to the next" },
      { keys: "Cmd+Enter (in replace field)", description: "Replace all matches" },
    ],
  },
  {
    title: "Find in project",
    entries: [
      { keys: "Cmd+Shift+F", description: "Project-wide search, results shown as an editable multibuffer" },
      { keys: "Cmd+Shift+H", description: "Project-wide search and replace" },
      { keys: "Cmd+Alt+F", description: "Text Finder: quick find-in-files popup with a preview" },
      { keys: "Cmd+Shift+J", description: "Show include / exclude path filters (e.g. src/**/*.ts)" },
      { keys: "Cmd+Enter", description: "Run the search in a new tab, keeping the current results" },
      { keys: "Cmd+Shift+Enter", description: "Expand / collapse all result excerpts" },
      { keys: "Esc", description: "Toggle focus between the query and the results" },
    ],
  },
  {
    title: "Go to file, symbol, line",
    entries: [
      { keys: "Cmd+P", description: "Go to file (fuzzy file finder)" },
      { keys: "Cmd+Shift+P", description: "Command palette — every action, searchable" },
      { keys: "Cmd+Shift+O", description: "Go to symbol in the current file (outline)" },
      { keys: "Cmd+T", description: "Go to symbol anywhere in the project" },
      { keys: "Ctrl+G", description: "Go to line (line:column works too)" },
      { keys: "Ctrl+Tab", description: "Switch between open tabs" },
      { keys: "Alt+Cmd+O", description: "Open a recent project" },
    ],
  },
  {
    title: "Code navigation",
    entries: [
      { keys: "F12 / Cmd+click", description: "Go to definition" },
      { keys: "Alt+F12", description: "Go to definition in a split" },
      { keys: "Cmd+F12", description: "Go to type definition" },
      { keys: "Shift+F12", description: "Go to implementation" },
      { keys: "Alt+Shift+F12", description: "Find all references" },
      { keys: "Ctrl+- / Ctrl+Shift+-", description: "Navigate back / forward" },
      { keys: "F8 / Shift+F8", description: "Next / previous diagnostic" },
      { keys: "Cmd+Shift+M", description: "Project diagnostics (all errors and warnings)" },
    ],
  },
  {
    title: "Multi-cursor & selection",
    entries: [
      { keys: "Cmd+D", description: "Add the next occurrence of the selection" },
      { keys: "Cmd+K Cmd+D", description: "Skip this occurrence and move to the next" },
      { keys: "Cmd+Shift+L", description: "Select all occurrences" },
      { keys: "Cmd+U", description: "Undo the last selection change" },
      { keys: "Alt+click", description: "Add a cursor" },
      { keys: "Cmd+Alt+Up / Down", description: "Add a cursor above / below" },
      { keys: "Ctrl+Shift+Right / Left", description: "Expand / shrink selection by syntax node" },
      { keys: "Cmd+L", description: "Select the line" },
    ],
  },
  {
    title: "Editing",
    entries: [
      { keys: "Cmd+/", description: "Toggle line comment" },
      { keys: "Alt+Up / Down", description: "Move line up / down" },
      { keys: "Alt+Shift+Up / Down", description: "Duplicate line up / down" },
      { keys: "Cmd+Shift+K", description: "Delete line" },
      { keys: "Cmd+Enter / Cmd+Shift+Enter", description: "Insert line below / above" },
      { keys: "Cmd+] / Cmd+[", description: "Indent / outdent" },
      { keys: "F2", description: "Rename symbol" },
      { keys: "Cmd+.", description: "Code actions (quick fixes)" },
      { keys: "Cmd+Shift+I", description: "Format the file" },
      { keys: "Ctrl+Space", description: "Show completions" },
      { keys: "Alt+Cmd+[ / Alt+Cmd+]", description: "Fold / unfold" },
      { keys: "Cmd+K Cmd+0 / Cmd+K Cmd+J", description: "Fold all / unfold all" },
    ],
  },
  {
    title: "Panes, panels & tabs",
    entries: [
      { keys: "Cmd+\\", description: "Split the pane to the right" },
      { keys: "Cmd+1-9", description: "Focus pane by number" },
      { keys: "Cmd+{ / Cmd+}", description: "Previous / next tab" },
      { keys: "Cmd+W", description: "Close tab" },
      { keys: "Cmd+Shift+T", description: "Reopen closed tab" },
      { keys: "Shift+Esc", description: "Zoom the focused pane or panel" },
      { keys: "Cmd+B / Cmd+R / Cmd+J", description: "Toggle left / right / bottom dock" },
      { keys: "Cmd+Shift+E", description: "Project panel (file tree)" },
      { keys: "Ctrl+Shift+G", description: "Git panel" },
      { keys: "Ctrl+`", description: "Toggle the terminal" },
      { keys: "Cmd+?", description: "Agent panel" },
    ],
  },
  {
    title: "Settings",
    entries: [
      { keys: "Cmd+,", description: "Open settings" },
      { keys: "Cmd+K Cmd+S", description: "Open the keymap editor" },
      { keys: "Cmd+K M", description: "Change the language mode of the file" },
      { keys: "Cmd+Shift+X", description: "Extensions" },
      { keys: "Cmd+= / Cmd+- / Cmd+0", description: "Increase / decrease / reset font size" },
    ],
  },
];

export default function ZedCheatsheet() {
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

      <p className="-mt-2 text-xs text-slate-400 dark:text-slate-500">
        Default macOS keymap. On Linux and Windows, read Cmd as Ctrl.
      </p>

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
