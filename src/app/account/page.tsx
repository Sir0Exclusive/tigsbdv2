import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { requireUser } from "@/lib/auth/session";

export const metadata = { title: "Account | TIGSBD + Sarongo", description: "Your shared TIGSBD and Sarongo customer account." };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <main className="min-h-screen bg-[#f7f8f6] px-6 py-12 text-slate-950 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Link href="/tigsbd" className="text-sm font-black tracking-[0.2em] text-slate-950 focus-visible:outline-2 focus-visible:outline-amber-500">TIGSBD + SARONGO</Link>
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/40 sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Shared account</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">Good to see you, {user.firstName}.</h1>
              <p className="mt-3 text-slate-600">Your identity works across both TIGSBD and Sarongo.</p>
            </div>
            <LogoutButton />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Name</p><p className="mt-2 font-semibold">{user.firstName} {user.lastName}</p></div>
            <div className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Email</p><p className="mt-2 break-all font-semibold">{user.email}</p></div>
          </div>
          <Link href="/account/orders" className="mt-6 block rounded-2xl border border-slate-200 p-5 transition-colors hover:border-slate-950"><p className="font-semibold">Order history</p><p className="mt-1 text-sm text-slate-500">View your TIGSBD and Sarongo orders.</p></Link>
          <p className="mt-8 rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-300">Orders, addresses, wishlist, and other customer features will be added in later phases. Your shared identity is ready for both stores now.</p>
        </div>
      </div>
    </main>
  );
}