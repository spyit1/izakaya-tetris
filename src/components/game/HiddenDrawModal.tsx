import Modal from "@/components/ui/Modal";
import { HiddenCard } from "@/features/game/types";

type Props = {
  open: boolean;
  hiddenCards: HiddenCard[];
  onPick: (id: string) => void;
};

export default function HiddenDrawModal({
  open,
  hiddenCards,
  onPick,
}: Props) {
  return (
    <Modal open={open} title="1枚選んでください">
      <div className="space-y-4">
        <p className="text-sm text-zinc-300 text-center">
          裏向きのカードから1枚選びます
        </p>

        <div className="grid grid-cols-3 gap-3">
          {hiddenCards.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onPick(item.id)}
              className="flex flex-col items-center justify-center rounded-xl bg-zinc-800 py-6 hover:bg-zinc-700 transition"
            >
              <div className="text-2xl font-black">?</div>

              <div className="mt-2 text-xs text-zinc-400">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}