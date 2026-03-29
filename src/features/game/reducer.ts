import {
  clearFullLines,
  createActivePiece,
  createInitialBoard,
  getRandomLegalPlacement,
  mergePieceIntoBoard,
  movePieceHorizontally,
  rotatePiece,
} from "./boardutils";
import { CARD_ORDER, createHiddenCards, getAvailableCards } from "./draw";
import { initialState } from "./initialState";
import { PLACEMENT_LIMIT } from "./tetrominoes";
import { GameAction, GameState, TetrominoType } from "./types";

import { Board } from "./types";

function isBoardEmpty(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell === 0));
}

function checkCleared(state: GameState): GameState {
  const noPiece = state.activePiece === null;
  const noCurrent = state.currentBlock === null;
  const noStock = state.stock === 0;
  const emptyBoard = isBoardEmpty(state.board);

  if (noPiece && noCurrent && noStock && emptyBoard) {
    return {
      ...state,
      gameStatus: "cleared",
    };
  }

  return state;
}

function startPlacingWithBlock(
  state: GameState,
  block: TetrominoType
): GameState {
  const activePiece = createActivePiece(state.board, block);

  if (!activePiece) {
    return {
      ...state,
      currentBlock: null,
      activePiece: null,
      gameStatus: "gameover",
      modal: "none",
    };
  }

  return {
    ...state,
    currentBlock: block,
    activePiece,
    hiddenCards: [],
    gameStatus: "placing",
    modal: "draw-result",
    placementTimeLeft: PLACEMENT_LIMIT,
    canHold: true,
  };
}

