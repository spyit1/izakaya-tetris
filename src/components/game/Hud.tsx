import { GameStatus, TetrominoType } from "@/features/game/types";
import TetrominoPreview from "./TetrominoPreview";

type Props = {
  stock: number;
  lines: number;
  drinks: number;
  time: number;
  status: GameStatus;
  currentBlock: TetrominoType | null;
  placementTimeLeft: number;
};

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-zinc-900/80 px-4 py-3 shadow-inner">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </div>
      <div className="mt-2 text-xl font-black text-white">{value}</div>
    </div>
  );
}

function CurrentBlockCard({
  currentBlock,
}: {
  currentBlock: TetrominoType | null;
}) {
  return (
    <div className="rounded-2xl bg-zinc-900/80 px-4 py-3 shadow-inner">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
        Current
      </div>

      <div className="mt-2 flex min-h-[40px] items-center">
        <TetrominoPreview type={currentBlock} cellSize={10} emptyLabel="-" />
      </div>
    </div>
  );
}

export default function Hud({
  stock,
  lines,
  drinks,
  time,
  status,
  currentBlock,
  placementTimeLeft,
}: Props) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        <InfoCard label="Stock" value={stock} />
        <InfoCard label="Lines" value={lines} />
        <InfoCard label="Drinks" value={drinks} />
        <InfoCard label="Time" value={`${time}s`} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <InfoCard label="Status" value={status} />
        <CurrentBlockCard currentBlock={currentBlock} />
      </div>

      {status === "placing" && (
        <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 shadow-lg">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-200/80">
            Placement Time Left
          </div>
          <div className="mt-2 text-2xl font-black text-red-200">
            {placementTimeLeft}
          </div>
        </div>
      )}
    </div>
  );
}