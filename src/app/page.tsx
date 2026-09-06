export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
          TIGSBD + Sarongo
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
          Platform foundation ready.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
          Phase 0 is running on the new Next.js App Router foundation. Shared
          commerce services will be added only after this foundation is approved.
        </p>
        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {[
            ["Runtime", "Next.js + React"],
            ["Data", "Turso + Drizzle"],
            ["Validation", "TypeScript + Zod"],
          ].map(([label, value]) => (
            <div key={label} className="border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-2 text-sm text-slate-200">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
