import { TetrominoType } from "@/features/game/types";
import TetrominoPreview from "./TetrominoPreview";

type Props = {
  holdBlock: TetrominoType | null;
  canHold: boolean;
};

export default function HoldPanel({ holdBlock, canHold }: Props) {
  return (
    <div
      className={`w-24 rounded-2xl border p-3 text-center transition ${
        canHold
          ? "border-emerald-400/40 bg-zinc-900 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          : "border-zinc-700 bg-zinc-800 opacity-70"
      }`}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        Hold
      </div>

      <div className="mt-3 flex min-h-[56px] items-center justify-center rounded-xl bg-black/30 px-2">
        <TetrominoPreview
          type={holdBlock}
          cellSize={10}
          emptyLabel="EMPTY"
        />
      </div>

      <div
        className={`mt-3 text-[10px] font-bold ${
          canHold ? "text-emerald-300" : "text-zinc-500"
        }`}
      >
        {canHold ? "READY" : "USED"}
      </div>
    </div>
  );
}