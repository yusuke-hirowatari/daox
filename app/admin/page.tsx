"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/atoms/Avatar";
import { StatCard, AdminBtn, BarChart } from "@/components/admin/atoms";

// ─── Static data ──────────────────────────────────────────────────────────

const DAU_DATA = [
  { k: "月", v: 12 },
  { k: "火", v: 18 },
  { k: "水", v: 22 },
  { k: "木", v: 24 },
  { k: "金", v: 19 },
  { k: "土", v: 28 },
  { k: "日", v: 31, hi: true },
];

const ACTIVITIES = [
  { t: "5分前",   who: "伊藤 さくら", tone: 1, what: "がカフェことりにチェックイン",      amt: null   },
  { t: "12分前",  who: "田中 太郎",   tone: 0, what: "がタスクを承認: 看板リペイント",    amt: "-120" },
  { t: "28分前",  who: "木村 弘",     tone: 3, what: "が投稿: チラシ配布スタッフ募集",   amt: null   },
  { t: "1時間前", who: "佐藤 一郎",   tone: 2, what: "が投票に参加",                     amt: null   },
  { t: "2時間前", who: "高橋 美咲",   tone: 4, what: "が新規参加",                       amt: null   },
];

const ACTION_ITEMS = [
  {
    severity: "red" as const,
    label: "通報: 不審なリンク投稿",
    detail: "木村 弘",
    action: "対応する",
    href: "/admin/board",
  },
  {
    severity: "yellow" as const,
    label: "承認待ち: タスク完了報告 2件",
    detail: null,
    action: "確認する",
    href: "/admin/tasks",
  },
  {
    severity: "yellow" as const,
    label: "レビュー: 新規メンバー申請 1件",
    detail: null,
    action: "確認する",
    href: "/admin/members",
  },
];

const ENGAGEMENT_DATA = [
  { label: "チェックイン", value: 248, total: 312 },
  { label: "タスク参加",   value: 142, total: 312 },
  { label: "掲示板投稿",   value: 56,  total: 312 },
  { label: "DM送信",       value: 312, total: 312 },
  { label: "投票参加",     value: 198, total: 312 },
];

const QUICK_ACTIONS = [
  { icon: "◉", label: "お知らせを配信",   variant: "primary"  as const, href: "/admin/posts" },
  { icon: "+", label: "投票を作成",         variant: "outline" as const, href: "/admin/board" },
  { icon: "◈", label: "トークンを発行",     variant: "outline" as const, href: "/admin/tokens" },
  { icon: "✉", label: "メンバーを招待",    variant: "outline" as const, href: "/admin/members" },
];

const MORE_ACTIVITIES = [
  { t: "3時間前", who: "鈴木 花子", tone: 1, what: "がタスクを完了: 見守り隊", amt: "+30" },
  { t: "4時間前", who: "中島 健",   tone: 0, what: "が投稿にコメント",          amt: null },
  { t: "5時間前", who: "小林 真理", tone: 1, what: "が新メンバーを紹介",        amt: "+100" },
  { t: "昨日",    who: "田中 太郎", tone: 0, what: "がお知らせを配信",          amt: null },
  { t: "昨日",    who: "佐藤 一郎", tone: 2, what: "がチェックイン 3店舗",      amt: "+30" },
];

// ─── Page ─────────────────────────────────────────────────────────────────

