"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "izakaya-tetorisu-save";

export default function Home() {
  const router = useRouter();
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setHasSave(!!saved);
    } catch {
      setHasSave(false);
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#27272a_0%,_#18181b_35%,_#09090b_100%)] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300/90">
          Izakaya Tetris Puzzle
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">
          居酒屋テトリス
        </h1>

        <p className="mt-4 text-sm leading-6 text-zinc-300">
          飲んで、引いて、置く。
          <br />
          運と判断で盤面をさばくパズルゲーム。
        </p>

        {/* ゲーム開始 */}
        <button
          type="button"
          onClick={() => router.push("/game")}
          className="mt-8 w-full rounded-2xl bg-emerald-400 px-4 py-4 text-base font-black text-zinc-950 transition hover:bg-emerald-300 active:scale-[0.99]"
        >
          ゲームスタート
        </button>

        {/* セーブがあるときだけ表示 */}
        {hasSave && (
          <>
            {/* 続きから */}
            <button
              type="button"
              onClick={() => router.push("/game")}
              className="mt-3 w-full rounded-2xl border border-white/20 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.99]"
            >
              続きからプレイ
            </button>

            {/* 最初から */}
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                router.push("/game");
              }}
              className="mt-2 w-full rounded-2xl border border-red-400/30 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10 active:scale-[0.99]"
            >
              最初からプレイ
            </button>
          </>
        )}
      </div>
    </main>
  );
}