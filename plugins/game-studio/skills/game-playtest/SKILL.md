---
name: game-playtest
description: Play browser games through their real UI and report player-visible QA findings across controls, transitions, HUD, canvas, responsive layout, and visual states. Use for exploratory playtesting, manual browser QA, screenshot review, or real-input verification; route repeatable GameSpec scenarios to game-eval.
---

# Game Playtest

Play the slice the way a player does, through the visible UI and documented controls. Use `../game-eval/SKILL.md` alongside this skill when the project has a frozen GameSpec or deterministic bridge.

## Real UI Pass

1. Boot the normal development or packaged URL and reach the first actionable screen.
2. Use actual keyboard, pointer, touch, pause, and restart controls named by the game.
3. Complete the core loop to a visible success or failure state.
4. Capture screenshots at the GameSpec state names; add exploratory screenshots only when they explain a finding.
5. Check the DOM HUD separately from the canvas, then inspect how they compose at desktop and one narrow viewport.
6. Record console, page, request, and HTTP errors.
7. Report findings in severity order with exact input sequences and owning surface.

Do not use test-bridge dispatch as the only playtest. It proves deterministic rules, not physical input wiring or player legibility.

## Deterministic Companion Pass

Route scenario contracts, seeded reset, state snapshots, named screenshot assertions, and rubric scoring to `../game-eval/SKILL.md`. A release candidate needs both:

- one real-input route through the core loop;
- deterministic evidence for every required GameSpec state.

## Common Checks

- first-load readiness and objective clarity;
- input feedback, focus handling, and pause/restart behavior;
- sprite or geometry alignment and outcome readability;
- HUD overlap, menu transitions, and playfield visibility;
- desktop/narrow viewport sanity and safe areas;
- reduced-motion behavior when applicable;
- visual state matching the attached JSON snapshot;

For explicit 3D work, also check camera reset, pointer-lock transitions, depth readability, asset stalls, collision proxies, and WebGL performance cliffs.

## Reporting

For each finding include what the player sees, the exact controls and named state, screenshot/snapshot evidence, why it matters, and the likely owning subsystem. End with the real-input path completed and any GameSpec state that remains unproven.

## References

- Deterministic evaluation: `../game-eval/SKILL.md`
- Frontend review cues: `../game-ui-frontend/SKILL.md`
- Broader checklist: `../../references/playtest-checklist.md`
