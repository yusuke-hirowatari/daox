import { type ReactNode, type JSX } from "react";

// ─── SVG Illustrations ────────────────────────────────────────────────────

function IllustNotification() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="36" fill="#f1f1f5" />
      {/* Bell body */}
      <path d="M36 20c-7.18 0-13 5.82-13 13v7l-2 4h30l-2-4v-7c0-7.18-5.82-13-13-13z"
        fill="#dedee5" stroke="#bbbbc0" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Bell clapper */}
      <path d="M33 44c0 1.66 1.34 3 3 3s3-1.34 3-3" stroke="#9a9aa0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Zzz */}
      <text x="48" y="27" fontSize="10" fill="#9a9aa0" fontWeight="700">z</text>
      <text x="52" y="21" fontSize="8" fill="#bbbbc0" fontWeight="700">z</text>
    </svg>
  );
}

function IllustInbox() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="36" fill="#f1f1f5" />
      {/* Envelope */}
      <rect x="16" y="25" width="40" height="28" rx="3" fill="#dedee5" stroke="#bbbbc0" strokeWidth="1.5" />
      <path d="M16 28l20 14 20-14" stroke="#9a9aa0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Small dots */}
      <circle cx="26" cy="45" r="2" fill="#bbbbc0" />
      <circle cx="33" cy="45" r="2" fill="#bbbbc0" />
      <circle cx="40" cy="45" r="2" fill="#bbbbc0" />
    </svg>
  );
}

function IllustList() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="36" fill="#f1f1f5" />
      {/* Clipboard */}
      <rect x="20" y="22" width="32" height="36" rx="3" fill="#dedee5" stroke="#bbbbc0" strokeWidth="1.5" />
      <rect x="28" y="18" width="16" height="8" rx="2" fill="#bbbbc0" />
      {/* Lines */}
      <line x1="26" y1="34" x2="46" y2="34" stroke="#9a9aa0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="40" x2="40" y2="40" stroke="#bbbbc0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="46" x2="43" y2="46" stroke="#bbbbc0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IllustCoupon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="36" fill="#f1f1f5" />
      {/* Ticket shape */}
      <path d="M16 28a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v4a4 4 0 0 0 0 8v4a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4v-4a4 4 0 0 0 0-8v-4z"
        fill="#dedee5" stroke="#bbbbc0" strokeWidth="1.5" />
      {/* Dashed divider */}
      <line x1="28" y1="24" x2="28" y2="48" stroke="#9a9aa0" strokeWidth="1" strokeDasharray="3 2" />
      {/* Star */}
      <path d="M44 32l1.5 3h3.5l-2.8 2 1 3.2L44 38.5l-3.2 1.7 1-3.2-2.8-2H42.5z" fill="#9a9aa0" />
    </svg>
  );
}

function IllustChat() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="36" fill="#f1f1f5" />
      {/* Chat bubbles */}
      <rect x="18" y="22" width="26" height="18" rx="5" fill="#dedee5" stroke="#bbbbc0" strokeWidth="1.5" />
      <path d="M22 40l-2 4 5-2" fill="#dedee5" stroke="#bbbbc0" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="28" y="34" width="26" height="16" rx="5" fill="#e8e8f0" stroke="#bbbbc0" strokeWidth="1.5" />
      <path d="M50 50l2 4-5-2" fill="#e8e8f0" stroke="#bbbbc0" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Dots */}
      <circle cx="26" cy="31" r="1.5" fill="#9a9aa0" />
      <circle cx="31" cy="31" r="1.5" fill="#9a9aa0" />
      <circle cx="36" cy="31" r="1.5" fill="#9a9aa0" />
    </svg>
  );
}

// ─── Variant map ──────────────────────────────────────────────────────────

export type EmptyVariant = "notification" | "inbox" | "list" | "coupon" | "chat";

const ILLUSTRATIONS: Record<EmptyVariant, () => JSX.Element> = {
  notification: IllustNotification,
  inbox:        IllustInbox,
  list:         IllustList,
  coupon:       IllustCoupon,
  chat:         IllustChat,
};

// ─── EmptyState ───────────────────────────────────────────────────────────

interface EmptyStateProps {
  variant?: EmptyVariant;
  title: string;
  sub?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  variant = "list",
  title,
  sub,
  action,
  className = "",
}: EmptyStateProps) {
  const Illust = ILLUSTRATIONS[variant];
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 px-6 text-center ${className}`}
    >
      <Illust />
      <div>
        <p className="text-[13px] font-semibold text-[#525261]">{title}</p>
        {sub && (
          <p className="text-[11px] text-[#9a9aa0] mt-1 leading-relaxed">{sub}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
