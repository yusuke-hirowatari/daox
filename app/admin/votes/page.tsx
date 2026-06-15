"use client";

import { useState } from "react";
import { AdminBtn, AdminPill, AdminPageShell } from "@/components/admin/atoms";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VoteOption {
  label: string;
  voteCount: number;
}

interface Vote {
  id: string;
  title: string;
  deadline: string;
  voted: number;
  total: number;
  options: VoteOption[];
  status: "open" | "closed";
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INITIAL_VOTES: Vote[] = [
  {
    id: "v1",
    title: "夏祭り出店ジャンルの希望調査",
    deadline: "〜6/20",
    voted: 198,
    total: 312,
    options: [
      { label: "飲食", voteCount: 78 },
      { label: "物販", voteCount: 52 },
      { label: "体験型", voteCount: 44 },
      { label: "その他", voteCount: 24 },
    ],
    status: "open",
  },
  {
    id: "v2",
    title: "定例会の開催曜日について",
    deadline: "〜6/15",
    voted: 145,
    total: 312,
    options: [
      { label: "月曜", voteCount: 32 },
      { label: "水曜", voteCount: 58 },
      { label: "金曜", voteCount: 45 },
      { label: "土曜", voteCount: 10 },
    ],
    status: "open",
  },
  {
    id: "v3",
    title: "ロゴリニューアルの方向性",
    deadline: "終了",
    voted: 256,
    total: 312,
    options: [
      { label: "モダン路線", voteCount: 142 },
      { label: "伝統路線", voteCount: 88 },
      { label: "現状維持", voteCount: 26 },
    ],
    status: "closed",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminVotesPage() {
  const [votes, setVotes] = useState<Vote[]>(INITIAL_VOTES);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [tab, setTab] = useState<"all" | "open" | "closed">("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openCount = votes.filter((v) => v.status === "open").length;
  const closedCount = votes.filter((v) => v.status === "closed").length;

  const TABS = [
    { id: "all" as const, label: `すべて (${votes.length})` },
    { id: "open" as const, label: `受付中 (${openCount})` },
    { id: "closed" as const, label: `終了 (${closedCount})` },
  ];

  const filtered = tab === "all" ? votes : votes.filter((v) => v.status === tab);

  const handleCreate = () => {
    const validOptions = newOptions.filter((o) => o.trim());
    if (!newTitle.trim() || validOptions.length < 2) return;

    const vote: Vote = {
      id: `v${Date.now()}`,
      title: newTitle.trim(),
      deadline: newDeadline ? `〜${newDeadline.replace(/-/g, "/").slice(5)}` : "未設定",
      voted: 0,
      total: 312,
      options: validOptions.map((label) => ({ label: label.trim(), voteCount: 0 })),
      status: "open",
    };
    setVotes((prev) => [vote, ...prev]);
    setCreating(false);
    setNewTitle("");
    setNewDeadline("");
    setNewOptions(["", ""]);
  };

  const handleClose = (id: string) => {
    setVotes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "closed" as const, deadline: "終了" } : v))
    );
  };

  const handleDelete = (id: string) => {
    setVotes((prev) => prev.filter((v) => v.id !== id));
    setConfirmDeleteId(null);
  };

  const addOption = () => setNewOptions((prev) => [...prev, ""]);

