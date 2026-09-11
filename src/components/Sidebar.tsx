import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { Wrench } from "lucide-react";
import { SearchBox } from "./SearchBox";
import { categories } from "../tools/registry";
import type { ToolDefinition } from "../lib/types";

interface SidebarProps {
  query: string;
  onQueryChange: (value: string) => void;
  results: ToolDefinition[];
  onNavigate?: () => void;
}

export const Sidebar = forwardRef<HTMLInputElement, SidebarProps>(
  function Sidebar({ query, onQueryChange, results, onNavigate }, searchRef) {
    return (
      <div className="flex h-full flex-col gap-4 p-4">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2 px-1 text-lg font-semibold text-slate-800 dark:text-slate-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Wrench size={16} />
          </span>
          Toolshed
        </NavLink>

        <SearchBox ref={searchRef} value={query} onChange={onQueryChange} />

        <nav className="flex-1 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-1 py-4 text-sm text-slate-400 dark:text-slate-500">
              No tools match "{query}".
            </p>
          ) : (
            categories.map((category) => {
              const items = results.filter((t) => t.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="mb-4">
                  <h3 className="px-2 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {category}
                  </h3>
                  <ul className="flex flex-col gap-0.5">
                    {items.map((tool) => (
                      <li key={tool.id}>
                        <NavLink
                          to={`/tools/${tool.id}`}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            [
                              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                            ].join(" ")
                          }
                        >
                          <tool.icon size={16} className="shrink-0" />
                          <span className="truncate">{tool.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </nav>

        <p className="border-t border-slate-100 px-1 pt-3 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Runs entirely in your browser. Nothing you type ever leaves this
          page.
        </p>
      </div>
    );
  },
);
