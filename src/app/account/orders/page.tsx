import Link from "next/link";

import { requireUser } from "@/lib/auth/session";
import { getCustomerOrders } from "@/lib/orders";
import { formatBDT } from "@/lib/money";

export const metadata = { title: "Orders | TIGSBD + Sarongo" };

export default async function CustomerOrdersPage() {
  const user = await requireUser();
  const entries = await getCustomerOrders(user.id);
  return <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16"><Link href="/account" className="text-sm font-semibold text-slate-600 hover:underline">Back to account</Link><div className="mt-8 border-b border-slate-200 pb-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Shared account</p><h1 className="mt-3 text-4xl font-black tracking-tight">Your orders</h1><p className="mt-3 text-slate-600">Orders from TIGSBD and Sarongo in one history.</p></div>{entries.length === 0 ? <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">No orders yet.</div> : <div className="mt-8 space-y-3">{entries.map(({ order, items }) => { const stores=[...new Set(items.map(item=>item.storeName))]; return <Link key={order.id} href={`/account/orders/${order.id}`} className="block rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-bold">{order.orderNumber}</p><p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-BD")} · {items.length} items · {stores.join(" + ")}</p></div><div className="text-left sm:text-right"><p className="font-bold">{formatBDT(order.totalCents)}</p><span className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">{order.status}</span></div></div></Link>})}</div>}</main>;
}