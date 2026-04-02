"use client";

import Modal from "@/components/ui/Modal";
import TetrominoPreview from "@/components/game/TetrominoPreview";
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
  const canExcludeNewCard = stock > 1;

  return (
    <Modal open={open} title="除外するカードを選ぶ">
      <div className="space-y-4">
        <div className="text-sm text-zinc-300">
          <p>ストック: {stock}</p>
          <p>最低1ストックは抽選用に残します。</p>
          <p>選択済みのカードをもう一度押すと解除できます。</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CARD_ORDER.map((card) => {
            const excluded = excludedCards.includes(card);
            const canPress = excluded || canExcludeNewCard;

            return (
              <button
                key={card}
                type="button"
                onClick={() => onExclude(card)}
                disabled={!canPress}
                className={`rounded-lg border px-3 py-4 text-sm font-bold transition ${
                  excluded
                    ? "border-red-500 bg-red-950 text-red-300"
                    : canPress
                    ? "border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
                    : "border-zinc-800 bg-zinc-900 text-zinc-500"
                }`}
              >
                <div className="flex justify-center">
                  {card === "ANY" || card === "NONE" ? (
                    <div className="text-lg font-bold text-white">{card}</div>
                  ) : (
                    <TetrominoPreview type={card} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onStartDraw}
          className="w-full rounded-lg bg-yellow-500 px-4 py-2 font-bold text-black"
        >
          この内容で抽選へ進む
        </button>
      </div>
    </Modal>
  );
}