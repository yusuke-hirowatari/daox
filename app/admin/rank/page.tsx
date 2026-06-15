"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { AdminBtn, AdminPill, AdminPageShell } from "@/components/admin/atoms";

// ─── Module-level atoms ───────────────────────────────────────────────────

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
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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
          <button onClick={() => { onDelete?.(id); setConfirmDeleteId(null); }} className="text-[10px] px-2 py-1 bg-red-600 text-white rounded font-semibold">確認</button>
          <button onClick={() => setConfirmDeleteId(null)} className="text-[10px] px-2 py-1 bg-[#f1f1f5] rounded font-semibold">キャンセル</button>
        </div>
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
                  onClick={() => { onEdit?.(id); setMenuOpen(null); }}
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
  onStartEdit,
  onEditChange,
  onSave,
}: {
  icon: string;
  text: string;
  editing?: boolean;
  editText?: string;
  onStartEdit?: () => void;
  onEditChange?: (val: string) => void;
  onSave?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-2 bg-[#f1f1f5] rounded-md text-[11.5px]">
      <span className="text-[14px] text-[#6666ff]">{icon}</span>
      {editing ? (
        <input
          className="flex-1 px-2 py-1 border border-[#6666ff] rounded text-[11.5px] outline-none"
          value={editText ?? ""}
          onChange={(e) => onEditChange?.(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSave?.(); }}
          autoFocus
        />
      ) : (
        <span className="flex-1">{text}</span>
      )}
      <button
        className="text-[10px] text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]"
        onClick={() => { if (editing) { onSave?.(); } else { onStartEdit?.(); } }}
      >
        {editing ? "保存" : "編集"}
      </button>
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
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [rankSaved, setRankSaved] = useState(false);

  const [conditions, setConditions] = useState([
    { id: "cond-checkin", label: "チェックイン回数", valueLabel: "今年の累計", value: 10, unit: "回以上" },
    { id: "cond-duty", label: "担い手活動の参加", valueLabel: "今年の累計", value: 1, unit: "回以上" },
  ]);

  const [addingCondition, setAddingCondition] = useState(false);
  const [newCondLabel, setNewCondLabel] = useState("");
  const [newCondValue, setNewCondValue] = useState("");
  const [newCondUnit, setNewCondUnit] = useState("");

  const [benefits, setBenefits] = useState([
    { icon: "◈", text: "500 DAO ボーナス付与" },
    { icon: "✉", text: "達成通知をプッシュ送信" },
    { icon: "🏷", text: "プロフィールに★バッジ表示" },
  ]);
  const [editingBenefit, setEditingBenefit] = useState<number | null>(null);
  const [editBenefitText, setEditBenefitText] = useState("");

  const [editingCondition, setEditingCondition] = useState<string | null>(null);
  const [editCondValue, setEditCondValue] = useState(0);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  return (
    <AdminPageShell
      breadcrumbs="HOME › ランク条件"
      title="ランク条件"
      sub="ベーシック / プレミアム の判定条件"
      actions={
        <>
          <AdminBtn variant="outline" onClick={() => setPreviewing(prev => !prev)}>{previewing ? "プレビューを閉じる" : "プレビュー"}</AdminBtn>
          <AdminBtn onClick={() => { setRankSaved(true); setTimeout(() => setRankSaved(false), 2000); }}>{rankSaved ? "✓ 保存しました" : "保存"}</AdminBtn>
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
            {conditions.map(c => (
              editingCondition === c.id ? (
                <div key={c.id} className="flex items-center gap-3 p-3 border border-[#6666ff] rounded-lg bg-white mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold">{c.label}</div>
                    <div className="text-[10px] text-[#9a9aa0] mt-0.5">{c.valueLabel}</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 border-[1.5px] border-[#6666ff] rounded-md bg-white font-mono font-bold text-[14px]">
                    <button className="text-[11px] text-[#6666ff] cursor-pointer" onClick={() => setEditCondValue(v => Math.max(0, v - 1))}>−</button>
                    {editCondValue}
                    <button className="text-[11px] text-[#6666ff] cursor-pointer" onClick={() => setEditCondValue(v => v + 1)}>+</button>
                  </div>
                  <span className="text-[11px] text-[#525261] min-w-[56px]">{c.unit}</span>
                  <AdminBtn onClick={() => { setConditions(prev => prev.map(x => x.id === c.id ? { ...x, value: editCondValue } : x)); setEditingCondition(null); }}>確定</AdminBtn>
                  <AdminBtn variant="ghost" onClick={() => setEditingCondition(null)}>取消</AdminBtn>
                </div>
              ) : (
                <ConditionRow
                  key={c.id}
                  id={c.id}
                  label={c.label}
                  valueLabel={c.valueLabel}
                  value={c.value}
                  unit={c.unit}
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  onEdit={(id) => { const cond = conditions.find(x => x.id === id); if (cond) { setEditCondValue(cond.value); setEditingCondition(id); } }}
                  onDelete={(id) => setConditions(prev => prev.filter(x => x.id !== id))}
                  confirmDeleteId={confirmDeleteId}
                  setConfirmDeleteId={setConfirmDeleteId}
                />
              )
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
                        setConditions(prev => [...prev, { id: `cond-${Date.now()}`, label: newCondLabel, valueLabel: "今年の累計", value: parseInt(newCondValue) || 0, unit: newCondUnit || "回以上" }]);
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
              {benefits.map((b, i) => (
                <BenefitRow
                  key={i}
                  icon={b.icon}
                  text={b.text}
                  editing={editingBenefit === i}
                  editText={editBenefitText}
                  onStartEdit={() => { setEditingBenefit(i); setEditBenefitText(b.text); }}
                  onEditChange={setEditBenefitText}
                  onSave={() => { setBenefits(prev => prev.map((x, j) => j === i ? { ...x, text: editBenefitText } : x)); setEditingBenefit(null); }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: impact + near premium */}
        <div className="flex flex-col gap-3" style={{ width: 340 }}>
          {/* Impact preview */}
          <div className={`p-4 border rounded-[10px] bg-white transition-all ${previewing ? "border-[#6666ff] ring-2 ring-[#6666ff]/20" : "border-[#dedee5]"}`}>
            <div className="text-[11px] text-[#9a9aa0] font-mono mb-2">
              変更による影響 {previewing && <span className="text-[#6666ff] font-semibold ml-1">プレビュー中</span>}
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
          <div className={`p-4 border rounded-[10px] bg-white flex-1 transition-all ${previewing ? "border-[#6666ff] ring-2 ring-[#6666ff]/20" : "border-[#dedee5]"}`}>
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
