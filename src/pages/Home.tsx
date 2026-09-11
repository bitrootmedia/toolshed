import { categories, tools } from "../tools/registry";
import { ToolCard } from "../components/ToolCard";

export function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Toolshed
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Fast, no-nonsense browser tools. Everything runs locally &mdash;
          nothing you paste is ever sent anywhere.
        </p>
      </div>

      {categories.map((category) => {
        const items = tools.filter((t) => t.category === category);
        return (
          <section key={category} className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