const PERIODS = ["今日", "今週", "今月", "全期間"] as const;

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("今週");
  const [showAllActivity, setShowAllActivity] = useState(false);
  const router = useRouter();

  function cyclePeriod() {
    const idx = PERIODS.indexOf(period as typeof PERIODS[number]);
    const next = PERIODS[(idx + 1) % PERIODS.length];
    setPeriod(next);
  }

  function downloadCSV() {
    const header = "指標,値,変化,期間";
    const rows = [
      ["メンバー","312","+8","今週"],
      ["DAU","94","+12%","先週比"],
      ["チェックイン","248","+18%","今週"],
      ["完了タスク","42","+6","今週"],
      ["トークン流通","58,420","2.1%","DAO"],
    ];
    const csv = [header, ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex-none flex items-center gap-4 px-4 md:px-6 py-2.5 md:py-3.5 border-b border-[#dedee5]">
        <div className="flex-1 min-w-0">
          <div className="hidden md:block text-[10.5px] text-[#9a9aa0] font-mono mb-1">HOME</div>
          <div className="text-[15px] md:text-[17px] font-bold leading-tight">ダッシュボード</div>
          <div className="text-[11px] text-[#9a9aa0] mt-0.5">
            新富商店街コミュニティ ・ 全体の動向
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <AdminBtn variant="ghost" icon="↓" onClick={downloadCSV}>CSV書き出し</AdminBtn>
          <AdminBtn variant="outline" icon="🕒" onClick={cyclePeriod}>期間: {period}</AdminBtn>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa] p-3 md:p-5">
        <div className="flex flex-col gap-4">

          {/* 要対応 section */}
          <div
            className="p-4 rounded-[10px] border border-[#6666ff] bg-[#f0f0ff]"
          >
            <div className="text-[14px] text-[#6666ff] font-bold mb-3">
              🔔 要対応 · {ACTION_ITEMS.length}件
            </div>
            <div className="flex flex-col gap-0">
              {ACTION_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-t border-[#d8d8ef] first:border-t-0"
                >
                  <span className="flex-none text-[14px]">
                    {item.severity === "red" ? "🔴" : "🟡"}
                  </span>
                  <div className="flex-1 min-w-0 text-[12.5px]">
                    <span className="font-semibold">{item.label}</span>
                    {item.detail && (
                      <span className="text-[#525261] ml-2">{item.detail}</span>
                    )}
                  </div>
                  <Link
                    href={item.href}
                    className="flex-none text-[12px] text-[#6666ff] font-bold hover:underline"
                  >
                    {item.action} →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="メンバー"    value="312"    delta="+8"   sub="今週" />
            <StatCard label="DAU"         value="94"     delta="+12%" sub="先週比" />
            <StatCard label="チェックイン" value="248"   delta="+18%" sub="今週" />
            <StatCard label="完了タスク"  value="42"     delta="+6"   sub="今週" />
            <StatCard label="トークン流通" value="58,420" delta="2.1%" deltaTone="flat" sub="DAO" />
          </div>

          {/* 2-col */}
          <div className="flex flex-col md:flex-row gap-4">

            {/* Left: chart + activity */}
            <div className="flex-[1.5] flex flex-col gap-4 min-w-0">

              {/* Bar chart */}
              <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
                <div className="flex items-center mb-3">
                  <div className="flex-1">
                    <div className="text-[11px] text-[#9a9aa0] font-mono">
                      WEEKLY ACTIVITY
                    </div>
                    <div className="text-[14px] font-bold mt-0.5">
                      日別アクティブユーザー
                    </div>
                  </div>
                  <div className="flex gap-3 text-[11px] text-[#525261]">
                    <span className="flex items-center gap-1">
                      <span
                        className="inline-block w-2.5 h-2.5"
                        style={{ background: "#1a1a1a" }}
                      />
                      DAU
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="inline-block w-2.5 h-2.5"
                        style={{ background: "#6666ff" }}
                      />
                      ピーク
                    </span>
                  </div>
                </div>
                <BarChart data={DAU_DATA} height={130} />
              </div>

              {/* Recent activity */}
              <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white flex flex-col">
                <div className="flex items-center mb-2.5">
                  <div className="flex-1 text-[14px] font-bold">
                    最近のアクティビティ
                  </div>
                  <button
                    className="text-[11px] text-[#525261] cursor-pointer hover:text-[#1a1a1a]"
                    onClick={() => setShowAllActivity(prev => !prev)}
                  >
                    {showAllActivity ? "閉じる" : "すべて見る →"}
                  </button>
                </div>
                <div>
                  {(showAllActivity ? [...ACTIVITIES, ...MORE_ACTIVITIES] : ACTIVITIES).map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 py-[9px] border-b border-[#dedee5] last:border-b-0"
                    >
                      <span className="w-14 text-[10px] text-[#9a9aa0] font-mono flex-none">
                        {a.t}
                      </span>
                      <Avatar size={24} label={a.who[0]} tone={a.tone} />
                      <span className="flex-1 min-w-0 text-[12px] truncate">
                        <strong className="font-bold">{a.who}</strong>
                        <span className="text-[#525261]"> {a.what}</span>
                      </span>
                      {a.amt && (
                        <span className="flex-none text-[11px] text-[#6666ff] font-bold font-mono">
                          {a.amt} DAO
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: engagement + quick actions + system */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">

              {/* 機能別エンゲージメント */}
              <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
                <div className="text-[11px] text-[#9a9aa0] font-mono mb-1">
                  ENGAGEMENT
                </div>
                <div className="text-[14px] font-bold mb-3">
                  機能別エンゲージメント
                </div>
                <div className="flex flex-col gap-3">
                  {ENGAGEMENT_DATA.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-[#525261]">
                          {item.label}
                        </span>
                        <span className="text-[12px] font-bold font-mono">
                          {item.value}
                          <span className="text-[10.5px] text-[#9a9aa0] font-normal">
                            /{item.total}
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#e8e8f0]">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(item.value / item.total) * 100}%`,
                            background: "#1a1a1a",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
                <div className="text-[11px] text-[#9a9aa0] font-mono mb-2.5">
                  クイックアクション
                </div>
                <div className="flex flex-col gap-1.5">
                  {QUICK_ACTIONS.map((q) => (
                    <AdminBtn key={q.label} variant={q.variant} icon={q.icon} onClick={() => router.push(q.href)}>
                      {q.label}
                    </AdminBtn>
                  ))}
                </div>
              </div>

              {/* System status */}
              <div className="p-3.5 border border-[#dedee5] rounded-[10px] bg-white text-[11px] text-[#525261]">
                <div className="text-[11px] text-[#9a9aa0] font-mono mb-1.5">
                  システム状況
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-none"
                    style={{ background: "#3e8056" }}
                  />
                  すべてのサービスが正常稼働中
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
