---
name: game-publish-sites
description: Final-check and package a browser-self-contained game, then hand the verified static output to Sites publishing when that capability is available. Use when a browser-game vertical slice has passed evaluation and the user asks to prepare, preview, or publish it; never deploy without explicit user authorization.
---

# Publish Game to Sites

Prepare a static game artifact that can run from its packaged directory without development servers, localhost calls, or remote runtime dependencies. Publishing is a separate, explicit handoff.

## Package

1. Read the frozen `game-spec.json`, its required screenshots, and the latest `game-eval` rubric.
2. Stop if required states are missing, any rubric item is not `pass`, or browser errors remain.
3. Run the project's production build. Preserve the repository's package manager and existing build command.
4. Inspect the output using `references/final-check.md`. All scripts, styles, fonts, audio, images, and data needed at runtime must resolve from the packaged directory.
5. Serve that directory with a plain static server and re-run the boot, core-loop, restart, and required-screenshot scenarios against it.
6. Produce a handoff containing the output directory, title, suggested slug, GameSpec path, eval evidence paths, and build command.

Do not rewrite the game into a new framework or introduce a deployment SDK merely to package it.

## Sites Handoff

If a connected Sites publishing capability is available and the user explicitly asks to publish, pass the verified output directory and handoff metadata to it. Preserve its preview/review step before any public publish. If Sites is unavailable, return the package path and the missing capability; do not substitute another host without the user's direction.

For preparation-only requests, stop after the handoff. Do not deploy, create a public URL, or modify an existing Site.

## Completion Report

Return:

- packaged directory and build command;
- production-like URL used for the final check;
- GameSpec revision and scenario/evidence paths;
- browser error result and rubric summary;
- Sites handoff status: `ready`, `unavailable`, or `published` with user authorization.

## Reference

- Final package checklist: `references/final-check.md`
