import Phaser from "phaser";
import { ACTIONS, type ActionId } from "./actions";
import { createInitialState, reduceAction, type GameState } from "./state";

const CELL = 56;
const GRID_X = 32;
const GRID_Y = 18;

export class GameRuntime {
  private state: GameState;
  private graphics?: Phaser.GameObjects.Graphics;
  private readonly onState: (state: GameState) => void;
  private readonly onReady: () => void;

  constructor(parent: HTMLElement, seed: number, onState: (state: GameState) => void, onReady: () => void) {
    this.state = createInitialState(seed);
    this.onState = onState;
    this.onReady = onReady;
    const runtime = this;

    new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: 960,
      height: 540,
      backgroundColor: "#08111f",
      render: { antialias: true, pixelArt: false },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: {
        create(this: Phaser.Scene) {
          runtime.graphics = this.add.graphics();
          runtime.render();
          runtime.onReady();
        }
      }
    });
  }

  dispatch(action: ActionId): void {
    if (action === ACTIONS.restart) {
      this.reset(this.state.seed);
      return;
    }
    this.state = reduceAction(this.state, action);
    this.render();
  }

  reset(seed = this.state.seed): void {
    this.state = createInitialState(seed);
    this.render();
  }

  step(frames = 1): void {
    this.state = { ...this.state, tick: this.state.tick + Math.max(0, frames) };
    this.render();
  }

  getState(): GameState {
    return structuredClone(this.state);
  }

  private render(): void {
    if (!this.graphics) return;
    const graphics = this.graphics;
    graphics.clear();

    graphics.lineStyle(1, 0x17304d, 0.8);
    for (let x = 0; x <= 16; x += 1) graphics.lineBetween(GRID_X + x * CELL, GRID_Y, GRID_X + x * CELL, GRID_Y + 9 * CELL);
    for (let y = 0; y <= 9; y += 1) graphics.lineBetween(GRID_X, GRID_Y + y * CELL, GRID_X + 16 * CELL, GRID_Y + y * CELL);

    const beaconX = GRID_X + this.state.beacon.x * CELL + CELL / 2;
    const beaconY = GRID_Y + this.state.beacon.y * CELL + CELL / 2;
    graphics.fillStyle(0xffca5c, 0.2).fillCircle(beaconX, beaconY, 23);
    graphics.lineStyle(3, 0xffca5c, 1).strokeCircle(beaconX, beaconY, 15);

    const playerX = GRID_X + this.state.player.x * CELL + 10;
    const playerY = GRID_Y + this.state.player.y * CELL + 10;
    graphics.fillStyle(this.state.status === "won" ? 0x59f6b1 : 0x56d6ff, 1).fillRoundedRect(playerX, playerY, 36, 36, 9);

    if (this.state.status === "won") {
      graphics.fillStyle(0x07101c, 0.74).fillRoundedRect(280, 190, 400, 150, 18);
      graphics.lineStyle(2, 0x59f6b1, 1).strokeRoundedRect(280, 190, 400, 150, 18);
    }

    this.onState(this.getState());
  }
}
