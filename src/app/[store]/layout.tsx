import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { resolveStore } from "@/lib/stores";

type StoreLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
};

export async function generateMetadata({ params }: StoreLayoutProps): Promise<Metadata> {
  const { store: slug } = await params;
  const store = resolveStore(slug);
  if (!store) return {};
  return { title: store.metadata.title, description: store.metadata.description };
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const { store: slug } = await params;
  const store = resolveStore(slug);
  if (!store) notFound();
  return <StorefrontShell store={store}>{children}</StorefrontShell>;
}