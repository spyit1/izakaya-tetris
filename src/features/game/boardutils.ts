import { ActivePiece, Board, TetrominoType } from "./types";
import { BOARD_HEIGHT, BOARD_WIDTH, getShape } from "./tetrominoes";

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(0)
  ) as Board;
}

const INITIAL_FILL_TYPES: TetrominoType[] = ["I", "J", "L", "O", "S", "T", "Z"];

function getRandomTetrominoType(): TetrominoType {
  const index = Math.floor(Math.random() * INITIAL_FILL_TYPES.length);
  return INITIAL_FILL_TYPES[index];
}

function countFilledCells(board: Board): number {
  let count = 0;

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] !== 0) {
        count++;
      }
    }
  }

  return count;
}

function getTopFilledRow(board: Board): number | null {
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].some((cell) => cell !== 0)) {
      return y;
    }
  }

  return null;
}

function getFilledHeight(board: Board): number {
  const topRow = getTopFilledRow(board);

  if (topRow === null) {
    return 0;
  }

  return BOARD_HEIGHT - topRow;
}

function countFullLines(board: Board): number {
  let count = 0;

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every((cell) => cell !== 0)) {
      count++;
    }
  }

  return count;
}

function getPlacementBottomY(piece: ActivePiece): number {
  const shape = getShape(piece.type, piece.rotation);
  let maxY = -Infinity;

  for (const cell of shape) {
    const y = piece.y + cell.y;
    if (y > maxY) {
      maxY = y;
    }
  }

  return maxY;
}

function getPlacementScore(
  board: Board,
  piece: ActivePiece,
  targetRows: number
): number {
  const nextBoard = mergePieceIntoBoard(board, piece);
  const filledHeight = getFilledHeight(nextBoard);
  const fullLines = countFullLines(nextBoard);
  const bottomY = getPlacementBottomY(piece);

  let score = 0;

  // 低い位置に置くほど高得点
  score += bottomY * 100;

  // 目標段数に近づくほど高得点
  score += Math.min(filledHeight, targetRows) * 80;

  // 最初からライン完成しすぎるのは少し抑える
  score -= fullLines * 120;

  return score;
}

function getAllLegalPlacements(
  board: Board,
  type: TetrominoType
): ActivePiece[] {
  const placements: ActivePiece[] = [];

  for (let rotation = 0; rotation < 4; rotation++) {
    for (let x = -2; x < BOARD_WIDTH; x++) {
      const y = getLowestLegalY(board, type, rotation, x);

      if (y !== null) {
        placements.push({ type, rotation, x, y });
      }
    }
  }

  return placements;
}

function getBestInitialPlacements(
  board: Board,
  type: TetrominoType,
  targetRows: number
): ActivePiece[] {
  const placements = getAllLegalPlacements(board, type);

  if (placements.length === 0) {
    return [];
  }

  const scored = placements.map((piece) => ({
    piece,
    score: getPlacementScore(board, piece, targetRows),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topScore = scored[0].score;

  return scored
    .filter((item) => item.score >= topScore - 60)
    .map((item) => item.piece);
}

function getRandomItem<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export function createInitialBoard(initialRows = 0): Board {
  const board = createEmptyBoard();
  const targetRows = Math.max(0, Math.min(initialRows, BOARD_HEIGHT - 2));

  if (targetRows === 0) {
    return board;
  }

  // かなり密度高めに埋める
  const targetFilledCells = targetRows * BOARD_WIDTH;
  const minFilledCells = Math.floor(targetFilledCells * 0.94);
  const maxAttempts = 1200;

  let workingBoard = board;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    const currentFilledCells = countFilledCells(workingBoard);
    const currentHeight = getFilledHeight(workingBoard);

    if (currentFilledCells >= minFilledCells && currentHeight >= targetRows) {
      break;
    }

    const type = getRandomTetrominoType();

    let placements = getBestInitialPlacements(
      workingBoard,
      type,
      targetRows
    );

    if (placements.length === 0) {
      placements = getAllLegalPlacements(workingBoard, type);
    }

    if (placements.length === 0) {
      break;
    }

    const piece = getRandomItem(placements);
    workingBoard = mergePieceIntoBoard(workingBoard, piece);
  }

  return workingBoard;
}

export function canPlaceAt(
  board: Board,
  type: TetrominoType,
  rotation: number,
  baseX: number,
  baseY: number
): boolean {
  const shape = getShape(type, rotation);

  for (const cell of shape) {
    const x = baseX + cell.x;
    const y = baseY + cell.y;

    if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) {
      return false;
    }

    if (board[y][x] !== 0) {
      return false;
    }
  }

  return true;
}

export function getLowestLegalY(
  board: Board,
  type: TetrominoType,
  rotation: number,
  x: number
): number | null {
  let lastLegalY: number | null = null;

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (canPlaceAt(board, type, rotation, x, y)) {
      lastLegalY = y;
    } else if (lastLegalY !== null) {
      break;
    }
  }

  return lastLegalY;
}

export function createActivePiece(
  board: Board,
  type: TetrominoType
): ActivePiece | null {
  const startRotation = 0;
  const startX = 3;
  const startY = getLowestLegalY(board, type, startRotation, startX);

  if (startY === null) {
    return null;
  }

  return {
    type,
    rotation: startRotation,
    x: startX,
    y: startY,
  };
}

export function movePieceHorizontally(
  board: Board,
  piece: ActivePiece,
  deltaX: number
): ActivePiece | null {
  const nextX = piece.x + deltaX;
  const nextY = getLowestLegalY(board, piece.type, piece.rotation, nextX);

  if (nextY === null) {
    return null;
  }

  return {
    ...piece,
    x: nextX,
    y: nextY,
  };
}

export function rotatePiece(
  board: Board,
  piece: ActivePiece,
  deltaRotation: number
): ActivePiece | null {
  const nextRotation = (piece.rotation + deltaRotation + 4) % 4;
  const tryOffsets = [0, -1, 1, -2, 2];

  for (const offset of tryOffsets) {
    const nextX = piece.x + offset;
    const nextY = getLowestLegalY(board, piece.type, nextRotation, nextX);

    if (nextY !== null) {
      return {
        ...piece,
        rotation: nextRotation,
        x: nextX,
        y: nextY,
      };
    }
  }

  return null;
}

export function mergePieceIntoBoard(board: Board, piece: ActivePiece): Board {
  const nextBoard = board.map((row) => [...row]) as Board;
  const shape = getShape(piece.type, piece.rotation);

  for (const cell of shape) {
    const x = piece.x + cell.x;
    const y = piece.y + cell.y;
    nextBoard[y][x] = piece.type;
  }

  return nextBoard;
}

export function clearFullLines(board: Board): {
  board: Board;
  clearedCount: number;
} {
  const remainingRows = board.filter((row) => row.some((cell) => cell === 0));
  const clearedCount = BOARD_HEIGHT - remainingRows.length;

  const newRows = Array.from({ length: clearedCount }, () =>
    Array(BOARD_WIDTH).fill(0)
  ) as Board;

  return {
    board: [...newRows, ...remainingRows] as Board,
    clearedCount,
  };
}

export function getRandomLegalPlacement(
  board: Board,
  type: TetrominoType
): ActivePiece | null {
  const placements = getAllLegalPlacements(board, type);

  if (placements.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * placements.length);
  return placements[index];
}