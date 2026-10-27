# Contributing to DarkHub Vault for browsers

Thanks for helping. This extension is small on purpose: three scripts and a popup, no build step and no dependencies.

## What you need

- Chrome, Edge or Firefox 115+
- [DarkHub Suite](https://github.com/Pokeralho/darkhub-suite/releases/latest) 0.7.3+ on Windows, with the vault
  unlocked and the native host registered (see the README)
- Node.js 18+ only to run the checks

## Workflow

1. Fork and clone, then load [extension/](../extension) unpacked (README, "Load the extension").
2. Make the change and reload the extension from the extensions page.
3. Run `node scripts/check.mjs` (CI runs the same).
4. Open a pull request with screenshots for any visual change, and say which browsers you tested.

## Rules

- **No network.** The extension only talks to DarkHub through native messaging. No `fetch`, analytics, remote fonts
  or remote scripts.
- **No new permissions** without discussing it in an issue first. `scripts/check.mjs` fails on a permission it does
  not know, on purpose.
- **Keep the security checks**: fills only after a trusted click (`isTrusted`), only into the page whose origin the
  app answered for, and the inline UI stays in a closed shadow root.
- **Every text in pt and en.** Popup strings live in `STRINGS.pt` / `STRINGS.en` in `popup.js` (the check compares
  them); inline-picker texts use `tr(pt, en)` in `content.js`.
- The message types between `popup.js`, `content.js` and `background.js`, and between `background.js` and the native
  host, are a contract with DarkHub Suite. Changing them needs a matching pull request there
  ([electron/services/vaultBridge/](https://github.com/Pokeralho/darkhub-suite/tree/main/electron/services/vaultBridge)).
- Bump `version` in `manifest.json` and add a line to [CHANGELOG.md](../CHANGELOG.md) under "Unreleased".

## Good first contributions

- A new translation of the popup and the inline picker.
- Better form detection on a site where the inline icon does not show (say which site and attach the form's HTML).
- Accessibility fixes (keyboard use of the inline picker, screen reader labels).

## Releases

Maintainers tag `vX.Y.Z` (matching `manifest.json`); the release workflow builds `darkhub-vault-X.Y.Z.zip` and attaches
it to the GitHub release.
