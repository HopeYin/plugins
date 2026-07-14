import { ACTIONS, type ActionId } from "./actions";

export type GameStatus = "ready" | "playing" | "won";

export type GameState = {
  seed: number;
  tick: number;
  status: GameStatus;
  score: number;
  targetScore: number;
  player: { x: number; y: number };
  beacon: { x: number; y: number };
};

const GRID_WIDTH = 16;
const GRID_HEIGHT = 9;

function beaconFor(seed: number, score: number): { x: number; y: number } {
  return {
    x: ((seed + score * 7) % (GRID_WIDTH - 2)) + 1,
    y: ((Math.floor(seed / 10) + score * 5) % (GRID_HEIGHT - 2)) + 1
  };
}

export function createInitialState(seed: number): GameState {
  if (!Number.isInteger(seed) || seed < 0 || seed > 2147483647) {
    throw new RangeError("seed must be a nonnegative 32-bit integer");
  }
  return {
    seed,
    tick: 0,
    status: "ready",
    score: 0,
    targetScore: 3,
    player: { x: 8, y: 4 },
    beacon: beaconFor(seed, 0)
  };
}

function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}

export function reduceAction(state: GameState, action: ActionId): GameState {
  if (state.status === "won") return state;

  const next: GameState = {
    ...state,
    tick: state.tick + 1,
    status: "playing",
    player: { ...state.player },
    beacon: { ...state.beacon }
  };

  if (action === ACTIONS.moveLeft) next.player.x = clamp(next.player.x - 1, GRID_WIDTH - 1);
  if (action === ACTIONS.moveRight) next.player.x = clamp(next.player.x + 1, GRID_WIDTH - 1);
  if (action === ACTIONS.moveUp) next.player.y = clamp(next.player.y - 1, GRID_HEIGHT - 1);
  if (action === ACTIONS.moveDown) next.player.y = clamp(next.player.y + 1, GRID_HEIGHT - 1);

  if (action === ACTIONS.collect && next.player.x === next.beacon.x && next.player.y === next.beacon.y) {
    next.score += 1;
    if (next.score >= next.targetScore) {
      next.status = "won";
    } else {
      next.beacon = beaconFor(next.seed, next.score);
    }
  }

  return next;
}
