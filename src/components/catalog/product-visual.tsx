type ProductVisualProps = {
  name: string;
  accent: string;
  compact?: boolean;
};

export function ProductVisual({ name, accent, compact = false }: ProductVisualProps) {
  return (
    <div className={`relative overflow-hidden bg-slate-950 ${compact ? "aspect-[4/3] rounded-xl" : "aspect-[4/3] rounded-2xl"}`}>
      <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full border-[18px] opacity-80" style={{ borderColor: accent }} />
      <div className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full border-[12px] border-white/10" />
      <div className="absolute inset-x-5 bottom-5">
        <span className="block text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400">Demo object</span>
        <span className="mt-1 block max-w-[12rem] text-lg font-semibold leading-tight text-white">{name}</span>
      </div>
    </div>
  );
}