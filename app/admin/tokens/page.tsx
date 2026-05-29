"use client";

import type { ReactNode } from "react";
import { StatCard, AdminBtn, AdminPill, AdminTable, BarChart, AdminPageShell, type ColDef } from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

const FLOW_DATA = [40, 52, 48, 65, 72, 88, 94].map((v, i) => ({
  k: ["月", "火", "水", "木", "金", "土", "日"][i],
  v,
  hi: i === 6,
}));

const ISSUANCES = [
  { t: "今日 09:20", who: "田中 太郎", what: "新規メンバー初回特典 (5人)", amt: "+250",   kind: "mint" as const },
  { t: "昨日 18:00", who: "田中 太郎", what: "夏祭り運営ボーナス",         amt: "+1,200", kind: "mint" as const },
  { t: "5/22",       who: "伊藤 さくら", what: "タスクの金額上書き承認",   amt: "+150",   kind: "adj"  as const },
  { t: "5/20",       who: "田中 太郎", what: "誤発行の修正",               amt: "-80",    kind: "burn" as const },
];

const REWARDS = [
  { trigger: "チェックイン",           amt: "+10",      freq: "1日1店舗まで"  },
  { trigger: "投票参加",               amt: "+5",       freq: "1投票あたり"  },
  { trigger: "タスク完了 (短)",        amt: "+30〜120", freq: "内容に応じて"  },
  { trigger: "お仕事完了 (一般)",      amt: "+50〜200", freq: "依頼内容次第"  },
  { trigger: "新メンバー紹介",         amt: "+100",     freq: "紹介者にも還元" },
  { trigger: "プレミアム達成ボーナス", amt: "+500",     freq: "1回のみ"      },
  { trigger: "担い手活動",             amt: "+30〜120", freq: "主催から付与"  },
];

const REWARD_COLS: ColDef[] = [
  { key: "trigger", label: "トリガー",  flex: 1.5, bold: true },
  { key: "amt",     label: "報酬",      flex: 1,   mono: true, bold: true },
  { key: "freq",    label: "上限/頻度", flex: 1.5, muted: true },
  { key: "edit",    label: "",          flex: 0.5, align: "right" },
];

function buildRewardRows(): Record<string, ReactNode>[] {
  return REWARDS.map((r) => ({
    trigger: r.trigger,
    amt:     <span className="text-[#6666ff]">{r.amt} DAO</span>,
    freq:    r.freq,
    edit:    <span className="text-[#525261] text-[11px] cursor-pointer hover:text-[#1a1a1a]">編集 ›</span>,
  }));
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminTokensPage() {
  const rows = buildRewardRows();

  return (
    <AdminPageShell
      breadcrumbs="HOME › トークン経済"
      title="トークン経済"
      sub="DAOトークンの発行・流通・報酬ルール"
      actions={
        <>
          <AdminBtn variant="outline" icon="↓">発行履歴をダウンロード</AdminBtn>
          <AdminBtn icon="◈">トークンを発行</AdminBtn>
        </>
      }
    >
      <div className="p-5 flex flex-col gap-4">
        {/* KPIs */}
        <div className="flex gap-3">
          <StatCard label="総流通量"   value="58,420" delta="+2.1%" sub="DAO" />
          <StatCard label="今週の発行" value="3,240"  delta="+18%"  sub="DAO" />
          <StatCard label="今週の取引" value="142"    delta="+12"   sub="件" />
          <StatCard label="平均保有"   value="187"    delta="+4"    sub="DAO/人" />
        </div>

        {/* 2-col */}
        <div className="flex gap-4">

          {/* Left: chart + recent issuances */}
          <div className="flex-[1.2] flex flex-col gap-4 min-w-0">
            <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
              <div className="text-[11px] text-[#9a9aa0] font-mono mb-0.5">
                WEEKLY VOLUME
              </div>
              <div className="text-[14px] font-bold mb-3">日別取引量 (DAO)</div>
              <BarChart data={FLOW_DATA} height={140} />
            </div>

            <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
              <div className="text-[14px] font-bold mb-2.5">最近の発行・調整</div>
              {ISSUANCES.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 py-2 border-b border-[#dedee5] last:border-b-0"
                >
                  <span className="w-[70px] text-[10px] text-[#9a9aa0] font-mono flex-none">
                    {a.t}
                  </span>
                  <AdminPill
                    tone={
                      a.kind === "mint" ? "success" : a.kind === "burn" ? "warn" : "info"
                    }
                  >
                    {a.kind === "mint" ? "発行" : a.kind === "burn" ? "焼却" : "調整"}
                  </AdminPill>
                  <span className="flex-1 text-[11.5px] min-w-0 truncate">{a.what}</span>
                  <span className="text-[10px] text-[#9a9aa0] flex-none">by {a.who}</span>
                  <span
                    className={`text-[12px] font-bold font-mono flex-none min-w-[56px] text-right ${
                      a.amt.startsWith("+") ? "text-[#6666ff]" : "text-[#525261]"
                    }`}
                  >
                    {a.amt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: reward table */}
          <div className="flex-1 flex flex-col p-4 border border-[#dedee5] rounded-[10px] bg-white min-w-0 overflow-hidden">
            <div className="flex items-center mb-2.5">
              <div className="flex-1 text-[14px] font-bold">報酬テーブル</div>
              <span className="text-[10.5px] text-[#9a9aa0]">変更は即時反映</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <AdminTable cols={REWARD_COLS} rows={rows} rowHeight={36} />
            </div>
            <div className="mt-2.5 p-2.5 bg-[#f1f1f5] rounded-md text-[10.5px] text-[#525261] leading-[1.5]">
              ※ 変更すると未来のトリガーから適用されます。既存の取引には影響しません。
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
