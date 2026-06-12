"use client";

import { useState, useCallback } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { AdminBtn, AdminPill, AdminPageShell } from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

type ModTab = "pending" | "hold" | "done";
type ReportStatus = "pending" | "approved" | "warned" | "hidden" | "deleted" | "suspended";

interface Report {
  id:          number;
  type:        string;
  typeTone:    "warn" | "open";
  reasons:     string[];
  count:       number;
  who:         string;
  whoTone:     number;
  content:     string;
  time:        string;
  status:      ReportStatus;
  title:       string;
  detail:      string;
  postedAgo:   string;
  category:    string;
  dao:         string;
  joinDate:    string;
  pastReports: number;
  xp:          number;
  daoPoints:   number;
}

const INITIAL_REPORTS: Report[] = [
  {
    id: 1,
    type: "投稿", typeTone: "warn", reasons: ["スパム", "誤情報"], count: 3,
    who: "木村 弘", whoTone: 3,
    content: "チラシ配布スタッフ募集 → リンク先が怪しい",
    time: "5分前",
    status: "pending",
    title: "チラシ配布スタッフ募集",
    detail: "配布エリア応相談、約2時間の予定です。\n詳細はこちら → http://suspicious-url.example/job\n事前面接をオンラインで行います。お気軽にお問い合わせを。",
    postedAgo: "28分前",
    category: "お仕事",
    dao: "+120 DAO",
    joinDate: "2024/04/01",
    pastReports: 0,
    xp: 620,
    daoPoints: 180,
  },
  {
    id: 2,
    type: "コメント", typeTone: "warn", reasons: ["不適切表現"], count: 1,
    who: "匿名ユーザー", whoTone: 2,
    content: "◯◯さんいい加減にしろ。何度言えば...",
    time: "1時間前",
    status: "pending",
    title: "コメント: 地域イベントについて",
    detail: "◯◯さんいい加減にしろ。何度言えば分かるんだ。こんな企画は迷惑でしかない。",
    postedAgo: "1時間前",
    category: "イベント",
    dao: "+30 DAO",
    joinDate: "2024/08/15",
    pastReports: 1,
    xp: 210,
    daoPoints: 45,
  },
  {
    id: 3,
    type: "メンバー", typeTone: "open", reasons: ["なりすまし"], count: 2,
    who: "田中 一郎(疑い)", whoTone: 0,
    content: "既存メンバー「田中 太郎」に酷似したアカウント",
    time: "3時間前",
    status: "pending",
    title: "なりすましアカウント疑い",
    detail: "既存メンバー「田中 太郎」に酷似した名前・プロフィールでアカウントが作成されています。プロフィール画像も類似しています。",
    postedAgo: "3時間前",
    category: "メンバー",
    dao: "0 DAO",
    joinDate: "2025/06/10",
    pastReports: 0,
    xp: 0,
    daoPoints: 0,
  },
];

