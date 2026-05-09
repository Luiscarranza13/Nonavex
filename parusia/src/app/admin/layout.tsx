import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Sidebar } from "@/components/admin/Sidebar";
import { getAdminUser } from "@/lib/auth/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-background">
      <div className="flex">
        <Sidebar className="hidden lg:block" />
        <div className="min-w-0 flex-1">
          <AdminNavbar />
          <ProtectedRoute>
            <main className="mx-auto w-full max-w-[1600px] p-3 sm:p-5 lg:p-6">{children}</main>
          </ProtectedRoute>
        </div>
      </div>
    </div>
  );
}
