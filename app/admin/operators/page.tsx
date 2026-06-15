"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { AdminBtn, AdminPill, AdminTable, AdminPageShell, type ColDef, type PillTone } from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

interface Operator {
  id:     string;
  name:   string;
  tone:   number;
  role:   string;
  email:  string;
  last:   string;
  status: string;
}

const OPERATORS: Operator[] = [
  { id: "o1", name: "田中 太郎",   tone: 0, role: "スーパー管理者", email: "tanaka@daox.app",  last: "今",      status: "有効"   },
  { id: "o2", name: "伊藤 さくら", tone: 1, role: "モデレーター",   email: "ito@daox.app",     last: "5分前",   status: "有効"   },
  { id: "o3", name: "運営事務局",  tone: 0, role: "スーパー管理者", email: "admin@daox.app",   last: "1時間前", status: "有効"   },
  { id: "o4", name: "佐藤 一郎",   tone: 2, role: "モデレーター",   email: "sato@daox.app",    last: "昨日",    status: "招待中" },
];

const COLS: ColDef[] = [
  { key: "name",   label: "運営者",       flex: 1.4, bold: true },
  { key: "role",   label: "ロール",       flex: 1 },
  { key: "email",  label: "メール",       flex: 1.4, mono: true, muted: true },
  { key: "last",   label: "最終ログイン", flex: 0.8, muted: true },
  { key: "status", label: "ステータス",   flex: 0.7 },
  { key: "act",    label: "",             flex: 0.4, align: "right" },
];

function buildRows(
  ops: Operator[],
  menuOpen: string | null,
  setMenuOpen: (id: string | null) => void,
  setOperators: React.Dispatch<React.SetStateAction<Operator[]>>,
  confirmSuspendId: string | null,
  setConfirmSuspendId: (id: string | null) => void,
): Record<string, ReactNode>[] {
  return ops.map((o) => ({
    name:   (
      <span className="inline-flex items-center gap-2">
        <Avatar size={22} label={o.name[0]} tone={o.tone} />
        {o.name}
      </span>
    ),
    role:   <AdminPill tone={o.role === "スーパー管理者" ? "info" : "default" as PillTone}>{o.role}</AdminPill>,
    email:  o.email,
    last:   o.last,
    status: <AdminPill tone={o.status === "有効" ? "success" : "warn" as PillTone}>{o.status}</AdminPill>,
    act: (
      <div className="relative">
        {confirmSuspendId === o.id ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-red-600 font-semibold whitespace-nowrap">停止しますか？</span>
            <button onClick={() => { setOperators(prev => prev.map(op => op.id === o.id ? {...op, status: "停止"} : op)); setConfirmSuspendId(null); }} className="text-[10px] px-2 py-1 bg-red-600 text-white rounded font-semibold">確認</button>
            <button onClick={() => setConfirmSuspendId(null)} className="text-[10px] px-2 py-1 bg-[#f1f1f5] rounded font-semibold">キャンセル</button>
          </div>
        ) : (
          <>
            <button
              className="text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]"
              onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === o.id ? null : o.id); }}
            >
              ⋯
            </button>
            {menuOpen === o.id && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#dedee5] rounded-lg shadow-lg z-20 py-1">
                <button
                  className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
                  onClick={() => {
                    const newRole = o.role === "スーパー管理者" ? "モデレーター" : "スーパー管理者";
                    setOperators(prev => prev.map(op => op.id === o.id ? {...op, role: newRole} : op));
                    setMenuOpen(null);
                  }}
                >
                  権限を変更
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-[12px] text-[#6666ff] hover:bg-[#f1f1f5]"
                  onClick={() => {
                    setConfirmSuspendId(o.id);
                    setMenuOpen(null);
                  }}
                >
                  アクセスを停止
                </button>
              </div>
            )}
          </>
        )}
      </div>
    ),
  }));
}

// ─── Permission matrix ────────────────────────────────────────────────────

const PERMISSIONS = [
  { group: "ダッシュボード閲覧",      a: true,  b: true  },
  { group: "メンバー管理",            a: true,  b: true  },
  { group: "モデレーション",          a: true,  b: true  },
  { group: "お知らせ作成・配信",      a: true,  b: true  },
  { group: "タスク監視・介入",        a: true,  b: true  },
  { group: "トークン発行",            a: true,  b: false },
  { group: "ランク条件設定",          a: true,  b: false },
  { group: "運営者の招待・削除",      a: true,  b: false },
  { group: "コミュニティ設定",        a: true,  b: false },
  { group: "監査ログ閲覧",            a: true,  b: false },
];

