type Props = {
  visible: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onHold: () => void;
  onConfirm: () => void;
};

function Button({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-12 rounded-2xl font-bold shadow-md transition active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

export default function ControlPad({
  visible,
  onMoveLeft,
  onMoveRight,
  onRotateLeft,
  onRotateRight,
  onHold,
  onConfirm,
}: Props) {
  if (!visible) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* 上段 */}
      <Button
        onClick={onRotateLeft}
        className="bg-blue-500 text-white hover:bg-blue-400"
      >
        ⟲
      </Button>

      <Button
        onClick={onHold}
        className="bg-purple-500 text-white hover:bg-purple-400"
      >
        HOLD
      </Button>

      <Button
        onClick={onRotateRight}
        className="bg-blue-500 text-white hover:bg-blue-400"
      >
        ⟳
      </Button>

      {/* 下段 */}
      <Button
        onClick={onMoveLeft}
        className="bg-zinc-700 text-white hover:bg-zinc-600"
      >
        ←
      </Button>

      <Button
        onClick={onConfirm}
        className="bg-emerald-400 text-black text-lg font-black hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
      >
        決定
      </Button>

      <Button
        onClick={onMoveRight}
        className="bg-zinc-700 text-white hover:bg-zinc-600"
      >
        →
      </Button>
    </div>
  );
}