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
    title: "grep — everyday",
    entries: [
      { keys: "grep -n pattern file", description: "Match with line numbers" },
      { keys: "grep -i pattern file", description: "Case-insensitive match" },
      { keys: "grep -w pattern file", description: "Match whole words only" },
      { keys: "grep -x pattern file", description: "Match the whole line only" },
      { keys: "grep -v pattern file", description: "Invert: lines that do not match" },
      { keys: "grep -c pattern file", description: "Count matching lines" },
      { keys: "grep -o pattern file", description: "Print only the matched part" },
      { keys: "grep -F 'literal' file", description: "Fixed string, no regex (fastest)" },
      { keys: "grep -E 'foo|bar' file", description: "Extended regex: alternation, +, ?, {n}" },
      { keys: "grep -P '\\d{3}' file", description: "Perl regex: lookaround, \\d, \\b (GNU grep)" },
      { keys: "grep -e p1 -e p2 file", description: "Search several patterns at once" },
      { keys: "grep -f patterns.txt file", description: "Read patterns from a file, one per line" },
    ],
  },
  {
    title: "grep — files, context, recursion",
    entries: [
      { keys: "grep -rn pattern .", description: "Recursive search with line numbers" },
      { keys: "grep -rl pattern .", description: "List only the files that match" },
      { keys: "grep -rL pattern .", description: "List only the files that do not match" },
      { keys: "grep -C 3 pattern file", description: "3 lines of context around each match" },
      { keys: "grep -A 3 pattern file", description: "3 lines after each match" },
      { keys: "grep -B 3 pattern file", description: "3 lines before each match" },
      { keys: "grep -rn --include='*.py' pattern .", description: "Restrict recursion to a glob" },
      { keys: "grep -rn --exclude-dir={.git,node_modules} pattern .", description: "Skip noisy directories" },
      { keys: "grep -h pattern *.log", description: "Suppress file name prefixes (-H forces them)" },
      { keys: "grep -I pattern .", description: "Skip binary files entirely" },
      { keys: "grep -a pattern file", description: "Treat a binary file as text" },
    ],
  },
  {
    title: "Big files — grep tactics",
    entries: [
      { keys: "LC_ALL=C grep -F 'str' huge.log", description: "Byte-wise matching, no UTF-8 decoding — often several times faster" },
      { keys: "grep -m 1 -n 'str' huge.log", description: "Stop after the first match instead of scanning to EOF" },
      { keys: "grep -q 'str' huge.log && echo found", description: "Exit status only; quits at the first hit" },
      { keys: "grep -m 20 'str' huge.log", description: "Cap output instead of piping to head (which keeps grep running)" },
      { keys: "tail -f app.log | grep --line-buffered ERROR", description: "Live filter a growing log without buffering delays" },
      { keys: "sed -n '5000,5100p;5101q' huge.log", description: "Print a line range and quit — never reads the rest" },
      { keys: "zgrep pattern file.gz", description: "Search a compressed file without unpacking it to disk" },
      { keys: "parallel --pipepart -a huge.log --block 100M grep -c pattern", description: "Split one huge file across cores (GNU parallel)" },
      { keys: "grep -c '' huge.log", description: "Count lines the same way grep sees them" },
    ],
  },
  {
    title: "ripgrep (rg) — everyday",
    entries: [
      { keys: "rg pattern", description: "Recursive from cwd; honours .gitignore, skips hidden and binary files" },
      { keys: "rg pattern path/", description: "Search a specific file or directory" },
      { keys: "rg -i pattern", description: "Case-insensitive (-S smart case, -s force sensitive)" },
      { keys: "rg -w pattern", description: "Whole words only (-x whole line)" },
      { keys: "rg -F 'literal'", description: "Fixed string, no regex" },
      { keys: "rg -l pattern", description: "List matching files (--files-without-match for the inverse)" },
      { keys: "rg -c pattern", description: "Count matching lines (--count-matches counts every match)" },
      { keys: "rg -C 3 pattern", description: "Context lines (-A / -B for one side)" },
      { keys: "rg -g '*.ts' pattern", description: "Include by glob (-g '!node_modules' to exclude)" },
      { keys: "rg -t py pattern", description: "Search one file type (-T js excludes; --type-list shows all)" },
      { keys: "rg --files | rg name", description: "Find files by name instead of content" },
      { keys: "rg -o -r '$1' 'id=(\\d+)'", description: "Print only capture group 1 of each match" },
      { keys: "rg -P '(?<=foo)bar'", description: "PCRE2 mode: lookaround and backreferences" },
      { keys: "rg -U 'foo\\nbar'", description: "Multiline match (--multiline-dotall lets . cross lines)" },
      { keys: "rg -u / -uu / -uuu pattern", description: "Relax: ignore .gitignore, then include hidden, then binary" },
    ],
  },
  {
    title: "Big files — ripgrep tactics",
    entries: [
      { keys: "rg -m 5 pattern huge.log", description: "Stop after 5 matches per file" },
      { keys: "rg -M 200 pattern huge.log", description: "Truncate long lines — essential for minified or one-line JSON" },
      { keys: "rg -j 8 pattern logs/", description: "Pin the thread count when searching many files" },
      { keys: "rg --max-filesize 50M pattern", description: "Skip anything bigger than the limit" },
      { keys: "rg -z pattern logs/", description: "Transparently search .gz, .bz2, .xz, .zst archives" },
      { keys: "rg --no-mmap pattern huge.log", description: "Read instead of mmap (network mounts, files being written)" },
      { keys: "rg --stats pattern", description: "Report files searched, matches, and elapsed time" },
      { keys: "rg --sort path pattern", description: "Deterministic order — forces single-threaded search" },
      { keys: "rg --pre pdftotext pattern docs/", description: "Pipe each file through a preprocessor first" },
      { keys: "rg --line-buffered pattern | head", description: "Flush per line when piping into another tool" },
    ],
  },
  {
    title: "ack — source trees",
    entries: [
      { keys: "ack pattern", description: "Recursive from cwd; skips VCS dirs, binaries, and backups" },
      { keys: "ack -i pattern", description: "Case-insensitive (-S smart case; note -I means case-SENSITIVE here)" },
      { keys: "ack -w pattern", description: "Whole words only" },
      { keys: "ack -Q 'a.b[c]'", description: "Literal string — quote all regex metacharacters" },
      { keys: "ack -v pattern", description: "Invert: lines that do not match" },
      { keys: "ack -l pattern", description: "List matching files (-L for non-matching, -c to count)" },
      { keys: "ack -C 3 pattern", description: "Context lines (-A / -B for one side)" },
      { keys: "ack -t python pattern", description: "Only that file type (--type=nojs excludes one)" },
      { keys: "ack --help-types", description: "Show every known file type and its extensions" },
      { keys: "ack -f", description: "List the files ack would search — no pattern needed" },
      { keys: "ack -g pattern", description: "Match against file names rather than contents" },
      { keys: "ack --ignore-dir=node_modules pattern", description: "Add a directory to the ignore list" },
      { keys: "ack -m 5 pattern", description: "Stop after 5 matches per file" },
      { keys: "ack --noheading --nobreak pattern", description: "Flat grep-style output, easy to pipe" },
    ],
  },
  {
    title: "sift — large inputs",
    entries: [
      { keys: "sift pattern", description: "Recursive from cwd; Go-based, streams well over very large files" },
      { keys: "sift -n pattern file", description: "Show line numbers (--column adds column numbers)" },
      { keys: "sift -i pattern", description: "Case-insensitive (-s smart case)" },
      { keys: "sift -w pattern", description: "Whole words only (-Q for a literal pattern)" },
      { keys: "sift -l pattern", description: "List matching files (-L non-matching, -c count)" },
      { keys: "sift -C 3 pattern", description: "Context lines (-A / -B for one side)" },
      { keys: "sift --limit=10 pattern huge.log", description: "Show only the first 10 matches per file" },
      { keys: "sift --blocksize=8M pattern huge.log", description: "Tune the read block size for huge files" },
      { keys: "sift --cores=4 pattern logs/", description: "Cap CPU cores used" },
      { keys: "sift -m 'begin(.|\\n)*end' file", description: "Multiline pattern across line boundaries" },
      { keys: "sift --replace='$1' 'id=(\\d+)' file", description: "Rewrite matches using capture groups" },
      { keys: "sift -x go pattern", description: "Limit to an extension (-X excludes one)" },
      { keys: "sift --exclude-dirs='node_modules' pattern", description: "Skip directories by glob" },
      { keys: "sift --git pattern", description: "Respect .gitignore rules" },
      { keys: "sift -z pattern logs/", description: "Search inside gzipped files" },
      { keys: "sift --binary-skip pattern", description: "Skip binary files (-a treats them as text)" },
      { keys: "sift --targets pattern", description: "List the files that would be searched" },
      { keys: "sift --stats pattern", description: "Print search statistics when done" },
    ],
  },
];

export default function SearchCheatsheet() {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((group) => ({
      ...group,
      entries: group.entries.filter(
        (e) =>
          e.keys.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          group.title.toLowerCase().includes(q),
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
                    key={`${group.title}-${i}`}
                    className={[
                      "flex items-center justify-between gap-4 px-3 py-2.5",
                      i > 0 ? "border-t border-slate-100 dark:border-slate-800" : "",
                      "bg-white dark:bg-slate-900",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                      <code className="w-fit rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium break-words text-slate-700 sm:w-auto sm:max-w-[55%] sm:shrink-0 dark:bg-slate-800 dark:text-slate-200">
                        {entry.keys}
                      </code>
                      <span className="min-w-0 text-sm text-slate-600 dark:text-slate-300">
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
