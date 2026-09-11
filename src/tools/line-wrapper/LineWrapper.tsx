import { useMemo, useState } from "react";
import { CopyButton } from "../../components/CopyButton";

const DEFAULT_BEGIN = "'";
const DEFAULT_END = "',";

function wrapLines(input: string, begin: string, end: string): string {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => `${begin}${line}${end}`)
    .join("\n");
}

export default function LineWrapper() {
  const [input, setInput] = useState("");
  const [begin, setBegin] = useState(DEFAULT_BEGIN);
  const [end, setEnd] = useState(DEFAULT_END);

  const output = useMemo(() => wrapLines(input, begin, end), [input, begin, end]);
  const lineCount = useMemo(
    () => input.split(/\r?\n/).filter((l) => l.trim().length > 0).length,
    [input],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Beginning" value={begin} onChange={setBegin} />
        <Field label="Ending" value={end} onChange={setEnd} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Input
            </label>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"e3245ff1-3ff3-4204-b424-9970ce6ecc7a\n3a903aac-3c79-46b0-8fda-dc7c1e293acc\n..."}
            spellCheck={false}
            className="h-[65vh] min-h-[380px] w-full resize-y rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Output
            </label>
            <CopyButton text={output} disabled={output.length === 0} />
          </div>
          <textarea
            value={output}
            readOnly
            spellCheck={false}
            placeholder="Output will appear here"
            className="h-[65vh] min-h-[380px] w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
      />
    </div>
  );
}
