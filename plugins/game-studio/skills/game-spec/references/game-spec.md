# GameSpec guidance

## Contract boundary

GameSpec describes what a player and evaluator can observe in one vertical slice. It is not a backlog, narrative bible, balance sheet, or framework architecture.

## Field decisions

- Keep `brief` to one paragraph and `sessionLengthSeconds` to a realistic prototype session.
- Make `verbs` player language: move, dodge, collect, aim, choose.
- Give every `action` a stable ID and at least one binding. Code and Playwright scenarios use the same IDs.
- Give every `state` an observable condition. Each required screenshot name must match a state ID.
- Use one nonnegative 32-bit integer `seed`. Resetting with the same seed must reproduce initial gameplay state.
- Use a fixed simulation step when time affects gameplay. Discrete or turn-based games may set `fixedStepMs` to `null`.
- Keep `outOfScope` concrete so implementation does not grow sideways.

## Freeze rule

Treat the first validated file as frozen. Implementation may add internal detail without changing it. When player-visible intent changes:

1. revise the GameSpec first;
2. append a terse entry to `changes` with the new revision and reason;
3. update affected eval scenarios;
4. re-run every required screenshot state.

Do not silently make tests match accidental implementation behavior.

## Acceptance check

A GameSpec is ready when another agent can answer all of these without guessing:

- What does the player do in the first ten seconds?
- How does the slice end successfully or unsuccessfully?
- Which semantic inputs drive it?
- How is the same start state reproduced through `window.__GAME_STUDIO__`?
- Which named screenshots prove the important states?
- What will not be built in this slice?
