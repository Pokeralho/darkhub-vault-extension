# Publishing in the browser stores

Everything the stores ask for is ready in this repository; creating the developer accounts and submitting is up to the
owner (each store needs its own account, and the Chrome Web Store charges a one-time 5 USD fee).

| | Chrome Web Store | Microsoft Edge Add-ons | Firefox Add-ons (AMO) |
|---|---|---|---|
| Account | <https://chrome.google.com/webstore/devconsole> (5 USD once) | <https://partner.microsoft.com/dashboard/microsoftedge> (free) | <https://addons.mozilla.org/developers> (free) |
| Upload | `darkhub-vault-X.Y.Z.zip` from the release | same zip | same zip |
| Extension id | **new id from the store** | **new id from the store** | `vault@darkhub.app` (kept) |
| Review | days | days | hours to days |

## The one change after Chrome and Edge publish

The stores give the extension a new id, and DarkHub's native host only answers the ids it knows. After each store
accepts the extension, add its id to `STORE_CHROMIUM_IDS` in DarkHub Suite
(`electron/services/vaultBridge/nativeHost.js`) and release DarkHub; users then click **Register** again in
Password vault → Browser extension. The `key` field in `manifest.json` only fixes the id of the unpacked copy.

## Listing text

**Name:** DarkHub Vault

**Summary (132 characters max)**
- en: Fills and saves logins from your DarkHub Suite password vault. Local only: talks to the DarkHub app on your PC, never the internet.
- pt-BR: Preenche e salva logins do cofre de senhas do DarkHub Suite. Só local: fala com o app DarkHub no seu PC, nunca com a internet.

**Description (en)**

DarkHub Vault connects your browser to the password vault in DarkHub Suite, the Windows utility.

• See the logins saved for the site you are on and fill them in one click.
• A small DarkHub icon in login fields lets you pick a login right there.
• After you sign in somewhere new, it offers to save the login; DarkHub asks you before saving anything.

Local only. There is no server, account or sync: the extension talks to the DarkHub app on your PC through native
messaging. Passwords leave the vault only when you click Fill, and only for the site that saved them. Nothing is
answered while the vault is locked.

Requires DarkHub Suite 0.7.3 or newer on Windows 10/11 (free, open source: github.com/Pokeralho/darkhub-suite). Pair
the browser once with a 6-digit code shown in both places.

**Description (pt-BR)**

O DarkHub Vault liga o seu navegador ao cofre de senhas do DarkHub Suite, o utilitário para Windows.

• Veja os logins salvos para o site aberto e preencha com um clique.
• Um pequeno ícone do DarkHub nos campos de login deixa você escolher o login ali mesmo.
• Depois que você entra num site novo, ele oferece salvar o login; o DarkHub pergunta antes de salvar.

Só local. Não há servidor, conta nem sincronização: a extensão fala com o app DarkHub no seu PC por native messaging.
As senhas só saem do cofre quando você clica em Preencher, e só para o site que as salvou. Nada é respondido com o cofre
bloqueado.

Requer o DarkHub Suite 0.7.3 ou mais novo no Windows 10/11 (gratuito, código aberto: github.com/Pokeralho/darkhub-suite).
Pareie o navegador uma vez com um código de 6 dígitos mostrado nos dois lugares.

**Category:** Productivity (Chrome) / Privacy & Security (Firefox)

**Privacy policy URL:** <https://github.com/Pokeralho/darkhub-vault-extension/blob/main/PRIVACY.md>

**Images:** `docs/store/screenshot-1-*.png`, `docs/store/screenshot-2-*.png` (1280x800), `docs/store/promo-small-440x280.png`,
icon `extension/icons/icon-128.png`.

## Permission justifications (Chrome asks for one per permission)

| Permission | Why |
|---|---|
| `nativeMessaging` | The only way the extension reaches the DarkHub app on the same PC; there is no server. |
| `storage` | Keeps the pairing token and the "offer to save logins" setting. |
| `tabs` | Reads the address of the active tab to show the logins saved for that site in the popup. |
| Host permission `http://*/*`, `https://*/*` | The content script finds login forms, shows the DarkHub icon in them and fills the login the user picks, on any site the user has logins for. |
| Remote code | None. All code is in the package. |

**Single purpose:** fill and save logins from the user's DarkHub Suite password vault.

**Data usage (Chrome form):** handles "authentication information" (usernames and passwords) only to fill them on the
user's request; not sold, not transferred, not used for anything else. Firefox: the manifest declares
`data_collection_permissions: none` (nothing is sent to the developer or anyone else).
