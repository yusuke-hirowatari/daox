"use client";

import Link from "next/link";
import { CommunitySwitcher } from "./CommunitySwitcher";

/** PC・SP 共通グローバルヘッダー */
export function GlobalHeader() {
  return (
    <>
      {/* ── SP Header ── */}
      <div className="flex md:hidden shrink-0 items-center justify-between gap-2 px-3 py-2 border-b border-[#dedee5] sticky top-0 z-30 bg-white">
        <CommunitySwitcher variant="sp" />
        <div className="flex items-center gap-1">
          <Link
            href="/members"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5] transition-colors"
            aria-label="メンバー"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </Link>
          <Link
            href="/notifications"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5] transition-colors"
            aria-label="通知"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </Link>
          <Link
            href="/mypage"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5] transition-colors"
            aria-label="マイページ"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── PC Header ── */}
      <div className="hidden md:flex shrink-0 items-center justify-between gap-4 px-5 py-3 border-b border-[#dedee5] sticky top-0 z-30 bg-white">
        <CommunitySwitcher variant="header" />
        <div className="flex items-center gap-2.5">
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#525261] rounded-full border border-[#dedee5] hover:bg-[#f1f1f5] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            メンバー
          </Link>
          <Link
            href="/notifications"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f1f1f5] transition-colors"
            aria-label="通知"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </Link>
          <Link
            href="/mypage"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f1f1f5] transition-colors"
            aria-label="マイページ"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}

/** 後方互換 — layout.tsx の import をそのまま使えるように */
export { GlobalHeader as PcGlobalHeader };
