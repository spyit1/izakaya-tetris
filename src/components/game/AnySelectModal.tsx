import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import TetrominoPreview from "@/components/game/TetrominoPreview";
import Board from "@/components/game/Board";

import {
  ActivePiece,
  Board as BoardType,
  TetrominoType,
} from "@/features/game/types";

type Props = {
  open: boolean;
  board: BoardType;
  activePiece: ActivePiece | null;
  onSelect: (block: TetrominoType) => void;
};

const BLOCKS: TetrominoType[] = ["I", "J", "L", "O", "S", "T", "Z"];

export default function AnySelectModal({
  open,
  board,
  activePiece,
  onSelect,
}: Props) {
  const [showBoard, setShowBoard] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowBoard(false);
    }
  }, [open]);

  return (
    <Modal open={open} title={showBoard ? "現在の盤面" : "好きなブロックを選択"}>
      {showBoard ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <div className="mx-auto w-[220px] sm:w-[260px] rounded-2xl bg-zinc-900/80 p-3 shadow-inner">
              <Board board={board} activePiece={activePiece} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBoard(false)}
            className="w-full rounded-lg bg-zinc-700 px-4 py-2 text-white transition hover:bg-zinc-600"
          >
            戻る
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowBoard(true)}
            className="w-full rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-500"
          >
            盤面を見る
          </button>

          <div className="grid grid-cols-4 gap-3">
            {BLOCKS.map((block) => (
              <button
                key={block}
                type="button"
                onClick={() => onSelect(block)}
                className="flex items-center justify-center rounded-lg bg-zinc-800 p-4 transition hover:bg-zinc-700"
              >
                <TetrominoPreview type={block} />
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}