import { AdminRoleProvider } from "@/components/admin/role-context";
import { AdminSideNav } from "@/components/admin/AdminSideNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoleProvider>
      <div className="flex h-full bg-white">
        <AdminSideNav />
        <main className="flex-1 overflow-hidden flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </AdminRoleProvider>
  );
}
