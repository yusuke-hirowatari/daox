"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type AdminRole = "super" | "mod";

type CtxVal = { role: AdminRole; setRole: (r: AdminRole) => void };

export const AdminRoleCtx = createContext<CtxVal>({
  role: "super",
  setRole: () => {},
});

export function useAdminRole() {
  return useContext(AdminRoleCtx);
}

export function AdminRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AdminRole>("super");
  return (
    <AdminRoleCtx.Provider value={{ role, setRole }}>
      {children}
    </AdminRoleCtx.Provider>
  );
}
