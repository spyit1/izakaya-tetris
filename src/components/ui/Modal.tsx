type Props = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, title, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="
          w-full max-w-sm
          rounded-3xl
          border border-white/10
          bg-zinc-900/95
          p-5
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          animate-[fadeIn_0.2s_ease]
        "
      >
        {title && (
          <h2 className="mb-4 text-lg font-black tracking-wide text-white">
            {title}
          </h2>
        )}

        <div className="text-sm text-zinc-200">{children}</div>
      </div>
    </div>
  );
}