function resolveDrawResult(
  state: GameState,
  card: typeof CARD_ORDER[number]
): GameState {
  if (card === "NONE") {
    return {
      ...state,
      drawnCard: card,
      currentBlock: null,
      activePiece: null,
      hiddenCards: [],
      gameStatus: "idle",
      modal: "draw-result",
    };
  }

  if (card === "ANY") {
    return {
      ...state,
      drawnCard: card,
      currentBlock: null,
      activePiece: null,
      hiddenCards: [],
      gameStatus: "drawing",
      modal: "any-select",
    };
  }

  return {
    ...startPlacingWithBlock(
      {
        ...state,
        drawnCard: card,
      },
      card
    ),
    drawnCard: card,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "LOAD_STATE":
      return {
        ...initialState,
        ...action.payload,
        initialUsedRows: action.payload.initialUsedRows ?? 0,
      };

    case "SET_INITIAL_USED_ROWS":
      return {
        ...state,
        initialUsedRows: Math.max(0, Math.min(action.rows, 18)),
      };

    case "RESET_GAME_WITH_SETTINGS": {
        const adjustedRows = state.initialUsedRows *2;

        return {
            ...initialState,
            board: createInitialBoard(state.initialUsedRows),
            initialUsedRows: state.initialUsedRows,
            gameStatus: "idle",
            modal: "none",
            stock: 0,
            usedDrinks: 0,
            elapsedTime: 0,
        };
    }

    case "ADD_DRINK":
      return {
        ...state,
        stock: state.stock + 1,
        usedDrinks: state.usedDrinks + 1,
        gameStatus: "drink-choice",
        modal: "drink-choice",
      };

    case "CHOOSE_DRINK_ACTION":
      if (action.choice === "store") {
        return {
          ...state,
          gameStatus: "idle",
          modal: "none",
        };
      }

      if (state.stock <= 0) {
        return state;
      }

      if (state.stock >= 2) {
        return {
          ...state,
          excludedCards: [],
          hiddenCards: [],
          drawnCard: null,
          currentBlock: null,
          activePiece: null,
          gameStatus: "excluding",
          modal: "exclude",
        };
      }

      return {
        ...state,
        excludedCards: [],
        hiddenCards: createHiddenCards(CARD_ORDER),
        drawnCard: null,
        currentBlock: null,
        activePiece: null,
        stock: state.stock - 1,
        gameStatus: "drawing",
        modal: "draw-pick",
      };

    case "EXCLUDE_CARD":
      if (state.gameStatus !== "excluding") {
        return state;
      }

      if (state.stock <= 1) {
        return state;
      }

      if (state.excludedCards.includes(action.card)) {
        return state;
      }

      return {
        ...state,
        stock: state.stock - 1,
        excludedCards: [...state.excludedCards, action.card],
      };

    case "TO_DRAW_STEP": {
      if (state.stock <= 0) {
        return state;
      }

      const availableCards = getAvailableCards(state.excludedCards);

      return {
        ...state,
        stock: state.stock - 1,
        hiddenCards: createHiddenCards(availableCards),
        drawnCard: null,
        currentBlock: null,
        activePiece: null,
        gameStatus: "drawing",
        modal: "draw-pick",
      };
    }

    case "PICK_HIDDEN_CARD": {
      const picked = state.hiddenCards.find((item) => item.id === action.id);
      if (!picked) return state;

      return resolveDrawResult(state, picked.card);
    }

    case "SELECT_ANY_BLOCK":
      return {
        ...startPlacingWithBlock(state, action.block),
        drawnCard: "ANY",
      };

    case "MOVE_LEFT":
      if (state.gameStatus !== "placing" || !state.activePiece) {
        return state;
      }

      return {
        ...state,
        activePiece:
          movePieceHorizontally(state.board, state.activePiece, -1) ??
          state.activePiece,
      };

    case "MOVE_RIGHT":
      if (state.gameStatus !== "placing" || !state.activePiece) {
        return state;
      }

      return {
        ...state,
        activePiece:
          movePieceHorizontally(state.board, state.activePiece, 1) ??
          state.activePiece,
      };

    case "ROTATE_LEFT":
      if (state.gameStatus !== "placing" || !state.activePiece) {
        return state;
      }

      return {
        ...state,
        activePiece:
          rotatePiece(state.board, state.activePiece, -1) ?? state.activePiece,
      };

    case "ROTATE_RIGHT":
      if (state.gameStatus !== "placing" || !state.activePiece) {
        return state;
      }

      return {
        ...state,
        activePiece:
          rotatePiece(state.board, state.activePiece, 1) ?? state.activePiece,
      };

    case "CONFIRM_PLACE":
      if (state.gameStatus !== "placing" || !state.activePiece) {
        return state;
      }

      {
        const mergedBoard = mergePieceIntoBoard(state.board, state.activePiece);
        const { board, clearedCount } = clearFullLines(mergedBoard);

        const nextState: GameState = {
          ...state,
          board,
          currentBlock: null,
          activePiece: null,
          hiddenCards: [],
          excludedCards: [],
          drawnCard: null,
          modal: "none",
          gameStatus: "idle",
          placementTimeLeft: PLACEMENT_LIMIT,
          canHold: true,
          clearedLines: state.clearedLines + clearedCount,
        };

        return checkCleared(nextState);
      }

    case "USE_HOLD":
      if (
        state.gameStatus !== "placing" ||
        !state.activePiece ||
        !state.currentBlock ||
        !state.canHold
      ) {
        return state;
      }

      if (state.holdBlock === null) {
        return {
          ...state,
          holdBlock: state.currentBlock,
          currentBlock: null,
          activePiece: null,
          gameStatus: "idle",
          modal: "none",
          placementTimeLeft: PLACEMENT_LIMIT,
          canHold: false,
          excludedCards: [],
          hiddenCards: [],
          drawnCard: null,
        };
      }

      {
        const nextBlock = state.holdBlock;
        const nextState = startPlacingWithBlock(
          {
            ...state,
            holdBlock: state.currentBlock,
          },
          nextBlock
        );

        return {
          ...nextState,
          canHold: false,
        };
      }

    case "TICK_ELAPSED_TIME":
      return {
        ...state,
        elapsedTime: state.elapsedTime + 1,
      };

    case "TICK_PLACEMENT_TIMER":
      if (state.gameStatus !== "placing") {
        return state;
      }

      return {
        ...state,
        placementTimeLeft: Math.max(0, state.placementTimeLeft - 1),
      };

    case "TIMEOUT_RANDOM_PLACE":
      if (state.gameStatus !== "placing" || !state.currentBlock) {
        return state;
      }

      {
        const randomPlacement = getRandomLegalPlacement(
          state.board,
          state.currentBlock
        );

        if (!randomPlacement) {
          return {
            ...state,
            gameStatus: "gameover",
            modal: "none",
            activePiece: null,
            currentBlock: null,
          };
        }

        const mergedBoard = mergePieceIntoBoard(state.board, randomPlacement);
        const { board, clearedCount } = clearFullLines(mergedBoard);

        const nextState: GameState = {
          ...state,
          board,
          currentBlock: null,
          activePiece: null,
          hiddenCards: [],
          excludedCards: [],
          drawnCard: null,
          modal: "none",
          gameStatus: "idle",
          placementTimeLeft: PLACEMENT_LIMIT,
          canHold: true,
          clearedLines: state.clearedLines + clearedCount,
        };

        return checkCleared(nextState);
      }

    case "SKIP_TURN":
      return checkCleared({
        ...state,
        drawnCard: null,
        currentBlock: null,
        activePiece: null,
        hiddenCards: [],
        excludedCards: [],
        gameStatus: "idle",
        modal: "none",
      });

    case "CLOSE_MODAL":
      return {
        ...state,
        modal: "none",
      };

    case "RESET_DRAW_TEMP":
      return {
        ...state,
        excludedCards: [],
        drawnCard: null,
        hiddenCards: [],
      };

    default:
      return state;
  }
}