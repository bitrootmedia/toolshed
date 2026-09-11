import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { CopyButton } from "../../components/CopyButton";

type IndentOption = "2" | "4" | "tab" | "min";

const INDENT_OPTIONS: { value: IndentOption; label: string }[] = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tabs" },
  { value: "min", label: "Minify" },
];

function indentFor(option: IndentOption): string | number | undefined {
  if (option === "2") return 2;
  if (option === "4") return 4;
  if (option === "tab") return "\t";
  return undefined;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) {
      sorted[key] = sortKeysDeep(source[key]);
    }
    return sorted;
  }
  return value;
}

interface JsonError {
  message: string;
  line?: number;
  column?: number;
}

interface JsonToken {
  text: string;
  className?: string;
}

const JSON_TOKEN_REGEX =
  /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

function tokenizeJson(json: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  let lastIndex = 0;

  for (const match of json.matchAll(JSON_TOKEN_REGEX)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ text: json.slice(lastIndex, index) });
    }

    const value = match[0];
    let className = "text-amber-600 dark:text-amber-400"; // number
    if (value.startsWith('"')) {
      className = value.endsWith(":")
        ? "text-indigo-600 dark:text-indigo-400 font-medium" // object key
        : "text-emerald-600 dark:text-emerald-400"; // string value
    } else if (value === "true" || value === "false") {
      className = "text-purple-600 dark:text-purple-400";
    } else if (value === "null") {
      className = "text-slate-400 dark:text-slate-500";
    }

    tokens.push({ text: value, className });
    lastIndex = index + value.length;
  }

  if (lastIndex < json.length) {
    tokens.push({ text: json.slice(lastIndex) });
  }

  return tokens;
}

function describeError(input: string, error: unknown): JsonError {
  const message = error instanceof Error ? error.message : String(error);
  const match = message.match(/position (\d+)/);
  if (!match) return { message };

  const position = Number(match[1]);
  let line = 1;
  let lastNewline = -1;
  for (let i = 0; i < position && i < input.length; i++) {
    if (input[i] === "\n") {
      line++;
      lastNewline = i;
    }
  }
  return { message, line, column: position - lastNewline };
}

export default function JsonFormat() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<IndentOption>("2");
  const [sortKeys, setSortKeys] = useState(false);

  const result = useMemo(() => {
    if (input.trim().length === 0) {
      return { output: "", error: null as JsonError | null };
    }
    try {
      let parsed = JSON.parse(input);
      if (sortKeys) parsed = sortKeysDeep(parsed);
      return { output: JSON.stringify(parsed, null, indentFor(indent)), error: null as JsonError | null };
    } catch (error) {
      return { output: "", error: describeError(input, error) };
    }
  }, [input, indent, sortKeys]);

  const hasInput = input.trim().length > 0;
  const isValid = hasInput && result.error === null;
  const tokens = useMemo(() => tokenizeJson(result.output), [result.output]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
            {INDENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIndent(opt.value)}
                className={[
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  indent === opt.value
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400 dark:border-slate-600 dark:bg-slate-800"
            />
            Sort keys
          </label>
        </div>

        {hasInput && (
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              isValid
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
            ].join(" ")}
          >
            {isValid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {isValid ? "Valid JSON" : "Invalid JSON"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'{\n  "hello": "world"\n}'}
            spellCheck={false}
            className={[
              "h-[65vh] min-h-[380px] w-full resize-y rounded-lg border p-3 font-mono text-sm shadow-sm outline-none placeholder:text-slate-400",
              result.error
                ? "border-red-300 bg-red-50/40 text-slate-800 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-red-500/40 dark:bg-red-950/20 dark:text-slate-100"
                : "border-slate-200 bg-white text-slate-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20",
            ].join(" ")}
          />
          {result.error && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {result.error.message}
              {result.error.line != null
                ? ` (line ${result.error.line}, column ${result.error.column})`
                : ""}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Output
            </label>
            <CopyButton text={result.output} disabled={result.output.length === 0} />
          </div>
          <pre
            className="h-[65vh] min-h-[380px] w-full resize-y overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {result.output ? (
              tokens.map((token, i) =>
                token.className ? (
                  <span key={i} className={token.className}>
                    {token.text}
                  </span>
                ) : (
                  token.text
                ),
              )
            ) : (
              <span className="text-slate-400 dark:text-slate-600">
                Formatted JSON will appear here
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
