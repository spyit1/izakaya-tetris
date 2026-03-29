type Props = {
  onClick: () => void;
};

export default function DrinkButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        rounded-2xl
        bg-gradient-to-r from-amber-400 to-yellow-300
        px-4 py-4
        text-base font-black text-zinc-900
        shadow-[0_8px_20px_rgba(251,191,36,0.35)]
        transition
        hover:from-amber-300 hover:to-yellow-200
        active:scale-95
      "
    >
      飲食+1
    </button>
  );
}