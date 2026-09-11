import { Link } from "react-router-dom";
import type { ToolDefinition } from "../lib/types";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/30"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:group-hover:bg-indigo-500/20">
        <tool.icon size={18} />
      </span>
      <div>
        <h3 className="font-medium text-slate-800 dark:text-slate-100">
          {tool.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
