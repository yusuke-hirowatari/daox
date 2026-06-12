"use client";

import { useState } from "react";
import { BarChart, MiniSpark, AdminBtn, AdminPageShell } from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

const DAU_30 = [22, 18, 24, 28, 32, 25, 31, 35, 30, 28, 38, 42, 36, 40, 45,
                48, 44, 50, 52, 48, 55, 58, 54, 62, 65, 68, 64, 72, 78, 94];

const NEW_USERS = [1, 0, 2, 1, 3, 0, 1, 2, 1, 0, 4, 2, 1, 3, 2, 1, 5, 2, 1, 2,
                   3, 4, 2, 5, 3, 2, 4, 3, 5, 8];

const KPI_CARDS = [
  { k: "DAU",         v: "94",   delta: "+12%", spark: DAU_30.slice(-14) },
  { k: "MAU",         v: "287",  delta: "+5%",  spark: DAU_30.map((v, i) => i < 14 ? v - 4 : v) },
  { k: "新規参加",    v: "8",    delta: "+33%", spark: NEW_USERS.slice(-14) },
  { k: "リテンション", v: "78%", delta: "+3pt", spark: [70, 72, 74, 73, 75, 77, 78] },
  { k: "平均投稿/週", v: "14",   delta: "+2",   spark: [8, 10, 9, 12, 11, 13, 14] },
];

const ENGAGEMENTS = [
  { k: "チェックイン", v: 248, max: 300 },
  { k: "タスク参加",   v: 142, max: 300 },
  { k: "掲示板投稿",   v: 56,  max: 300 },
  { k: "DM送信",       v: 312, max: 400 },
  { k: "投票参加",     v: 198, max: 300 },
];

const POPULAR_TAGS = [
  { t: "お仕事",   n: 28 },
  { t: "イベント", n: 22 },
  { t: "物々交換", n: 18 },
  { t: "相談",     n: 12 },
  { t: "飲食",     n: 10 },
  { k: "カフェ",   n: 8 } as { t?: string; k?: string; n: number },
  { t: "農家",     n: 6 },
  { t: "雑談",     n: 5 },
  { t: "デザイン", n: 4 },
];

const CHART_TABS = ["DAU", "WAU", "MAU"] as const;

// ─── Module-level atoms ───────────────────────────────────────────────────

function KPICard({ label, value, delta, spark }: {
  label: string;
  value: string;
  delta: string;
  spark: number[];
}) {
  return (
    <div className="flex-1 min-w-0 px-3.5 py-3 border border-[#dedee5] rounded-[10px] bg-white">
      <div className="text-[10.5px] text-[#9a9aa0] font-mono tracking-[0.5px]">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-[22px] font-bold font-mono tracking-[-0.5px]">
          {value}
        </span>
        <span className="text-[10px] text-[#3e8056] font-semibold font-mono">
          ↑ {delta}
        </span>
      </div>
      <div className="mt-1">
        <MiniSpark values={spark} width={150} height={22} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = ["過去7日", "過去30日", "過去90日", "全期間"] as const;

export default function AdminAnalyticsPage() {
  const [chartTab, setChartTab] = useState(0);
  const [periodIdx, setPeriodIdx] = useState(1); // default "過去30日"

  const barData = DAU_30.map((v, i) => ({
    k: i % 5 === 0 ? `${i + 1}` : "",
    v,
  }));

  return (
    <AdminPageShell
      breadcrumbs="HOME › 分析"
      title="分析"
      sub="コミュニティのエンゲージメントとグロース"
      actions={
        <>
          <AdminBtn
            variant="outline"
            icon="🕒"
            onClick={() => setPeriodIdx((prev) => (prev + 1) % PERIOD_OPTIONS.length)}
          >
            期間: {PERIOD_OPTIONS[periodIdx]}
          </AdminBtn>
          <AdminBtn
            variant="outline"
            icon="↓"
            onClick={() => alert("分析レポートのダウンロードを開始しました（デモ）")}
          >
            レポート出力
          </AdminBtn>
        </>
      }
    >
      <div className="p-5 flex flex-col gap-4">

        {/* KPI cards */}
        <div className="flex gap-3">
          {KPI_CARDS.map((c) => (
            <KPICard
              key={c.k}
              label={c.k}
              value={c.v}
              delta={c.delta}
              spark={c.spark}
            />
          ))}
        </div>

        {/* Main chart */}
        <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
          <div className="flex items-center mb-2.5">
            <div className="flex-1">
              <div className="text-[11px] text-[#9a9aa0] font-mono">
                DAILY ACTIVE USERS
              </div>
              <div className="text-[14px] font-bold mt-0.5">DAU推移 (過去30日)</div>
            </div>
            <div className="flex gap-1.5">
              {CHART_TABS.map((t, i) => (
                <button
                  key={t}
                  className={[
                    "px-3 py-[4px] rounded-[999px] text-[11px] font-medium border transition-colors",
                    chartTab === i
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-white text-[#525261] border-[#dedee5] hover:border-[#9a9aa0]",
                  ].join(" ")}
                  onClick={() => setChartTab(i)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <BarChart data={barData} height={180} />
        </div>

        {/* Bottom split */}
        <div className="flex gap-4" style={{ height: 200 }}>
          {/* Engagement bars */}
          <div className="flex-1 p-4 border border-[#dedee5] rounded-[10px] bg-white">
            <div className="text-[13px] font-bold mb-2.5">機能別エンゲージメント</div>
            {ENGAGEMENTS.map((r) => (
              <div key={r.k} className="mb-2">
                <div className="flex text-[11px] mb-1">
                  <span className="flex-1 text-[#525261]">{r.k}</span>
                  <span className="font-mono">{r.v}</span>
                </div>
                <div className="h-1.5 bg-[#e8e8f0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1a1a1a] rounded-full"
                    style={{ width: `${(r.v / r.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Popular tags */}
          <div className="flex-1 p-4 border border-[#dedee5] rounded-[10px] bg-white overflow-y-auto">
            <div className="text-[13px] font-bold mb-2.5">人気タグ</div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-[6px] rounded-[14px] text-[11.5px] bg-[#f1f1f5] border border-[#dedee5]"
                >
                  {tag.t ?? tag.k}
                  <span className="text-[#9a9aa0] ml-1 font-mono">{tag.n}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
