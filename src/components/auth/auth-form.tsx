"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
  nextPath: string;
};

export function AuthForm({ mode, nextPath }: AuthFormProps) {
  const isRegister = mode === "register";
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const body = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      ...(isRegister ? { firstName: String(form.get("firstName") ?? ""), lastName: String(form.get("lastName") ?? "") } : {}),
    };
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Please check your details and try again.");
        return;
      }
      window.location.assign(nextPath);
    } catch {
      setError("We could not connect right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      {isRegister ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-800">First name<input name="firstName" autoComplete="given-name" required className="auth-input" /></label>
          <label className="grid gap-2 text-sm font-semibold text-slate-800">Last name<input name="lastName" autoComplete="family-name" required className="auth-input" /></label>
        </div>
      ) : null}
      <label className="grid gap-2 text-sm font-semibold text-slate-800">Email<input name="email" type="email" autoComplete="email" required className="auth-input" /></label>
      <label className="grid gap-2 text-sm font-semibold text-slate-800">Password<input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 8 : undefined} className="auth-input" /></label>
      {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{error}</p> : null}
      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">{isSubmitting ? "Working..." : isRegister ? "Create shared account" : "Sign in"}</button>
      <p className="text-center text-sm text-slate-600">{isRegister ? "Already have an account?" : "New to the platform?"} <Link href={isRegister ? `/login?next=${encodeURIComponent(nextPath)}` : `/register?next=${encodeURIComponent(nextPath)}`} className="font-semibold text-slate-950 underline underline-offset-4">{isRegister ? "Sign in" : "Create an account"}</Link></p>
    </form>
  );
}