"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AdminBtn, AdminPill, AdminTable, AdminPageShell, type ColDef, type PillTone } from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

type AnnStatus = "公開中" | "予約" | "下書き" | "アーカイブ";

interface Ann {
  status: AnnStatus;
  tag:    string;
  title:  string;
  date:   string;
  read:   string;
  author: string;
}

const ITEMS: Ann[] = [
  { status: "公開中",     tag: "重要",     title: "今週の市役所窓口の臨時休業について",   date: "2026/05/20", read: "248/312", author: "運営事務局" },
  { status: "公開中",     tag: "お知らせ", title: "夏祭り 出店者募集のお知らせ",           date: "2026/05/19", read: "198/312", author: "運営事務局" },
  { status: "予約",       tag: "イベント", title: "6月の定例会のお知らせ",                 date: "2026/05/27", read: "—",       author: "運営事務局" },
  { status: "下書き",     tag: "お知らせ", title: "ロゴリニューアルのご報告",               date: "2026/05/24", read: "—",       author: "田中 太郎" },
  { status: "アーカイブ", tag: "イベント", title: "5月のクリーン作戦のご案内",               date: "2026/04/30", read: "301/312", author: "運営事務局" },
];

const FILTER_TABS = [
  "すべて (12)",
  "公開中 (2)",
  "予約 (1)",
  "下書き (1)",
  "アーカイブ (8)",
];

const STATUS_TONE: Record<AnnStatus, PillTone> = {
  "公開中":     "success",
  "予約":       "info",
  "下書き":     "warn",
  "アーカイブ": "muted",
};

const COLS: ColDef[] = [
  { key: "status", label: "ステータス", flex: 0.8 },
  { key: "tag",    label: "タグ",       flex: 0.7 },
  { key: "title",  label: "タイトル",   flex: 2.5, bold: true },
  { key: "date",   label: "配信日",     flex: 0.9, mono: true, muted: true },
  { key: "read",   label: "既読",       flex: 0.7, mono: true, align: "right" },
  { key: "author", label: "作成者",     flex: 0.9, muted: true },
  { key: "act",    label: "",           flex: 0.4, align: "right" },
];

function buildRows(items: Ann[]): Record<string, ReactNode>[] {
  return items.map((i) => ({
    status: <AdminPill tone={STATUS_TONE[i.status]}>{i.status}</AdminPill>,
    tag:    <AdminPill tone={i.tag === "重要" ? "warn" : "default"}>{i.tag}</AdminPill>,
    title:  i.title,
    date:   i.date,
    read:   i.read,
    author: i.author,
    act:    <span className="text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]">⋯</span>,
  }));
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminAnnouncePage() {
  const [filterIdx, setFilterIdx] = useState(0);
  const rows = buildRows(ITEMS);

  return (
    <AdminPageShell
      breadcrumbs="HOME › お知らせ"
      title="お知らせ"
      sub="公開中 2件 ・ 下書き 1件 ・ 予約 1件"
      actions={<AdminBtn icon="+">新しいお知らせ</AdminBtn>}
    >
      <div className="p-5 flex flex-col gap-3">
        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_TABS.map((f, i) => (
            <button
              key={f}
              className={[
                "px-3 py-[5px] rounded-[999px] text-[11.5px] font-medium border transition-colors whitespace-nowrap",
                filterIdx === i
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "bg-white text-[#525261] border-[#dedee5] hover:border-[#9a9aa0]",
              ].join(" ")}
              onClick={() => setFilterIdx(i)}
            >
              {f}
            </button>
          ))}
          <div className="flex-1" />
          <button className="px-3 py-[5px] rounded-[999px] text-[11.5px] font-medium border border-[#dedee5] bg-white text-[#525261] hover:border-[#9a9aa0] whitespace-nowrap">
            📅 配信日順
          </button>
        </div>

        {/* Table */}
        <AdminTable cols={COLS} rows={rows} rowHeight={44} />
      </div>
    </AdminPageShell>
  );
}
