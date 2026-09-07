"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ProductVisual } from "@/components/catalog/product-visual";
import { getStoreByKey, storeConfigs } from "@/lib/stores";

type Line = { cartId: string; product: { id: string; storeId: string; name: string; slug: string; sku: string; priceCents: number; salePriceCents: number | null }; variant: { id: string; name: string; priceCents: number | null } | null; media: { url: string } | null; inventory: { availableQuantity: number; reservedQuantity: number } | null; quantity: number; unitPriceCents: number; lineSubtotalCents: number };

function price(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100); }

export default function CartPage() {
  const [lines, setLines] = useState<Line[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cart").then(async (response) => {
      const result = await response.json();
      if (cancelled) return;
      if (response.ok) setLines(result.lines); else setError(result.error);
    });
    return () => { cancelled = true; };
  }, []);

  async function change(line: Line, quantity: number) {
    setPending(`${line.product.id}:${line.variant?.id ?? "base"}`); setError(null);
    const response = await fetch("/api/cart", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: line.product.id, variantId: line.variant?.id ?? null, quantity }) });
    const result = await response.json(); if (response.ok) setLines(result.lines); else setError(result.error); setPending(null);
  }
  async function remove(line: Line) { const response = await fetch("/api/cart", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: line.product.id, variantId: line.variant?.id ?? null }) }); const result = await response.json(); if (response.ok) setLines(result.lines); else setError(result.error); }

  const subtotal = lines.reduce((sum, line) => sum + line.lineSubtotalCents, 0);
  return <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
    <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-8"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Shared cart</p><h1 className="mt-3 text-4xl font-black tracking-tight">Everything you saved</h1><p className="mt-3 text-slate-600">TIGSBD and Sarongo items stay together in one cart.</p></div><span className="text-sm font-semibold text-slate-500">{lines.length} {lines.length === 1 ? "item" : "items"}</span></div>
    {error ? <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
    {lines.length === 0 ? <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><p className="text-lg font-semibold">Your shared cart is empty.</p><p className="mt-2 text-slate-500">Start in either storefront and your items will meet here.</p><div className="mt-6 flex justify-center gap-3"><Link href="/tigsbd/products" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Browse TIGSBD</Link><Link href="/sarongo/products" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold">Browse Sarongo</Link></div></div> : <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]"><section className="space-y-4">{lines.map((line) => { const store = storeConfigs.find((item) => item.id === line.product.storeId) ?? getStoreByKey("TIGSBD")!; const accent = line.media?.url.startsWith("placeholder://") ? `#${line.media.url.replace("placeholder://", "")}` : store.colors.accent; const key = `${line.product.id}:${line.variant?.id ?? "base"}`; return <article key={key} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[10rem_1fr_auto] sm:items-center"><ProductVisual name={line.product.name} accent={accent} compact /><div><p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: store.colors.accent }}>{store.name}</p><Link href={`/${store.slug}/product/${line.product.slug}`} className="mt-1 block text-lg font-semibold hover:underline">{line.product.name}</Link><p className="mt-1 text-sm text-slate-500">SKU {line.product.sku}{line.variant ? ` · ${line.variant.name}` : ""}</p><p className="mt-3 font-bold">{price(line.unitPriceCents)}</p></div><div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end"><div className="flex items-center rounded-xl border border-slate-300"><button type="button" aria-label={`Decrease ${line.product.name} quantity`} disabled={line.quantity <= 1 || pending === key} onClick={() => void change(line, line.quantity - 1)} className="min-h-11 min-w-11 text-lg hover:bg-slate-100">-</button><span className="min-w-10 text-center text-sm font-semibold">{pending === key ? "..." : line.quantity}</span><button type="button" aria-label={`Increase ${line.product.name} quantity`} disabled={pending === key} onClick={() => void change(line, line.quantity + 1)} className="min-h-11 min-w-11 text-lg hover:bg-slate-100">+</button></div><button type="button" onClick={() => void remove(line)} className="text-sm font-semibold text-slate-500 underline-offset-4 hover:text-red-700 hover:underline">Remove</button><p className="font-bold text-slate-950">{price(line.lineSubtotalCents)}</p></div></article> })}</section><aside className="h-fit rounded-2xl bg-slate-950 p-6 text-white"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">Summary</p><div className="mt-6 flex justify-between gap-4 text-lg"><span>Subtotal</span><strong>{price(subtotal)}</strong></div><p className="mt-4 text-sm leading-6 text-slate-400">Checkout, shipping, and payment arrive in later phases.</p><button type="button" disabled className="mt-6 w-full rounded-xl bg-white/20 px-4 py-3 text-sm font-bold text-slate-300">Checkout arrives later</button></aside></div>}
  </main>;
}