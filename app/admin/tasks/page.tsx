"use client";

import { useState, useEffect } from "react";
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

type TaskState = "承認待ち" | "実施中" | "募集中" | "完了" | "差戻し";

interface TaskRow {
  id:     string;
  state:  TaskState;
  tone:   PillTone;
  title:  string;
  owner:  string;
  worker: string;
  amt:    number;
  due:    string;
  age:    string;
}

const TASKS: TaskRow[] = [
  { id: "t1", state: "承認待ち", tone: "warn",    title: "チラシ配布スタッフ募集",     owner: "木村 弘",    worker: "佐藤 一郎",   amt: 120, due: "今日",   age: "2日" },
  { id: "t2", state: "承認待ち", tone: "warn",    title: "看板リペイント手伝い",         owner: "田中 太郎",  worker: "伊藤 さくら", amt: 50,  due: "昨日",   age: "1日" },
  { id: "t3", state: "実施中",   tone: "open",    title: "見守り隊 (今月分)",            owner: "運営事務局", worker: "高橋 美咲",   amt: 30,  due: "5/31",   age: "5日" },
  { id: "t4", state: "募集中",   tone: "info",    title: "夏祭り 出店サポート",          owner: "運営事務局", worker: "—",          amt: 120, due: "8/15",   age: "3日" },
  { id: "t5", state: "募集中",   tone: "info",    title: "新メンバー案内役",             owner: "運営事務局", worker: "—",          amt: 40,  due: "随時",   age: "1週" },
  { id: "t6", state: "完了",     tone: "success", title: "商店街クリーン作戦 (5月)",     owner: "運営事務局", worker: "田中ほか3名", amt: 50,  due: "完了",   age: "5/18" },
  { id: "t7", state: "差戻し",   tone: "muted",   title: "不適切な投稿(削除済)",         owner: "—",         worker: "—",          amt: 0,   due: "—",     age: "—" },
];

const FILTER_TABS = [
  "すべて (24)",
  "承認待ち (2)",
  "実施中 (5)",
  "募集中 (3)",
  "完了 (12)",
  "差戻し (2)",
];

// ─── Table columns ────────────────────────────────────────────────────────

const COLS: ColDef[] = [
  { key: "state",  label: "ステータス", flex: 0.9 },
  { key: "title",  label: "タスク",     flex: 2.2, bold: true },
  { key: "owner",  label: "発注主",     flex: 1.1, muted: true },
  { key: "worker", label: "受注者",     flex: 1.1, muted: true },
  { key: "amt",    label: "金額",       flex: 0.7, mono: true, align: "right" },
  { key: "due",    label: "期限",       flex: 0.7, mono: true, muted: true },
  { key: "age",    label: "経過",       flex: 0.6, mono: true, muted: true },
  { key: "act",    label: "",           flex: 0.4, align: "right" },
];

function buildRows(
  tasks: TaskRow[],
  menuOpen: string | null,
  setMenuOpen: (id: string | null) => void,
): Record<string, ReactNode>[] {
  return tasks.map((t) => ({
    state:  <AdminPill tone={t.tone}>{t.state}</AdminPill>,
    title:  t.title,
    owner:
      t.owner === "—" ? (
        <span className="text-[#9a9aa0]">—</span>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          <Avatar size={18} label={t.owner[0]} tone={0} />
          {t.owner}
        </span>
      ),
    worker:
      t.worker === "—" ? (
        <span className="text-[#9a9aa0]">—</span>
      ) : (
        t.worker
      ),
    amt:
      t.amt > 0 ? (
        `${t.amt}`
      ) : (
        <span className="text-[#9a9aa0]">—</span>
      ),
    due:  t.due,
    age:  t.age,
    act: (
      <div className="relative">
        <button
          className="text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === t.id ? null : t.id); }}
        >
          ⋯
        </button>
        {menuOpen === t.id && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#dedee5] rounded-lg shadow-lg z-20 py-1">
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { alert(`「${t.title}」の詳細を表示します（デモ）`); setMenuOpen(null); }}
            >
              詳細を見る
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { alert(`「${t.title}」の編集画面を開きます（デモ）`); setMenuOpen(null); }}
            >
              編集
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] text-[#6666ff] hover:bg-[#f1f1f5]"
              onClick={() => { alert(`「${t.title}」の募集を中止します（デモ）`); setMenuOpen(null); }}
            >
              募集を中止
            </button>
          </div>
        )}
      </div>
    ),
  }));
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminTasksPage() {
  const [filterIdx, setFilterIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  const sortedTasks = sortAsc ? TASKS : [...TASKS].reverse();
  const rows = buildRows(sortedTasks, menuOpen, setMenuOpen);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex-none flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 px-4 md:px-6 py-2.5 md:py-3.5 border-b border-[#dedee5]">
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] text-[#9a9aa0] font-mono mb-1 hidden md:block">
            HOME › タスク監視
          </div>
          <div className="text-[15px] md:text-[17px] font-bold leading-tight">タスク監視</div>
          <div className="text-[11px] text-[#9a9aa0] mt-0.5">
            承認待ち 2件 ・ 実施中 1件 ・ 募集中 2件
          </div>
        </div>
        <AdminBtn variant="outline" onClick={() => alert("タスクガイドラインを表示します（デモ）")}>ガイドライン</AdminBtn>
        <AdminBtn onClick={() => alert("運営タスク作成画面は今後実装予定です")}>運営タスクを作成</AdminBtn>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa] p-3 md:p-5">
        <div className="flex flex-col gap-3">

          {/* Aging alert */}
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-lg border text-[11.5px] flex-wrap"
            style={{ background: "#f0f0ff", borderColor: "#6666ff", color: "#6666ff" }}
          >
            <span className="text-[14px] flex-none">⚠</span>
            <div className="flex-1 min-w-0">
              <strong>承認待ちが 2件、2日以上滞留しています。</strong>
              {" "}発注主にリマインドを送ることができます。
            </div>
            <AdminBtn variant="accent" onClick={() => alert("承認待ちのタスク発注者にリマインドを送信しました（デモ）")}>リマインド送信</AdminBtn>
          </div>

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
            <button
              className="text-[11px] text-[#9a9aa0] whitespace-nowrap hover:text-[#1a1a1a] cursor-pointer"
              onClick={() => setSortAsc((prev) => !prev)}
            >
              並び: 経過 ({sortAsc ? "古い順" : "新しい順"}) ▾
            </button>
          </div>

          {/* Table */}
          <AdminTable cols={COLS} rows={rows} rowHeight={44} />
        </div>
      </div>
    </div>
  );
}
