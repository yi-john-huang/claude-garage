import { expect, test } from 'claude-code/testing'

const PROPS = {
  hasSurvey: false,
  isWorking: false,
  maxRows: 10,
  bodyColumns: 120,
  scroll: { offset: 0, bodyRows: 9, contentRows: 1 },
  view: {},
}

test('band shows model, cwd, plan, context and window', async ($, on) => {
  on('session.model', () => ({ value: 'GPT-6 Sol' }))
  on('session.cwd', () => ({ value: '/Users/me/workspace/sdd-mcp' }))
  on('session.usage', () => ({
    value: {
      startedAt: 0,
      context: { tokens: 8000, window: 272_000, percent: 3 },
      rateLimits: [{ kind: 'five_hour', percentUsed: 10 }],
    },
  }))

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({
      plugin: 'omp-statusline',
      surface,
      component: 'AbovePrompt',
      props: PROPS,
    })
    expect(await ui.find({ type: 'Text', text: /GPT-6 Sol/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /~\/workspace\/sdd-mcp/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /\(sub\)/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /3%/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /272K/ })).toBeDefined()
    await ui.unmount()
  }
})

test('band yields to a survey', async ($, on) => {
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine band</Text>
  })
  on('session.model', () => ({ value: 'GPT-6 Sol' }))
  const ui = await $.ui.mount({
    plugin: 'omp-statusline',
    surface: 'terminal',
    component: 'AbovePrompt',
    props: { ...PROPS, hasSurvey: true },
  })
  expect(await ui.find({ type: 'Text', text: /GPT-6 Sol/ })).toBeUndefined()
  await ui.unmount()
})
