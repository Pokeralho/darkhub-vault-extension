# Security policy

## Supported versions

Only the [latest release](https://github.com/Pokeralho/darkhub-vault-extension/releases/latest) receives fixes, used
with the latest [DarkHub Suite](https://github.com/Pokeralho/darkhub-suite/releases/latest).

## Reporting a vulnerability

Please do **not** open a public issue for a vulnerability. Use
[GitHub private vulnerability reporting](https://github.com/Pokeralho/darkhub-vault-extension/security/advisories/new)
and include:

- extension version, browser and version, DarkHub Suite version;
- what an attacker can do and under which conditions (malicious page, malicious frame, another extension, local user...);
- steps or a proof of concept.

You will get an answer within 7 days. Fixes ship in a new release, credited to you unless you prefer otherwise.

## Scope

In scope: everything in [extension/](../extension), for example a page reading a password it should not get, a fill on
the wrong origin or frame, or a page triggering a fill or a save without a real user action.

The native host, the loopback bridge, pairing and the vault itself live in DarkHub Suite: report those through
[its security policy](https://github.com/Pokeralho/darkhub-suite/security/policy). If you are not sure where it
belongs, report it here.
