# Deterministic browser scenario contract

## Bridge

Expose one test-only observation boundary without coupling scenarios to Phaser objects:

```ts
type GameStudioBridge = {
  ready: boolean;
  reset(seed?: number): void;
  dispatch(action: string): void;
  step(frames?: number): void;
  getState(): unknown;
};
```

Production input and the bridge must dispatch the same semantic action IDs. `getState()` must return JSON-safe data and exclude renderer objects, timestamps, and nondeterministic IDs.

## State marker

Keep one DOM element with `data-game-state="<state-id>"`. It may be a compact visible badge or a screenshot-safe test marker, but it must not depend on canvas pixel inspection. Update it in the same render pass as the player-visible state.

## Scenario file

Validate `scenarios.json` with `scenario.schema.json`. Each scenario:

- starts from an explicit seed;
- uses stable action IDs from GameSpec;
- advances time explicitly when required;
- names checkpoints after GameSpec state IDs;
- asserts a small state subset rather than serializing framework internals.

Do not use arbitrary delays. Wait for bridge readiness or a named state transition.

## Error evidence

Register all listeners before navigation and persist only these categorical records:

- console errors: sanitized source location plus line and column;
- uncaught `pageerror` events: an `uncaught exception` category;
- `requestfailed` events: sanitized request source plus a `failed` category;
- responses with status 400 or above: status plus sanitized response source.

For HTTP(S), a sanitized source contains origin and pathname only. For every other URI scheme, retain the scheme and replace its payload with `<redacted>`. Never persist raw console text, exception text, request-failure reasons, URL user-info, query strings, fragments, local paths, or inline URI data. Treat every captured browser error as a failure in this prototype.

## Evidence names

Use `<scenario-id>--<state-id>.png` for screenshots and `<scenario-id>--<state-id>.json` for state attachments. Keep names stable across runs so diffs stay understandable.
