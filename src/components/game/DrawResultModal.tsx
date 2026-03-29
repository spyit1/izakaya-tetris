import { CardType } from "@/features/game/types";
import Modal from "@/components/ui/Modal";
import TetrominoPreview from "@/components/game/TetrominoPreview";

type Props = {
  open: boolean;
  card: CardType | null;
  onClose: () => void;
};

export default function DrawResultModal({ open, card, onClose }: Props) {
  const isBlock =
    card !== null && card !== "ANY" && card !== "NONE";

  return (
    <Modal open={open} title="抽選結果">
      <div className="space-y-4 text-center">
        <div className="flex justify-center rounded-xl bg-zinc-800 py-8">
          {card === null && "?"}

          {card === "ANY" && (
            <div className="text-2xl font-bold text-yellow-400">
              ANY
            </div>
          )}

          {card === "NONE" && (
            <div className="text-2xl font-bold text-red-400">
              NONE
            </div>
          )}

          {isBlock && <TetrominoPreview type={card} />}
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-zinc-700 px-4 py-2"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}