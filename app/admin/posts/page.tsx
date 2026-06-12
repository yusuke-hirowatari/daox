"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import {
  AdminBtn,
  AdminPill,
  AdminTable,
  AdminPageShell,
  type ColDef,
  type PillTone,
} from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

type PostStatus = "公開中" | "予約" | "下書き" | "アーカイブ";
type PostType = "お知らせ" | "記事" | "イベント";

interface AdminPost {
  id: string;
  status: PostStatus;
  type: PostType;
  title: string;
  date: string;
  read: string;
  author: string;
}

const INITIAL_POSTS: AdminPost[] = [
  { id: "p1", status: "公開中",     type: "お知らせ", title: "今週の市役所窓口の臨時休業について", date: "2026/05/20", read: "248/312", author: "運営事務局" },
  { id: "p2", status: "公開中",     type: "イベント", title: "夏祭り 出店者募集のお知らせ",       date: "2026/05/19", read: "198/312", author: "運営事務局" },
  { id: "p3", status: "予約",       type: "イベント", title: "6月の定例会のお知らせ",             date: "2026/05/27", read: "—",       author: "運営事務局" },
  { id: "p4", status: "下書き",     type: "記事",     title: "ロゴリニューアルのご報告",           date: "2026/05/24", read: "—",       author: "田中 太郎" },
  { id: "p5", status: "アーカイブ", type: "お知らせ", title: "5月のクリーン作戦のご案内",           date: "2026/04/30", read: "301/312", author: "運営事務局" },
];

const FILTER_TABS = [
  "すべて (12)",
  "公開中 (2)",
  "予約 (1)",
  "下書き (1)",
  "アーカイブ (8)",
];

const STATUS_TONE: Record<PostStatus, PillTone> = {
  "公開中":     "success",
  "予約":       "info",
  "下書き":     "warn",
  "アーカイブ": "muted",
};

const TYPE_TONE: Record<PostType, PillTone> = {
  "お知らせ": "default",
  "記事":     "info",
  "イベント": "open",
};

const COLS: ColDef[] = [
  { key: "status", label: "ステータス", flex: 0.8 },
  { key: "type",   label: "種別",       flex: 0.6 },
  { key: "title",  label: "タイトル",   flex: 2.5, bold: true },
  { key: "date",   label: "配信日",     flex: 0.9, mono: true, muted: true },
  { key: "read",   label: "既読",       flex: 0.7, mono: true, align: "right" },
  { key: "author", label: "作成者",     flex: 0.9, muted: true },
  { key: "act",    label: "",           flex: 0.4, align: "right" },
];

const POST_TYPES: PostType[] = ["お知らせ", "記事", "イベント"];

// ─── Row builder ──────────────────────────────────────────────────────────

