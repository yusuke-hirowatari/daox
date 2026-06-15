"use client";

import { useState } from "react";
import { AnnouncementBar } from "@/components/atoms/AnnouncementBar";
import { SegmentedTabs } from "@/components/atoms/Tabs";
import { TopTabs } from "@/components/atoms/Tabs";
import { NoticeList } from "@/components/home/NoticeList";
import { BoardList } from "@/components/home/BoardList";
import { VoteList } from "@/components/home/VoteList";
import { NoticeDetailModal } from "@/components/home/NoticeDetailModal";
import { PostDetailModal } from "@/components/home/PostDetailModal";
import { NOTICES, BOARD_POSTS, BOARD_COMMENTS, VOTES, BANNER_NOTICES } from "@/mocks";
import type { Notice, BoardPost, BoardComment, Vote, VoteOption } from "@/mocks/types";

const SP_TABS  = ["お知らせ", "掲示板", "投票"] as const;
const PC_TABS  = ["お知らせ", "掲示板", "投票"] as const;

type ComposeType = "notice" | "board" | "vote" | null;

export default function HomePage() {
  const [spTab,  setSpTab]  = useState(0);
  const [pcTab,  setPcTab]  = useState(1);

  const [fabOpen, setFabOpen] = useState(false);
  const [composeType, setComposeType] = useState<ComposeType>(null);

  // Mutable data lists
  const [notices, setNotices] = useState<Notice[]>(NOTICES);
  const [posts, setPosts] = useState<BoardPost[]>(BOARD_POSTS);
  const [votes, setVotes] = useState<Vote[]>(VOTES);

  // Detail modals
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null);
  const [comments, setComments] = useState<BoardComment[]>(BOARD_COMMENTS);

  const handleComment = (postId: string, text: string) => {
    const newComment: BoardComment = {
      id: `bc_${Date.now()}`,
      postId,
      authorId: "u1",
      authorName: "田中",
      tone: 0,
      xp: 1240,
      text,
      time: "たった今",
    };
    setComments((prev) => [...prev, newComment]);
  };

  const openCompose = (type: string) => {
    setFabOpen(false);
    setComposeType(type as ComposeType);
  };

  // ── Create handlers ──
  const handleCreateNotice = (data: { tag: Notice["tag"]; title: string; body: string }) => {
    const newNotice: Notice = {
      id: `n_${Date.now()}`,
      tag: data.tag,
      date: new Date().toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }),
      title: data.title,
      body: data.body,
      authorId: "u1",
    };
    setNotices((prev) => [newNotice, ...prev]);
    setComposeType(null);
    setSpTab(0);
    setPcTab(0);
  };

  const handleCreatePost = (data: { title: string; body: string }) => {
    const newPost: BoardPost = {
      id: `bp_${Date.now()}`,
      authorId: "u1",
      authorName: "田中",
      tone: 0,
      xp: 1240,
      time: "たった今",
      tokens: null,
      title: data.title,
      body: data.body,
      isUnread: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setComposeType(null);
    setSpTab(1);
    setPcTab(1);
  };

  const handleCreateVote = (data: { title: string; deadline: string; options: string[] }) => {
    const newVote: Vote = {
      id: `v_${Date.now()}`,
      title: data.title,
      deadline: data.deadline,
      voted: 0,
      total: 312,
      options: data.options.map((label) => ({ label, voteCount: 0 })),
      status: "open",
    };
    setVotes((prev) => [newVote, ...prev]);
    setComposeType(null);
    setSpTab(2);
    setPcTab(2);
  };

  return (
    <div className="flex flex-col h-full">

      {/* ══════════════════════════════════════════
          MOBILE レイアウト
      ══════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 overflow-hidden md:hidden">

        {/* ── Announcement ── */}
        <AnnouncementBar items={BANNER_NOTICES} />

        {/* ── Segmented Tabs ── */}
        <SegmentedTabs tabs={[...SP_TABS]} defaultIndex={spTab} onChange={setSpTab} />

        {/* ── Content ── */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {spTab === 0 && <NoticeList notices={notices} onSelect={setSelectedNotice} />}
            {spTab === 1 && <BoardList posts={posts} comments={comments} onSelect={setSelectedPost} />}
            {spTab === 2 && <VoteList votes={votes} />}
          </div>
          <HomeFab open={fabOpen} onToggle={() => setFabOpen(!fabOpen)} onSelect={openCompose} />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PC (Desktop) レイアウト
      ══════════════════════════════════════════ */}
      <div className="hidden md:flex md:flex-col md:flex-1 md:overflow-hidden">
        <div className="relative shrink-0">
          <AnnouncementBar items={BANNER_NOTICES} />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden min-w-0 relative">
          <TopTabs tabs={[...PC_TABS]} defaultIndex={pcTab} onChange={setPcTab} />
          <div className="flex-1 overflow-y-auto">
            {pcTab === 0 && <NoticeList notices={notices} onSelect={setSelectedNotice} />}
            {pcTab === 1 && <BoardList posts={posts} comments={comments} onSelect={setSelectedPost} />}
            {pcTab === 2 && <VoteList votes={votes} />}
          </div>
          <HomeFab open={fabOpen} onToggle={() => setFabOpen(!fabOpen)} onSelect={openCompose} pc />
        </div>
      </div>

      {/* Detail modals */}
      <NoticeDetailModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      <PostDetailModal post={selectedPost} comments={comments} onClose={() => setSelectedPost(null)} onComment={handleComment} />

      {/* Compose modals */}
      {composeType === "notice" && <ComposeNoticeModal onClose={() => setComposeType(null)} onCreate={handleCreateNotice} />}
      {composeType === "board"  && <ComposeBoardModal  onClose={() => setComposeType(null)} onCreate={handleCreatePost} />}
      {composeType === "vote"   && <ComposeVoteModal   onClose={() => setComposeType(null)} onCreate={handleCreateVote} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Expandable FAB (X-style)
══════════════════════════════════════════════════════════════════════════════ */
const FAB_ITEMS = [
  { type: "notice", label: "お知らせ",  icon: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /> },
  { type: "board",  label: "掲示板",    icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 7h8M8 12h5" /></> },
  { type: "vote",   label: "投票",      icon: <><path d="M3 3v18h18" /><path d="M7 17V13M11 17V9M15 17V5M19 17v-4" /></> },
] as const;

function HomeFab({ open, onToggle, onSelect, pc }: {
  open: boolean;
  onToggle: () => void;
  onSelect: (type: string) => void;
  pc?: boolean;
}) {
  const pos = pc ? "right-6 bottom-6" : "right-4 bottom-4";
  return (
    <>
      {open && (
        <div className="absolute inset-0 bg-black/20 z-10" onClick={onToggle} />
      )}
      <div className={`absolute ${pos} z-20 flex flex-col-reverse items-end gap-2.5`}>
        <button
          onClick={onToggle}
          className={[
            "w-[52px] h-[52px] rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,.15)] hover:bg-[#333] transition-all duration-200",
            open ? "rotate-45" : "",
          ].join(" ")}
          aria-label="新規作成"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        {FAB_ITEMS.map((item, i) => (
          <button
            key={item.type}
            onClick={() => onSelect(item.type)}
            className={[
              "flex items-center gap-2.5 pl-3 pr-4 h-10 rounded-full bg-white text-[#1a1a1a] shadow-[0_4px_16px_rgba(0,0,0,.12)] border border-[#e8e8ed] hover:bg-[#f1f1f5] transition-all duration-200 origin-bottom-right",
              open
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-2 pointer-events-none",
            ].join(" ")}
            style={{ transitionDelay: open ? `${(FAB_ITEMS.length - 1 - i) * 40}ms` : "0ms" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {item.icon}
            </svg>
            <span className="text-[12.5px] font-semibold whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Compose Modal Shell
══════════════════════════════════════════════════════════════════════════════ */
function ComposeShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:max-w-[520px] bg-white rounded-t-2xl md:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-9 h-1 rounded-full bg-[#dedee5]" />
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#dedee5] shrink-0">
          <span className="text-[15px] font-bold">{title}</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Compose: お知らせ
══════════════════════════════════════════════════════════════════════════════ */
function ComposeNoticeModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: { tag: Notice["tag"]; title: string; body: string }) => void;
}) {
  const [tag, setTag] = useState<Notice["tag"]>("お知らせ");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const valid = title.trim() && body.trim();

  return (
    <ComposeShell title="お知らせを作成" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Tag selector */}
        <div>
          <label className="text-[11px] font-semibold text-[#9a9aa0] mb-1.5 block">カテゴリ</label>
          <div className="flex gap-2">
            {(["お知らせ", "重要", "イベント"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-full border transition-colors ${
                  tag === t
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-white text-[#525261] border-[#dedee5] hover:border-[#9a9aa0]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-[11px] font-semibold text-[#9a9aa0] mb-1.5 block">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="お知らせのタイトル"
            className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[13px] outline-none focus:border-[#6666ff] transition-colors"
            autoFocus
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-[11px] font-semibold text-[#9a9aa0] mb-1.5 block">本文</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="お知らせの内容を入力"
            rows={5}
            className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[13px] outline-none focus:border-[#6666ff] transition-colors resize-none"
          />
        </div>

        <button
          onClick={() => valid && onCreate({ tag, title: title.trim(), body: body.trim() })}
          disabled={!valid}
          className="w-full py-3 rounded-lg bg-[#1a1a1a] text-white text-[13px] font-semibold disabled:opacity-30 hover:bg-[#333] transition-colors"
        >
          投稿する
        </button>
      </div>
    </ComposeShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Compose: 掲示板
══════════════════════════════════════════════════════════════════════════════ */
function ComposeBoardModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: { title: string; body: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const valid = title.trim() && body.trim();

  return (
    <ComposeShell title="掲示板に投稿" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="text-[11px] font-semibold text-[#9a9aa0] mb-1.5 block">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="投稿のタイトル"
            className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[13px] outline-none focus:border-[#6666ff] transition-colors"
            autoFocus
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-[11px] font-semibold text-[#9a9aa0] mb-1.5 block">本文</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="内容を入力"
            rows={5}
            className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[13px] outline-none focus:border-[#6666ff] transition-colors resize-none"
          />
        </div>

        <button
          onClick={() => valid && onCreate({ title: title.trim(), body: body.trim() })}
          disabled={!valid}
          className="w-full py-3 rounded-lg bg-[#1a1a1a] text-white text-[13px] font-semibold disabled:opacity-30 hover:bg-[#333] transition-colors"
        >
          投稿する
        </button>
      </div>
    </ComposeShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Compose: 投票
══════════════════════════════════════════════════════════════════════════════ */
function ComposeVoteModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: { title: string; deadline: string; options: string[] }) => void;
}) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const updateOption = (i: number, v: string) => setOptions((prev) => prev.map((o, j) => (j === i ? v : o)));
  const addOption = () => setOptions((prev) => [...prev, ""]);
  const removeOption = (i: number) => setOptions((prev) => prev.filter((_, j) => j !== i));

  const filledOptions = options.filter((o) => o.trim());
  const valid = title.trim() && deadline && filledOptions.length >= 2;

  return (
    <ComposeShell title="投票を作成" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="text-[11px] font-semibold text-[#9a9aa0] mb-1.5 block">質問</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="投票の質問を入力"
            className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[13px] outline-none focus:border-[#6666ff] transition-colors"
            autoFocus
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="text-[11px] font-semibold text-[#9a9aa0] mb-1.5 block">締切日</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[13px] outline-none focus:border-[#6666ff] transition-colors"
          />
        </div>

        {/* Options */}
        <div>
          <label className="text-[11px] font-semibold text-[#9a9aa0] mb-1.5 block">選択肢（2つ以上）</label>
          <div className="flex flex-col gap-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-[#dedee5] flex items-center justify-center shrink-0">
                  <span className="text-[9px] text-[#9a9aa0] font-bold">{i + 1}</span>
                </div>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`選択肢 ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-[#dedee5] rounded-lg text-[13px] outline-none focus:border-[#6666ff] transition-colors"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-[#9a9aa0] hover:bg-[#f1f1f5] hover:text-[#e55] transition-colors shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 6 && (
            <button
              onClick={addOption}
              className="mt-2 text-[12px] font-semibold text-[#6666ff] hover:opacity-70 transition-opacity"
            >
              + 選択肢を追加
            </button>
          )}
        </div>

        <button
          onClick={() => valid && onCreate({
            title: title.trim(),
            deadline: new Date(deadline).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }) + "まで",
            options: filledOptions,
          })}
          disabled={!valid}
          className="w-full py-3 rounded-lg bg-[#1a1a1a] text-white text-[13px] font-semibold disabled:opacity-30 hover:bg-[#333] transition-colors"
        >
          投票を作成
        </button>
      </div>
    </ComposeShell>
  );
}