function PermToggle({ on, label, onClick }: { on: boolean; label: string; onClick?: () => void }) {
  return (
    <span
      className="inline-flex items-center w-[26px] h-[18px] rounded-[9px] px-[2px] transition-all cursor-pointer"
      style={{ background: on ? "#1a1a1a" : "#e8e8f0", justifyContent: on ? "flex-end" : "flex-start" }}
      onClick={onClick}
    >
      <span
        className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-[7px] bg-white text-[8px] font-bold shadow-sm"
        style={{ color: on ? "#1a1a1a" : "#9a9aa0" }}
      >
        {label}
      </span>
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminOperatorsPage() {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [operators, setOperators] = useState<Operator[]>(OPERATORS);
  const [confirmSuspendId, setConfirmSuspendId] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [invEmail, setInvEmail] = useState("");
  const [invRole, setInvRole] = useState("モデレーター");
  const [invSent, setInvSent] = useState(false);
  const [permissions, setPermissions] = useState(PERMISSIONS);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  const rows = buildRows(operators, menuOpen, setMenuOpen, setOperators, confirmSuspendId, setConfirmSuspendId);

  return (
    <AdminPageShell
      breadcrumbs="HOME › 運営者"
      title="運営者"
      sub="スーパー管理者 2 ・ モデレーター 2"
      actions={<AdminBtn icon="✉" onClick={() => setInviting(true)}>運営者を招待</AdminBtn>}
    >
      <div className="p-5 flex flex-wrap gap-5" style={{ minHeight: "calc(100vh - 120px)" }}>

        {inviting && (
          <div className="w-full border-[1.5px] border-[#6666ff] rounded-[10px] bg-white p-4 mb-0">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[14px] font-bold">運営者を招待</div>
              <button onClick={() => { setInviting(false); setInvEmail(""); setInvSent(false); }} className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[18px] leading-none">×</button>
            </div>
            {invSent ? (
              <div className="text-[12.5px] text-[#2d7a4a] font-semibold py-2">&#10003; {invEmail} に招待を送信しました</div>
            ) : (
              <div className="flex items-end gap-3 flex-wrap">
                <div>
                  <div className="text-[11px] font-semibold text-[#525261] mb-1">メールアドレス</div>
                  <input type="email" className="h-9 w-[280px] px-3 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]" placeholder="operator@example.com" value={invEmail} onChange={(e) => setInvEmail(e.target.value)} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#525261] mb-1">ロール</div>
                  <select className="h-9 px-3 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff] bg-white" value={invRole} onChange={(e) => setInvRole(e.target.value)}>
                    <option value="モデレーター">モデレーター</option>
                    <option value="スーパー管理者">スーパー管理者</option>
                  </select>
                </div>
                <button
                  className="h-9 px-4 rounded-md bg-[#1a1a1a] text-white text-[12px] font-semibold disabled:opacity-30"
                  disabled={!invEmail.trim() || !invEmail.includes("@")}
                  onClick={() => setInvSent(true)}
                >
                  招待を送信
                </button>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="flex-1 min-w-0">
          <AdminTable cols={COLS} rows={rows} rowHeight={48} />
        </div>

        {/* Permission matrix */}
        <div className="flex-none" style={{ width: 320 }}>
          <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
            <div className="text-[13px] font-bold mb-3">ロール権限</div>
            {permissions.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 py-[7px] border-b border-[#dedee5] last:border-b-0 text-[11.5px]"
              >
                <span className="flex-1 text-[#525261]">{p.group}</span>
                <PermToggle on={p.a} label="A" onClick={() => setPermissions(prev => prev.map((pp, j) => j === i ? { ...pp, a: !pp.a } : pp))} />
                <PermToggle on={p.b} label="B" onClick={() => setPermissions(prev => prev.map((pp, j) => j === i ? { ...pp, b: !pp.b } : pp))} />
              </div>
            ))}
            <div className="mt-2.5 p-2 bg-[#f1f1f5] rounded-md text-[10px] text-[#525261] leading-[1.5]">
              <strong>A</strong>=スーパー管理者 / <strong>B</strong>=モデレーター
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