  const removeOption = (index: number) => {
    if (newOptions.length <= 2) return;
    setNewOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    setNewOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  return (
    <AdminPageShell
      breadcrumbs="HOME › 投票"
      title="投票"
      sub="コミュニティの投票を管理"
      actions={
        <AdminBtn icon="+" onClick={() => setCreating(true)}>
          新しい投票を作成
        </AdminBtn>
      }
    >
      <div className="p-3 md:p-5 flex flex-col gap-3">
        {/* Creation form */}
        {creating && (
          <div className="border-[1.5px] border-[#6666ff] rounded-[10px] bg-white p-4 mb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[14px] font-bold">新しい投票を作成</div>
              <button
                onClick={() => { setCreating(false); setNewTitle(""); setNewDeadline(""); setNewOptions(["", ""]); }}
                className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[18px] leading-none"
              >
                ×
              </button>
            </div>

            <div className="mb-3">
              <div className="text-[11px] font-semibold text-[#525261] mb-1">タイトル</div>
              <input
                className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]"
                placeholder="例: 夏祭りの開催日について"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <div className="text-[11px] font-semibold text-[#525261] mb-1">締切日</div>
              <input
                type="date"
                className="w-[200px] px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <div className="text-[11px] font-semibold text-[#525261] mb-2">選択肢</div>
              <div className="flex flex-col gap-2">
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className="flex-1 px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]"
                      placeholder={`選択肢 ${i + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                    />
                    {newOptions.length > 2 && (
                      <button
                        className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[16px]"
                        onClick={() => removeOption(i)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="mt-2 text-[11px] text-[#6666ff] font-semibold hover:underline"
                onClick={addOption}
              >
                + 選択肢を追加
              </button>
            </div>

            <div className="flex items-center gap-2">
              <AdminBtn
                onClick={handleCreate}
                disabled={!newTitle.trim() || newOptions.filter((o) => o.trim()).length < 2}
              >
                投票を公開
              </AdminBtn>
              <AdminBtn
                variant="outline"
                onClick={() => { setCreating(false); setNewTitle(""); setNewDeadline(""); setNewOptions(["", ""]); }}
              >
                キャンセル
              </AdminBtn>
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

        {/* Vote cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-[#9a9aa0]">
            投票はありません
          </div>
        ) : (
          filtered.map((v) => {
            const pct = v.total > 0 ? Math.round((v.voted / v.total) * 100) : 0;
            return (
              <div key={v.id} className="border border-[#dedee5] rounded-[10px] bg-white p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AdminPill tone={v.status === "open" ? "info" : "muted"}>
                      {v.status === "open" ? "受付中" : "終了"}
                    </AdminPill>
                    <span className="text-[10.5px] text-[#9a9aa0] font-mono">{v.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {v.status === "open" && (
                      <AdminBtn variant="outline" onClick={() => handleClose(v.id)}>
                        締め切る
                      </AdminBtn>
                    )}
                    {confirmDeleteId === v.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-red-600 font-semibold">削除しますか？</span>
                        <button onClick={() => handleDelete(v.id)} className="text-[10px] px-2 py-1 bg-red-600 text-white rounded font-semibold">確認</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-[10px] px-2 py-1 bg-[#f1f1f5] rounded font-semibold">キャンセル</button>
                      </div>
                    ) : (
                      <AdminBtn variant="danger" onClick={() => setConfirmDeleteId(v.id)}>
                        削除
                      </AdminBtn>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="text-[14px] font-bold mb-3">{v.title}</div>

                {/* Options with bars */}
                <div className="flex flex-col gap-2 mb-3">
                  {v.options.map((o) => {
                    const optPct = v.voted > 0 ? Math.round((o.voteCount / v.voted) * 100) : 0;
                    const maxVotes = Math.max(...v.options.map((x) => x.voteCount));
                    const isTop = o.voteCount === maxVotes && o.voteCount > 0;
                    return (
                      <div key={o.label}>
                        <div className="flex items-center justify-between text-[12px] mb-1">
                          <span className={isTop ? "font-semibold text-[#1a1a1a]" : "text-[#525261]"}>
                            {o.label}
                          </span>
                          <span className="font-mono text-[11px] text-[#9a9aa0]">
                            {o.voteCount}票 ({optPct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-[#f1f1f5] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isTop ? "bg-[#6666ff]" : "bg-[#dedee5]"}`}
                            style={{ width: `${optPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer stats */}
                <div className="flex items-center gap-3 text-[11px] text-[#9a9aa0]">
                  <span>{v.voted} / {v.total}人 投票済 ({pct}%)</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminPageShell>
  );
}
