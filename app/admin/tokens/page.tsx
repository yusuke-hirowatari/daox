"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { StatCard, AdminBtn, AdminPill, AdminTable, BarChart, AdminPageShell, type ColDef } from "@/components/admin/atoms";

// ─── Tabs ────────────────────────────────────────────────────────────────

type Tab = "トークン経済" | "ランク条件";
const TABS: Tab[] = ["トークン経済", "ランク条件"];

// ─── Tokens Data ─────────────────────────────────────────────────────────

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

// ─── Rank Data ───────────────────────────────────────────────────────────

const NEAR_PREMIUM = [
  { who: "佐藤 一郎", tone: 2, ck: 9,  duties: 1, sub: "チェックイン あと 1回" },
  { who: "高橋 美咲", tone: 4, ck: 10, duties: 0, sub: "担い手活動 あと 1回" },
  { who: "木村 弘",   tone: 3, ck: 8,  duties: 0, sub: "チェックイン2 + 担い手1" },
  { who: "中島 健",   tone: 0, ck: 12, duties: 0, sub: "担い手活動 あと 1回" },
];

// ─── Rank Components ─────────────────────────────────────────────────────

function ConditionRow({
  id,
  label,
  valueLabel,
  value,
  unit,
  menuOpen,
  setMenuOpen,
  onEdit,
  onDelete,
  editing,
  editValue,
  setEditValue,
  editUnit,
  setEditUnit,
  onSaveEdit,
  onCancelEdit,
  confirmDeleteId,
  setConfirmDeleteId,
}: {
  id: string;
  label: string;
  valueLabel: string;
  value: number;
  unit: string;
  menuOpen: string | null;
  setMenuOpen: (id: string | null) => void;
  onEdit: () => void;
  onDelete: () => void;
  editing: boolean;
  editValue: string;
  setEditValue: (v: string) => void;
  editUnit: string;
  setEditUnit: (v: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 border border-[#dedee5] rounded-lg bg-[#f1f1f5] mb-2">
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold">{label}</div>
        <div className="text-[10px] text-[#9a9aa0] mt-0.5">{valueLabel}</div>
      </div>
      {confirmDeleteId === id ? (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-red-600 font-semibold">削除しますか？</span>
          <button onClick={() => { onDelete(); setConfirmDeleteId(null); }} className="text-[10px] px-2 py-1 bg-red-600 text-white rounded font-semibold">確認</button>
          <button onClick={() => setConfirmDeleteId(null)} className="text-[10px] px-2 py-1 bg-[#f1f1f5] rounded font-semibold">キャンセル</button>
        </div>
      ) : editing ? (
        <>
          <input
            type="number"
            className="w-[60px] px-2 py-1 border border-[#6666ff] rounded text-[14px] font-mono font-bold text-center outline-none"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <input
            className="w-[80px] px-2 py-1 border border-[#6666ff] rounded text-[11px] outline-none"
            value={editUnit}
            onChange={(e) => setEditUnit(e.target.value)}
          />
          <button
            className="text-[11px] text-[#6666ff] font-semibold cursor-pointer hover:underline"
            onClick={onSaveEdit}
          >
            保存
          </button>
          <button
            className="text-[11px] text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]"
            onClick={onCancelEdit}
          >
            取消
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-1.5 px-2.5 py-1 border-[1.5px] border-[#1a1a1a] rounded-md bg-white font-mono font-bold text-[14px]">
            <span className="text-[11px] text-[#9a9aa0]">−</span>
            {value}
            <span className="text-[11px] text-[#9a9aa0]">+</span>
          </div>
          <span className="text-[11px] text-[#525261] min-w-[56px]">{unit}</span>
          <div className="relative">
            <button
              className="text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]"
              onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === id ? null : id); }}
            >
              ⋯
            </button>
            {menuOpen === id && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#dedee5] rounded-lg shadow-lg z-20 py-1">
                <button
                  className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
                  onClick={() => { onEdit(); setMenuOpen(null); }}
                >
                  編集
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-[12px] text-[#6666ff] hover:bg-[#f1f1f5]"
                  onClick={() => { setConfirmDeleteId(id); setMenuOpen(null); }}
                >
                  削除
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function BenefitRow({
  icon,
  text,
  editing,
  editText,
  setEditText,
  onToggleEdit,
}: {
  icon: string;
  text: string;
  editing: boolean;
  editText: string;
  setEditText: (v: string) => void;
  onToggleEdit: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-2 bg-[#f1f1f5] rounded-md text-[11.5px]">
      <span className="text-[14px] text-[#6666ff]">{icon}</span>
      {editing ? (
        <input
          className="flex-1 px-2 py-0.5 border border-[#6666ff] rounded text-[11.5px] outline-none"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
        />
      ) : (
        <span className="flex-1">{text}</span>
      )}
      <button
        className="text-[10px] text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]"
        onClick={onToggleEdit}
      >
        {editing ? "保存" : "編集"}
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────

export default function AdminTokensPage() {
  const [activeTab, setActiveTab] = useState<Tab>("トークン経済");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // ── Token issuance state ──
  const [issuing, setIssuing] = useState(false);
  const [issueReason, setIssueReason] = useState("");
  const [issueAmount, setIssueAmount] = useState("");
  const [issueTarget, setIssueTarget] = useState("");
  const [issuances, setIssuances] = useState(ISSUANCES);

  // ── Rewards state ──
  const [rewards, setRewards] = useState(REWARDS);
  const [editingReward, setEditingReward] = useState<number | null>(null);
  const [editAmt, setEditAmt] = useState("");
  const [editFreq, setEditFreq] = useState("");

  // ── Conditions state ──
  const [conditions, setConditions] = useState([
    { id: "cond-checkin", label: "チェックイン回数", valueLabel: "今年の累計", value: 10, unit: "回以上" },
    { id: "cond-duty", label: "担い手活動の参加", valueLabel: "今年の累計", value: 1, unit: "回以上" },
  ]);
  const [editingCondition, setEditingCondition] = useState<string | null>(null);
  const [editCondValue, setEditCondValue] = useState("");
  const [editCondUnit, setEditCondUnit] = useState("");

  // ── Add condition state ──
  const [addingCondition, setAddingCondition] = useState(false);
  const [newCondLabel, setNewCondLabel] = useState("");
  const [newCondValue, setNewCondValue] = useState("");
  const [newCondUnit, setNewCondUnit] = useState("");

  // ── Benefits state ──
  const [benefits, setBenefits] = useState([
    { icon: "◈", text: "500 DAO ボーナス付与" },
    { icon: "✉", text: "達成通知をプッシュ送信" },
    { icon: "🏷", text: "プロフィールに★バッジ表示" },
  ]);
  const [editingBenefit, setEditingBenefit] = useState<number | null>(null);
  const [editBenefitText, setEditBenefitText] = useState("");

  // ── Rank save / preview state ──
  const [rankSaved, setRankSaved] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // ── Build reward rows (now uses state) ──
  const rows: Record<string, ReactNode>[] = rewards.map((r, idx) => ({
    trigger: r.trigger,
    amt: editingReward === idx ? (
      <input className="w-24 px-1.5 py-0.5 border border-[#6666ff] rounded text-[11px] font-mono" value={editAmt} onChange={(e) => setEditAmt(e.target.value)} />
    ) : (
      <span className="text-[#6666ff]">{r.amt} DAO</span>
    ),
    freq: editingReward === idx ? (
      <input className="w-32 px-1.5 py-0.5 border border-[#6666ff] rounded text-[11px]" value={editFreq} onChange={(e) => setEditFreq(e.target.value)} />
    ) : (
      r.freq
    ),
    edit: editingReward === idx ? (
      <button
        className="text-[#6666ff] text-[11px] cursor-pointer hover:text-[#1a1a1a] font-semibold"
        onClick={() => {
          setRewards(prev => prev.map((rw, i) => i === editingReward ? { ...rw, amt: editAmt, freq: editFreq } : rw));
          setEditingReward(null);
        }}
      >
        保存 ›
      </button>
    ) : (
      <button
        className="text-[#525261] text-[11px] cursor-pointer hover:text-[#1a1a1a]"
        onClick={() => { setEditingReward(idx); setEditAmt(r.amt); setEditFreq(r.freq); }}
      >
        編集 ›
      </button>
    ),
  }));

  // Close menu on outside click (for rank tab)
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  const sub = activeTab === "トークン経済"
    ? "DAOトークンの発行・流通・報酬ルール"
    : "ベーシック / プレミアム の判定条件";

  const actions = activeTab === "トークン経済" ? (
    <>
      <AdminBtn variant="outline" icon="↓" onClick={() => {
        const header = "日時,担当者,内容,金額,種別";
        const csvRows = issuances.map(a => [a.t, a.who, a.what, a.amt, a.kind].join(","));
        const csv = [header, ...csvRows].join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `token_history_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }}>発行履歴をダウンロード</AdminBtn>
      <AdminBtn icon="◈" onClick={() => setIssuing(true)}>トークンを発行</AdminBtn>
    </>
  ) : (
    <>
      <AdminBtn variant="outline" onClick={() => setPreviewing(prev => !prev)}>{previewing ? "プレビューを閉じる" : "プレビュー"}</AdminBtn>
      <AdminBtn onClick={() => { setRankSaved(true); setTimeout(() => setRankSaved(false), 2000); }}>{rankSaved ? "✓ 保存しました" : "保存"}</AdminBtn>
    </>
  );

  return (
    <AdminPageShell
      breadcrumbs="HOME › トークン・ランク"
      title="トークン・ランク"
      sub={sub}
      actions={actions}
    >
      <div className="p-3 md:p-5 flex flex-col gap-4">
        {/* Tab switcher */}
        <div className="flex bg-[#e8e8f0] rounded-lg p-0.5 gap-0.5 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`flex-none px-4 py-[5px] rounded-md text-[11.5px] font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white font-semibold shadow-sm"
                  : "text-[#7a7a84]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "トークン経済" ? (
          /* ── Tokens tab content ── */
          <>
            {/* Inline issuance form */}
            {issuing && (
              <div className="border-[1.5px] border-[#6666ff] rounded-[10px] bg-white p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[14px] font-bold">トークンを発行</div>
                  <button onClick={() => { setIssuing(false); setIssueReason(""); setIssueAmount(""); setIssueTarget(""); }} className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[18px] leading-none cursor-pointer">×</button>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-[#525261] mb-1">対象者</div>
                    <input className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]" placeholder="例: 田中 太郎" value={issueTarget} onChange={(e) => setIssueTarget(e.target.value)} />
                  </div>
                  <div className="flex gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-[#525261] mb-1">発行量 (DAO)</div>
                      <input className="w-[160px] px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] font-mono outline-none focus:border-[#6666ff]" placeholder="0" value={issueAmount} onChange={(e) => setIssueAmount(e.target.value)} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-semibold text-[#525261] mb-1">理由</div>
                      <input className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]" placeholder="例: 新規メンバー初回特典" value={issueReason} onChange={(e) => setIssueReason(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <AdminBtn disabled={!issueAmount.trim() || !issueTarget.trim()} onClick={() => {
                      const newIssuance = {
                        t: "たった今",
                        who: issueTarget,
                        what: issueReason || "手動発行",
                        amt: `+${issueAmount}`,
                        kind: "mint" as const,
                      };
                      setIssuances(prev => [newIssuance, ...prev]);
                      setIssuing(false);
                      setIssueReason("");
                      setIssueAmount("");
                      setIssueTarget("");
                    }}>発行する</AdminBtn>
                    <AdminBtn variant="outline" onClick={() => { setIssuing(false); setIssueReason(""); setIssueAmount(""); setIssueTarget(""); }}>キャンセル</AdminBtn>
                  </div>
                </div>
              </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="総流通量"   value="58,420" delta="+2.1%" sub="DAO" />
              <StatCard label="今週の発行" value="3,240"  delta="+18%"  sub="DAO" />
              <StatCard label="今週の取引" value="142"    delta="+12"   sub="件" />
              <StatCard label="平均保有"   value="187"    delta="+4"    sub="DAO/人" />
            </div>

            {/* 2-col */}
            <div className="flex flex-col md:flex-row gap-4">

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
                  {issuances.map((a, i) => (
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
          </>
        ) : (
          /* ── Rank tab content ── */
          <div className="flex flex-col md:flex-row gap-4 md:gap-5" style={{ minHeight: "calc(100vh - 220px)" }}>

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
                {conditions.map((c) => (
                  <ConditionRow
                    key={c.id}
                    id={c.id}
                    label={c.label}
                    valueLabel={c.valueLabel}
                    value={c.value}
                    unit={c.unit}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    editing={editingCondition === c.id}
                    editValue={editCondValue}
                    setEditValue={setEditCondValue}
                    editUnit={editCondUnit}
                    setEditUnit={setEditCondUnit}
                    onEdit={() => {
                      setEditingCondition(c.id);
                      setEditCondValue(String(c.value));
                      setEditCondUnit(c.unit);
                    }}
                    onDelete={() => {
                      setConditions(prev => prev.filter(cond => cond.id !== c.id));
                    }}
                    onSaveEdit={() => {
                      setConditions(prev => prev.map(cond =>
                        cond.id === c.id
                          ? { ...cond, value: parseInt(editCondValue) || 0, unit: editCondUnit }
                          : cond
                      ));
                      setEditingCondition(null);
                    }}
                    onCancelEdit={() => {
                      setEditingCondition(null);
                    }}
                    confirmDeleteId={confirmDeleteId}
                    setConfirmDeleteId={setConfirmDeleteId}
                  />
                ))}
                <div className="mt-1 mb-4">
                  {addingCondition ? (
                    <div className="border border-[#6666ff] rounded-lg p-3 mb-2">
                      <div className="text-[12px] font-semibold mb-2">新しい条件を追加</div>
                      <div className="flex gap-2 items-end flex-wrap">
                        <div>
                          <div className="text-[10px] text-[#9a9aa0] mb-1">条件名</div>
                          <input className="w-[180px] px-2 py-1.5 border border-[#dedee5] rounded text-[12px] outline-none focus:border-[#6666ff]" value={newCondLabel} onChange={(e) => setNewCondLabel(e.target.value)} placeholder="例: 投票参加回数" />
                        </div>
                        <div>
                          <div className="text-[10px] text-[#9a9aa0] mb-1">値</div>
                          <input type="number" className="w-[80px] px-2 py-1.5 border border-[#dedee5] rounded text-[12px] font-mono outline-none focus:border-[#6666ff]" value={newCondValue} onChange={(e) => setNewCondValue(e.target.value)} placeholder="5" />
                        </div>
                        <div>
                          <div className="text-[10px] text-[#9a9aa0] mb-1">単位</div>
                          <input className="w-[100px] px-2 py-1.5 border border-[#dedee5] rounded text-[12px] outline-none focus:border-[#6666ff]" value={newCondUnit} onChange={(e) => setNewCondUnit(e.target.value)} placeholder="回以上" />
                        </div>
                        <AdminBtn onClick={() => {
                          if (newCondLabel.trim()) {
                            setConditions(prev => [...prev, {
                              id: `cond-${Date.now()}`,
                              label: newCondLabel,
                              valueLabel: "今年の累計",
                              value: parseInt(newCondValue) || 0,
                              unit: newCondUnit || "回以上",
                            }]);
                            setAddingCondition(false);
                            setNewCondLabel("");
                            setNewCondValue("");
                            setNewCondUnit("");
                          }
                        }}>追加</AdminBtn>
                        <AdminBtn variant="ghost" onClick={() => setAddingCondition(false)}>キャンセル</AdminBtn>
                      </div>
                    </div>
                  ) : (
                    <AdminBtn variant="ghost" icon="+" onClick={() => setAddingCondition(true)}>条件を追加</AdminBtn>
                  )}
                </div>

                <div className="flex-1" />

                <div className="text-[11px] text-[#9a9aa0] font-mono tracking-[0.5px] mb-2">
                  達成時の特典
                </div>
                <div className="flex flex-col gap-1.5">
                  {benefits.map((b, idx) => (
                    <BenefitRow
                      key={idx}
                      icon={b.icon}
                      text={b.text}
                      editing={editingBenefit === idx}
                      editText={editBenefitText}
                      setEditText={setEditBenefitText}
                      onToggleEdit={() => {
                        if (editingBenefit === idx) {
                          setBenefits(prev => prev.map((ben, i) => i === idx ? { ...ben, text: editBenefitText } : ben));
                          setEditingBenefit(null);
                        } else {
                          setEditingBenefit(idx);
                          setEditBenefitText(b.text);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: impact + near premium */}
            <div className="flex flex-col gap-3 w-full md:w-[340px] md:flex-none">
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
        )}
      </div>
    </AdminPageShell>
  );
}
