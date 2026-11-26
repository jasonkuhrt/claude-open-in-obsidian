# open-in-obsidian

A Claude Code mod. When a reply links a Markdown note in your Obsidian vault,
the mod adds a row under the reply: "Open in Obsidian:" and one button per
note. A button opens that note in the Obsidian app.

## Install

At the prompt of a terminal session:

```
/plugin install open-in-obsidian --marketplace jasonkuhrt/claude-open-in-obsidian
```

From a shell:

```bash
claude plugin install open-in-obsidian --marketplace jasonkuhrt/claude-open-in-obsidian
```

Answer `y` to add the marketplace, then choose the user scope.

In the desktop app: click + next to the prompt box, then Plugins, Add
marketplace with `jasonkuhrt/claude-open-in-obsidian`, then Add plugin.

## Your vault

The vault path is the `VAULT` constant at the top of `hooks/register.tsx`. It
is set to the author's vault. Fork the repository and change it to yours.

## Which links get a button

A Markdown link whose target ends in `.md` and is an absolute path inside the
vault. A path relative to the vault also gets one, but only in a session whose
working directory is in the vault: in any other project a relative link names
that project's file. Links to URLs and to dot folders get none. A reply gets at
most six buttons.

## Develop

```bash
claude plugin validate .
```

```bash
claude plugin test .
```
