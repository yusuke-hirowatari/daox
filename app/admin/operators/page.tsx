"use client";

import type { ReactNode } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { AdminBtn, AdminPill, AdminTable, AdminPageShell, type ColDef, type PillTone } from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

interface Operator {
  name:   string;
  tone:   number;
  role:   string;
  email:  string;
  last:   string;
  status: string;
}

const OPERATORS: Operator[] = [
  { name: "田中 太郎",   tone: 0, role: "スーパー管理者", email: "tanaka@daox.app",  last: "今",      status: "有効"   },
  { name: "伊藤 さくら", tone: 1, role: "モデレーター",   email: "ito@daox.app",     last: "5分前",   status: "有効"   },
  { name: "運営事務局",  tone: 0, role: "スーパー管理者", email: "admin@daox.app",   last: "1時間前", status: "有効"   },
  { name: "佐藤 一郎",   tone: 2, role: "モデレーター",   email: "sato@daox.app",    last: "昨日",    status: "招待中" },
];

const COLS: ColDef[] = [
  { key: "name",   label: "運営者",       flex: 1.4, bold: true },
  { key: "role",   label: "ロール",       flex: 1 },
  { key: "email",  label: "メール",       flex: 1.4, mono: true, muted: true },
  { key: "last",   label: "最終ログイン", flex: 0.8, muted: true },
  { key: "status", label: "ステータス",   flex: 0.7 },
  { key: "act",    label: "",             flex: 0.4, align: "right" },
];

function buildRows(ops: Operator[]): Record<string, ReactNode>[] {
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
    act:    <span className="text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]">⋯</span>,
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

function PermToggle({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center justify-end w-[26px] h-[18px] rounded-[9px] px-[2px] transition-all"
      style={{ background: on ? "#1a1a1a" : "#e8e8f0" }}
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
  const rows = buildRows(OPERATORS);

  return (
    <AdminPageShell
      breadcrumbs="HOME › 運営者"
      title="運営者"
      sub="スーパー管理者 2 ・ モデレーター 2"
      actions={<AdminBtn icon="✉">運営者を招待</AdminBtn>}
    >
      <div className="p-5 flex gap-5" style={{ minHeight: "calc(100vh - 120px)" }}>

        {/* Table */}
        <div className="flex-1 min-w-0">
          <AdminTable cols={COLS} rows={rows} rowHeight={48} />
        </div>

        {/* Permission matrix */}
        <div className="flex-none" style={{ width: 320 }}>
          <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white">
            <div className="text-[13px] font-bold mb-3">ロール権限</div>
            {PERMISSIONS.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 py-[7px] border-b border-[#dedee5] last:border-b-0 text-[11.5px]"
              >
                <span className="flex-1 text-[#525261]">{p.group}</span>
                <PermToggle on={p.a} label="A" />
                <PermToggle on={p.b} label="B" />
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
