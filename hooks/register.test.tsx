import { expect, test } from 'claude-code/testing'
import { inVault, notesIn } from './register'

const TEXT = "Read [Trip plan](</Users/jasonkuhrt/meos/Travel/Trip plan/Trip plan.md>)."

test('a relative link counts only in a session working in the vault', () => {
  const reply = 'See [the hand-over](bloo-world-handover.md) and [Trip plan](</Users/jasonkuhrt/meos/Travel/Trip plan.md>).'
  expect(notesIn(reply, false)).toEqual(['Travel/Trip plan.md'])
  expect(notesIn(reply, true)).toEqual(['bloo-world-handover.md', 'Travel/Trip plan.md'])
  expect(inVault('/Users/jasonkuhrt/meos/Wiki')).toBe(true)
  expect(inVault('/Users/jasonkuhrt/meos-other')).toBe(false)
  expect(inVault('/Users/jasonkuhrt/projects/app')).toBe(false)
})

test('a reply that links a vault note gets a button, on every surface', async ($, on) => {
  on('session.cwd', () => ({ value: '/Users/jasonkuhrt/projects/app' }))
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
