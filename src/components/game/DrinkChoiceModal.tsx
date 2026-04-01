import Modal from "@/components/ui/Modal";
import { DrawSource } from "@/features/game/types";

type Props = {
  open: boolean;
  stock: number;
  drawSource: DrawSource;
  onDrawNow: () => void;
  onDrawWithExclude: () => void;
  onStore: () => void;
};

export default function DrinkChoiceModal({
  open,
  stock,
  drawSource,
  onDrawNow,
  onDrawWithExclude,
  onStore,
}: Props) {
  const isStockMode = drawSource === "stock";
  const canExclude = isStockMode ? stock >= 2 : stock >= 1;

  return (
    <Modal open={open} title={isStockMode ? "ストックを使って引く" : "飲食しました"}>
      <div className="space-y-4">
        <p className="text-sm text-zinc-300">
          {isStockMode
            ? `現在のストック: ${stock}`
            : `ストックが1増えました。現在のストック: ${stock}`}
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onDrawNow}
            className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black"
          >
            {isStockMode ? "1ストック消費して引く" : "今すぐ引く"}
          </button>

          <button
            type="button"
            onClick={onDrawWithExclude}
            disabled={!canExclude}
            className={`rounded-lg px-4 py-2 font-semibold ${
              canExclude
                ? "bg-red-500 text-white"
                : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {isStockMode
              ? "2ストック消費して除外して引く"
              : "1ストック消費して除外して引く"}
          </button>

          {!isStockMode && (
            <button
              type="button"
              onClick={onStore}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-white"
            >
              ストックする
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}