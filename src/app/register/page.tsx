import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

type RegisterPageProps = { searchParams: Promise<{ next?: string }> };

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/account";
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-950 sm:py-16">
      <div className="mx-auto max-w-md">
        <Link href="/tigsbd" className="text-sm font-black tracking-[0.2em] text-white focus-visible:outline-2 focus-visible:outline-amber-300">TIGSBD + SARONGO</Link>
        <section className="mt-8 rounded-3xl bg-white p-7 shadow-2xl shadow-black/20 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Shared customer identity</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Make it yours.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Create one account for both storefronts. No separate store logins.</p>
          <AuthForm mode="register" nextPath={nextPath} />
        </section>
      </div>
    </main>
  );
}