"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AdminBtn, AdminPill, AdminTable, AdminPageShell, type ColDef, type PillTone } from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

type AnnStatus = "公開中" | "予約" | "下書き" | "アーカイブ";

interface Ann {
  id:     string;
  status: AnnStatus;
  tag:    string;
  title:  string;
  date:   string;
  read:   string;
  author: string;
}

const ITEMS: Ann[] = [
  { id: "a1", status: "公開中",     tag: "重要",     title: "今週の市役所窓口の臨時休業について",   date: "2026/05/20", read: "248/312", author: "運営事務局" },
  { id: "a2", status: "公開中",     tag: "お知らせ", title: "夏祭り 出店者募集のお知らせ",           date: "2026/05/19", read: "198/312", author: "運営事務局" },
  { id: "a3", status: "予約",       tag: "イベント", title: "6月の定例会のお知らせ",                 date: "2026/05/27", read: "—",       author: "運営事務局" },
  { id: "a4", status: "下書き",     tag: "お知らせ", title: "ロゴリニューアルのご報告",               date: "2026/05/24", read: "—",       author: "田中 太郎" },
  { id: "a5", status: "アーカイブ", tag: "イベント", title: "5月のクリーン作戦のご案内",               date: "2026/04/30", read: "301/312", author: "運営事務局" },
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

function buildRows(
  items: Ann[],
  menuOpen: string | null,
  setMenuOpen: (id: string | null) => void,
  onEdit: (id: string, title: string) => void,
  onDuplicate: (id: string) => void,
  onArchive: (id: string) => void,
): Record<string, ReactNode>[] {
  return items.map((i) => ({
    status: <AdminPill tone={STATUS_TONE[i.status]}>{i.status}</AdminPill>,
    tag:    <AdminPill tone={i.tag === "重要" ? "warn" : "default"}>{i.tag}</AdminPill>,
    title:  i.title,
    date:   i.date,
    read:   i.read,
    author: i.author,
    act: (
      <div className="relative">
        <button
          className="text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === i.id ? null : i.id); }}
        >
          ⋯
        </button>
        {menuOpen === i.id && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#dedee5] rounded-lg shadow-lg z-20 py-1">
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { onEdit(i.id, i.title); setMenuOpen(null); }}
            >
              編集
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { onDuplicate(i.id); setMenuOpen(null); }}
            >
              複製
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] text-[#6666ff] hover:bg-[#f1f1f5]"
              onClick={() => { onArchive(i.id); setMenuOpen(null); }}
            >
              {i.status === "公開中" ? "公開を停止" : "アーカイブ"}
            </button>
          </div>
        )}
      </div>
    ),
  }));
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminAnnouncePage() {
  const router = useRouter();
  const [items, setItems] = useState<Ann[]>(ITEMS);
  const [filterIdx, setFilterIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  const handleEdit = (id: string, title: string) => {
    setEditingItem(id);
    setEditTitle(title);
  };

  const handleDuplicate = (id: string) => {
    const original = items.find(x => x.id === id);
    if (original) {
      const copy: Ann = { ...original, id: `a${Date.now()}`, title: `${original.title} (コピー)`, status: "下書き" };
      setItems(prev => [copy, ...prev]);
    }
  };

  const handleArchive = (id: string) => {
    setItems(prev => prev.map(x => x.id === id ? {...x, status: "アーカイブ"} : x));
  };

  const sortedItems = sortAsc ? items : [...items].reverse();
  const rows = buildRows(sortedItems, menuOpen, setMenuOpen, handleEdit, handleDuplicate, handleArchive);

  return (
    <AdminPageShell
      breadcrumbs="HOME › お知らせ"
      title="お知らせ"
      sub="公開中 2件 ・ 下書き 1件 ・ 予約 1件"
      actions={<AdminBtn icon="+" onClick={() => router.push("/admin/posts")}>新しいお知らせ</AdminBtn>}
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
          <button
            className="px-3 py-[5px] rounded-[999px] text-[11.5px] font-medium border border-[#dedee5] bg-white text-[#525261] hover:border-[#9a9aa0] whitespace-nowrap cursor-pointer"
            onClick={() => setSortAsc((prev) => !prev)}
          >
            {sortAsc ? "📅 配信日順 ↓" : "📅 配信日順 ↑"}
          </button>
        </div>

        {/* Table */}
        <AdminTable cols={COLS} rows={rows} rowHeight={44} />
      </div>

      {/* Edit modal */}
      {editingItem && (() => {
        const item = items.find(i => i.id === editingItem);
        if (!item) return null;
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setEditingItem(null)} />
            <div className="relative bg-white rounded-2xl w-full max-w-[480px] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-bold">お知らせを編集</span>
                <button onClick={() => setEditingItem(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="mb-3">
                <div className="text-[11px] font-semibold text-[#525261] mb-1">タイトル</div>
                <input className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <AdminBtn onClick={() => { setItems(prev => prev.map(i => i.id === editingItem ? {...i, title: editTitle} : i)); setEditingItem(null); }}>保存</AdminBtn>
                <AdminBtn variant="outline" onClick={() => setEditingItem(null)}>キャンセル</AdminBtn>
              </div>
            </div>
          </div>
        );
      })()}
    </AdminPageShell>
  );
}
