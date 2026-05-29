"use client";

import { useState } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { AdminBtn, AdminPill, AdminPageShell } from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

type ModTab = "pending" | "hold" | "done";

interface Report {
  type:        string;
  typeTone:    "warn" | "open";
  reasons:     string[];
  count:       number;
  who:         string;
  whoTone:     number;
  content:     string;
  time:        string;
}

const REPORTS: Report[] = [
  {
    type: "投稿", typeTone: "warn", reasons: ["スパム", "誤情報"], count: 3,
    who: "木村 弘", whoTone: 3,
    content: "チラシ配布スタッフ募集 → リンク先が怪しい",
    time: "5分前",
  },
  {
    type: "コメント", typeTone: "warn", reasons: ["不適切表現"], count: 1,
    who: "匿名ユーザー", whoTone: 2,
    content: "◯◯さんいい加減にしろ。何度言えば...",
    time: "1時間前",
  },
  {
    type: "メンバー", typeTone: "open", reasons: ["なりすまし"], count: 2,
    who: "田中 一郎(疑い)", whoTone: 0,
    content: "既存メンバー「田中 太郎」に酷似したアカウント",
    time: "3時間前",
  },
];

const REPORT_REASONS = [
  { who: "田中", tone: 0, reason: "スパム",   detail: "外部リンクが怪しい" },
  { who: "伊藤", tone: 1, reason: "誤情報",   detail: "商店街公認ではない" },
  { who: "佐藤", tone: 2, reason: "スパム",   detail: "URLが個人サイトに飛ぶ" },
];

const MOD_TABS: { id: ModTab; label: string }[] = [
  { id: "pending", label: "未対応 (3)" },
  { id: "hold",    label: "保留" },
  { id: "done",    label: "処理済" },
];

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminModPage() {
  const [tab,      setTab]      = useState<ModTab>("pending");
  const [selected, setSelected] = useState(0);

  const active = REPORTS[selected];

  return (
    <AdminPageShell
      breadcrumbs="HOME › モデレーション"
      title="モデレーション"
      sub="未対応 3件 ・ 今週 8件処理"
      actions={
        <>
          <AdminBtn variant="outline">ガイドライン</AdminBtn>
          <AdminBtn>一括対応</AdminBtn>
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
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {REPORTS.map((r, i) => (
              <button
                key={i}
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
                  <span className="text-[10.5px] text-[#6666ff] font-bold font-mono">
                    ×{r.count}
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
          {/* Detail header */}
          <div className="flex-none px-5 py-3.5 border-b border-[#dedee5]">
            <div className="flex items-center gap-2 mb-2.5">
              <AdminPill tone="warn">{active.type}</AdminPill>
              <span className="text-[11px] text-[#6666ff] font-bold font-mono">
                通報 ×{active.count}
              </span>
              <span className="flex-1" />
              <AdminBtn variant="outline">プロフィール</AdminBtn>
              <AdminBtn variant="ghost">過去の通報</AdminBtn>
            </div>
            <div className="text-[16px] font-bold">チラシ配布スタッフ募集</div>
            <div className="text-[11px] text-[#9a9aa0] mt-1">
              木村 弘 ・ 28分前 ・ お仕事 ・ +120 DAO
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex gap-5 p-5">
            {/* Content + reports */}
            <div className="flex-1 flex flex-col gap-3.5 min-w-0 overflow-y-auto">
              <div className="p-3.5 border border-[#dedee5] rounded-lg bg-[#f1f1f5]">
                <div className="text-[10px] text-[#9a9aa0] font-mono tracking-[0.5px] mb-1.5">
                  投稿内容
                </div>
                <div className="text-[12.5px] leading-[1.6]">
                  配布エリア応相談、約2時間の予定です。
                  <br />
                  詳細はこちら → http://suspicious-url.example/job
                  <br />
                  事前面接をオンラインで行います。お気軽にお問い合わせを。
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#9a9aa0] font-mono tracking-[0.5px] mb-2">
                  通報理由 ・ 3件
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
              <AdminBtn>承認(問題なし)</AdminBtn>
              <AdminBtn variant="outline">警告を送る</AdminBtn>
              <AdminBtn variant="outline">投稿を非公開</AdminBtn>
              <AdminBtn variant="danger">投稿を削除</AdminBtn>
              <AdminBtn variant="danger">アカウント停止</AdminBtn>
              <div className="mt-2.5 p-2.5 bg-[#f1f1f5] rounded-md text-[10.5px] text-[#525261] leading-[1.5]">
                <div className="font-bold mb-1">投稿者の履歴</div>
                参加: 2024/04/01
                <br />
                過去の通報: 0件
                <br />
                XP: 620 ・ DAO: 180
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
