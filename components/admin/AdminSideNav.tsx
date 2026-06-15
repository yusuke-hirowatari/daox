"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/atoms/Avatar";
import { DAOXMark } from "@/components/atoms/DAOXLogo";
import { useAdminRole, type AdminRole } from "./role-context";

/* ─── Nav item type ─── */
type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: string;
  badge: number;
  superOnly: boolean;
};

/* ─── Section type ─── */
type NavSection = {
  header: string | null; // null = no header (top-level item)
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    header: null,
    items: [
      { id: "home", href: "/admin", label: "ホーム", icon: "\u{1F3E0}", badge: 0, superOnly: false },
    ],
  },
  {
    header: "コンテンツ管理",
    items: [
      { id: "board", href: "/admin/board", label: "掲示板", icon: "\u{1F4CB}", badge: 3, superOnly: false },
      { id: "posts", href: "/admin/posts", label: "投稿",   icon: "\u{1F4DD}", badge: 0, superOnly: false },
      { id: "tasks", href: "/admin/tasks", label: "タスク",  icon: "\u2611",    badge: 0, superOnly: false },
      { id: "votes", href: "/admin/votes", label: "投票",    icon: "\u{1F5F3}", badge: 0, superOnly: false },
    ],
  },
  {
    header: "コミュニティ運営",
    items: [
      { id: "members", href: "/admin/members", label: "メンバー",          icon: "\u{1F465}", badge: 0, superOnly: false },
      { id: "shops",   href: "/admin/shops",   label: "店舗・チェックイン", icon: "\u{1F3EA}", badge: 0, superOnly: false },
      { id: "tokens",  href: "/admin/tokens",  label: "トークン・ランク",   icon: "\u{1FA99}", badge: 0, superOnly: true  },
    ],
  },
  {
    header: "設定",
    items: [
      { id: "settings", href: "/admin/settings", label: "設定", icon: "\u2699", badge: 0, superOnly: true },
    ],
  },
];

const ROLE_LABELS: Record<AdminRole, string> = {
  super: "スーパー管理者",
  mod:   "モデレーター",
};

/* ─── Pending alert count (would come from API in production) ─── */
const PENDING_ALERT_COUNT = 3;

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

      {/* Nav sections */}
      <nav className="flex flex-col flex-1 overflow-y-auto">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {/* Section header */}
            {section.header && (
              <div className="text-[10px] font-semibold text-[#9a9aa0] uppercase tracking-wider px-2.5 pt-3 pb-1">
                {section.header}
              </div>
            )}

            {/* Section items */}
            <div className="flex flex-col gap-[1px]">
              {section.items.map((it) => {
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
            </div>
          </div>
        ))}
      </nav>

      {/* Alert section: 要対応 */}
      {PENDING_ALERT_COUNT > 0 && (
        <Link
          href="/admin/board"
          className="flex-none mt-3 flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors"
          style={{
            background: "#f0f0ff",
            border: "1px solid #6666ff",
          }}
        >
          <span className="text-[13px] flex-none">🔔</span>
          <span className="flex-1 text-[12px] font-semibold text-[#3a3a5c]">
            要対応
          </span>
          <span className="flex-none text-[10px] font-bold text-white bg-[#6666ff] rounded-[9px] px-[6px] py-[2px] leading-none">
            {PENDING_ALERT_COUNT}件
          </span>
        </Link>
      )}

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
