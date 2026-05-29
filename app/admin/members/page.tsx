"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import {
  AdminBtn,
  AdminPill,
  AdminTable,
  type ColDef,
  type PillTone,
} from "@/components/admin/atoms";

// ─── Static data ──────────────────────────────────────────────────────────

type MemberStatus = "有効" | "要確認" | "停止中";
type MemberRole   = "運営" | "店主" | "メンバー";

interface Member {
  name:   string;
  tone:   number;
  role:   MemberRole;
  status: MemberStatus;
  joined: string;
  xp:     number;
  dao:    number;
  last:   string;
}

const MEMBERS: Member[] = [
  { name: "田中 太郎",   tone: 0, role: "運営",     status: "有効",   joined: "2024/01/12", xp: 1240, dao: 420,  last: "今" },
  { name: "伊藤 さくら", tone: 1, role: "店主",     status: "有効",   joined: "2024/02/08", xp: 4820, dao: 1240, last: "5分前" },
  { name: "佐藤 一郎",   tone: 2, role: "メンバー", status: "有効",   joined: "2024/03/22", xp: 980,  dao: 320,  last: "昨日" },
  { name: "木村 弘",     tone: 3, role: "メンバー", status: "要確認", joined: "2024/04/01", xp: 620,  dao: 180,  last: "昨日" },
  { name: "高橋 美咲",   tone: 4, role: "メンバー", status: "有効",   joined: "2024/05/10", xp: 760,  dao: 95,   last: "3時間前" },
  { name: "中島 健",     tone: 0, role: "店主",     status: "有効",   joined: "2024/01/20", xp: 3640, dao: 560,  last: "5/22" },
  { name: "小林 真理",   tone: 1, role: "メンバー", status: "停止中", joined: "2024/04/18", xp: 420,  dao: 78,   last: "5/15" },
];

const FILTER_TABS = [
  "すべて (312)",
  "運営 (4)",
  "店主 (28)",
  "メンバー (280)",
  "要確認 (3)",
  "停止中 (2)",
];

const STATUS_TONE: Record<MemberStatus, PillTone> = {
  "有効":   "success",
  "要確認": "warn",
  "停止中": "muted",
};

const ROLE_TONE: Record<MemberRole, PillTone> = {
  "運営":     "info",
  "店主":     "default",
  "メンバー": "muted",
};

// ─── Table column definition ──────────────────────────────────────────────

const COLS: ColDef[] = [
  { key: "sel",    label: "",           flex: 0,   w: 28 },
  { key: "name",   label: "メンバー",   flex: 1.7, bold: true },
  { key: "role",   label: "ロール",     flex: 0.9 },
  { key: "status", label: "ステータス", flex: 0.9 },
  { key: "joined", label: "参加日",     flex: 1,   mono: true, muted: true },
  { key: "xp",     label: "XP",         flex: 0.7, mono: true, align: "right" },
  { key: "dao",    label: "DAO",        flex: 0.8, mono: true, align: "right" },
  { key: "last",   label: "最終アクティブ", flex: 0.9, muted: true },
  { key: "act",    label: "",           flex: 0.4, align: "right" },
];

function buildRows(
  members: Member[],
  selected: Set<number>,
  toggle: (i: number) => void,
): Record<string, ReactNode>[] {
  return members.map((m, i) => ({
    sel: (
      <button
        className="w-3.5 h-3.5 rounded-[3px] border-[1.5px] border-[#c8c8d0] flex items-center justify-center flex-none"
        style={{
          background: selected.has(i) ? "#1a1a1a" : "transparent",
          borderColor: selected.has(i) ? "#1a1a1a" : "#c8c8d0",
        }}
        onClick={() => toggle(i)}
        aria-label={`${m.name}を選択`}
      >
        {selected.has(i) && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2 3-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    ),
    name: (
      <span className="inline-flex items-center gap-2">
        <Avatar size={22} label={m.name[0]} tone={m.tone} />
        {m.name}
      </span>
    ),
    role:   <AdminPill tone={ROLE_TONE[m.role]}>{m.role}</AdminPill>,
    status: <AdminPill tone={STATUS_TONE[m.status]}>{m.status}</AdminPill>,
    joined: m.joined,
    xp:     m.xp.toLocaleString(),
    dao:    m.dao.toLocaleString(),
    last:   m.last,
    act:    <span className="text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]">⋯</span>,
  }));
}

// ─── Pagination ───────────────────────────────────────────────────────────

const PAGE_ITEMS = [1, 2, 3, "…", 45] as const;

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminMembersPage() {
  const [filterIdx, setFilterIdx] = useState(0);
  const [selected,  setSelected]  = useState<Set<number>>(new Set([0, 2]));

  function toggleSelect(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); } else { next.add(i); }
      return next;
    });
  }

  const rows = buildRows(MEMBERS, selected, toggleSelect);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex-none flex items-center gap-4 px-6 py-3.5 border-b border-[#dedee5]">
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] text-[#9a9aa0] font-mono mb-1">
            HOME › メンバー
          </div>
          <div className="text-[17px] font-bold leading-tight">メンバー</div>
          <div className="text-[11px] text-[#9a9aa0] mt-0.5">
            312人 ・ 今週 +8人
          </div>
        </div>
        <AdminBtn variant="outline" icon="↓">CSV書き出し</AdminBtn>
        <AdminBtn icon="✉">招待を送る</AdminBtn>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa] p-5">
        <div className="flex flex-col gap-3">

          {/* Filter bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-[7px] border border-[#dedee5] rounded-md bg-white max-w-[280px] w-full">
              <span className="text-[#9a9aa0] text-[13px]">⌕</span>
              <span className="text-[12px] text-[#9a9aa0]">
                名前・ID・メールで検索
              </span>
            </div>
            {/* Filter chips */}
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
            <span className="text-[11px] text-[#9a9aa0] whitespace-nowrap">
              並び: 参加日 (新しい順) ▾
            </span>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#f1f1f5] border border-[#dedee5]">
              <span className="text-[11.5px] text-[#525261]">
                <strong>{selected.size}件</strong> 選択中
              </span>
              <span className="flex-1" />
              <AdminBtn variant="ghost">ロール変更</AdminBtn>
              <AdminBtn variant="ghost">DM一斉送信</AdminBtn>
              <AdminBtn variant="danger">停止</AdminBtn>
            </div>
          )}

          {/* Table */}
          <AdminTable cols={COLS} rows={rows} rowHeight={44} />

          {/* Pagination */}
          <div className="flex items-center justify-between text-[11px] text-[#9a9aa0]">
            <span>7 / 312 件を表示</span>
            <div className="flex items-center gap-1.5">
              <span className="px-1 cursor-pointer hover:text-[#1a1a1a]">‹</span>
              {PAGE_ITEMS.map((p, i) => (
                <span
                  key={i}
                  className="px-2 py-[2px] rounded"
                  style={
                    p === 1
                      ? { background: "#1a1a1a", color: "#fff" }
                      : { color: "#525261" }
                  }
                >
                  {p}
                </span>
              ))}
              <span className="px-1 cursor-pointer hover:text-[#1a1a1a]">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
