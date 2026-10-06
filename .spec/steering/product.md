# Product Overview

## Product Description
claude-garage is a Claude Code plugin marketplace: a "garage" of Claude Code mods that grows one mod at a time.

**Project**: claude-garage (GitHub: `yi-john-huang/claude-garage`)
**Version**: no repo-level version; each mod is versioned on its own (`omp-statusline` is `0.1.0`)
**Type**: Claude Code plugin marketplace (a collection of plugins/mods)

## Core Features
- **Marketplace manifest** (`.claude-plugin/marketplace.json`): lets users add the repo with `claude plugin marketplace add` and install mods from it.
- **omp-statusline mod**: an Oh My Pi style band above the prompt (`AbovePrompt`) that shows:
  - the model, the cwd (with the home dir shortened to `~`), and the git branch;
  - the open PR number (from `gh`) and `(sub)` when subscription rate limits apply;
  - context use as a percentage (magenta, yellow at 60% or more, red at 85% or more) and the context window size.
  - It hides itself when a survey is showing.

## Target Use Case
Claude Code users who want extra UI and behavior mods in their sessions, installed from one marketplace.

## Target Users
- The owner (John Huang), who uses and builds the mods.
- Other Claude Code users who add the marketplace from GitHub or a local clone.

## Boundaries
- Each mod is a self-contained plugin under `plugins/<mod>/`. A mod does not depend on other mods.
- Runtime requirements belong to each mod. omp-statusline needs `git`, and needs `gh` only for the PR number. If a command fails, the mod hides that segment and does not raise an error.
- No build step and no published package. Mods are loaded from source by Claude Code.

## Unresolved
- Success metrics and roadmap (which mods come next) are not documented.
