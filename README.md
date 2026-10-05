# claude-garage

A garage of Claude Code mods: a plugin marketplace that grows one mod at a time.

## Install

```sh
# From GitHub (after pushing this repo)
claude plugin marketplace add <github-user>/claude-garage
# Or from a local clone
claude plugin marketplace add ~/workspace/claude-garage

claude plugin install omp-statusline@claude-garage
```

Then run `/reload-plugins` in a session, or start a new one.

## Mods

| Mod | What it does |
| --- | --- |
| [omp-statusline](plugins/omp-statusline) | An Oh My Pi style band above the prompt: model, cwd, git branch, PR, `(sub)`, context use and window. Needs `git`; the PR number needs `gh`. |

## Develop

```sh
claude plugin validate .                      # the marketplace
claude plugin validate plugins/omp-statusline # one mod
claude plugin test plugins/omp-statusline
```

Bump `version` in both the mod's `plugin.json` and `marketplace.json` when releasing a change, so `claude plugin update` picks it up.
