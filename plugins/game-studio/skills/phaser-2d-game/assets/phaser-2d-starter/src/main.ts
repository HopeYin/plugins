import "./style.css";
import gameSpec from "../game-spec.json";
import { ACTIONS, INPUT_ACTION_MAP, isActionId } from "./actions";
import { GameRuntime } from "./game";
import type { GameState } from "./state";

declare global {
  interface Window {
    __GAME_STUDIO__?: {
      ready: boolean;
      reset(seed?: number): void;
      dispatch(action: string): void;
      step(frames?: number): void;
      getState(): GameState;
    };
  }
}

const DEFAULT_SEED = gameSpec.determinism.seed;
const gameRoot = document.querySelector<HTMLElement>("#game")!;
const score = document.querySelector<HTMLElement>("#score")!;
const status = document.querySelector<HTMLElement>("#status")!;
const marker = document.querySelector<HTMLOutputElement>("#game-state-marker")!;
const restart = document.querySelector<HTMLButtonElement>("#restart")!;

function renderHud(state: GameState): void {
  score.textContent = `${state.score} / ${state.targetScore}`;
  status.textContent = state.status[0].toUpperCase() + state.status.slice(1);
  marker.dataset.gameState = state.status;
  marker.textContent = `STATE: ${state.status.toUpperCase()}`;
}

const bridge = {
  ready: false,
  reset(seed = DEFAULT_SEED) {
    runtime.reset(seed);
  },
  dispatch(action: string) {
    if (!isActionId(action)) throw new TypeError(`Unknown game action: ${action}`);
    runtime.dispatch(action);
  },
  step(frames = 1) {
    runtime.step(frames);
  },
  getState() {
    return runtime.getState();
  }
};

const runtime = new GameRuntime(gameRoot, DEFAULT_SEED, renderHud, () => {
  bridge.ready = true;
});

window.__GAME_STUDIO__ = bridge;

window.addEventListener("keydown", (event) => {
  const action = INPUT_ACTION_MAP[event.code];
  if (!action) return;
  event.preventDefault();
  bridge.dispatch(action);
});

restart.addEventListener("click", () => bridge.dispatch(ACTIONS.restart));
