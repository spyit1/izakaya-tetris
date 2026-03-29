import { TetrominoType } from "@/features/game/types";
import { getShape } from "@/features/game/tetrominoes";

type Props = {
  type: TetrominoType | null;
  cellSize?: number;
  emptyLabel?: string;
};

function getCellColor(type: TetrominoType) {
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

export default function TetrominoPreview({
  type,
  cellSize = 16,
  emptyLabel = "EMPTY",
}: Props) {
  if (!type) {
    return (
      <div className="flex h-20 items-center justify-center rounded-2xl bg-black/30 px-4 text-lg font-black text-zinc-200">
        {emptyLabel}
      </div>
    );
  }

  const shape = getShape(type, 0);

  const minX = Math.min(...shape.map((cell) => cell.x));
  const maxX = Math.max(...shape.map((cell) => cell.x));
  const minY = Math.min(...shape.map((cell) => cell.y));
  const maxY = Math.max(...shape.map((cell) => cell.y));

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  const normalized = shape.map((cell) => ({
    x: cell.x - minX,
    y: cell.y - minY,
  }));

  const filled = Array.from({ length: height }, () =>
    Array(width).fill(false)
  );

  for (const cell of normalized) {
    filled[cell.y][cell.x] = true;
  }

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
      }}
    >
      {filled.flatMap((row, y) =>
        row.map((isFilled, x) => (
          <div
            key={`${x}-${y}`}
            className={`rounded-[4px] border ${
              isFilled
                ? `${getCellColor(type)} border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.08)]`
                : "border-transparent bg-transparent"
            }`}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          />
        ))
      )}
    </div>
  );
}