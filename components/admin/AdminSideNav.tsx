"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/atoms/Avatar";
import { DAOXMark } from "@/components/atoms/DAOXLogo";
import { useAdminRole, type AdminRole } from "./role-context";

const ADMIN_NAV = [
  { id: "dashboard", href: "/admin",          label: "ダッシュボード",   icon: "▦", badge: 0, superOnly: false },
  { id: "members",   href: "/admin/members",   label: "メンバー",         icon: "◧", badge: 0, superOnly: false },
  { id: "mod",       href: "/admin/mod",       label: "モデレーション",   icon: "⚑", badge: 3, superOnly: false },
  { id: "announce",  href: "/admin/announce",  label: "お知らせ",         icon: "◉", badge: 0, superOnly: false },
  { id: "tasks",     href: "/admin/tasks",     label: "タスク監視",       icon: "☑", badge: 0, superOnly: false },
  { id: "tokens",    href: "/admin/tokens",    label: "トークン経済",     icon: "◈", badge: 0, superOnly: true  },
  { id: "rank",      href: "/admin/rank",      label: "ランク条件",       icon: "★", badge: 0, superOnly: true  },
  { id: "shops",     href: "/admin/shops",     label: "店舗・QR",         icon: "⚏", badge: 0, superOnly: false },
  { id: "analytics", href: "/admin/analytics", label: "分析",             icon: "◔", badge: 0, superOnly: false },
  { id: "operators", href: "/admin/operators", label: "運営者",           icon: "◍", badge: 0, superOnly: true  },
  { id: "audit",     href: "/admin/audit",     label: "監査ログ",         icon: "⚿", badge: 0, superOnly: true  },
  { id: "settings",  href: "/admin/settings",  label: "コミュニティ設定", icon: "⚙", badge: 0, superOnly: true  },
] as const;

const ROLE_LABELS: Record<AdminRole, string> = {
  super: "スーパー管理者",
  mod:   "モデレーター",
};

export function AdminSideNav() {
  const pathname = usePathname();
  const { role, setRole } = useAdminRole();
  const isSuper = role === "super";

  return (
    <aside
      className="flex-none flex flex-col overflow-hidden"
      style={{
        width: 224,
        borderRight: "1px solid #dedee5",
        background: "#f1f1f5",
        padding: "16px 10px",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-2.5 pb-3.5 flex-none">
        <DAOXMark size={26} />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold leading-none">DAOX Admin</div>
          <div className="text-[9.5px] text-[#9a9aa0] font-mono mt-0.5">
            新富商店街
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-[1px] flex-1 overflow-y-auto">
        {ADMIN_NAV.map((it) => {
          const active =
            it.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(it.href);
          const locked = it.superOnly && !isSuper;
          return (
            <Link
              key={it.id}
              href={locked ? "#" : it.href}
              aria-disabled={locked}
              onClick={locked ? (e) => e.preventDefault() : undefined}
              className={[
                "flex items-center gap-2 px-2.5 py-[7px] rounded-md text-[12.5px] transition-colors",
                active
                  ? "bg-white text-[#1a1a1a] font-semibold border border-[#dedee5]"
                  : locked
                  ? "text-[#c8c8d0] font-medium border border-transparent cursor-default"
                  : "text-[#525261] font-medium border border-transparent hover:bg-white/60",
              ].join(" ")}
            >
              <span className="w-4 flex-none text-center text-[12px]">
                {it.icon}
              </span>
              <span className="flex-1 truncate">{it.label}</span>
              {it.badge > 0 && !locked ? (
                <span className="flex-none text-[9px] font-bold text-white bg-[#6666ff] rounded-[9px] px-[6px] py-[1px] leading-none">
                  {it.badge}
                </span>
              ) : null}
              {locked && (
                <span className="flex-none text-[9px] text-[#c8c8d0]">🔒</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card + role toggle */}
      <div className="mt-3 p-2.5 rounded-lg bg-white border border-[#dedee5] flex-none">
        <div className="flex items-center gap-2">
          <Avatar size={26} label="田" tone={0} />
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-semibold truncate">
              田中 太郎
            </div>
            <div className="text-[9.5px] text-[#9a9aa0]">
              {ROLE_LABELS[role]}
            </div>
          </div>
        </div>
        {/* Demo role switcher */}
        <div className="mt-2 flex gap-1">
          {(["super", "mod"] as const).map((r) => (
            <button
              key={r}
              className={[
                "flex-1 text-[9px] font-semibold py-[3px] rounded-[4px] transition-colors",
                role === r
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-[#ebebf0] text-[#9a9aa0] hover:bg-[#e0e0e8]",
              ].join(" ")}
              onClick={() => setRole(r)}
            >
              {r === "super" ? "スーパー" : "モデレーター"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
