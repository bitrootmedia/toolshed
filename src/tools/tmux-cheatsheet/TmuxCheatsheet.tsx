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

const PREFIX = "Ctrl+b";

const GROUPS: CheatGroup[] = [
  {
    title: "Sessions",
    entries: [
      { keys: "tmux new -s name", description: "Start a new named session" },
      { keys: "tmux ls", description: "List sessions" },
      { keys: "tmux attach -t name", description: "Attach to a session" },
      { keys: "tmux kill-session -t name", description: "Kill a session" },
      { keys: `${PREFIX} d`, description: "Detach from the current session" },
      { keys: `${PREFIX} $`, description: "Rename the current session" },
      { keys: `${PREFIX} s`, description: "List and switch sessions" },
    ],
  },
  {
    title: "Windows",
    entries: [
      { keys: `${PREFIX} c`, description: "Create a new window" },
      { keys: `${PREFIX} ,`, description: "Rename the current window" },
      { keys: `${PREFIX} &`, description: "Kill the current window" },
      { keys: `${PREFIX} w`, description: "List windows" },
      { keys: `${PREFIX} n`, description: "Next window" },
      { keys: `${PREFIX} p`, description: "Previous window" },
      { keys: `${PREFIX} 0-9`, description: "Switch to window by number" },
    ],
  },
  {
    title: "Panes",
    entries: [
      { keys: `${PREFIX} %`, description: "Split pane vertically" },
      { keys: `${PREFIX} "`, description: "Split pane horizontally" },
      { keys: `${PREFIX} o`, description: "Switch to next pane" },
      { keys: `${PREFIX} ;`, description: "Toggle last active pane" },
      { keys: `${PREFIX} arrow key`, description: "Move to pane in direction" },
      { keys: `${PREFIX} x`, description: "Kill the current pane" },
      { keys: `${PREFIX} z`, description: "Toggle pane zoom (fullscreen)" },
      { keys: `${PREFIX} {`, description: "Swap pane with previous" },
      { keys: `${PREFIX} }`, description: "Swap pane with next" },
      { keys: `${PREFIX} q`, description: "Show pane numbers" },
      { keys: `${PREFIX} space`, description: "Cycle pane layouts" },
    ],
  },
  {
    title: "Copy mode",
    entries: [
      { keys: `${PREFIX} [`, description: "Enter copy mode" },
      { keys: "q", description: "Quit copy mode" },
      { keys: "Space", description: "Start selection (in copy mode)" },
      { keys: "Enter", description: "Copy selection (in copy mode)" },
      { keys: `${PREFIX} ]`, description: "Paste copied text" },
    ],
  },
  {
    title: "Misc",
    entries: [
      { keys: `${PREFIX} ?`, description: "List all key bindings" },
      { keys: `${PREFIX} :`, description: "Enter command prompt" },
      { keys: `${PREFIX} t`, description: "Show clock" },
      { keys: "tmux kill-server", description: "Kill the tmux server and all sessions" },
    ],
  },
];

export default function TmuxCheatsheet() {
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