function buildRows(
  items: AdminPost[],
  menuOpen: string | null,
  setMenuOpen: (id: string | null) => void,
): Record<string, ReactNode>[] {
  return items.map((i) => ({
    status: <AdminPill tone={STATUS_TONE[i.status]}>{i.status}</AdminPill>,
    type:   <AdminPill tone={TYPE_TONE[i.type]}>{i.type}</AdminPill>,
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
              onClick={() => { alert(`「${i.title}」を編集します（デモ）`); setMenuOpen(null); }}
            >
              編集
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { alert(`「${i.title}」を複製します（デモ）`); setMenuOpen(null); }}
            >
              複製
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] text-[#6666ff] hover:bg-[#f1f1f5]"
              onClick={() => {
                if (i.status === "公開中") {
                  alert(`「${i.title}」の公開を停止します（デモ）`);
                } else {
                  alert(`「${i.title}」をアーカイブします（デモ）`);
                }
                setMenuOpen(null);
              }}
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

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>(INITIAL_POSTS);
  const [filterIdx, setFilterIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Creation form state
  const [creating, setCreating] = useState(false);
  const [newType, setNewType] = useState<PostType>("お知らせ");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newDate, setNewDate] = useState("");

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  // Reset creation form
  const resetForm = () => {
    setNewType("お知らせ");
    setNewTitle("");
    setNewBody("");
    setNewTag("");
    setNewDate("");
  };

  // Handle publish
  const handlePublish = () => {
    if (!newTitle.trim() || !newBody.trim()) {
      alert("タイトルと本文を入力してください");
      return;
    }
    const post: AdminPost = {
      id: `p${Date.now()}`,
      status: "公開中",
      type: newType,
      title: newTitle.trim(),
      date: newDate || new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
      read: "0/312",
      author: "運営事務局",
    };
    setPosts((prev) => [post, ...prev]);
    resetForm();
    setCreating(false);
    alert("投稿を公開しました");
  };

  // Handle draft save
  const handleDraft = () => {
    const post: AdminPost = {
      id: `p${Date.now()}`,
      status: "下書き",
      type: newType,
      title: newTitle.trim() || "無題の投稿",
      date: newDate || new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
      read: "—",
      author: "運営事務局",
    };
    setPosts((prev) => [post, ...prev]);
    resetForm();
    setCreating(false);
    alert("下書きを保存しました");
  };

  // Handle cancel
  const handleCancel = () => {
    resetForm();
    setCreating(false);
  };

  const sortedPosts = sortAsc ? posts : [...posts].reverse();
  const rows = buildRows(sortedPosts, menuOpen, setMenuOpen);

  return (
    <AdminPageShell
      breadcrumbs="HOME › 投稿"
      title="投稿"
      sub="お知らせ・記事・イベントの投稿を管理"
      actions={
        <AdminBtn icon="+" onClick={() => setCreating(true)}>
          新しい投稿を作成
        </AdminBtn>
      }
    >
      <div className="p-3 md:p-5 flex flex-col gap-3">
        {/* ── Creation form ──────────────────────────────────────── */}
        {creating && (
          <div className="border-[1.5px] border-[#6666ff] rounded-[10px] bg-white p-3 md:p-5 mb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-[14px] font-bold">新しい投稿を作成</div>
              <button
                className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[18px] leading-none cursor-pointer"
                onClick={handleCancel}
              >
                ×
              </button>
            </div>

            {/* Type selector */}
            <div className="mb-4">
              <div className="text-[11px] font-semibold text-[#525261] mb-1">種別</div>
              <div className="flex items-center gap-2 flex-wrap">
                {POST_TYPES.map((t) => (
                  <button
                    key={t}
                    className={[
                      "px-3 py-[5px] rounded-[999px] text-[11.5px] font-medium border transition-colors whitespace-nowrap cursor-pointer",
                      newType === t
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                        : "bg-white text-[#525261] border-[#dedee5] hover:border-[#9a9aa0]",
                    ].join(" ")}
                    onClick={() => setNewType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <div className="text-[11px] font-semibold text-[#525261] mb-1">タイトル</div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]"
                placeholder="投稿のタイトルを入力"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            {/* Body */}
            <div className="mb-4">
              <div className="text-[11px] font-semibold text-[#525261] mb-1">本文</div>
              <textarea
                className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff] min-h-[100px] resize-none"
                placeholder="投稿の本文を入力"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
              />
            </div>

            {/* Tag + Date row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 mb-4">
              <div>
                <div className="text-[11px] font-semibold text-[#525261] mb-1">タグ</div>
                <input
                  type="text"
                  className="w-full md:w-[200px] px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]"
                  placeholder="例: 重要"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#525261] mb-1">配信日</div>
                <input
                  type="date"
                  className="w-full md:w-[200px] px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <AdminBtn variant="accent" onClick={handlePublish}>公開する</AdminBtn>
              <AdminBtn variant="outline" onClick={handleDraft}>下書き保存</AdminBtn>
              <AdminBtn variant="ghost" onClick={handleCancel}>キャンセル</AdminBtn>
            </div>
            <div className="text-[10.5px] text-[#9a9aa0] mt-2">
              ※ 運営事務局として投稿されます
            </div>
          </div>
        )}

        {/* ── Filter chips ───────────────────────────────────────── */}
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

        {/* ── Table ──────────────────────────────────────────────── */}
        <AdminTable cols={COLS} rows={rows} rowHeight={44} />
      </div>
    </AdminPageShell>
  );
}
