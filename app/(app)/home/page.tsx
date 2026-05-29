"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/atoms/Avatar";
import { AnnouncementBar } from "@/components/atoms/AnnouncementBar";
import { SegmentedTabs } from "@/components/atoms/Tabs";
import { TopTabs } from "@/components/atoms/Tabs";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { NoticeList } from "@/components/home/NoticeList";
import { BoardList } from "@/components/home/BoardList";
import { VoteList } from "@/components/home/VoteList";
import { RightPane } from "@/components/home/RightPane";
import { NOTICES, BOARD_POSTS, VOTES, ANNOUNCEMENTS } from "@/mocks";

const SP_TABS  = ["お知らせ", "掲示板", "投票"] as const;
const PC_TABS  = ["お知らせ", "掲示板", "投票"] as const;

export default function HomePage() {
  const router = useRouter();
  const [spTab,  setSpTab]  = useState(0);
  const [pcTab,  setPcTab]  = useState(1); // PC は掲示板をデフォルト表示

  return (
    <div className="flex flex-col h-full">

      {/* ══════════════════════════════════════════
          MOBILE レイアウト
      ══════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 overflow-hidden md:hidden">

        {/* ── Mobile Header ── */}
        <div className="flex shrink-0 items-center gap-2 border-b border-[#dedee5] px-4 py-2.5">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">HOME</div>
          </div>
          <div className="flex-none flex items-center gap-2">
            <button
              onClick={() => router.push("/home?search=1")}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]"
              aria-label="検索"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <Link
              href="/notifications"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]"
              aria-label="通知"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </Link>
            <Link href="/mypage" aria-label="マイページ">
              <Avatar size={28} label="田" tone={0} />
            </Link>
          </div>
        </div>

        {/* ── Segmented Tabs ── */}
        <SegmentedTabs tabs={[...SP_TABS]} defaultIndex={spTab} onChange={setSpTab} />

        {/* ── Announcement + Content (relative for absolute overlay) ── */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <AnnouncementBar items={ANNOUNCEMENTS} />

          <div className="flex-1 overflow-y-auto">
            {spTab === 0 && <NoticeList notices={NOTICES} />}
            {spTab === 1 && <BoardList posts={BOARD_POSTS} />}
            {spTab === 2 && <VoteList votes={VOTES} />}
          </div>

          {/* FAB — 掲示板タブのみ表示 */}
          {spTab === 1 && (
            <Link
              href="/home?compose=1"
              className="absolute right-4 bottom-4 w-[52px] h-[52px] rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[22px] font-light leading-none shadow-[0_4px_12px_rgba(0,0,0,.15)] hover:bg-[#333] transition-colors z-10"
              aria-label="新規投稿"
            >
              +
            </Link>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PC (Desktop) レイアウト
      ══════════════════════════════════════════ */}
      <div className="hidden md:flex md:flex-col md:flex-1 md:overflow-hidden">

        {/* ── PC Header ── */}
        <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-4 border-b border-[#dedee5]">
          <div>
            <div className="text-[17px] font-bold">新富商店街コミュニティ</div>
            <div className="text-[11px] text-[#9a9aa0] mt-0.5">メンバー 312人</div>
          </div>
          <div className="flex items-center gap-2.5">
            <Input placeholder="検索" className="w-[220px]"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>}
            />
            <Button variant="outline" size="sm" onClick={() => router.push("/home?compose=1")}>+ 投稿</Button>
          </div>
        </div>

        {/* ── PC Announcement (relative for overlay) ── */}
        <div className="relative shrink-0">
          <AnnouncementBar items={ANNOUNCEMENTS} />
        </div>

        {/* ── 2-column: メイン + 右ペイン ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* メイン列 */}
          <div className="flex flex-1 flex-col overflow-hidden min-w-0">
            <TopTabs tabs={[...PC_TABS]} defaultIndex={pcTab} onChange={setPcTab} />
            <div className="flex-1 overflow-y-auto">
              {pcTab === 0 && <NoticeList notices={NOTICES} />}
              {pcTab === 1 && <BoardList posts={BOARD_POSTS} />}
              {pcTab === 2 && <VoteList votes={VOTES} />}
            </div>
          </div>

          {/* 右ペイン */}
          <RightPane votes={VOTES} />
        </div>
      </div>
    </div>
  );
}
