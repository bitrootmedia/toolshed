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
    title: "Modes — Shift+Tab is the one to learn",
    entries: [
      { keys: "Shift+Tab", description: "Cycle permission modes: normal → auto-accept edits → plan mode → normal" },
      { keys: "Shift+Tab ×2 (plan mode)", description: "Read-only: Claude explores and writes a plan but changes nothing until you approve it" },
      { keys: "Shift+Tab ×1 (auto-accept)", description: "Edits apply without a prompt each time — good for a plan you already signed off on" },
      { keys: "claude --permission-mode plan", description: "Start the session already in plan mode" },
      { keys: "/permissions", description: "See and edit the allow/ask/deny rules behind the prompts" },
      { keys: "claude --dangerously-skip-permissions", description: "No prompts at all — only in a sandbox/container you can throw away" },
    ],
  },
  {
    title: "Planning workflow",
    entries: [
      { keys: "Plan first, then build", description: "Shift+Tab into plan mode, ask for a plan, review it, approve — then let it execute" },
      { keys: "think / think hard / ultrathink", description: "Escalating thinking budget; worth it for architecture and tricky debugging" },
      { keys: "Explore, then plan, then code, then commit", description: "The four-step prompt that keeps Claude from coding before it has read the code" },
      { keys: "Write the plan to a file", description: "\"Save the plan to plan.md\" — survives /clear and doubles as a review artifact" },
      { keys: "Ask for options, not an answer", description: "\"Give me 2–3 approaches with trade-offs before you pick one\"" },
      { keys: "Point at files up front", description: "Tab-complete or @-mention paths so it reads the right code instead of searching for it" },
      { keys: "Esc", description: "Interrupt immediately when it heads the wrong way — cheaper than letting it finish" },
      { keys: "Esc Esc", description: "Rewind: jump back to an earlier message and steer from there" },
    ],
  },
  {
    title: "Context — /clear early and often",
    entries: [
      { keys: "/clear", description: "Wipe the conversation, keep the session. Use it between unrelated tasks" },
      { keys: "/compact", description: "Summarise the conversation into a shorter context instead of dropping it" },
      { keys: "/compact focus on the API refactor", description: "Compact with an instruction about what to keep" },
      { keys: "/context", description: "Show what is currently filling the context window" },
      { keys: "/rewind", description: "Restore the conversation (and optionally files) to an earlier checkpoint" },
      { keys: "/resume", description: "Pick an earlier session to continue" },
      { keys: "claude -c", description: "Continue the most recent session in this directory" },
      { keys: "claude -r", description: "Resume a past session by picking it from a list" },
      { keys: "/cost", description: "Token and cost usage for the current session" },
      { keys: "/usage", description: "Plan usage and limits" },
    ],
  },
  {
    title: "Memory — CLAUDE.md",
    entries: [
      { keys: "./CLAUDE.md", description: "Project memory, committed to the repo — conventions, commands, gotchas the whole team shares" },
      { keys: "~/.claude/CLAUDE.md", description: "User memory — your personal preferences across every project" },
      { keys: "./CLAUDE.local.md", description: "Project memory that stays out of git (gitignore it)" },
      { keys: "./packages/api/CLAUDE.md", description: "Sub-directory memory, loaded on demand when Claude works in that folder" },
      { keys: "/init", description: "Bootstrap a CLAUDE.md by having Claude read the codebase" },
      { keys: "/memory", description: "Open the memory files in your editor" },
      { keys: "# always run npm run lint before committing", description: "A message starting with # is filed straight into memory" },
      { keys: "@docs/architecture.md", description: "Import another file into CLAUDE.md instead of duplicating it" },
      { keys: "Keep it short and specific", description: "CLAUDE.md is prepended to every request — bullet points beat prose, stale rules cost you" },
    ],
  },
  {
    title: "Backlog-driven work (many features, one session each)",
    entries: [
      { keys: "backlog.md in the repo root", description: "One checklist of features/tasks; the durable plan that outlives any single context window" },
      { keys: "- [ ] 03 Rate limiting — see docs/rate-limits.md", description: "One line per task: id, title, and a pointer to the detail it needs" },
      { keys: "\"Read backlog.md and do task 03 only\"", description: "Scope each session to one item so the context stays small and reviewable" },
      { keys: "\"Tick off task 03 in backlog.md and note what changed\"", description: "Let Claude update the backlog as part of the task — state lives in the file, not the chat" },
      { keys: "/clear between tasks", description: "The whole point: fresh context per feature, backlog.md carries the memory" },
      { keys: "backlog/task-03-rate-limiting.md", description: "For bigger items, give each task its own file with acceptance criteria and notes" },
      { keys: "Commit the backlog with the code", description: "Reviewers see the plan and the diff together; the next session picks up where you left off" },
      { keys: "\"Split this epic into backlog.md tasks, no code yet\"", description: "Use plan mode to generate the backlog before any implementation starts" },
    ],
  },
  {
    title: "Keyboard & input",
    entries: [
      { keys: "Esc", description: "Stop Claude mid-turn" },
      { keys: "Ctrl+C", description: "Cancel the current input (twice to quit)" },
      { keys: "Ctrl+D", description: "Exit the session" },
      { keys: "Ctrl+L", description: "Clear the terminal screen (conversation kept)" },
      { keys: "Ctrl+R", description: "Toggle verbose output — see full tool results" },
      { keys: "Ctrl+B", description: "Send the running command to the background" },
      { keys: "↑ / ↓", description: "Walk through your previous prompts" },
      { keys: "\\ + Enter", description: "Newline without submitting (Option+Enter or Shift+Enter after /terminal-setup)" },
      { keys: "@", description: "Fuzzy-complete a file or directory path into the prompt" },
      { keys: "/", description: "Slash-command menu" },
      { keys: "!", description: "Run a shell command directly; its output lands in the conversation" },
      { keys: "#", description: "Save the line to CLAUDE.md memory" },
      { keys: "/vim", description: "Vim keybindings in the prompt box" },
      { keys: "/terminal-setup", description: "Configure Shift+Enter for newlines in your terminal" },
    ],
  },
  {
    title: "Everyday slash commands",
    entries: [
      { keys: "/help", description: "List commands and shortcuts" },
      { keys: "/model", description: "Switch model for this session" },
      { keys: "/config", description: "Settings UI: theme, editor, notifications, defaults" },
      { keys: "/status", description: "Version, account, model, and connected services" },
      { keys: "/doctor", description: "Diagnose an unhealthy installation" },
      { keys: "/review", description: "Review a pull request or the current changes" },
      { keys: "/add-dir ../other-repo", description: "Give the session access to another directory" },
      { keys: "/ide", description: "Connect to VS Code / JetBrains for diffs and selection context" },
      { keys: "/export", description: "Export the conversation to a file or the clipboard" },
      { keys: "/bug", description: "Report a problem with Claude Code" },
      { keys: "/release-notes", description: "What changed in recent versions" },
    ],
  },
  {
    title: "Extending Claude",
    entries: [
      { keys: ".claude/commands/review-api.md", description: "A markdown file becomes the /review-api slash command, shared via the repo" },
      { keys: "$ARGUMENTS", description: "Placeholder in a custom command, filled from what you type after it" },
      { keys: "~/.claude/commands/", description: "Personal slash commands available in every project" },
      { keys: "/agents", description: "Create and manage subagents — separate context, own tools and prompt" },
      { keys: ".claude/agents/reviewer.md", description: "A subagent definition: frontmatter (name, description, tools, model) plus its system prompt" },
      { keys: ".claude/skills/<name>/SKILL.md", description: "A skill: instructions Claude loads only when the task matches" },
      { keys: "/hooks", description: "Run your own commands on events like PreToolUse, PostToolUse, and Stop" },
      { keys: "/mcp", description: "Manage MCP servers and authenticate to them" },
      { keys: "claude mcp add --transport http linear https://mcp.linear.app/mcp", description: "Add an MCP server to this project" },
      { keys: ".mcp.json", description: "Project-level MCP servers, committed so the team shares them" },
      { keys: "/statusline", description: "Build a custom status line from a shell command" },
      { keys: "/output-style", description: "Switch response style (e.g. explanatory, learning)" },
    ],
  },
  {
    title: "Config files",
    entries: [
      { keys: ".claude/settings.json", description: "Project settings: permissions, hooks, env — checked into git" },
      { keys: ".claude/settings.local.json", description: "Your machine-only overrides; gitignored by default" },
      { keys: "~/.claude/settings.json", description: "User settings for every project" },
      { keys: ".claude/", description: "Where commands, agents, skills, and settings live in a repo" },
      { keys: "claude config list", description: "Inspect the effective configuration" },
      { keys: "ANTHROPIC_MODEL", description: "Env var to pin the model outside the session" },
    ],
  },
  {
    title: "CLI & headless",
    entries: [
      { keys: "claude", description: "Start an interactive session in the current directory" },
      { keys: "claude \"fix the failing test\"", description: "Start with the first prompt already typed" },
      { keys: "claude -p \"summarise the diff\"", description: "Print mode: run once, print the answer, exit — scriptable" },
      { keys: "git diff | claude -p \"write a commit message\"", description: "Pipe stdin into a one-shot run" },
      { keys: "claude -p \"...\" --output-format json", description: "Machine-readable output for CI and scripts" },
      { keys: "claude --model opus", description: "Choose the model at launch" },
      { keys: "claude --allowedTools \"Read\" \"Grep\"", description: "Restrict tools for an unattended run" },
      { keys: "claude update", description: "Update to the latest version" },
      { keys: "claude doctor", description: "Check the install from the shell" },
      { keys: "claude mcp serve", description: "Expose Claude Code itself as an MCP server" },
    ],
  },
  {
    title: "Git & GitHub habits",
    entries: [
      { keys: "\"Commit this\"", description: "Claude writes the message from the actual diff — review it before pushing" },
      { keys: "gh", description: "Install the GitHub CLI and Claude can open PRs, read issues, and check CI" },
      { keys: "/install-github-app", description: "Set up @claude reviews and mentions on your repository" },
      { keys: "git worktree add ../feat-x -b feat-x", description: "Run parallel Claude sessions on the same repo without them colliding" },
      { keys: "Small, reviewable commits", description: "Ask for one logical change per commit — easier to reject half the work" },
    ],
  },
];

export default function ClaudeCodeCheatsheet() {
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
