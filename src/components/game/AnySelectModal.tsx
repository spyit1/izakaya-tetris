import Modal from "@/components/ui/Modal";
import { TetrominoType } from "@/features/game/types";
import TetrominoPreview from "@/components/game/TetrominoPreview";

type Props = {
  open: boolean;
  onSelect: (block: TetrominoType) => void;
};

const BLOCKS: TetrominoType[] = ["I", "J", "L", "O", "S", "T", "Z"];

export default function AnySelectModal({ open, onSelect }: Props) {
  return (
    <Modal open={open} title="好きなブロックを選択">
      <div className="grid grid-cols-4 gap-3">
        {BLOCKS.map((block) => (
          <button
            key={block}
            onClick={() => onSelect(block)}
            className="flex items-center justify-center rounded-lg bg-zinc-800 p-4 hover:bg-zinc-700 transition"
          >
            <TetrominoPreview type={block} />
          </button>
        ))}
      </div>
    </Modal>
  );
}