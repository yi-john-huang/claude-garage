import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Git } from '../types'

const git = atom({ plugin: 'omp-statusline', key: 'git' } as const, null)
// Bumped whenever usage or the model may have moved, so the band redraws.
const tick = atom({ plugin: 'omp-statusline', key: 'tick' } as const, 0)

const SEP = ' › '

const shortPath = (path: string): string =>
  path.replace(/^\/(Users|home)\/[^/]+/, '~')

const shortTokens = (n: number): string =>
  n >= 1_000_000
    ? `${+(n / 1_000_000).toFixed(1)}M`
    : n >= 1000
      ? `${Math.round(n / 1000)}K`
      : `${n}`

const percentColor = (p: number): string =>
  p >= 85 ? 'red' : p >= 60 ? 'yellow' : 'magenta'

async function run($: EngineInterface, argv: string[]): Promise<string | null> {
  try {
    const r = await $.process.run(argv, { timeoutMs: 5000 })
    return r.exitCode === 0 ? r.stdout.trim() : null
  } catch {
    return null
  }
}

// PR lookups hit the network, so only redo one when the branch changes.
let prFor: string | null = null
let pr: number | null = null

async function refreshGit($: EngineInterface): Promise<void> {
  const branch = await run($, ['git', 'rev-parse', '--abbrev-ref', 'HEAD'])
  if (branch === null) {
    await update($, git, () => null)
    return
  }
  if (branch !== prFor) {
    prFor = branch
    const n = await run($, ['gh', 'pr', 'view', '--json', 'number', '-q', '.number'])
    pr = n !== null && /^\d+$/.test(n) ? Number(n) : null
  }
  const next: Git = { branch, pr }
  await update($, git, () => next)
}

async function bump($: EngineInterface): Promise<void> {
  await update($, tick, n => n + 1)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    void refreshGit($)
    return started
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if (e.agentId === undefined) {
      void refreshGit($)
      await bump($)
    }
    return done
  })

  on('session.measure', async ($, e, next) => {
    const measured = await next(e)
    await bump($)
    return measured
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)

    await read($, tick)
    const [model, cwd, usage, repo] = await Promise.all([
      $.session.model(),
      $.session.cwd(),
      $.session.usage(),
      read($, git),
    ])
    const { context, rateLimits } = usage
    const isSub = rateLimits.length > 0

    const { Box, Text } = $.ui.resolve(e)
    const sep = <Text dimColor>{SEP}</Text>

    return (
      <Box flexDirection="row">
        <Text dimColor>π</Text>
        {sep}
        <Text color="magenta">◑ {model}</Text>
        {sep}
        <Text color="cyan">📁 {shortPath(cwd)}</Text>
        {repo && sep}
        {repo && <Text color="green">⑂ {repo.branch}</Text>}
        {repo?.pr != null && sep}
        {repo?.pr != null && <Text color="magenta">↗#{repo.pr}</Text>}
        {isSub && sep}
        {isSub && <Text color="magenta">(sub)</Text>}
        {sep}
        {context.percent !== undefined && (
          <Text color={percentColor(context.percent)}>{context.percent}% </Text>
        )}
        <Text dimColor>│ </Text>
        <Text color="magenta">{shortTokens(context.window)}</Text>
      </Box>
    )
  })
}
