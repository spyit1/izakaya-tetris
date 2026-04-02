"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import AnySelectModal from "@/components/game/AnySelectModal";
import Board from "@/components/game/Board";
import ControlPad from "@/components/game/ControlPad";
import DrawResultModal from "@/components/game/DrawResultModal";
import DrinkButton from "@/components/game/DrinkButton";
import DrinkChoiceModal from "@/components/game/DrinkChoiceModal";
import ExcludeCardsModal from "@/components/game/ExcludeCardsModal";
import HiddenDrawModal from "@/components/game/HiddenDrawModal";
import HoldPanel from "@/components/game/HoldPanel";
import Hud from "@/components/game/Hud";

import { initialState } from "@/features/game/initialState";
import { gameReducer } from "@/features/game/reducer";

const STORAGE_KEY = "izakaya-tetorisu-save";
const DIFFICULTY_OPTIONS = [0, 3, 6, 9, 12, 15];

export default function GamePage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const controlPadRef = useRef<HTMLElement | null>(null);

  function scrollToControlPad() {
    window.setTimeout(() => {
      controlPadRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "LOAD_STATE", payload: parsed });
      }
    } catch (error) {
      console.error("保存データの読み込みに失敗しました", error);
    } finally {
      setLoaded(true);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("保存データの書き込みに失敗しました", error);
    }
  }, [mounted, loaded, state]);

  useEffect(() => {
    if (!mounted || !loaded) return;

    const timer = window.setInterval(() => {
      dispatch({ type: "TICK_ELAPSED_TIME" });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mounted, loaded]);

  useEffect(() => {
    if (!mounted || !loaded) return;
    if (state.gameStatus !== "placing") return;

    if (state.placementTimeLeft <= 0) {
      dispatch({ type: "TIMEOUT_PLACE_CURRENT" });
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: "TICK_PLACEMENT_TIMER" });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [mounted, loaded, state.gameStatus, state.placementTimeLeft]);

  if (!mounted || !loaded) {
    return null;
  }

  const canUseStockDraw =
    state.stock > 0 &&
    state.gameStatus !== "setup" &&
    state.gameStatus !== "placing" &&
    state.gameStatus !== "drawing" &&
    state.gameStatus !== "excluding" &&
    state.gameStatus !== "gameover" &&
    state.gameStatus !== "cleared";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#27272a_0%,_#18181b_35%,_#09090b_100%)] px-4 py-6 text-white">
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-3 text-left text-sm text-zinc-400 underline"
        >
          ← タイトルへ戻る
        </button>

        <header className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300/90">
            Izakaya Tetris Puzzle
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
            居酒屋テトリス
          </h1>
          <p className="mt-2 text-sm text-zinc-300">
            飲んで、引いて、置く。運と判断で盤面をさばくパズル。
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm">
          <Hud
            stock={state.stock}
            lines={state.clearedLines}
            drinks={state.usedDrinks}
            time={state.elapsedTime}
            status={state.gameStatus}
            currentBlock={state.currentBlock}
            placementTimeLeft={state.placementTimeLeft}
          />
        </section>

        {state.gameStatus === "setup" && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm">
            <div className="mb-3">
              <h2 className="text-sm font-bold text-zinc-100">
                初期使用行数（難易度）
              </h2>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                数字を増やすほど、最初から盤面が埋まった状態で始まります。
              </p>
              <p className="mt-2 text-sm font-bold text-amber-300">
                現在の設定: {state.initialUsedRows}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {DIFFICULTY_OPTIONS.map((rows) => {
                const selected = state.initialUsedRows === rows;

                return (
                  <button
                    key={rows}
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "SET_INITIAL_USED_ROWS",
                        rows,
                      })
                    }
                    className={`rounded-2xl px-3 py-3 text-sm font-extrabold transition ${
                      selected
                        ? "scale-[1.02] bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/30"
                        : "bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700"
                    }`}
                  >
                    {rows}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => dispatch({ type: "RESET_GAME_WITH_SETTINGS" })}
              className="mt-4 w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-emerald-300 active:scale-[0.99]"
            >
              この設定で開始
            </button>
          </section>
        )}

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex w-24 shrink-0 flex-col gap-2">
              <div className="rounded-xl bg-zinc-900/80 p-2">
                <HoldPanel
                  holdBlock={state.holdBlock}
                  canHold={
                    state.gameStatus === "placing" ? state.canHold : true
                  }
                />
              </div>

              <div className="rounded-xl bg-zinc-900/80 p-2">
                <DrinkButton onClick={() => dispatch({ type: "ADD_DRINK" })} />
              </div>

              {canUseStockDraw && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "START_DRAW_FROM_STOCK" })}
                  className="rounded-xl bg-sky-500 px-2 py-2 text-xs font-bold text-white transition hover:bg-sky-400 active:scale-[0.99]"
                >
                  ストックで引く
                </button>
              )}
            </div>

            <div className="min-w-0 flex-1 rounded-2xl bg-zinc-900/80 p-1 shadow-inner">
              <div className="mb-2 text-xs text-zinc-400">
                rows: {state.board.length} / cols: {state.board[0]?.length ?? 0}
              </div>

              <Board board={state.board} activePiece={state.activePiece} />
            </div>
          </div>
        </section>

        <section
          ref={controlPadRef}
          className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm"
        >
          <ControlPad
            visible={state.gameStatus === "placing"}
            onMoveLeft={() => dispatch({ type: "MOVE_LEFT" })}
            onMoveRight={() => dispatch({ type: "MOVE_RIGHT" })}
            onRotateLeft={() => dispatch({ type: "ROTATE_LEFT" })}
            onRotateRight={() => dispatch({ type: "ROTATE_RIGHT" })}
            onHold={() => dispatch({ type: "USE_HOLD" })}
            onConfirm={() => dispatch({ type: "CONFIRM_PLACE" })}
          />
        </section>

        <DrinkChoiceModal
          open={state.modal === "drink-choice"}
          stock={state.stock}
          drawSource={state.drawSource}
          onDrawNow={() => {
            if (state.drawSource === "stock") {
              dispatch({ type: "CHOOSE_STOCK_DRAW_MODE", mode: "normal" });
              return;
            }

            dispatch({ type: "CHOOSE_DRINK_ACTION", choice: "draw-now" });
          }}
          onDrawWithExclude={() => {
            if (state.drawSource === "stock") {
              dispatch({ type: "CHOOSE_STOCK_DRAW_MODE", mode: "exclude" });
              return;
            }

            dispatch({
              type: "CHOOSE_DRINK_ACTION",
              choice: "draw-with-exclude",
            });
          }}
          onStore={() =>
            dispatch({ type: "CHOOSE_DRINK_ACTION", choice: "store" })
          }
          onBack={() => dispatch({ type: "CANCEL_DRINK_CHOICE" })}
        />

        <ExcludeCardsModal
          open={state.modal === "exclude"}
          stock={state.stock}
          excludedCards={state.excludedCards}
          onExclude={(card) => dispatch({ type: "EXCLUDE_CARD", card })}
          onStartDraw={() => dispatch({ type: "TO_DRAW_STEP" })}
        />

        <HiddenDrawModal
          open={state.modal === "draw-pick"}
          hiddenCards={state.hiddenCards}
          onPick={(id) => dispatch({ type: "PICK_HIDDEN_CARD", id })}
        />

        <DrawResultModal
          open={state.modal === "draw-result"}
          card={state.drawnCard}
          onClose={() => {
            if (state.drawnCard === "NONE") {
              dispatch({ type: "SKIP_TURN" });
              return;
            }

            dispatch({ type: "CLOSE_MODAL" });
            scrollToControlPad();
          }}
        />

        <AnySelectModal
          open={state.modal === "any-select"}
          board={state.board}
          activePiece={state.activePiece}
          onSelect={(block) => dispatch({ type: "SELECT_ANY_BLOCK", block })}
        />

        {state.gameStatus === "gameover" && (
          <div className="rounded-3xl border border-red-400/30 bg-red-500/10 px-6 py-5 text-center shadow-xl">
            <p className="text-2xl font-black tracking-wide text-red-200">
              GAME OVER
            </p>
            <p className="mt-2 text-sm text-red-100/80">
              もう置ける場所がありませんでした
            </p>
          </div>
        )}

        {state.gameStatus === "cleared" && (
          <div className="rounded-3xl border border-emerald-300/30 bg-emerald-400/10 px-6 py-5 text-center shadow-xl">
            <p className="text-2xl font-black tracking-wide text-emerald-200">
              CLEAR!!
            </p>
            <p className="mt-2 text-sm text-emerald-100/80">
              盤面をきれいに片付けました
            </p>
          </div>
        )}
      </div>
    </main>
  );
}