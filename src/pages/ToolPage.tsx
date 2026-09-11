import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getToolById } from "../tools/registry";

export function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = getToolById(toolId);

  if (!tool) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-slate-600 dark:text-slate-300">
          That tool doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          <ArrowLeft size={14} />
          Back to all tools
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={14} />
          All tools
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <tool.icon size={20} />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              {tool.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <Suspense fallback={<p className="text-sm text-slate-400">Loading&hellip;</p>}>
          <tool.component />
        </Suspense>
      </div>
    </div>
  );
}
