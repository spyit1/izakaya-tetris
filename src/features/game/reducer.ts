import {
  clearFullLines,
  createActivePiece,
  createInitialBoard,
  mergePieceIntoBoard,
  movePieceHorizontally,
  rotatePiece,
} from "./boardutils";
import { CARD_ORDER, createHiddenCards, getAvailableCards } from "./draw";
import { initialState } from "./initialState";
import { PLACEMENT_LIMIT } from "./tetrominoes";
import { Board, GameAction, GameState, TetrominoType } from "./types";

function checkCleared(state: GameState): GameState {
  // 初期配置がない（難易度0）の場合は、全消しをクリア条件にする（念のため）
  if (state.initialUsedRows === 0) {
    const emptyBoard = state.board.every((row) => row.every((cell) => cell === 0));
    if (emptyBoard) return { ...state, gameStatus: "cleared" };
    return state;
  }

  // 盤面の底から count 行目が「初期配置の最下行」
  // 盤面が20行だとして、initialUsedRowsが3なら、index 17, 18, 19 が初期配置。
  // そのうち「一番上」にある初期配置行（この場合は index 17）が消えればOKとするなら以下の通り
  
  // もし「物理的に一番下の行（index 19）」が消えたことを条件にするなら：
  const targetRowIndex = state.board.length - 1; 
  const isTargetRowEmpty = state.board[targetRowIndex].every(cell => cell === 0);

  if (isTargetRowEmpty) {
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

  // ブロックが出た時、すぐに "placing" にせず、一旦モーダル表示用の状態にする
  const activePiece = createActivePiece(state.board, card as TetrominoType);

  return {
    ...state,
    drawnCard: card,
    currentBlock: card as TetrominoType,
    activePiece,
    hiddenCards: [],
    // ここを "drawing" や別の待機状態のままにしておく
    gameStatus: "drawing", 
    modal: "draw-result",
    placementTimeLeft: PLACEMENT_LIMIT,
    canHold: true,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "LOAD_STATE":
      return {
        ...initialState,
        ...action.payload,
        initialUsedRows: action.payload.initialUsedRows ?? 0,
        drawSource: action.payload.drawSource ?? null,
      };

    case "SET_INITIAL_USED_ROWS":
      return {
        ...state,
        initialUsedRows: Math.max(0, Math.min(action.rows, 18)),
      };

    case "RESET_GAME_WITH_SETTINGS":
      return {
        ...initialState,
        board: createInitialBoard(state.initialUsedRows),
        initialUsedRows: state.initialUsedRows,
        gameStatus: "idle",
        modal: "none",
        stock: 0,
        usedDrinks: 0,
        elapsedTime: 0,
        drawSource: null,
      };

    case "ADD_DRINK":
      return {
        ...state,
        stock: state.stock + 1,
        usedDrinks: state.usedDrinks + 1,
        gameStatus: "drink-choice",
        modal: "drink-choice",
        drawSource: "drink",
      };

    case "CHOOSE_DRINK_ACTION":
      if (action.choice === "store") {
        return {
          ...state,
          gameStatus: "idle",
          modal: "none",
          drawSource: null,
        };
      }

      if (action.choice === "draw-with-exclude") {
        if (state.stock < 1) {
          return state;
        }

        return {
          ...state,
          excludedCards: [],
          hiddenCards: [],
          drawnCard: null,
          currentBlock: null,
          activePiece: null,
          gameStatus: "excluding",
          modal: "exclude",
          drawSource: "drink",
        };
      }

      if (state.stock <= 0) {
        return state;
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
        drawSource: "drink",
      };

    case "START_DRAW_FROM_STOCK":
      if (state.stock <= 0) {
        return state;
      }

      return {
        ...state,
        excludedCards: [],
        hiddenCards: [],
        drawnCard: null,
        currentBlock: null,
        activePiece: null,
        gameStatus: "drink-choice",
        modal: "drink-choice",
        drawSource: "stock",
      };

    case "CHOOSE_STOCK_DRAW_MODE":
      if (state.drawSource !== "stock") {
        return state;
      }

      if (action.mode === "exclude") {
        if (state.stock < 2) {
          return state;
        }

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

      if (state.stock < 1) {
        return state;
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

    case "CANCEL_DRINK_CHOICE":
      return {
        ...state,
        excludedCards: [],
        hiddenCards: [],
        drawnCard: null,
        currentBlock: null,
        activePiece: null,
        gameStatus: "idle",
        modal: "none",
        drawSource: null,
      };

    case "EXCLUDE_CARD":
      if (state.gameStatus !== "excluding") {
        return state;
      }

      if (state.excludedCards.includes(action.card)) {
        return {
          ...state,
          stock: state.stock + 1,
          excludedCards: state.excludedCards.filter(
            (card) => card !== action.card
          ),
        };
      }

      if (state.stock <= 1) {
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
      // startPlacingWithBlock を使うと gameStatus が "placing" になってしまうので、
      // ここで直接状態をセットして、モーダルを表示する待機状態にするよ。
      {
        const activePiece = createActivePiece(state.board, action.block);
        
        // もし配置不可ならゲームオーバー
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
          currentBlock: action.block,
          activePiece,
          drawnCard: action.block, // 選んだブロックを「引いたカード」として扱う
          gameStatus: "drawing",   // まだ "placing" にしない！
          modal: "draw-result",    // 結果確認モーダルを出す
          placementTimeLeft: PLACEMENT_LIMIT,
          canHold: true,
        };
      }

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
        // 【追加】消す前の状態で、一番下の行（Index 19）が全部埋まっているかチェック
        const bottomRowIndex = mergedBoard.length - 1;
        const isBottomRowFull = mergedBoard[bottomRowIndex].every(cell => cell !== 0);

        const { board, clearedCount } = clearFullLines(mergedBoard);

        // 【判定】「もともと一番下が埋まっていて」かつ「ラインが1つ以上消えた」なら、
        // 一番下の行が消去されたとみなしてクリア！
        if (isBottomRowFull && clearedCount > 0) {
          return {
            ...state,
            board,
            gameStatus: "cleared",
            modal: "none",
            // ...他のリセット処理
          };
        }

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
          drawSource: null,
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

      // 初めてのホールド（中身が空）の時
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
          drawSource: null,
        };
      }

      // すでにホールドにブロックがある時（中身を入れ替える時）
      {
        const nextBlock = state.holdBlock;
        const activePiece = createActivePiece(state.board, nextBlock);

        return {
          ...state,
          holdBlock: state.currentBlock, // 現在のをホールドへ
          currentBlock: nextBlock,       // ホールドにあったのを現在へ
          activePiece,
          drawnCard: nextBlock,          // 【追加】確認用にくじ引きと同じようにセット
          gameStatus: "drawing",         // 【変更】操作中(placing)にせず待機
          modal: "draw-result",          // 【変更】確認モーダルを出す
          placementTimeLeft: PLACEMENT_LIMIT,
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

    case "TIMEOUT_PLACE_CURRENT":
      if (state.gameStatus !== "placing" || !state.activePiece) {
        return state;
      }

      {
        const mergedBoard = mergePieceIntoBoard(state.board, state.activePiece);

        // 【追加】消す前の状態で、一番下の行（Index 19）が全部埋まっているかチェック
        const bottomRowIndex = mergedBoard.length - 1;
        const isBottomRowFull = mergedBoard[bottomRowIndex].every(cell => cell !== 0);

        const { board, clearedCount } = clearFullLines(mergedBoard);

        // 【判定】「もともと一番下が埋まっていて」かつ「ラインが1つ以上消えた」なら、
        // 一番下の行が消去されたとみなしてクリア！
        if (isBottomRowFull && clearedCount > 0) {
          return {
            ...state,
            board,
            gameStatus: "cleared",
            modal: "none",
            // ...他のリセット処理
          };
        }

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
          drawSource: null,
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
        drawSource: null,
      });

    case "CLOSE_MODAL":
      // モーダルを閉じた瞬間に、くじの結果が「ハズレ(NONE)」でも「ANY」でもない（＝ブロックが出た）なら、操作開始
      if (
        state.modal === "draw-result" && 
        state.drawnCard !== "NONE" && 
        state.drawnCard !== "ANY" &&
        state.drawnCard !== null
      ) {
        return {
          ...state,
          modal: "none",
          gameStatus: "placing", // ここでカウント開始！
        };
      }
  
      // それ以外（ハズレだった時や、通常のモーダル閉じ）
      return {
        ...state,
        modal: "none",
        // もし ANY 選択後などで status が drawing のままなら idle に戻すなどの処理が必要かも
        gameStatus: state.gameStatus === "placing" ? "placing" : "idle",
      };

    case "RESET_DRAW_TEMP":
      return {
        ...state,
        excludedCards: [],
        drawnCard: null,
        hiddenCards: [],
        drawSource: null,
      };

    default:
      return state;
  }
}