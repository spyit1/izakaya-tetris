export type TetrominoType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

export type CardType = TetrominoType | "ANY" | "NONE";

export type GameStatus =
  | "setup"
  | "idle"
  | "drink-choice"
  | "excluding"
  | "drawing"
  | "placing"
  | "gameover"
  | "cleared";

export type ModalType =
  | "none"
  | "drink-choice"
  | "exclude"
  | "draw-pick"
  | "draw-result"
  | "any-select";

export type DrawSource = "drink" | "stock" | null;

export type CellValue = 0 | TetrominoType;
export type Board = CellValue[][];

export type HiddenCard = {
  id: string;
  card: CardType;
};

export type Point = {
  x: number;
  y: number;
};

export type ActivePiece = {
  type: TetrominoType;
  rotation: number;
  x: number;
  y: number;
};

export type GameState = {
  board: Board;

  currentBlock: TetrominoType | null;
  holdBlock: TetrominoType | null;
  activePiece: ActivePiece | null;

  stock: number;
  excludedCards: CardType[];
  drawnCard: CardType | null;
  hiddenCards: HiddenCard[];

  gameStatus: GameStatus;
  modal: ModalType;
  drawSource: DrawSource;

  clearedLines: number;
  usedDrinks: number;
  elapsedTime: number;
  placementTimeLeft: number;

  canHold: boolean;
  initialUsedRows: number;
};

export type GameAction =
  | { type: "LOAD_STATE"; payload: GameState }
  | { type: "SET_INITIAL_USED_ROWS"; rows: number }
  | { type: "RESET_GAME_WITH_SETTINGS" }
  | { type: "ADD_DRINK" }
  | {
      type: "CHOOSE_DRINK_ACTION";
      choice: "draw-now" | "draw-with-exclude" | "store";
    }
  | { type: "START_DRAW_FROM_STOCK" }
  | { type: "CHOOSE_STOCK_DRAW_MODE"; mode: "normal" | "exclude" }
  | { type: "EXCLUDE_CARD"; card: CardType }
  | { type: "TO_DRAW_STEP" }
  | { type: "PICK_HIDDEN_CARD"; id: string }
  | { type: "SELECT_ANY_BLOCK"; block: TetrominoType }
  | { type: "MOVE_LEFT" }
  | { type: "MOVE_RIGHT" }
  | { type: "ROTATE_LEFT" }
  | { type: "ROTATE_RIGHT" }
  | { type: "CONFIRM_PLACE" }
  | { type: "USE_HOLD" }
  | { type: "TICK_ELAPSED_TIME" }
  | { type: "TICK_PLACEMENT_TIMER" }
  | { type: "TIMEOUT_PLACE_CURRENT" }
  | { type: "SKIP_TURN" }
  | { type: "CLOSE_MODAL" }
  | { type: "RESET_DRAW_TEMP" };