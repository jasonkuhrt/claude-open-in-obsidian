import { expect, test } from 'claude-code/testing'

const TEXT = "Read [Trip plan](<Travel/Trip plan/Trip plan.md>)."

test('a reply that links a vault note gets a button, on every surface', async ($, on) => {
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({
      plugin: 'open-in-obsidian',
      component: 'AssistantMessage',
      props: { text: TEXT, isFirstOfReply: true },
      surface,
    })
    const button = await ui.find({ type: 'Button' })
    expect(button?.label ?? button?.text).toBe('Trip plan')
    await ui.unmount()
  }
})
