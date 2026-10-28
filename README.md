<p align="center">
  <img src="./extension/icons/icon-128.png" width="80" height="80" alt="DarkHub Vault logo" />
</p>

<h1 align="center">DarkHub Vault for browsers</h1>

<p align="center">
  Fills and saves logins from the <a href="https://github.com/Pokeralho/darkhub-suite">DarkHub Suite</a> password vault.<br/>
  Local only: it never talks to the network, only to the DarkHub app running on your PC.
</p>

<p align="center">
  <a href="https://github.com/Pokeralho/darkhub-vault-extension/releases/latest"><img src="https://img.shields.io/github/v/release/Pokeralho/darkhub-vault-extension?style=flat-square&label=release" alt="Latest release" /></a>
  <a href="https://github.com/Pokeralho/darkhub-vault-extension/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Pokeralho/darkhub-vault-extension/ci.yml?branch=main&style=flat-square&label=ci" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/browsers-Chrome%20%C2%B7%20Edge%20%C2%B7%20Firefox%20115%2B-informational?style=flat-square" alt="Chrome, Edge, Firefox 115+" />
</p>

<p align="center">
  <b>English</b> · <a href="./README.pt-BR.md">Português</a>
</p>

<p align="center">
  <img src="./docs/assets/popup.png" width="720" alt="DarkHub Vault popup: logins for github.com with Fill buttons, and the pairing code shown one digit per box" />
</p>

---

## How it works

Manifest V3 extension for Chrome, Edge and Firefox (115+). It reaches the running DarkHub app through **native
messaging**; there is no server, account or sync.

```
extension ──connectNative("com.darkhub.vault")──> DarkHub.VaultBridgeHost.exe ──TCP 127.0.0.1 (HMAC handshake)──> DarkHub app
```

