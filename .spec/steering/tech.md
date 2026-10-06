# Technology Stack

## Architecture
**Type**: Claude Code plugin marketplace. Each mod is a plugin of function hooks.
**Language**: TypeScript with JSX (`.tsx`)
**Module System**: ES modules (`import`/`export`)
**Framework**: Claude Code plugin hooks API (`'claude-code'` module; tests use `'claude-code/testing'`)
**Build Tool**: none. Claude Code loads `.tsx` hook modules directly and hot-reloads them.

## Core Technologies
- **Runtime**: Claude Code's plugin engine (no `package.json`, no npm dependencies)
- **Hook registration**: `hooks/hooks.json` lists modules (`{ "modules": ["./register.tsx"] }`). Each module exports `register: Register`.
- **State**: `atom({ plugin, key }, initial)` with `read($, atom)` and `update($, atom, fn)`. State keys are typed by extending `PluginState` in `types/index.d.ts`.
- **UI**: `$.ui.resolve(e)` returns `Box` and `Text` components for `ui.render` hooks.
- **External processes**: `$.process.run(argv, { timeoutMs })`. omp-statusline wraps it so that a failure returns `null`.
- **Testing**: `claude-code/testing` (`test`, `expect`, `$.ui.mount`, stubbed engine events such as `session.model`)

## Development Environment
- **Required CLI**: `claude` (Claude Code)
- **Mod runtime tools**: `git`, and `gh` (optional, used for the PR number)
- **TypeScript config**: each mod's `tsconfig.json` extends `./.claude-plugin/types/tsconfig.json`. Claude Code generates that file per machine when it loads the mod, and it is git-ignored.

## Development Commands (verified 2026-10-06)
```bash
claude plugin validate .                      # validate the marketplace manifest
claude plugin validate plugins/omp-statusline # validate one mod (lists the calls and state reads/writes)
claude plugin test plugins/omp-statusline     # run the mod's tests
```
After a change in a session, run `/reload-plugins`, or start a new session.

## Release
- Bump `version` in **both** `plugins/<mod>/.claude-plugin/plugin.json` and that mod's entry in `.claude-plugin/marketplace.json`, so that `claude plugin update` finds the change.

## Tooling
- `.mcp.json` registers the `sdd-mcp` server (`npx -y sdd-mcp-server@5.3.0`) for the spec-driven workflow.
- `.claude/` and `.sdd-mcp/` contain generated agent files and are git-ignored.

## Unresolved
- No linter, formatter, or CI is configured.
