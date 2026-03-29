"use client";

import { useEffect, useState } from "react";
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
  const maxSelectable = Math.max(0, stock - 1);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedCards([]);
    }
  }, [open]);

  const handleToggleSelect = (card: CardType) => {
    if (excludedCards.includes(card)) return;

    setSelectedCards((prev) => {
      const alreadySelected = prev.includes(card);

      if (alreadySelected) {
        return prev.filter((c) => c !== card);
      }

      if (prev.length >= maxSelectable) {
        return prev;
      }

      return [...prev, card];
    });
  };

  const handleStartDraw = () => {
    selectedCards.forEach((card) => {
      onExclude(card);
    });
    onStartDraw();
    setSelectedCards([]);
  };

  return (
    <Modal open={open} title="除外するカードを選ぶ">
      <div className="space-y-4">
        <div className="text-sm text-zinc-300">
          <p>ストック: {stock}</p>
          <p>抽選用に最低1ストックは残します。</p>
          <p>最大 {maxSelectable} 枚まで選択できます。</p>
          <p>
            選択中: {selectedCards.length} / {maxSelectable}
          </p>
          <p>同じカードをもう一度押すと選択解除できます。</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CARD_ORDER.map((card) => {
            const excluded = excludedCards.includes(card);
            const selected = selectedCards.includes(card);
            const limitReached =
              !selected && selectedCards.length >= maxSelectable;

            return (
              <button
                key={card}
                type="button"
                onClick={() => handleToggleSelect(card)}
                disabled={excluded || limitReached}
                className={`rounded-lg border px-3 py-4 text-sm font-bold transition ${
                  excluded
                    ? "border-red-500 bg-red-950 text-red-300"
                    : selected
                    ? "border-yellow-400 bg-yellow-500/20 text-yellow-200 ring-2 ring-yellow-400"
                    : limitReached
                    ? "border-zinc-800 bg-zinc-900 text-zinc-500"
                    : "border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
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
          onClick={handleStartDraw}
          className="w-full rounded-lg bg-yellow-500 px-4 py-2 font-bold text-black"
        >
          この内容で抽選へ進む
        </button>
      </div>
    </Modal>
  );
}