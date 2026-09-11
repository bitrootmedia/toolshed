import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { CopyButton } from "../../components/CopyButton";

interface TuiEntry {
  name: string;
  command: string;
  language: string;
  url: string;
  description: string;
  keywords: string;
}

interface TuiGroup {
  title: string;
  entries: TuiEntry[];
}

const GROUPS: TuiGroup[] = [
  {
    title: "System monitors",
    entries: [
      {
        name: "htop",
        command: "htop",
        language: "C",
        url: "https://htop.dev",
        description:
          "Interactive process viewer with a colour meter per CPU core; search, sort, kill and renice without leaving the list.",
        keywords: "process cpu memory ncurses top",
      },
      {
        name: "btop",
        command: "btop",
        language: "C++",
        url: "https://github.com/aristocratos/btop",
        description:
          "The most decorated resource monitor going: braille-plotted CPU and network graphs, a process tree, full mouse support and swappable themes.",
        keywords: "process gpu disk graphs bpytop bashtop",
      },
      {
        name: "bottom",
        command: "btm",
        language: "Rust",
        url: "https://github.com/ClementTsang/bottom",
        description:
          "Cross-platform monitor laid out as a resizable widget grid — expand any chart to full screen, filter processes by regex, tree view on t.",
        keywords: "btm process temperature battery widgets",
      },
      {
        name: "glances",
        command: "glances",
        language: "Python",
        url: "https://github.com/nicolargo/glances",
        description:
          "One screen for CPU, disks, sensors, containers and alerts; also runs client/server or exposes the same data over a REST API.",
        keywords: "remote web api sensors containers",
      },
      {
        name: "nvtop",
        command: "nvtop",
        language: "C",
        url: "https://github.com/Syllo/nvtop",
        description:
          "htop for GPUs — per-process VRAM and utilisation across NVIDIA, AMD and Intel adapters on one timeline.",
        keywords: "gpu cuda vram nvidia amd machine learning",
      },
      {
        name: "s-tui",
        command: "s-tui",
        language: "Python",
        url: "https://github.com/amanusk/s-tui",
        description:
          "Stress the CPU on demand and watch frequency, temperature, power draw and thermal throttling react in real time.",
        keywords: "stress test thermal benchmark power",
      },
      {
        name: "zenith",
        command: "zenith",
        language: "Rust",
        url: "https://github.com/bvaisvil/zenith",
        description:
          "Process table backed by zoomable historical charts, so you can scroll back through the last few hours of CPU, disk and network.",
        keywords: "history charts gpu process",
      },
      {
        name: "atop",
        command: "atop -r",
        language: "C",
        url: "https://www.atoptool.nl",
        description:
          "Logs full system and per-process resource use to disk on an interval, which makes it the only one of these you can point at yesterday's load spike.",
        keywords: "logging forensics postmortem history",
      },
    ],
  },
  {
    title: "Files & disk",
    entries: [
      {
        name: "superfile",
        command: "spf",
        language: "Go",
        url: "https://superfile.dev",
        description:
          "Modern file manager with multiple panels and tabs, fuzzy search, a metadata sidebar, image previews and a trash can it actually manages for you.",
        keywords: "spf bubbletea panels preview trash",
      },
      {
        name: "yazi",
        command: "yazi",
        language: "Rust",
        url: "https://yazi-rs.github.io",
        description:
          "Fully asynchronous manager with in-terminal image, video and PDF previews, Lua plugins and a proper visual selection mode.",
        keywords: "preview async plugins images lua",
      },
      {
        name: "ranger",
        command: "ranger",
        language: "Python",
        url: "https://github.com/ranger/ranger",
        description:
          "The Miller-column classic: vi keys, three panes and a preview script that will happily render almost any file type.",
        keywords: "miller columns vim rifle scope preview",
      },
      {
        name: "nnn",
        command: "nnn",
        language: "C",
        url: "https://github.com/jarun/nnn",
        description:
          "Under a megabyte, instant on anything, and extended by a plugin library covering previews, batch rename and cloud mounts.",
        keywords: "lightweight minimal fast plugins",
      },
      {
        name: "lf",
        command: "lf",
        language: "Go",
        url: "https://github.com/gokcehan/lf",
        description:
          "Ranger's ideas as a single static binary — server/client architecture and commands defined in plain shell, no Python runtime.",
        keywords: "ranger clone static binary shell",
      },
      {
        name: "broot",
        command: "br",
        language: "Rust",
        url: "https://dystroy.org/broot",
        description:
          "Navigates by fuzzy-filtering an entire directory tree at once, then hands the chosen path straight back to your shell.",
        keywords: "tree fuzzy navigate size cd",
      },
      {
        name: "vifm",
        command: "vifm",
        language: "C",
        url: "https://vifm.info",
        description:
          "Two-pane commander driven entirely by vi motions, with its own : command line and per-filetype associations.",
        keywords: "vi dual pane commander midnight",
      },
      {
        name: "ncdu",
        command: "ncdu /",
        language: "C / Zig",
        url: "https://dev.yorhel.nl/ncdu",
        description:
          "Scan a filesystem once, then walk the results sorted by size and delete the offenders in place. The default answer to a full disk.",
        keywords: "disk usage space cleanup du",
      },
      {
        name: "gdu",
        command: "gdu",
        language: "Go",
        url: "https://github.com/dundee/gdu",
        description:
          "Disk usage analyser built for SSDs — parallel scanning gets through very large trees in seconds.",
        keywords: "disk usage fast parallel ssd",
      },
      {
        name: "dua",
        command: "dua i",
        language: "Rust",
        url: "https://github.com/Byron/dua-cli",
        description:
          "Interactive disk usage with a mark-then-delete workflow and a running total of everything you have queued up.",
        keywords: "disk usage delete space dua-cli",
      },
    ],
  },
  {
    title: "Git",
    entries: [
      {
        name: "lazygit",
        command: "lazygit",
        language: "Go",
        url: "https://github.com/jesseduffield/lazygit",
        description:
          "Stage individual lines, rebase interactively, cherry-pick, bisect and resolve conflicts — each one a single keystroke away.",
        keywords: "stage rebase commit diff conflicts",
      },
      {
        name: "gitui",
        command: "gitui",
        language: "Rust",
        url: "https://github.com/extrawurst/gitui",
        description:
          "Fast enough for enormous repositories: async diffs and blame, stash management and inline hunk staging.",
        keywords: "fast async blame stash ratatui",
      },
      {
        name: "tig",
        command: "tig",
        language: "C",
        url: "https://jonas.github.io/tig",
        description:
          "A pager for git history — browse log, diff, blame and the staging area, with the underlying command always one key away.",
        keywords: "log history pager blame ncurses",
      },
      {
        name: "gh-dash",
        command: "gh dash",
        language: "Go",
        url: "https://github.com/dlvhdr/gh-dash",
        description:
          "GitHub CLI extension that turns your pull requests and issues into a configurable review dashboard with custom search sections.",
        keywords: "github pull requests issues review dashboard",
      },
    ],
  },
  {
    title: "Editors",
    entries: [
      {
        name: "helix",
        command: "hx",
        language: "Rust",
        url: "https://helix-editor.com",
        description:
          "Modal editor built selection-first, with tree-sitter highlighting and an LSP client in the box — no plugin config to write.",
        keywords: "modal lsp tree-sitter kakoune vim",
      },
      {
        name: "neovim",
        command: "nvim",
        language: "C / Lua",
        url: "https://neovim.io",
        description:
          "Vim rebuilt around Lua, an embedded terminal and a native LSP client; the substrate under most terminal IDE setups.",
        keywords: "vim lua plugins ide lsp",
      },
      {
        name: "micro",
        command: "micro",
        language: "Go",
        url: "https://micro-editor.github.io",
        description:
          "Ctrl-S saves, Ctrl-C copies, the mouse works. A modern editor for the times you do not want modes.",
        keywords: "nano replacement simple mouse",
      },
      {
        name: "kakoune",
        command: "kak",
        language: "C++",
        url: "https://kakoune.org",
        description:
          "Treats multiple selections as the primary editing primitive and previews every keystroke on all cursors at once.",
        keywords: "modal multiple selections vim kak",
      },
    ],
  },
  {
    title: "Containers",
    entries: [
      {
        name: "k9s",
        command: "k9s",
        language: "Go",
        url: "https://k9scli.io",
        description:
          "Live view of a Kubernetes cluster: pods and logs, port-forwards, shell-into-container, resource edits and RBAC checks.",
        keywords: "kubernetes cluster pods logs devops kubectl",
      },
      {
        name: "lazydocker",
        command: "lazydocker",
        language: "Go",
        url: "https://github.com/jesseduffield/lazydocker",
        description:
          "Containers, images, volumes and compose stacks on one screen, with logs, live stats and restarts under the cursor.",
        keywords: "docker compose logs stats volumes",
      },
      {
        name: "ctop",
        command: "ctop",
        language: "Go",
        url: "https://github.com/bcicen/ctop",
        description:
          "top-like view of container CPU, memory, network and I/O, with a single-container drill-down for the noisy one.",
        keywords: "docker metrics containers top",
      },
      {
        name: "dive",
        command: "dive image",
        language: "Go",
        url: "https://github.com/wagoodman/dive",
        description:
          "Explore a container image layer by layer and see exactly which files each build instruction added, changed or wasted.",
        keywords: "docker image layers size optimise dockerfile",
      },
    ],
  },
  {
    title: "Network",
    entries: [
      {
        name: "bandwhich",
        command: "bandwhich",
        language: "Rust",
        url: "https://github.com/imsnif/bandwhich",
        description:
          "Answers “what is eating my bandwidth” by attributing live traffic to processes, connections and remote hostnames.",
        keywords: "bandwidth traffic per process connections",
      },
      {
        name: "gping",
        command: "gping host",
        language: "Rust",
        url: "https://github.com/orf/gping",
        description:
          "ping, but plotted — compare latency to several hosts on one live graph, or graph the runtime of any command.",
        keywords: "latency ping graph plot",
      },
      {
        name: "trippy",
        command: "trip host",
        language: "Rust",
        url: "https://trippy.rs",
        description:
          "traceroute and ping combined into one diagnostic: per-hop loss, jitter histograms, DNS and AS lookups as the route shifts.",
        keywords: "traceroute mtr latency hops dns",
      },
      {
        name: "termshark",
        command: "termshark -r capture.pcap",
        language: "Go",
        url: "https://github.com/gcla/termshark",
        description:
          "Wireshark's capture filters, packet list and detail panes — over SSH, on a box with no display.",
        keywords: "wireshark pcap packets tshark capture",
      },
      {
        name: "iftop",
        command: "iftop",
        language: "C",
        url: "https://pdw.ex-parrot.com/iftop",
        description:
          "Bandwidth per connection pair, sorted live. Still the quickest way to find the host saturating a link.",
        keywords: "bandwidth connections sniff interface",
      },
    ],
  },
  {
    title: "Data & logs",
    entries: [
      {
        name: "lnav",
        command: "lnav /var/log",
        language: "C++",
        url: "https://lnav.org",
        description:
          "Merges many log files onto one timeline, auto-detects their formats, highlights errors and lets you query the result in SQL.",
        keywords: "logs syslog sql timeline journal",
      },
      {
        name: "visidata",
        command: "vd data.csv",
        language: "Python",
        url: "https://visidata.org",
        description:
          "A spreadsheet for the terminal: opens CSV, JSON, sqlite, xlsx, parquet and more, with frequency tables, pivots and plots on single keys.",
        keywords: "csv spreadsheet tabular explore pivot xlsx",
      },
      {
        name: "jless",
        command: "jless data.json",
        language: "Rust",
        url: "https://jless.io",
        description:
          "Pager for JSON — fold, search and jq-query documents far too large to read as text.",
        keywords: "json yaml viewer jq pager",
      },
      {
        name: "fx",
        command: "fx data.json",
        language: "JavaScript",
        url: "https://fx.wtf",
        description:
          "Interactive JSON viewer that uses JavaScript expressions as its query language, with a streaming mode for huge files.",
        keywords: "json viewer query stream",
      },
    ],
  },
  {
    title: "Databases",
    entries: [
      {
        name: "harlequin",
        command: "harlequin",
        language: "Python",
        url: "https://harlequin.sh",
        description:
          "A SQL IDE for the terminal: data catalog sidebar, multi-tab query editor and result grid, with DuckDB, Postgres and SQLite adapters.",
        keywords: "sql duckdb postgres sqlite textual ide",
      },
      {
        name: "pgcli",
        command: "pgcli",
        language: "Python",
        url: "https://www.pgcli.com",
        description:
          "psql with autocompletion, syntax highlighting and a readable result pager. mycli and litecli are the same idea elsewhere.",
        keywords: "postgres mysql sqlite repl autocomplete psql",
      },
      {
        name: "lazysql",
        command: "lazysql",
        language: "Go",
        url: "https://github.com/jorgerojas26/lazysql",
        description:
          "Vim-keyed database client for MySQL, Postgres and SQLite with tabs, saved connections and inline row editing.",
        keywords: "mysql postgres sqlite vim client",
      },
    ],
  },
  {
    title: "Music & media",
    entries: [
      {
        name: "ncmpcpp",
        command: "ncmpcpp",
        language: "C++",
        url: "https://github.com/ncmpcpp/ncmpcpp",
        description:
          "The MPD client of record: playlist editing, a tag editor, library browser and a full-screen spectrum visualiser.",
        keywords: "mpd music player playlist tags",
      },
      {
        name: "spotify-player",
        command: "spotify_player",
        language: "Rust",
        url: "https://github.com/aome510/spotify-player",
        description:
          "A complete Spotify client — playback control, search, playlists, lyrics and album art rendered in the terminal.",
        keywords: "spotify music streaming lyrics album art",
      },
      {
        name: "musikcube",
        command: "musikcube",
        language: "C++",
        url: "https://musikcube.com",
        description:
          "Local library player that doubles as a streaming server for its own mobile clients, with gapless playback and a replay-gain aware mixer.",
        keywords: "music library server player gapless",
      },
      {
        name: "cava",
        command: "cava",
        language: "C",
        url: "https://github.com/karlstav/cava",
        description:
          "Console audio visualiser that reacts to whatever the system is currently playing. Purely decorative, entirely justified.",
        keywords: "visualiser audio bars spectrum",
      },
    ],
  },
  {
    title: "Mail & chat",
    entries: [
      {
        name: "aerc",
        command: "aerc",
        language: "Go",
        url: "https://aerc-mail.org",
        description:
          "Email built for patch review: asynchronous IMAP, an embedded terminal for running git commands against a message, tabs per account.",
        keywords: "email imap mutt patches git smtp",
      },
      {
        name: "neomutt",
        command: "neomutt",
        language: "C",
        url: "https://neomutt.org",
        description:
          "Mutt with the good patches applied — notmuch search, a mailbox sidebar, and a binding for every key you own.",
        keywords: "email mutt imap notmuch sidebar",
      },
      {
        name: "weechat",
        command: "weechat",
        language: "C",
        url: "https://weechat.org",
        description:
          "Extensible chat client reaching IRC, Matrix and Slack through plugins, scriptable in six languages and happy to run in tmux for years.",
        keywords: "irc chat matrix slack bouncer",
      },
    ],
  },
  {
    title: "Shell & workspace",
    entries: [
      {
        name: "zellij",
        command: "zellij",
        language: "Rust",
        url: "https://zellij.dev",
        description:
          "Terminal workspace with discoverable keybinds along the bottom, saved layouts, floating panes and WebAssembly plugins.",
        keywords: "multiplexer tmux panes layouts wasm",
      },
      {
        name: "tmux",
        command: "tmux",
        language: "C",
        url: "https://github.com/tmux/tmux",
        description:
          "The multiplexer every other tool assumes you have: detachable sessions, splits, and a scriptable control mode.",
        keywords: "multiplexer sessions splits screen detach",
      },
      {
        name: "fzf",
        command: "fzf",
        language: "Go",
        url: "https://github.com/junegunn/fzf",
        description:
          "Turns any list on stdin into an interactive fuzzy picker, with preview windows and shell keybindings that rewire how you use history.",
        keywords: "fuzzy finder picker preview ctrl-r history",
      },
      {
        name: "atac",
        command: "atac",
        language: "Rust",
        url: "https://github.com/Julien-cpsn/ATAC",
        description:
          "Postman-shaped API client that keeps its collections as plain files, so requests live in the repo alongside the code they hit.",
        keywords: "http api rest postman insomnia requests",
      },
      {
        name: "slumber",
        command: "slumber",
        language: "Rust",
        url: "https://slumber.lucaspickering.me",
        description:
          "HTTP client driven by a YAML collection, with chained values so one request can feed a token to the next.",
        keywords: "http api rest yaml requests chain",
      },
    ],
  },
  {
    title: "Notes & tasks",
    entries: [
      {
        name: "taskwarrior-tui",
        command: "taskwarrior-tui",
        language: "Rust",
        url: "https://github.com/kdheepak/taskwarrior-tui",
        description:
          "Front end for Taskwarrior with live filtering, context switching, a calendar view and vim-style multi-select.",
        keywords: "todo tasks taskwarrior gtd calendar",
      },
      {
        name: "dooit",
        command: "dooit",
        language: "Python",
        url: "https://github.com/dooit-org/dooit",
        description:
          "Todo manager with nested workspaces, due dates, urgency levels and vim-ish navigation, configured in Python.",
        keywords: "todo tasks textual notes workspaces",
      },
      {
        name: "calcure",
        command: "calcure",
        language: "Python",
        url: "https://github.com/anufrievroman/calcure",
        description:
          "Calendar and task manager that reads existing ics files and Taskwarrior data, with weather and a journal view.",
        keywords: "calendar ics events todo journal",
      },
    ],
  },
  {
    title: "Toys",
    entries: [
      {
        name: "cmatrix",
        command: "cmatrix",
        language: "C",
        url: "https://github.com/abishekvashok/cmatrix",
        description:
          "Falling green glyphs. Yes, that one. Still ships in every distro's repos.",
        keywords: "screensaver matrix green animation",
      },
      {
        name: "pipes.sh",
        command: "pipes.sh",
        language: "Shell",
        url: "https://github.com/pipeseroni/pipes.sh",
        description:
          "Animated pipes screensaver written in pure shell — one of the great single-file hacks.",
        keywords: "screensaver animation shell pipes",
      },
      {
        name: "asciiquarium",
        command: "asciiquarium",
        language: "Perl",
        url: "https://robobunny.com/projects/asciiquarium",
        description:
          "An aquarium. Fish, seaweed, a whale, and the occasional shark taking a swimmer.",
        keywords: "screensaver ascii art fish aquarium",
      },
    ],
  },
  {
    title: "Build your own",
    entries: [
      {
        name: "ratatui",
        command: "cargo add ratatui",
        language: "Rust",
        url: "https://ratatui.rs",
        description:
          "The immediate-mode Rust library under gitui, bottom and trippy: widgets, a constraint layout solver and pluggable backends.",
        keywords: "library rust tui-rs widgets framework",
      },
      {
        name: "bubbletea",
        command: "go get github.com/charmbracelet/bubbletea",
        language: "Go",
        url: "https://github.com/charmbracelet/bubbletea",
        description:
          "Elm-architecture framework from Charm behind a generation of Go tools, paired with Lip Gloss for styling and Bubbles for widgets.",
        keywords: "library go charm lipgloss elm framework",
      },
      {
        name: "textual",
        command: "pip install textual",
        language: "Python",
        url: "https://textual.textualize.io",
        description:
          "Reactive Python framework with CSS-like styling and async widgets, and the odd trick of serving the same app to a browser.",
        keywords: "library python rich css web framework",
      },
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.entries.length, 0);

const LANGUAGES = Array.from(
  new Set(GROUPS.flatMap((g) => g.entries.flatMap((e) => e.language.split(" / ")))),
).sort((a, b) => a.localeCompare(b));

export default function TuiCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const terms = q ? q.split(/\s+/) : [];
    return GROUPS.filter((group) => !category || group.title === category)
      .map((group) => ({
        ...group,
        entries: group.entries.filter((entry) => {
          if (language && !entry.language.split(" / ").includes(language)) {
            return false;
          }
          if (terms.length === 0) return true;
          const haystack = [
            entry.name,
            entry.command,
            entry.description,
            entry.keywords,
            entry.language,
            group.title,
          ]
            .join(" ")
            .toLowerCase();
          return terms.every((term) => haystack.includes(term));
        }),
      }))
      .filter((group) => group.entries.length > 0);
  }, [query, category, language]);

  const shown = filteredGroups.reduce((n, g) => n + g.entries.length, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, description, or keyword…"
            spellCheck={false}
            className="w-full flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Filter by language"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
          >
            <option value="">Any language</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {GROUPS.map((group) => {
            const active = category === group.title;
            return (
              <button
                key={group.title}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(active ? "" : group.title)}
                className={[
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400",
                ].join(" ")}
              >
                {group.title}
                <span className={active ? "ml-1.5 opacity-70" : "ml-1.5 text-slate-400 dark:text-slate-500"}>
                  {group.entries.length}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Showing {shown} of {TOTAL} tools
        </p>
      </div>

      {filteredGroups.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No tools match those filters.
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
                    key={entry.name}
                    className={[
                      "flex flex-col gap-2 bg-white px-3 py-3 sm:flex-row sm:items-start sm:gap-4",
                      i > 0 ? "border-t border-slate-100 dark:border-slate-800" : "",
                      "dark:bg-slate-900",
                    ].join(" ")}
                  >
                    <div className="flex shrink-0 flex-col gap-1 sm:w-56">
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex w-fit items-center gap-1 font-mono text-sm font-semibold text-slate-800 hover:text-indigo-600 hover:underline dark:text-slate-100 dark:hover:text-indigo-400"
                      >
                        {entry.name}
                        <ExternalLink size={12} className="opacity-60" />
                      </a>
                      <code className="w-fit max-w-full overflow-x-auto rounded-md bg-slate-100 px-2 py-1 font-mono text-xs whitespace-nowrap text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {entry.command}
                      </code>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {entry.description}
                      </p>
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                        written in {entry.language}
                      </span>
                    </div>

                    <div className="shrink-0">
                      <CopyButton text={entry.command} />
                    </div>
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
