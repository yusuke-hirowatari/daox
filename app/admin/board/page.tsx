"use client";

import { useState, useCallback } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { AdminBtn, AdminPill, AdminPageShell } from "@/components/admin/atoms";

// ─── Types ───────────────────────────────────────────────────────────────────

type BoardTab = "reported" | "all" | "hidden";
type PostStatus = "active" | "hidden" | "deleted" | "resolved";

interface Report {
  id: number;
  reportCount: number;
  reportBadgeTone: "red" | "yellow";
  author: string;
  authorTone: number;
  title: string;
  content: string;
  reasons: string[];
  time: string;
  status: PostStatus;
  hasAccountAction?: boolean;
}

interface Post {
  id: number;
  author: string;
  authorTone: number;
  title: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  status: PostStatus;
  reported?: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INITIAL_REPORTS: Report[] = [
  {
    id: 101,
    reportCount: 3,
    reportBadgeTone: "red",
    author: "木村 弘",
    authorTone: 3,
    title: "チラシ配布スタッフ募集",
    content:
      "配布エリア応相談、約2時間の予定です。\n詳細はこちら → http://suspicious-url.example/job",
    reasons: ["スパム", "誤情報"],
    time: "28分前",
    status: "active",
  },
  {
    id: 102,
    reportCount: 1,
    reportBadgeTone: "red",
    author: "匿名ユーザー",
    authorTone: 2,
    title: "コメント: 地域イベントについて",
    content: "◯◯さんいい加減にしろ。何度言えば分かるんだ。",
    reasons: ["不適切表現"],
    time: "1時間前",
    status: "active",
  },
  {
    id: 103,
    reportCount: 2,
    reportBadgeTone: "yellow",
    author: "田中 一郎(疑い)",
    authorTone: 0,
    title: "なりすましアカウント疑い",
    content:
      "既存メンバー「田中 太郎」に酷似した名前・プロフィールでアカウントが作成されています。",
    reasons: ["なりすまし"],
    time: "3時間前",
    status: "active",
    hasAccountAction: true,
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 201,
    author: "田中",
    authorTone: 0,
    title: "看板のリペイント手伝ってくれる人",
    content: "土曜の朝3時間程度。経験不問、道具はこちらで。",
    likes: 12,
    comments: 2,
    time: "12分前",
    status: "active",
  },
  {
    id: 202,
    author: "伊藤",
    authorTone: 1,
    title: "新メニュー試食モニター募集",
    content: "カフェ「ことり」より、5名様限定。",
    likes: 8,
    comments: 2,
    time: "1時間前",
    status: "active",
  },
  {
    id: 203,
    author: "佐藤",
    authorTone: 2,
    title: "家庭菜園のトマト譲ります",
    content: "たくさん採れたので。容器持参希望。",
    likes: 5,
    comments: 1,
    time: "3時間前",
    status: "active",
  },
  {
    id: 204,
    author: "木村",
    authorTone: 3,
    title: "チラシ配布スタッフ募集",
    content: "配布エリア応相談、約2時間。",
    likes: 3,
    comments: 0,
    time: "昨日",
    status: "active",
    reported: true,
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminBoardPage() {
  const [tab, setTab] = useState<BoardTab>("reported");
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTokens, setNewTokens] = useState("");
  const [boardPeriod, setBoardPeriod] = useState("今週");
  const [formError, setFormError] = useState("");

  // ─── Derived counts ──────────────────────────────────────────────────
  const activeReports = reports.filter(
    (r) => r.status === "active"
  );
  const hiddenReports = reports.filter(
    (r) => r.status === "hidden"
  );
  const hiddenPosts = posts.filter((p) => p.status === "hidden");
  const allHiddenCount = hiddenReports.length + hiddenPosts.length;
  const allPostsCount = 56; // Mock total

  const TABS: { id: BoardTab; label: string }[] = [
    { id: "reported", label: `⚠ 通報あり (${activeReports.length})` },
    { id: "all", label: `すべて (${allPostsCount})` },
    { id: "hidden", label: `非公開 (${allHiddenCount})` },
  ];

  // ─── Report actions ──────────────────────────────────────────────────
  const handleReportAction = useCallback(
    (id: number, action: "resolve" | "hide" | "delete" | "suspend") => {
      const report = reports.find((r) => r.id === id);
      if (!report) return;

      if (action === "resolve") {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "resolved" as PostStatus } : r))
        );
      } else if (action === "hide") {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "hidden" as PostStatus } : r))
        );
      } else if (action === "delete") {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "deleted" as PostStatus } : r))
        );
      } else if (action === "suspend") {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "deleted" as PostStatus } : r))
        );
      }
    },
    [reports]
  );

  // ─── Post actions ────────────────────────────────────────────────────
  const handlePostAction = useCallback(
    (id: number, action: "hide" | "delete") => {
      const post = posts.find((p) => p.id === id);
      if (!post) return;

      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: action === "hide" ? "hidden" : "deleted" } : p))
      );
    },
    [posts]
  );

  // ─── Render: Reported post card ──────────────────────────────────────
  function ReportCard({ report }: { report: Report }) {
    const badgeColor =
      report.reportBadgeTone === "red" ? "#e53e3e" : "#d69e2e";
    const badgeBg =
      report.reportBadgeTone === "red" ? "#fee2e2" : "#fefcbf";
    const badgeIcon = report.reportBadgeTone === "red" ? "🔴" : "🟡";

    return (
      <div className="border border-[#dedee5] rounded-[10px] bg-white p-4 mb-3 border-l-[3px] border-l-[#6666ff]">
        {/* Top row: badge, reasons, time */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold whitespace-nowrap"
            style={{ background: badgeBg, color: badgeColor }}
          >
            {badgeIcon} 通報 {report.reportCount}件
          </span>
          {report.reasons.map((reason) => (
            <span
              key={reason}
              className="text-[10px] px-2 py-[2px] bg-[#e8e8f0] rounded text-[#525261] font-medium"
            >
              {reason}
            </span>
          ))}
          <span className="flex-1" />
          <span className="text-[10.5px] text-[#9a9aa0] font-mono">
            {report.time}
          </span>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar
            size={28}
            label={report.author[0]}
            tone={report.authorTone}
          />
          <span className="text-[13px] font-semibold">{report.author}</span>
        </div>

        {/* Title */}
        <div className="text-[13.5px] font-bold mb-2">{report.title}</div>

        {/* Content preview */}
        <div className="bg-[#f1f1f5] rounded-lg p-3 text-[12.5px] text-[#525261] leading-[1.6] whitespace-pre-line mb-3">
          {report.content}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <AdminBtn
            variant="primary"
            icon="✓"
            onClick={() => handleReportAction(report.id, "resolve")}
          >
            問題なし
          </AdminBtn>
          <AdminBtn
            variant="outline"
            icon="⚠"
            onClick={() => handleReportAction(report.id, "hide")}
          >
            非公開にする
          </AdminBtn>
          <AdminBtn
            variant="danger"
            icon="🗑"
            onClick={() => handleReportAction(report.id, "delete")}
          >
            削除する
          </AdminBtn>
          {report.hasAccountAction && (
            <AdminBtn
              variant="danger"
              onClick={() => handleReportAction(report.id, "suspend")}
            >
              アカウント停止
            </AdminBtn>
          )}
        </div>
      </div>
    );
  }

  // ─── Render: Regular post card ───────────────────────────────────────
  function PostCard({ post }: { post: Post }) {
    return (
      <div className="border border-[#dedee5] rounded-[10px] bg-white p-4 mb-3">
        {/* Top row: author + time */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar size={24} label={post.author[0]} tone={post.authorTone} />
          <span className="text-[12.5px] font-semibold">{post.author}</span>
          <span className="flex-1" />
          {post.reported && (
            <AdminPill tone="warn">⚠ 通報あり</AdminPill>
          )}
          <span className="text-[10.5px] text-[#9a9aa0] font-mono">
            {post.time}
          </span>
        </div>

        {/* Title */}
        <div className="text-[13px] font-bold mb-1">{post.title}</div>

        {/* Content */}
        <div className="text-[12.5px] text-[#525261] leading-[1.5] mb-2">
          {post.content}
        </div>

        {/* Stats + actions */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <span className="text-[11px] text-[#9a9aa0]">
            ❤ {post.likes}
          </span>
          <span className="text-[11px] text-[#9a9aa0]">
            💬 {post.comments}
          </span>
          <span className="flex-1" />
          <AdminBtn
            variant="outline"
            icon="⚠"
            onClick={() => handlePostAction(post.id, "hide")}
          >
            非公開にする
          </AdminBtn>
          <AdminBtn
            variant="danger"
            icon="🗑"
            onClick={() => handlePostAction(post.id, "delete")}
          >
            削除する
          </AdminBtn>
        </div>
      </div>
    );
  }

  // ─── Render: Hidden post card ────────────────────────────────────────
  function HiddenCard({
    title,
    author,
    authorTone,
  }: {
    title: string;
    author: string;
    authorTone: number;
  }) {
    return (
      <div className="border border-[#dedee5] rounded-[10px] bg-white p-4 mb-3 opacity-60">
        <div className="flex items-center gap-2 mb-2">
          <Avatar size={24} label={author[0]} tone={authorTone} />
          <span className="text-[12.5px] font-semibold">{author}</span>
          <span className="flex-1" />
          <AdminPill tone="muted">非公開</AdminPill>
        </div>
        <div className="text-[13px] font-bold">{title}</div>
      </div>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────
  return (
    <AdminPageShell
      breadcrumbs="HOME › 掲示板"
      title="掲示板"
      sub="コミュニティの掲示板を管理"
      actions={
        <>
          <AdminBtn icon="+" onClick={() => setCreating(true)}>新規投稿</AdminBtn>
          <div className="flex items-center gap-2 px-3 py-[7px] border border-[#dedee5] rounded-md bg-white max-w-[240px] w-full">
            <span className="text-[#9a9aa0] text-[13px] flex-none">⌕</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="掲示板を検索"
              className="text-[12px] text-[#1a1a1a] placeholder:text-[#9a9aa0] bg-transparent outline-none w-full"
            />
          </div>
          <AdminBtn variant="outline" onClick={() => { const periods = ["今日","今週","今月","全期間"]; setBoardPeriod(periods[(periods.indexOf(boardPeriod)+1) % periods.length]); }}>期間: {boardPeriod}</AdminBtn>
        </>
      }
    >
      <div className="p-3 md:p-5 flex flex-col gap-3">
        {/* Creation form */}
        {creating && (
          <div className="border-[1.5px] border-[#6666ff] rounded-[10px] bg-white p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[14px] font-bold">新しい掲示板投稿を作成</div>
              <button
                onClick={() => { setCreating(false); setNewTitle(""); setNewBody(""); setNewTokens(""); }}
                className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[18px] leading-none"
              >
                ×
              </button>
            </div>

            <div className="mb-3">
              <div className="text-[11px] font-semibold text-[#525261] mb-1">タイトル</div>
              <input
                className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]"
                placeholder="例: 看板リペイント手伝い募集"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <div className="text-[11px] font-semibold text-[#525261] mb-1">本文</div>
              <textarea
                className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] min-h-[80px] resize-none outline-none focus:border-[#6666ff]"
                placeholder="投稿の内容を入力"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <div className="text-[11px] font-semibold text-[#525261] mb-1">報酬 DAO (任意)</div>
              <input
                className="w-[160px] px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] font-mono outline-none focus:border-[#6666ff]"
                placeholder="0"
                value={newTokens}
                onChange={(e) => setNewTokens(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              {formError && (
                <div className="mb-2 text-[12px] text-[#e53e3e] font-semibold">{formError}</div>
              )}
              <AdminBtn
                onClick={() => {
                  if (!newTitle.trim() || !newBody.trim()) { setFormError("タイトルと本文を入力してください"); setTimeout(() => setFormError(""), 3000); return; }
                  setFormError("");
                  const newPost: Post = {
                    id: Date.now(),
                    author: "運営事務局",
                    authorTone: 0,
                    title: newTitle.trim(),
                    content: newBody.trim(),
                    likes: 0,
                    comments: 0,
                    time: "たった今",
                    status: "active",
                  };
                  setPosts((prev) => [newPost, ...prev]);
                  setCreating(false);
                  setNewTitle("");
                  setNewBody("");
                  setNewTokens("");
                  setTab("all");
                }}
                disabled={!newTitle.trim() || !newBody.trim()}
              >
                投稿する
              </AdminBtn>
              <AdminBtn
                variant="outline"
                onClick={() => { setCreating(false); setNewTitle(""); setNewBody(""); setNewTokens(""); }}
              >
                キャンセル
              </AdminBtn>
              <span className="text-[10.5px] text-[#9a9aa0] ml-2">※ 運営事務局として投稿されます</span>
            </div>
          </div>
        )}

        {/* Tab chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={[
                "px-3 py-[5px] rounded-[999px] text-[11.5px] font-medium border transition-colors whitespace-nowrap",
                tab === t.id
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "bg-white text-[#525261] border-[#dedee5] hover:border-[#9a9aa0]",
              ].join(" ")}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        {tab === "reported" && (
          <>
            {activeReports.length === 0 ? (
              <div className="text-center py-12 text-[13px] text-[#9a9aa0]">
                通報された投稿はありません
              </div>
            ) : (
              activeReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            )}
          </>
        )}

        {tab === "all" && (
          <>
            {posts
              .filter((p) => p.status === "active")
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </>
        )}

        {tab === "hidden" && (
          <>
            {allHiddenCount === 0 ? (
              <div className="text-center py-12 text-[13px] text-[#9a9aa0]">
                非公開の投稿はありません
              </div>
            ) : (
              <>
                {hiddenReports.map((r) => (
                  <HiddenCard
                    key={r.id}
                    title={r.title}
                    author={r.author}
                    authorTone={r.authorTone}
                  />
                ))}
                {hiddenPosts.map((p) => (
                  <HiddenCard
                    key={p.id}
                    title={p.title}
                    author={p.author}
                    authorTone={p.authorTone}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </AdminPageShell>
  );
}
