# Final browser-game package check

## Artifact

- Production build exits successfully and produces one static output directory.
- Entry HTML loads with a relative or deploy-safe base path.
- Runtime code contains no localhost, development-server, or filesystem references.
- Required scripts, styles, images, audio, fonts, and game data live in the output directory.
- Source maps, debug menus, and test bridge exposure follow the project's shipping policy. The bridge may remain read-only when evals depend on it; mutation hooks should be gated when the game is public.

## Static-server replay

- First actionable state appears without console, page, request, or HTTP errors.
- Documented keyboard and pointer input reaches the same semantic actions used in evals.
- Core loop reaches the GameSpec success or failure state.
- Restart reproduces the seeded initial state.
- Every required named screenshot is recaptured from the packaged build.
- Desktop viewport and one narrow viewport remain playable.

## Sites metadata

Prepare, but do not publish without explicit authorization:

- title and suggested slug;
- static output directory;
- GameSpec revision;
- final scenario and screenshot evidence paths;
- concise game description and controls;
- any intentional external network dependency.