You need [DarkHub Suite](https://github.com/Pokeralho/darkhub-suite/releases/latest) 0.7.3 or newer on Windows 10/11.
The app also ships this extension: **Password vault → Browser extension → Open extension folder**.

## Install

### 1. Register the native host (in DarkHub)

Open DarkHub Suite → **Password vault** (unlock it) → **Browser extension** → click **Register** for each browser.
This writes, for the current Windows user only:

| Browser | Registry key (default value = manifest path) |
| --- | --- |
| Chrome | `HKCU\Software\Google\Chrome\NativeMessagingHosts\com.darkhub.vault` |
| Edge | `HKCU\Software\Microsoft\Edge\NativeMessagingHosts\com.darkhub.vault` |
| Firefox | `HKCU\Software\Mozilla\NativeMessagingHosts\com.darkhub.vault` |

and these files in `%APPDATA%\<DarkHub userData>\vault-bridge\`:

- `com.darkhub.vault.<browser>.json`: host manifest; `allowed_origins` / `allowed_extensions` list **only** this
  extension (`chrome-extension://dpibeiimcolhiofphhncmjbejgcfblgh/` and `vault@darkhub.app`).
- `DarkHub.VaultBridgeHost.exe`: the host (source: [DarkHub.VaultBridgeHost.cs](https://github.com/Pokeralho/darkhub-suite/blob/main/electron/services/DarkHub.VaultBridgeHost.cs)).
- `bridge.cfg`: loopback port + random secret, rewritten every time the app starts the bridge and deleted on exit.
- `pairings.json`: paired browsers (SHA-256 of their tokens, never the tokens).

**Unregister** removes the registry key (only if it still points at DarkHub's manifest) and the manifest file. The
loopback listener only runs while at least one browser is registered.

### 2. Load the extension

Download `darkhub-vault-x.y.z.zip` from the [latest release](https://github.com/Pokeralho/darkhub-vault-extension/releases/latest)
and extract it, or clone this repository and use the [extension/](./extension) folder.

**Chrome / Edge**
1. Open `chrome://extensions` (or `edge://extensions`) and turn on **Developer mode**.
2. **Load unpacked** → pick the extracted folder.
3. The ID must be `dpibeiimcolhiofphhncmjbejgcfblgh` (fixed by the `key` field in `manifest.json`). If it differs, the
   browser refuses to start the host.

**Firefox**
1. Open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → pick `manifest.json`.
2. In `about:addons` → DarkHub Vault → **Permissions**, allow access to all websites (Firefox makes MV3 host
   permissions opt-in); otherwise the inline icon and form detection do not run.
3. Temporary add-ons are removed when Firefox closes. A permanent install needs the extension signed by Mozilla (the
   gecko id `vault@darkhub.app` must be kept).

### 3. Pair

Click the extension icon → **Pair with DarkHub**. The popup shows a 6-digit code and DarkHub shows a dialog with a code:
accept only if they match. Paired browsers are listed in DarkHub (Password vault → Browser extension) and can be revoked
there; the extension can also unpair itself.

## Using it

- **Popup**: lists the logins saved for the current tab's site, with a **Fill** button each.
- **Inline icon**: focusing a username or password field shows a small DarkHub icon; click it to pick a login.
- **Save**: after you submit a login form, the toolbar icon gets a `+` badge; open the popup and click **Send to
  DarkHub**. DarkHub asks for confirmation before anything is saved (turn "Offer to save logins" off to disable this).

## Security model

- Nothing is answered while the vault is locked. The vault also locks on the Windows lock screen and on sleep.
- The app never sends the vault: a query returns only usernames of entries for the page's site. The password of one
  entry is returned only on an explicit fill (a real user click), and only after the app re-checks that the entry
  matches the page URL reported by the browser (not by the page). The extension fills only when the answer's origin is
  the page's origin.
- Matching: exact host first (`www.` ignored), then same registrable domain (eTLD+1, built-in list of multi-label
  suffixes and hosting platforms such as `github.io`). Ports must match. `http://` pages only match entries saved
  explicitly as `http://...` (exact host), except localhost; entries saved as `https://` never match `http://` pages.
  IPs and localhost match exactly only. Entries whose site is not a host name (for example "Gmail") never match.
- Frames: a frame only gets logins when it is same-site with the top page.
- The inline icon and menu live in a closed shadow root, so the page cannot read them through the DOM.
- Requests are rate limited per paired browser (queries 60/min, fills 20/min, save prompts 6/min, pairing 3 per 10 min).
- Transport: the host↔app link is TCP bound to `127.0.0.1` only, authenticated both ways with HMAC-SHA256 over the
  per-start secret in `bridge.cfg` (user-profile ACL). On top of that each browser needs its pairing token.

Found a problem? See [SECURITY.md](./.github/SECURITY.md).

## Development

There is no build step: the files in [extension/](./extension) are loaded as they are.

```bash
node scripts/check.mjs      # syntax, manifest and pt/en string checks (what CI runs)
```

Load the folder unpacked (see above) and reload it from the extensions page after each change. The app-side rules
(matching, rate limits, pairing) live in DarkHub Suite: [electron/services/vaultBridge/](https://github.com/Pokeralho/darkhub-suite/tree/main/electron/services/vaultBridge),
tests in `tests/vaultBridge.test.ts`.

| File | What it does |
|---|---|
| `background.js` | Native messaging port, pairing, popup and content-script requests, save offers |
| `content.js` | Finds login forms, inline icon and picker, fills fields, notices submitted logins |
| `popup.html` / `popup.css` / `popup.js` | The toolbar popup |

## Privacy

Nothing is collected or sent anywhere: see [PRIVACY.md](./PRIVACY.md).

## Contributing

Bug reports, translations and pull requests are welcome: read [CONTRIBUTING.md](./.github/CONTRIBUTING.md).
Changes to what the extension can access (permissions, messages, matching) need a matching change in DarkHub Suite.

## License

[MIT](./LICENSE)
