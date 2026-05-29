"use client";

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

const ALERTS = [
  { text: "通報された投稿のレビュー",    sub: "木村 弘 の「チラシ配布」" },
  { text: "承認待ちタスク 5件",         sub: "最古: 2日前" },
  { text: "プレミアム承認待ち 1件",      sub: "佐藤 一郎" },
];

const QUICK_ACTIONS = [
  { icon: "◉", label: "お知らせを配信",   variant: "primary"  as const },
  { icon: "+", label: "投票を作成",         variant: "outline" as const },
  { icon: "◈", label: "トークンを発行",     variant: "outline" as const },
  { icon: "✉", label: "メンバーを招待",    variant: "outline" as const },
];

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex-none flex items-center gap-4 px-6 py-3.5 border-b border-[#dedee5]">
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] text-[#9a9aa0] font-mono mb-1">HOME</div>
          <div className="text-[17px] font-bold leading-tight">ダッシュボード</div>
          <div className="text-[11px] text-[#9a9aa0] mt-0.5">
            新富商店街コミュニティ ・ 全体の動向
          </div>
        </div>
        <AdminBtn variant="ghost" icon="↓">CSV書き出し</AdminBtn>
        <AdminBtn variant="outline" icon="🕒">期間: 今週</AdminBtn>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa] p-5">
        <div className="flex flex-col gap-4">

          {/* Stats row */}
          <div className="flex gap-3">
            <StatCard label="メンバー"    value="312"    delta="+8"   sub="今週" />
            <StatCard label="DAU"         value="94"     delta="+12%" sub="先週比" />
            <StatCard label="チェックイン" value="248"   delta="+18%" sub="今週" />
            <StatCard label="完了タスク"  value="42"     delta="+6"   sub="今週" />
            <StatCard label="トークン流通" value="58,420" delta="2.1%" deltaTone="flat" sub="DAO" />
            <StatCard label="未対応の通報" value="3"     delta="要対応" deltaTone="down" sub="モデレ" />
          </div>

          {/* 2-col */}
          <div className="flex gap-4">

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
                  <span className="text-[11px] text-[#525261]">
                    すべて見る →
                  </span>
                </div>
                <div>
                  {ACTIVITIES.map((a, i) => (
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

            {/* Right: alerts + quick actions + system */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">

              {/* Alerts */}
              <div
                className="p-4 rounded-[10px] border"
                style={{
                  borderColor: "#6666ff",
                  background: "#f0f0ff",
                }}
              >
                <div className="text-[11px] text-[#6666ff] font-mono font-bold mb-2">
                  要対応 · 3件
                </div>
                {ALERTS.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 py-2 border-t border-[#dedee5] first:border-t-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold">{a.text}</div>
                      <div className="text-[10.5px] text-[#525261] mt-0.5">
                        {a.sub}
                      </div>
                    </div>
                    <span className="text-[13px] text-[#6666ff]">›</span>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
                <div className="text-[11px] text-[#9a9aa0] font-mono mb-2.5">
                  クイックアクション
                </div>
                <div className="flex flex-col gap-1.5">
                  {QUICK_ACTIONS.map((q) => (
                    <AdminBtn key={q.label} variant={q.variant} icon={q.icon}>
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
