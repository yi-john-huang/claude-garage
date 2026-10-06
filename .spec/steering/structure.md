# Project Structure

## Directory Organization
```
├── .claude-plugin/
│   └── marketplace.json        # Marketplace manifest: lists every mod and its version
├── plugins/
│   └── omp-statusline/         # One directory per mod
│       ├── .claude-plugin/
│       │   └── plugin.json     # Mod manifest (name, version, description, types)
│       ├── hooks/
│       │   ├── hooks.json      # Lists the hook modules to load
│       │   └── register.tsx    # Hook module: exports `register`
│       ├── types/
│       │   └── index.d.ts      # Shared types and PluginState augmentation
│       ├── tests/
│       │   └── band.test.tsx   # Tests run by `claude plugin test`
│       └── tsconfig.json       # Extends the generated .claude-plugin/types/tsconfig.json
├── .spec/                      # SDD workflow files (steering/, specs/)
├── .mcp.json                   # sdd-mcp server registration
├── CLAUDE.md                   # Project instructions for Claude Code
└── README.md                   # Install, mod list, develop commands
```

## Adding a Mod
1. Create `plugins/<mod-name>/` with the same layout as `omp-statusline`.
2. Add an entry to `.claude-plugin/marketplace.json` with `"source": "./plugins/<mod-name>"` and the same `version` as the mod's `plugin.json`.
3. Add a row to the **Mods** table in `README.md`.
4. Run `claude plugin validate .`, `claude plugin validate plugins/<mod-name>` and `claude plugin test plugins/<mod-name>`.

## File Naming Conventions
- **Mod directories and plugin names**: kebab-case (`omp-statusline`). The directory name, `plugin.json` `name`, marketplace entry `name`, and the atom `plugin` key are identical.
- **Hook modules**: `hooks/*.tsx`, listed in `hooks/hooks.json`
- **Tests**: `tests/*.test.tsx`
- **Types**: `types/index.d.ts`
- **Constants**: UPPER_SNAKE_CASE (`SEP`, `PROPS`). **Functions/variables**: camelCase. **Types**: PascalCase.

## Code Patterns
- In hooks, call `next(e)` and then run side effects. Start slow work such as git and gh lookups with `void`, so that the hook does not block.
- Cache expensive or network results (for example, the PR number is fetched again only when the branch changes).
- Use a `tick` atom to force a redraw when engine data (usage, model) may have changed.
- Style: no semicolons, single quotes, 2-space indent, comments only where the reason is not obvious.

## Testing Structure
- Tests are in each mod's `tests/` directory. They mount the UI on each surface (`terminal`, `desktop`) and stub engine events.

## Ignored / Generated
- `.claude-plugin/types/` (per machine), `.claude/`, `.sdd-mcp/`, `.DS_Store`

## Unresolved
- `data/plugins/` exists locally as an empty, untracked directory. Its purpose is unknown.
