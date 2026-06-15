"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/atoms/Avatar";
import { DAOXMark } from "@/components/atoms/DAOXLogo";
import { useAdminRole, type AdminRole } from "./role-context";

/* ─── Nav data (same as AdminSideNav) ─── */
type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: string;
  badge: number;
  superOnly: boolean;
};

type NavSection = {
  header: string | null;
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

const PENDING_ALERT_COUNT = 3;

interface Props {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function AdminMobileHeader({ open, onToggle, onClose }: Props) {
  const pathname = usePathname();
  const { role, setRole } = useAdminRole();
  const isSuper = role === "super";

  // Close drawer on route change
  useEffect(() => {
    onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Fixed top bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 bg-white border-b border-[#dedee5]"
        style={{ height: 52 }}
      >
        {/* Hamburger */}
        <button onClick={onToggle} className="flex-none w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f1f1f5]">
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>

        {/* Title */}
        <DAOXMark size={22} />
        <span className="text-[13px] font-bold flex-1">Admin</span>

        {/* Alert badge */}
        {PENDING_ALERT_COUNT > 0 && (
          <Link href="/admin/board" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "#f0f0ff" }}>
            <span className="text-[12px]">🔔</span>
            <span className="text-[10px] font-bold text-[#6666ff]">{PENDING_ALERT_COUNT}</span>
          </Link>
        )}
      </div>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/30" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 z-[70] flex flex-col transition-transform duration-200 ease-out"
        style={{
          width: 280,
          background: "#f1f1f5",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-[#dedee5] flex-none">
          <DAOXMark size={26} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold leading-none">DAOX Admin</div>
            <div className="text-[9.5px] text-[#9a9aa0] font-mono mt-0.5">新富商店街</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/60">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-2">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si}>
              {section.header && (
                <div className="text-[10px] font-semibold text-[#9a9aa0] uppercase tracking-wider px-2.5 pt-3 pb-1">
                  {section.header}
                </div>
              )}
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
                      onClick={(e) => {
                        if (locked) { e.preventDefault(); return; }
                        onClose();
                      }}
                      className={[
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors",
                        active
                          ? "bg-white text-[#1a1a1a] font-semibold border border-[#dedee5]"
                          : locked
                          ? "text-[#c8c8d0] font-medium border border-transparent cursor-default"
                          : "text-[#525261] font-medium border border-transparent hover:bg-white/60",
                      ].join(" ")}
                    >
                      <span className="w-5 flex-none text-center text-[14px]">{it.icon}</span>
                      <span className="flex-1">{it.label}</span>
                      {it.badge > 0 && !locked && (
                        <span className="flex-none text-[9px] font-bold text-white bg-[#6666ff] rounded-[9px] px-[6px] py-[1px] leading-none">
                          {it.badge}
                        </span>
                      )}
                      {locked && <span className="flex-none text-[10px] text-[#c8c8d0]">🔒</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Alert */}
        {PENDING_ALERT_COUNT > 0 && (
          <Link
            href="/admin/board"
            onClick={onClose}
            className="flex-none mx-2.5 mb-2 flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{ background: "#f0f0ff", border: "1px solid #6666ff" }}
          >
            <span className="text-[13px]">🔔</span>
            <span className="flex-1 text-[12.5px] font-semibold text-[#3a3a5c]">要対応</span>
            <span className="text-[10px] font-bold text-white bg-[#6666ff] rounded-[9px] px-[6px] py-[2px] leading-none">
              {PENDING_ALERT_COUNT}件
            </span>
          </Link>
        )}

        {/* User card */}
        <div className="flex-none mx-2.5 mb-2.5 p-3 rounded-lg bg-white border border-[#dedee5]">
          <div className="flex items-center gap-2">
            <Avatar size={28} label="田" tone={0} />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold truncate">田中 太郎</div>
              <div className="text-[10px] text-[#9a9aa0]">{ROLE_LABELS[role]}</div>
            </div>
          </div>
          <div className="mt-2 flex gap-1">
            {(["super", "mod"] as const).map((r) => (
              <button
                key={r}
                className={[
                  "flex-1 text-[10px] font-semibold py-[4px] rounded-[4px] transition-colors",
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
      </div>
    </>
  );
}
