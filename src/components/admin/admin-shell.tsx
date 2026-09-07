"use client";

import Link from "next/link";
import { useState } from "react";

import type { AdminUser } from "@/lib/db/schema";
import type { PublicUser } from "@/lib/auth/service";
import { storeConfigs } from "@/lib/stores/config";

type Props = { user: PublicUser; scope: AdminUser & { storeIds: string[] }; children: React.ReactNode };
const modules = [
  { label: "Dashboard", href: "/admin", available: true },
  { label: "Orders", href: "/admin/orders", available: true },
  { label: "Products", href: "#", available: false },
  { label: "Categories", href: "#", available: false },
  { label: "Inventory", href: "#", available: false },
  { label: "Customers", href: "#", available: false },
  { label: "Reviews", href: "#", available: false },
  { label: "Discounts", href: "#", available: false },
  { label: "Media", href: "#", available: false },
  { label: "Analytics", href: "#", available: false },
  { label: "Settings", href: "#", available: false },
];

export function AdminShell({ user, scope, children }: Props) {
  const [open, setOpen] = useState(false);
  const stores = scope.role === "platform_admin" || scope.role === "order_manager" ? [{ label: "All Stores", filter: "all" }, ...storeConfigs.map((store) => ({ label: store.name, filter: store.slug }))] : storeConfigs.filter((store) => scope.storeIds.includes(store.id)).map((store) => ({ label: store.name, filter: store.slug }));
    return <div className="min-h-screen bg-[#f4f6f5] text-slate-950"><header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950 text-white"><div className="flex min-h-16 items-center justify-between gap-4 px-5 lg:px-8"><Link href="/admin" className="text-sm font-black tracking-[0.2em] focus-visible:outline-2 focus-visible:outline-amber-300">TIGSBD ADMIN</Link><button type="button" aria-expanded={open} aria-controls="admin-sidebar" onClick={() => setOpen((value) => !value)} className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold lg:hidden focus-visible:outline-2 focus-visible:outline-amber-300">Menu</button><div className="hidden items-center gap-5 text-sm lg:flex"><span>{user.firstName} {user.lastName}</span><span className="rounded-full bg-white/10 px-3 py-1 uppercase tracking-[0.12em]">{scope.role.replace("_", " ")}</span><form action="/api/auth/logout" method="post"><button className="text-slate-300 hover:text-white">Sign out</button></form></div></div></header><div className="mx-auto flex max-w-[1600px]"><aside id="admin-sidebar" className={`${open ? "block" : "hidden"} fixed inset-x-0 top-16 z-20 border-b border-slate-200 bg-white p-5 lg:static lg:block lg:min-h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-6`}><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Store context</p><div className="mt-3 grid gap-1">{stores.map((store) => <Link key={store.filter} href={store.filter === "all" ? "/admin/orders" : `/admin/orders?store=${store.filter}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-slate-950">{store.label}</Link>)}</div></div><nav aria-label="Admin navigation" className="grid gap-1">{modules.map((module) => module.available ? <Link key={module.label} href={module.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-slate-950">{module.label}</Link> : <span key={module.label} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-400"><span>{module.label}</span><span className="text-[0.62rem] uppercase tracking-widest">Later</span></span>)}</nav><div className="mt-8 border-t border-slate-200 pt-5 lg:hidden"><p className="text-sm font-semibold">{user.email}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{scope.role.replace("_", " ")}</p></div></aside><main className="min-w-0 flex-1">{children}</main></div></div>;
}