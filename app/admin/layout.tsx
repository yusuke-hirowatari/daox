"use client";

import { useState } from "react";
import { AdminRoleProvider } from "@/components/admin/role-context";
import { AdminSideNav } from "@/components/admin/AdminSideNav";
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AdminRoleProvider>
      <div className="flex h-full bg-white">
        {/* PC sidebar: hidden on mobile */}
        <div className="hidden md:flex">
          <AdminSideNav />
        </div>

        {/* Mobile header + drawer */}
        <div className="md:hidden">
          <AdminMobileHeader open={drawerOpen} onToggle={() => setDrawerOpen(!drawerOpen)} onClose={() => setDrawerOpen(false)} />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col min-w-0 pt-[52px] md:pt-0">
          {children}
        </main>
      </div>
    </AdminRoleProvider>
  );
}
