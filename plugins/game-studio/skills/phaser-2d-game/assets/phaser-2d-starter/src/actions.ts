export const ACTIONS = {
  moveLeft: "move-left",
  moveRight: "move-right",
  moveUp: "move-up",
  moveDown: "move-down",
  collect: "collect",
  restart: "restart"
} as const;

export type ActionId = (typeof ACTIONS)[keyof typeof ACTIONS];

const ACTION_IDS = new Set<string>(Object.values(ACTIONS));

export function isActionId(action: string): action is ActionId {
  return ACTION_IDS.has(action);
}

export const INPUT_ACTION_MAP: Readonly<Record<string, ActionId>> = {
  ArrowLeft: ACTIONS.moveLeft,
  KeyA: ACTIONS.moveLeft,
  ArrowRight: ACTIONS.moveRight,
  KeyD: ACTIONS.moveRight,
  ArrowUp: ACTIONS.moveUp,
  KeyW: ACTIONS.moveUp,
  ArrowDown: ACTIONS.moveDown,
  KeyS: ACTIONS.moveDown,
  Space: ACTIONS.collect,
  KeyR: ACTIONS.restart
};
