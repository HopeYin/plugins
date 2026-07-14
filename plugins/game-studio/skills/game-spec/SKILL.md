---
name: game-spec
description: Turn a browser-game brief into a frozen, machine-readable GameSpec for a playable vertical slice. Use when starting or revising a game prototype, before implementation begins, or when gameplay, controls, named states, deterministic hooks, evaluation scenarios, and out-of-scope boundaries need one explicit contract.
---

# Game Spec

Convert the user's idea into a small contract that implementation and evaluation can share. Optimize for one playable vertical slice, not a complete design document.

## Workflow

1. Write a one-paragraph brief covering the fantasy, player verbs, session length, and visible win or fail condition.
2. Copy `assets/game-spec.template.json` into the game project as `game-spec.json`.
3. Fill every required field using `references/game-spec.schema.json`. Read `references/game-spec.md` for field decisions and freeze rules.
4. Use stable kebab-case IDs for actions and observable states. Bind evaluation to those IDs rather than implementation details.
5. Confirm the spec has exactly one vertical-slice objective, deterministic reset behavior, required screenshot states, and explicit exclusions.
6. Freeze the file before implementation. If intent changes, update the spec first and record the revision in `changes`.

## Required Contract

Keep these surfaces aligned:

- `actions`: semantic inputs such as `move-left` or `restart`, with human bindings.
- `states`: player-visible checkpoints such as `ready`, `playing`, `won`, or `failed`.
- `determinism`: seed, reset action, fixed-step policy, and browser bridge name.
- `evaluation`: scenario file and the named screenshot states that prove the slice.
- `outOfScope`: features deliberately excluded from this iteration.

Do not prescribe scene classes, component trees, or art production details unless they affect the observable contract.

## Handoff

Return the brief, the validated `game-spec.json` path, and a short list of frozen action/state IDs. Route implementation to `../phaser-2d-game/SKILL.md` by default, then evaluation to `../game-eval/SKILL.md`.

## Resources

- Field and freeze guidance: `references/game-spec.md`
- Machine-readable schema: `references/game-spec.schema.json`
- Copyable template: `assets/game-spec.template.json`
