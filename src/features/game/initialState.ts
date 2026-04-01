import { createInitialBoard } from "./boardutils";
import { GameState } from "./types";

const initialUsedRows = 0;

export const initialState: GameState = {
  board: createInitialBoard(initialUsedRows),

  currentBlock: null,
  holdBlock: null,
  activePiece: null,

  stock: 0,
  excludedCards: [],
  drawnCard: null,
  hiddenCards: [],

  gameStatus: "setup",
  modal: "none",
  drawSource: null,

  clearedLines: 0,
  usedDrinks: 0,
  elapsedTime: 0,
  placementTimeLeft: 5,

  canHold: true,
  initialUsedRows,
};