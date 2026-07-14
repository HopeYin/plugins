# Neon Relay: prompt to playable slice

This worked example is implemented by the copyable starter at `../../skills/phaser-2d-game/assets/phaser-2d-starter/`.

## 1. Brief

The prompt in `prompt.md` becomes one 60-second loop: locate a signal beacon, move onto it, route it, and repeat until three signals are complete. Levels, enemies, audio, persistence, and production art are excluded.

## 2. Frozen contract

The starter's `game-spec.json` freezes seed `5601`, six semantic action IDs, the `ready` / `playing` / `won` states, and three required screenshots. Runtime code and `eval/scenarios.json` consume those IDs unchanged.

## 3. Stable implementation

The starter keeps rules in `src/state.ts`, rendering in `src/game.ts`, physical controls in `src/actions.ts`, and the DOM HUD plus bridge wiring in `src/main.ts`. Both keyboard input and Playwright dispatch the same actions. The visible state badge and JSON snapshot update from the same state object.

## 4. Play and evaluate

The real-input path is: move with WASD or arrows, stand on the gold beacon, press Space, and repeat. The starter's `eval/scenarios.json` encodes the same seeded route without arbitrary sleeps. The game-eval runner captures:

- `route-three-signals--ready.png` and `.json`;
- `route-three-signals--playing.png` and `.json`;
- `route-three-signals--won.png` and `.json`;
- console, page, failed-request, and HTTP error evidence.

## 5. Refine and publish handoff

Review the three screenshot/state pairs against the rubric, fix the smallest visible issue set, and replay all required states. A passing production build can then be packaged by `game-publish-sites`; the workflow stops at a Sites handoff unless the user explicitly authorizes publishing.
