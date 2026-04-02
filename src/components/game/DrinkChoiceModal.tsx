import Modal from "@/components/ui/Modal";
import { DrawSource } from "@/features/game/types";

type Props = {
  open: boolean;
  stock: number;
  drawSource: DrawSource;
  onDrawNow: () => void;
  onDrawWithExclude: () => void;
  onStore: () => void;
  onBack: () => void;
};

export default function DrinkChoiceModal({
  open,
  stock,
  drawSource,
  onDrawNow,
  onDrawWithExclude,
  onStore,
  onBack,
}: Props) {
  const canDrawNow = stock >= 1;
  const canDrawWithExclude = stock >= 2;
  const isStockMode = drawSource === "stock";

  return (
    <Modal open={open} title="どうしますか？">
      <div className="space-y-3">
        <div className="text-sm text-zinc-300">
          <p>現在のストック: {stock}</p>
          {isStockMode ? (
            <p>持っているストックを使ってカードを引けます。</p>
          ) : (
            <p>飲食しました。次の行動を選んでください。</p>
          )}
        </div>

        <button
          type="button"
          onClick={onDrawNow}
          disabled={!canDrawNow}
          className={`w-full rounded-lg px-4 py-3 font-bold transition ${
            canDrawNow
              ? "bg-emerald-500 text-black hover:bg-emerald-400"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          普通に引く（1ストック消費）
        </button>

        <button
          type="button"
          onClick={onDrawWithExclude}
          disabled={!canDrawWithExclude}
          className={`w-full rounded-lg px-4 py-3 font-bold transition ${
            canDrawWithExclude
              ? "bg-yellow-500 text-black hover:bg-yellow-400"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          除外して引く（2ストック以上必要）
        </button>

        {isStockMode ? (
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-lg bg-zinc-700 px-4 py-3 font-bold text-white transition hover:bg-zinc-600"
          >
            戻る
          </button>
        ) : (
          <button
            type="button"
            onClick={onStore}
            className="w-full rounded-lg bg-sky-600 px-4 py-3 font-bold text-white transition hover:bg-sky-500"
          >
            今回は引かずにストックする
          </button>
        )}
      </div>
    </Modal>
  );
}