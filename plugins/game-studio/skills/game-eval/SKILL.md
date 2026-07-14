---
name: game-eval
description: Evaluate a browser-game vertical slice through deterministic Playwright scenarios, named screenshot states, console and network error capture, machine-readable state snapshots, and a concise playability rubric. Use when implementing or refining a browser game, checking a frozen GameSpec, or producing repeatable playtest evidence.
---

# Game Eval

Exercise the game through semantic actions and observable state. Treat screenshots and browser state as complementary evidence: neither alone proves a playable loop.

## Preconditions

- Read the frozen `game-spec.json` and its required screenshot state IDs.
- Confirm the game exposes the named bridge from GameSpec. The default is `window.__GAME_STUDIO__` with `ready`, `reset(seed)`, `dispatch(action)`, `step(frames)`, and `getState()`.
- Serve a production-like build at a stable local URL.
- Read `references/scenario-contract.md` before authoring or changing scenarios.

## Deterministic Run

1. Copy `assets/playwright/game.e2e.ts` and `assets/playwright/scenarios.json` into the project test surface.
2. Map each scenario to GameSpec action IDs and reset it with the frozen seed.
3. Register console, page, failed-request, and HTTP error listeners before navigation.
4. Wait for `bridge.ready === true`; do not replace readiness with arbitrary sleeps.
5. Dispatch semantic actions through the bridge. Use `step(frames)` when time affects simulation.
6. At each checkpoint, assert the state marker, attach `getState()` as JSON, and capture a screenshot named exactly after the GameSpec state.
7. Fail the scenario on unexpected console, page, or network errors.
8. Run the concise rubric below and report evidence paths with findings.

When a real pointer or keyboard behavior is part of the contract, add one scenario that uses the actual browser input in addition to bridge-driven deterministic coverage.

## Rubric

Score each item `pass`, `partial`, or `fail` with one sentence of evidence:

- **Boot:** reaches the first actionable state without browser errors.
- **Control:** documented inputs produce immediate, legible feedback.
- **Loop:** the core action can progress to the stated success or failure state.
- **Clarity:** objective, current state, and outcome are readable without obscuring play.
- **Determinism:** the same seed and actions reproduce state snapshots and named screenshots.
- **Resilience:** restart and viewport resize preserve a playable state.

A vertical slice is ready to publish only when every item passes and all required GameSpec screenshots exist.

## Refine Loop

Lead with player-visible findings. For each issue, give the state, action sequence, screenshot or snapshot path, expected GameSpec behavior, and smallest likely owning subsystem. Fix one coherent issue set, then re-run the affected scenario plus the complete required-state set.

## Resources

- Scenario data contract: `references/scenario-contract.md`
- Machine-readable scenario schema: `references/scenario.schema.json`
- Copyable Playwright runner: `assets/playwright/game.e2e.ts`
- Example scenario file: `assets/playwright/scenarios.json`
