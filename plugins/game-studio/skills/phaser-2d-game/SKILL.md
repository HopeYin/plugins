---
name: phaser-2d-game
description: Implement deterministic 2D browser-game vertical slices with Phaser, TypeScript, Vite, a DOM HUD, semantic input actions, and a browser test bridge. Use for Phaser implementation, scene/gameplay architecture, or when copying and adapting the Game Studio 2D starter.
---

# Phaser 2D Game

Use this as the default implementation path after `game-spec` freezes the vertical-slice contract.

## Start From the Stable Template

Copy `assets/phaser-2d-starter/` into the target project. It contains a small playable loop with:

- Phaser + TypeScript + Vite;
- deterministic seed-derived state;
- one explicit keyboard-to-action map;
- a DOM HUD shell around the canvas;
- `window.__GAME_STUDIO__` for reset, semantic actions, explicit stepping, and JSON-safe state;
- `data-game-state` markers for named screenshot checkpoints;
- no remote assets or runtime services.

Replace the example rules and presentation while preserving these boundaries. Keep GameSpec action and state IDs synchronized with `src/actions.ts`, the HUD marker, and eval scenarios.

## Architecture

1. Keep simulation state and rules outside Phaser display objects.
2. Let the scene adapt state into sprites, shapes, cameras, animation, and effects.
3. Send production keyboard/pointer input and evaluation input through the same semantic action dispatcher.
4. Return JSON-safe state from the bridge; never expose Phaser objects or timestamps.
5. Use seeded randomness and explicit fixed stepping when gameplay depends on time.
6. Keep dense text, status, menus, and settings in the DOM HUD unless an in-world presentation is essential.

## Vertical-Slice Order

1. Copy the starter and replace its bundled `game-spec.json` with the frozen project spec.
2. Implement the objective and visible success/failure state before adding content breadth.
3. Make each named state observable in both the HUD/canvas and `data-game-state`.
4. Run the game through real controls.
5. Route deterministic review to `../game-eval/SKILL.md`.

## Anti-Patterns

- Game rules hidden in an `update()` loop.
- Separate control paths for humans and evals.
- Unseeded randomness, wall-clock IDs, or arbitrary automation sleeps.
- Mutable globals passed between scenes.
- HUD text embedded in canvas solely for convenience.
- Expanding assets, levels, or systems beyond the frozen slice.

## References

- Frozen contract: `../game-spec/SKILL.md`
- Deterministic evaluation: `../game-eval/SKILL.md`
- Deeper module structure: `../../references/phaser-architecture.md`
- Frontend direction: `../game-ui-frontend/SKILL.md`
- Sprite workflow when required: `../sprite-pipeline/SKILL.md`
