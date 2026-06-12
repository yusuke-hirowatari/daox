"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/atoms/Avatar";
import { CommunitySwitcher } from "./CommunitySwitcher";

/* ── nav definition ── */
const NAV_ITEMS = [
  { href: "/home",    label: "ホーム",      icon: HomeIcon,    badge: 0 },
  { href: "/checkin", label: "チェックイン", icon: CheckinIcon, badge: 0 },
  { href: "/tasks",   label: "タスク",      icon: TaskIcon,    badge: 0 },
  { href: "/wallet",  label: "ウォレット",  icon: WalletIcon,  badge: 0 },
  { href: "/dm",      label: "DM",         icon: DmIcon,      badge: 3 },
] as const;

/* mock user — STEP 4 で実データに差替 */
const MOCK_USER = { name: "田中 太郎", initial: "田", dao: 420, tone: 0 } as const;

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex md:flex-col md:shrink-0"
      style={{ width: 220, background: "#f1f1f5", borderRight: "1px solid #dedee5", padding: "20px 12px" }}
    >
      {/* ── Community Switcher ── */}
      <div className="mb-[18px]">
        <CommunitySwitcher variant="pc" />
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
                active
                  ? "bg-white text-[#1a1a1a] border border-[#dedee5]"
                  : "text-[#525261] border border-transparent hover:bg-white/60",
              ].join(" ")}
            >
              <Icon active={active} />
              <span className="flex-1 whitespace-nowrap">{label}</span>
              {badge > 0 && (
                <span className="text-[9px] font-bold text-white bg-[#6666ff] rounded-[9px] px-[6px] py-[1px] leading-none">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User Card ── */}
      <Link
        href="/mypage"
        className="flex items-center gap-2.5 mt-3 p-3 rounded-lg bg-white border border-[#dedee5] hover:border-[#9a9aa0] transition-colors"
      >
        <Avatar size={28} label={MOCK_USER.initial} tone={MOCK_USER.tone} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[11.5px] font-semibold text-[#1a1a1a] truncate">{MOCK_USER.name}</span>
          </div>
          <div className="text-[10px] font-bold" style={{ color: "#6666ff", fontVariantNumeric: "tabular-nums" }}>
            {MOCK_USER.dao} DAO
          </div>
        </div>
      </Link>
    </aside>
  );
}

/* ── Icon components ── */
type IconProps = { active: boolean };
const ICON_COLOR = (active: boolean) => (active ? "#1a1a1a" : "#525261");

function HomeIcon({ active }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function CheckinIcon({ active }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3v3M14 21h2" />
    </svg>
  );
}

function TaskIcon({ active }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12l3 3 5-5" />
    </svg>
  );
}

function WalletIcon({ active }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
      <path d="M16 3H5a2 2 0 0 0-2 2v2" />
      <circle cx="16" cy="13" r="1.5" fill={ICON_COLOR(active)} stroke="none" />
    </svg>
  );
}

function CouponIcon({ active }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
    </svg>
  );
}

function DmIcon({ active }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
