---
name: game-studio
description: Run the end-to-end browser-game studio loop from brief and frozen GameSpec through a stable starter, implementation, real UI playtest, screenshot/state review, refinement, and publish handoff. Use when a user asks to make, prototype, iterate on, or ship a browser game and needs one executable workflow across the specialist skills.
---

# Game Studio

Drive toward one playable vertical slice. Default to the small Phaser 2D path unless the user explicitly requests an existing 3D stack.

## Executable Loop

Keep one visible artifact trail through every stage:

1. **Brief:** Reduce the request to fantasy, player verbs, session length, objective, success/failure, and exclusions.
2. **Freeze:** Use `../game-spec/SKILL.md` to create and validate `game-spec.json`. Freeze action IDs, observable state IDs, seed, and required screenshots before coding.
3. **Start stable:** For 2D work, copy `../phaser-2d-game/assets/phaser-2d-starter/` instead of inventing new plumbing. Preserve its input map, DOM HUD boundary, deterministic state, bridge, and state marker.
4. **Implement:** Build only the smallest loop that reaches a visible success or failure state. Keep rules outside renderer objects and keep GameSpec IDs stable.
5. **Run:** Start the repository's normal development command and reach the first actionable state.
6. **Play the real UI:** Use real keyboard or pointer input for the main player path. Confirm the bridge is an evaluation boundary, not a replacement for playable controls.
7. **Review evidence:** Use `../game-eval/SKILL.md` for deterministic scenarios, named screenshots, console/network capture, state snapshots, and the concise rubric.
8. **Refine:** Fix the smallest player-visible issue set, then replay affected scenarios and every required screenshot state. Revise GameSpec first if intent changes.
9. **Package and publish:** Use `../game-publish-sites/SKILL.md` to produce a browser-self-contained build and Sites handoff. Publish only when the user explicitly authorizes it and Sites is available.

Do not call a slice complete because it builds. Completion requires a real-input playthrough plus deterministic evidence for every required state.

## Routing

- Frozen vertical-slice contract: `../game-spec/SKILL.md`
- Default 2D implementation and starter: `../phaser-2d-game/SKILL.md`
- Deterministic browser evaluation: `../game-eval/SKILL.md`
- Manual or exploratory browser QA: `../game-playtest/SKILL.md`
- Static packaging and Sites handoff: `../game-publish-sites/SKILL.md`
- HUD and menu direction: `../game-ui-frontend/SKILL.md`
- 2D sprite work when the slice needs it: `../sprite-pipeline/SKILL.md`
- Explicit vanilla Three.js requests: `../three-webgl-game/SKILL.md`
- Explicit React Three Fiber requests: `../react-three-fiber-game/SKILL.md`
- Explicit 3D asset shipping work: `../web-3d-asset-pipeline/SKILL.md`

The same brief → freeze → implement → playtest → review → refine → publish loop applies to explicit 3D work, but this prototype adds no new 3D starter or pipeline.

## Required Handoff

For an implemented slice, return:

- frozen GameSpec revision and path;
- starter or stack used and development command;
- real-input playtest path;
- required screenshot and state-snapshot paths;
- console/network error result and rubric summary;
- unresolved GameSpec gaps;
- packaged output or next refinement action.

## Worked Example

Read `../../examples/neon-relay/workflow.md` for one prompt-to-playable example backed by a complete GameSpec and deterministic scenario contract.
