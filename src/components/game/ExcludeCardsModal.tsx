import Modal from "@/components/ui/Modal";
import { CARD_ORDER } from "@/features/game/draw";
import { CardType } from "@/features/game/types";

type Props = {
  open: boolean;
  stock: number;
  excludedCards: CardType[];
  onExclude: (card: CardType) => void;
  onStartDraw: () => void;
};

export default function ExcludeCardsModal({
  open,
  stock,
  excludedCards,
  onExclude,
  onStartDraw,
}: Props) {
  const canStartDraw = stock >= 1;

  return (
    <Modal open={open} title="除外するカードを選ぶ">
      <div className="space-y-4">
        <div className="text-sm text-zinc-300">
          <p>ストック: {stock}</p>
          <p>同じカードをもう一度押すと選択解除できます。</p>
          <p>最低1ストックは抽選用に残します。</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CARD_ORDER.map((card) => {
            const excluded = excludedCards.includes(card);
            const selectable = excluded || stock > 1;

            return (
              <button
                key={card}
                type="button"
                onClick={() => onExclude(card)}
                disabled={!selectable}
                className={`rounded-lg border px-3 py-4 text-sm font-bold transition ${
                  excluded
                    ? "border-red-500 bg-red-950 text-red-300"
                    : selectable
                    ? "border-zinc-600 bg-zinc-800 hover:bg-zinc-700"
                    : "border-zinc-800 bg-zinc-900 text-zinc-500"
                }`}
              >
                {card}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onStartDraw}
          disabled={!canStartDraw}
          className={`w-full rounded-lg px-4 py-2 font-bold ${
            canStartDraw
              ? "bg-yellow-500 text-black"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          この内容で抽選へ進む
        </button>
      </div>
    </Modal>
  );
}