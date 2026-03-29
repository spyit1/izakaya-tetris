import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  stock: number;
  onDrawNow: () => void;
  onStore: () => void;
};

export default function DrinkChoiceModal({
  open,
  stock,
  onDrawNow,
  onStore,
}: Props) {
  return (
    <Modal open={open} title="飲食しました">
      <div className="space-y-4">
        <p className="text-sm text-zinc-300">
          ストックが1増えました。現在のストック: {stock}
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onDrawNow}
            className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black"
          >
            今すぐ引く
          </button>

          <button
            onClick={onStore}
            className="rounded-lg bg-zinc-700 px-4 py-2 text-white"
          >
            ストックする
          </button>
        </div>
      </div>
    </Modal>
  );
}