export type Git = { branch: string; pr: number | null }

declare module 'claude-code' {
  interface PluginState {
    'omp-statusline': { git: Git | null; tick: number }
  }
}
