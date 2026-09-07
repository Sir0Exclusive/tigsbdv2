import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUser } from "@/lib/auth/session";
import { getAdminScope } from "@/lib/orders";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  const scope = await getAdminScope(user.id);
  if (!scope) redirect("/account");
  return <AdminShell user={user} scope={scope}>{children}</AdminShell>;
}