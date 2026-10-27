# Changelog

All notable changes to the DarkHub Vault browser extension are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-10-27

### Added
- Extension icons (16, 32, 48, 128 px) with the DarkHub mark.
- Own repository, CI checks (syntax, manifest, pt/en strings) and release packages.

### Changed
- New look matching DarkHub Suite: DarkHub mark, cold neutrals and one accent color.
- Every popup state has a title and one line of help: DarkHub not running, pairing, vault locked, unsupported page,
  no logins.
- The pairing code is shown one digit per box, with a "waiting for confirmation" line.
- Login rows show the user's initial; fill and save results are colored (success / error).
- The inline picker uses the same style, has a "DarkHub Vault" header and its messages follow the browser's language.

## [0.1.0] - 2026-10-23

### Added
- First version, shipped inside DarkHub Suite: pairing with a 6-digit code, popup with per-site logins and Fill,
  inline icon on login fields, offer to save logins after a submit, pt-BR and en-US.
