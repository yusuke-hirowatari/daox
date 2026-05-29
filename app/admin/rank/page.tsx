"use client";

import { Avatar } from "@/components/atoms/Avatar";
import { AdminBtn, AdminPill, AdminPageShell } from "@/components/admin/atoms";

// ─── Module-level atoms ───────────────────────────────────────────────────

function ConditionRow({
  label,
  valueLabel,
  value,
  unit,
}: {
  label: string;
  valueLabel: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 border border-[#dedee5] rounded-lg bg-[#f1f1f5] mb-2">
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold">{label}</div>
        <div className="text-[10px] text-[#9a9aa0] mt-0.5">{valueLabel}</div>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 border-[1.5px] border-[#1a1a1a] rounded-md bg-white font-mono font-bold text-[14px]">
        <span className="text-[11px] text-[#9a9aa0]">−</span>
        {value}
        <span className="text-[11px] text-[#9a9aa0]">+</span>
      </div>
      <span className="text-[11px] text-[#525261] min-w-[56px]">{unit}</span>
      <span className="text-[#9a9aa0] cursor-pointer">⋯</span>
    </div>
  );
}

function BenefitRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-2 bg-[#f1f1f5] rounded-md text-[11.5px]">
      <span className="text-[14px] text-[#6666ff]">{icon}</span>
      <span className="flex-1">{text}</span>
      <span className="text-[10px] text-[#9a9aa0] cursor-pointer">編集</span>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────

const NEAR_PREMIUM = [
  { who: "佐藤 一郎", tone: 2, ck: 9,  duties: 1, sub: "チェックイン あと 1回" },
  { who: "高橋 美咲", tone: 4, ck: 10, duties: 0, sub: "担い手活動 あと 1回" },
  { who: "木村 弘",   tone: 3, ck: 8,  duties: 0, sub: "チェックイン2 + 担い手1" },
  { who: "中島 健",   tone: 0, ck: 12, duties: 0, sub: "担い手活動 あと 1回" },
];

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminRankPage() {
  return (
    <AdminPageShell
      breadcrumbs="HOME › ランク条件"
      title="ランク条件"
      sub="ベーシック / プレミアム の判定条件"
      actions={
        <>
          <AdminBtn variant="outline">プレビュー</AdminBtn>
          <AdminBtn>保存</AdminBtn>
        </>
      }
    >
      <div className="p-5 flex gap-5" style={{ minHeight: "calc(100vh - 120px)" }}>

        {/* Left: tier cards */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Basic tier */}
          <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[22px] text-[#9a9aa0]">◇</span>
              <div className="flex-1">
                <div className="text-[14px] font-bold">ベーシック</div>
                <div className="text-[11px] text-[#9a9aa0]">全メンバーの初期ランク</div>
              </div>
              <AdminPill tone="muted">適用 280人</AdminPill>
            </div>
            <div className="text-[11.5px] text-[#525261] leading-[1.6]">
              加入時に自動で付与されます。条件はありません。
            </div>
          </div>

          {/* Premium tier */}
          <div className="flex-1 p-4 border-[1.5px] border-[#6666ff] rounded-[10px] bg-white flex flex-col">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="text-[22px] text-[#6666ff]">★</span>
              <div className="flex-1">
                <div className="text-[14px] font-bold">プレミアム</div>
                <div className="text-[11px] text-[#9a9aa0]">地域の担い手</div>
              </div>
              <AdminPill tone="open">適用 32人</AdminPill>
            </div>

            <div className="text-[11px] text-[#9a9aa0] font-mono tracking-[0.5px] mb-2">
              達成条件 (AND)
            </div>
            <ConditionRow
              label="チェックイン回数"
              valueLabel="今年の累計"
              value={10}
              unit="回以上"
            />
            <ConditionRow
              label="担い手活動の参加"
              valueLabel="今年の累計"
              value={1}
              unit="回以上"
            />
            <div className="mt-1 mb-4">
              <AdminBtn variant="ghost" icon="+">条件を追加</AdminBtn>
            </div>

            <div className="flex-1" />

            <div className="text-[11px] text-[#9a9aa0] font-mono tracking-[0.5px] mb-2">
              達成時の特典
            </div>
            <div className="flex flex-col gap-1.5">
              <BenefitRow icon="◈" text="500 DAO ボーナス付与" />
              <BenefitRow icon="✉" text="達成通知をプッシュ送信" />
              <BenefitRow icon="🏷" text="プロフィールに★バッジ表示" />
            </div>
          </div>
        </div>

        {/* Right: impact + near premium */}
        <div className="flex flex-col gap-3" style={{ width: 340 }}>
          {/* Impact preview */}
          <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
            <div className="text-[11px] text-[#9a9aa0] font-mono mb-2">
              変更による影響
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[22px] font-bold font-mono text-[#6666ff] leading-none pt-1">
                +12
              </span>
              <div className="flex-1 text-[11px] text-[#525261] leading-[1.5]">
                条件を緩めると <strong>12人</strong> が新たにプレミアム達成となります
              </div>
            </div>
          </div>

          {/* Near premium list */}
          <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white flex-1">
            <div className="text-[13px] font-bold mb-2.5">達成しそうな人</div>
            {NEAR_PREMIUM.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 py-2 border-t border-[#dedee5] first:border-t-0"
              >
                <Avatar size={24} label={p.who[0]} tone={p.tone} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold">{p.who}</div>
                  <div className="text-[10px] text-[#9a9aa0] mt-0.5">{p.sub}</div>
                </div>
                <span className="text-[10.5px] font-mono text-[#525261] flex-none">
                  {p.ck}/10 ・ {p.duties}/1
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
