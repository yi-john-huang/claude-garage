# CLAUDE.md — Spec-Driven Development

## Workflow

After installation, reload or restart the host and accept project trust. Use `/simple-task <description>` for small changes. For formal work, invoke `/sdd-requirements <feature-name>`, then `/sdd-design`, `/sdd-tasks`, and `/sdd-implement` after each explicit approval.
Skills automatically restore durable workflow state and approved compact context; users do not call MCP tools or paste workflow JSON.
The `output-clarity-ladder` skill applies automatically to explanation, summary, and teaching replies; it is the only model-invocable skill.

## On-demand directories

- Skills: `.claude/skills/`
- Hooks: `.claude/hooks/`
- Steering: `.spec/steering/`

## Model routing

Planning, architecture, review, and security execute in the current turn on their configured skill model/effort.
Implementation and TDD use their configured skill model/effort; do not spawn a redundant specialist unless the user chooses a project agent.
Review, security, and independent implementation slices ask once per session (inline or project agent) and report agents, parallelism, configured model/effort, and fallbacks.

## Commits and pull requests

Do not add `Co-Authored-By:` trailers or "Generated with Claude Code" lines to commit messages or pull request descriptions. This overrides default attribution guidance.
