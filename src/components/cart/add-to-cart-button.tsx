"use client";

import { useState } from "react";

type AddToCartButtonProps = { productId: string; variantId?: string | null; disabled?: boolean };

export function AddToCartButton({ productId, variantId = null, disabled = false }: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "added" | "error">("idle");
  async function add() {
    setStatus("pending");
    const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, variantId, quantity: 1 }) });
    setStatus(response.ok ? "added" : "error");
  }
  return <button type="button" onClick={add} disabled={disabled || status === "pending"} className="mt-10 w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-56 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">{status === "pending" ? "Adding..." : status === "added" ? "Added to shared cart" : status === "error" ? "Could not add item" : "Add to shared cart"}</button>;
}