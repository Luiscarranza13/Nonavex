import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
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
