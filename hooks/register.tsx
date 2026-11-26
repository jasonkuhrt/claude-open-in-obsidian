import type { Register } from 'claude-code'

const VAULT = '/Users/jasonkuhrt/meos'

// Markdown link targets: [text](<path with spaces.md>) or [text](path.md), optional :line.
const LINK = /\]\((?:<([^>]+)>|([^)\s]+))\)/g

/** Whether a session running in `cwd` is working in the vault. */
export const inVault = (cwd: string): boolean => cwd === VAULT || cwd.startsWith(`${VAULT}/`)

/**
 * The vault notes a reply links, as paths from the vault root, in order, once
 * each. An absolute path inside the vault always counts. A relative path counts
 * only when the session works in the vault: anywhere else it names a file of
 * that project.
 */
export const notesIn = (text: string, sessionInVault: boolean): string[] => {
  const found: string[] = []
  for (const match of text.matchAll(LINK)) {
    const raw = (match[1] ?? match[2] ?? '').replace(/\s*\n\s*/g, ' ').replace(/:\d+$/, '')
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('#')) continue
    let path = raw
    try {
      path = decodeURIComponent(raw)
    } catch {
      // keep the raw spelling
    }
    if (path.startsWith(`${VAULT}/`)) path = path.slice(VAULT.length + 1)
    else if (!sessionInVault) continue
    if (path.startsWith('/') || !path.endsWith('.md')) continue
    // Obsidian does not show dot folders.
    if (path.split('/').some(part => part.startsWith('.'))) continue
    if (!found.includes(path)) found.push(path)
  }
  return found.slice(0, 6)
}

const title = (path: string): string => path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '')

export const register: Register = on => {
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    const notes = notesIn(e.props.text, inVault(await $.session.cwd()))
    if (notes.length === 0) return next(e)

    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        {await next(e)}
        <Box marginTop="md" alignItems="center" columnGap="sm" rowGap="sm" flexWrap="wrap">
          <Text dimColor>Open in Obsidian:</Text>
          {notes.map(path => (
            <Button
              key={`obsidian:${path}`}
              label={title(path)}
              onPress={async () => {
                await $.process.run(['open', `obsidian://open?path=${encodeURIComponent(`${VAULT}/${path}`)}`])
              }}
            />
          ))}
        </Box>
      </Box>
    )
  })
}