const REPORT_REASONS = [
  { who: "田中", tone: 0, reason: "スパム",   detail: "外部リンクが怪しい" },
  { who: "伊藤", tone: 1, reason: "誤情報",   detail: "商店街公認ではない" },
  { who: "佐藤", tone: 2, reason: "スパム",   detail: "URLが個人サイトに飛ぶ" },
];

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminModPage() {
  const [tab,      setTab]      = useState<ModTab>("pending");
  const [selected, setSelected] = useState(0);
  const [reports,  setReports]  = useState<Report[]>(INITIAL_REPORTS);

  // Derived lists
  const pendingReports = reports.filter((r) => r.status === "pending");
  const doneReports    = reports.filter((r) => r.status !== "pending");

  const STATUS_LABELS: Record<ReportStatus, string> = {
    pending:   "未対応",
    approved:  "承認済",
    warned:    "警告済",
    hidden:    "非公開",
    deleted:   "削除済",
    suspended: "停止済",
  };

  // Which list to show based on current tab
  const visibleReports =
    tab === "pending" ? pendingReports :
    tab === "done"    ? doneReports    :
    [];                                  // "hold" is empty for demo

  const active = visibleReports[selected] ?? null;

  const MOD_TABS: { id: ModTab; label: string }[] = [
    { id: "pending", label: `未対応 (${pendingReports.length})` },
    { id: "hold",    label: "保留" },
    { id: "done",    label: `処理済 (${doneReports.length})` },
  ];

  // ─── Action handler ────────────────────────────────────────────────
  const handleAction = useCallback(
    (newStatus: ReportStatus, message: string) => {
      if (!active) return;

      // Show confirmation
      alert(message);

      // Update the report's status
      setReports((prev) =>
        prev.map((r) => (r.id === active.id ? { ...r, status: newStatus } : r))
      );

      // After updating, adjust the selection index
      // The current item will leave the pending list, so keep index or move back
      setSelected((prevIdx) => {
        const remainingCount =
          newStatus !== "pending"
            ? pendingReports.length - 1  // item is leaving pending
            : pendingReports.length;
        if (remainingCount <= 0) return 0;
        return Math.min(prevIdx, remainingCount - 1);
      });
    },
    [active, pendingReports.length]
  );

  // ─── Header handlers ──────────────────────────────────────────────
  const handleGuideline = useCallback(() => {
    alert("コミュニティガイドラインを表示します（デモ）");
  }, []);

  const handleBulkAction = useCallback(() => {
    alert("保留中の通報をすべて一括処理します（デモ）");
  }, []);

  // ─── Detail pane handlers ─────────────────────────────────────────
  const handleProfile = useCallback(() => {
    alert("ユーザーのプロフィールページを開きます（デモ）");
  }, []);

  const handlePastReports = useCallback(() => {
    alert("このユーザーの過去の通報履歴を表示します（デモ）");
  }, []);

  return (
    <AdminPageShell
      breadcrumbs="HOME > モデレーション"
      title="モデレーション"
      sub={`未対応 ${pendingReports.length}件 ・ 今週 ${doneReports.length + pendingReports.length}件処理`}
      actions={
        <>
          <AdminBtn variant="outline" onClick={handleGuideline}>ガイドライン</AdminBtn>
          <AdminBtn onClick={handleBulkAction}>一括対応</AdminBtn>
        </>
      }
    >
      <div className="flex h-full overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>

        {/* Queue list */}
        <div
          className="flex-none flex flex-col border-r border-[#dedee5] bg-[#f1f1f5] overflow-hidden"
          style={{ width: 340 }}
        >
          {/* Tabs */}
          <div className="flex-none px-4 py-2.5 border-b border-[#dedee5]">
            <div className="flex bg-[#e8e8f0] rounded-lg p-0.5 gap-0.5">
              {MOD_TABS.map((t) => (
                <button
                  key={t.id}
                  className={[
                    "flex-1 text-[11px] font-medium py-[5px] rounded-md transition-colors whitespace-nowrap",
                    tab === t.id
                      ? "bg-white text-[#1a1a1a] font-semibold shadow-sm"
                      : "text-[#7a7a84]",
                  ].join(" ")}
                  onClick={() => { setTab(t.id); setSelected(0); }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {visibleReports.length === 0 && (
              <div className="px-4 py-8 text-center text-[12px] text-[#9a9aa0]">
                {tab === "pending" ? "未対応の通報はありません" :
                 tab === "hold"    ? "保留中の通報はありません" :
                                     "処理済みの通報はありません"}
              </div>
            )}
            {visibleReports.map((r, i) => (
              <button
                key={r.id}
                className={[
                  "w-full text-left px-4 py-3 border-b border-[#dedee5] border-l-[3px] transition-colors",
                  selected === i
                    ? "bg-white border-l-[#6666ff]"
                    : "bg-transparent border-l-transparent hover:bg-white/60",
                ].join(" ")}
                onClick={() => setSelected(i)}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AdminPill tone={r.typeTone}>{r.type}</AdminPill>
                  {r.status !== "pending" && (
                    <AdminPill tone="success">{STATUS_LABELS[r.status]}</AdminPill>
                  )}
                  <span className="text-[10.5px] text-[#6666ff] font-bold font-mono">
                    x{r.count}
                  </span>
                  <span className="flex-1" />
                  <span className="text-[10px] text-[#9a9aa0] font-mono">{r.time}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Avatar size={20} label={r.who[0]} tone={r.whoTone} />
                  <span className="text-[11.5px] font-semibold">{r.who}</span>
                </div>
                <div className="text-[11.5px] text-[#525261] line-clamp-2 leading-[1.45]">
                  {r.content}
                </div>
                <div className="flex gap-1 mt-1.5">
                  {r.reasons.map((rsn) => (
                    <span
                      key={rsn}
                      className="text-[9.5px] px-1.5 py-[1px] bg-[#e8e8f0] rounded text-[#525261]"
                    >
                      {rsn}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail pane */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {active ? (
            <>
              {/* Detail header */}
              <div className="flex-none px-5 py-3.5 border-b border-[#dedee5]">
                <div className="flex items-center gap-2 mb-2.5">
                  <AdminPill tone={active.typeTone}>{active.type}</AdminPill>
                  {active.status !== "pending" && (
                    <AdminPill tone="success">{STATUS_LABELS[active.status]}</AdminPill>
                  )}
                  <span className="text-[11px] text-[#6666ff] font-bold font-mono">
                    通報 x{active.count}
                  </span>
                  <span className="flex-1" />
                  <AdminBtn variant="outline" onClick={handleProfile}>プロフィール</AdminBtn>
                  <AdminBtn variant="ghost" onClick={handlePastReports}>過去の通報</AdminBtn>
                </div>
                <div className="text-[16px] font-bold">{active.title}</div>
                <div className="text-[11px] text-[#9a9aa0] mt-1">
                  {active.who} ・ {active.postedAgo} ・ {active.category} ・ {active.dao}
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex gap-5 p-5">
                {/* Content + reports */}
                <div className="flex-1 flex flex-col gap-3.5 min-w-0 overflow-y-auto">
                  <div className="p-3.5 border border-[#dedee5] rounded-lg bg-[#f1f1f5]">
                    <div className="text-[10px] text-[#9a9aa0] font-mono tracking-[0.5px] mb-1.5">
                      投稿内容
                    </div>
                    <div className="text-[12.5px] leading-[1.6] whitespace-pre-line">
                      {active.detail}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#9a9aa0] font-mono tracking-[0.5px] mb-2">
                      通報理由 ・ {active.count}件
                    </div>
                    <div className="flex flex-col gap-2">
                      {REPORT_REASONS.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 px-3 py-2 border border-[#dedee5] rounded-md bg-white"
                        >
                          <Avatar size={22} label={r.who[0]} tone={r.tone} />
                          <span className="text-[11.5px] font-semibold">{r.who}</span>
                          <AdminPill tone="warn">{r.reason}</AdminPill>
                          <span className="flex-1 text-[11px] text-[#525261]">
                            {r.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action sidebar */}
                <div className="w-60 flex flex-col gap-2.5 flex-none">
                  <div className="text-[11px] text-[#9a9aa0] font-mono tracking-[0.5px]">
                    対応アクション
                  </div>
                  {active.status === "pending" ? (
                    <>
                      <AdminBtn
                        onClick={() => handleAction("approved", "この通報を承認しました。問題なしとして処理済みにします（デモ）")}
                      >
                        承認(問題なし)
                      </AdminBtn>
                      <AdminBtn
                        variant="outline"
                        onClick={() => handleAction("warned", "ユーザーに警告を送信しました（デモ）")}
                      >
                        警告を送る
                      </AdminBtn>
                      <AdminBtn
                        variant="outline"
                        onClick={() => handleAction("hidden", "投稿を非公開にしました（デモ）")}
                      >
                        投稿を非公開
                      </AdminBtn>
                      <AdminBtn
                        variant="danger"
                        onClick={() => handleAction("deleted", "投稿を削除しました（デモ）")}
                      >
                        投稿を削除
                      </AdminBtn>
                      <AdminBtn
                        variant="danger"
                        onClick={() => handleAction("suspended", "アカウントを停止しました（デモ）")}
                      >
                        アカウント停止
                      </AdminBtn>
                    </>
                  ) : (
                    <div className="p-3 bg-[#e2efe7] rounded-md text-[11.5px] text-[#3e8056] font-semibold text-center">
                      {STATUS_LABELS[active.status]}として対応済み
                    </div>
                  )}
                  <div className="mt-2.5 p-2.5 bg-[#f1f1f5] rounded-md text-[10.5px] text-[#525261] leading-[1.5]">
                    <div className="font-bold mb-1">投稿者の履歴</div>
                    参加: {active.joinDate}
                    <br />
                    過去の通報: {active.pastReports}件
                    <br />
                    XP: {active.xp} ・ DAO: {active.daoPoints}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[13px] text-[#9a9aa0]">
              {tab === "pending"
                ? "すべての通報に対応しました"
                : "通報を選択してください"}
            </div>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
