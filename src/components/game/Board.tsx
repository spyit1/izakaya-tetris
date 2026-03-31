import {
  ActivePiece,
  Board as BoardType,
  CellValue,
} from "@/features/game/types";
import { getShape } from "@/features/game/tetrominoes";

type Props = {
  board: BoardType;
  activePiece: ActivePiece | null;
};

function buildActiveMap(board: BoardType, activePiece: ActivePiece | null) {
  const activeMap: boolean[][] = board.map((row) => row.map(() => false));

  if (!activePiece || board.length === 0 || board[0].length === 0) {
    return activeMap;
  }

  const shape = getShape(activePiece.type, activePiece.rotation);

  for (const cell of shape) {
    const x = activePiece.x + cell.x;
    const y = activePiece.y + cell.y;

    if (y >= 0 && y < activeMap.length && x >= 0 && x < activeMap[0].length) {
      activeMap[y][x] = true;
    }
  }

  return activeMap;
}

function getCellColor(type: CellValue) {
  switch (type) {
    case "I":
      return "bg-cyan-400";
    case "O":
      return "bg-yellow-400";
    case "T":
      return "bg-purple-400";
    case "S":
      return "bg-green-400";
    case "Z":
      return "bg-red-400";
    case "J":
      return "bg-blue-400";
    case "L":
      return "bg-orange-400";
    default:
      return "bg-zinc-700";
  }
}

function getCellGlow(type: CellValue) {
  switch (type) {
    case "I":
      return "shadow-[0_0_10px_rgba(34,211,238,0.35)]";
    case "O":
      return "shadow-[0_0_10px_rgba(250,204,21,0.35)]";
    case "T":
      return "shadow-[0_0_10px_rgba(192,132,252,0.35)]";
    case "S":
      return "shadow-[0_0_10px_rgba(74,222,128,0.35)]";
    case "Z":
      return "shadow-[0_0_10px_rgba(248,113,113,0.35)]";
    case "J":
      return "shadow-[0_0_10px_rgba(96,165,250,0.35)]";
    case "L":
      return "shadow-[0_0_10px_rgba(251,146,60,0.35)]";
    default:
      return "";
  }
}

export default function Board({ board, activePiece }: Props) {
  const activeMap = buildActiveMap(board, activePiece);

  if (board.length === 0 || board[0].length === 0) {
    return (
      <div className="rounded-2xl bg-zinc-700 p-[3px]">
        <div className="rounded-[14px] bg-zinc-800 p-4 text-sm text-zinc-400">
          盤面データがありません
        </div>
      </div>
    );
  }

  const cols = board[0].length;

  return (
    <div className="rounded-2xl bg-zinc-700 p-[3px] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div
        className="grid gap-[1px] rounded-[14px] bg-zinc-800 p-[1px] sm:gap-[2px] sm:p-[2px]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {board.flatMap((row, y) =>
          row.map((cell, x) => {
            const isActive = activeMap[y][x];
            const displayType: CellValue = isActive
              ? activePiece?.type ?? 0
              : cell;

            return (
              <div
                key={`${x}-${y}`}
                className={`aspect-square w-full rounded-[3px] box-border border border-zinc-600 ${
                  getCellColor(displayType)
                } ${
                  displayType !== 0 ? getCellGlow(displayType) : ""
                } ${
                  isActive ? "scale-[1.02] ring-1 ring-white/30" : ""
                }`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}