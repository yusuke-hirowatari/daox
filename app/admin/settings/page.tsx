"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import {
  AdminBtn,
  AdminPill,
  AdminTable,
  AdminPageShell,
  type ColDef,
  type PillTone,
} from "@/components/admin/atoms";

// ─── Settings nav ─────────────────────────────────────────────────────────

type SettingsTab =
  | "profile"
  | "official"
  | "rules"
  | "notif"
  | "invite"
  | "brand"
  | "operators"
  | "audit"
  | "billing"
  | "danger";

interface NavItem {
  id: SettingsTab;
  label: string;
}

const NAV_GROUP_1: NavItem[] = [
  { id: "profile",  label: "プロフィール"  },
  { id: "official", label: "公式アカウント" },
  { id: "rules",    label: "ガイドライン"  },
  { id: "notif",    label: "通知設定"      },
  { id: "invite",   label: "招待・参加条件" },
  { id: "brand",    label: "ブランディング" },
];

const NAV_GROUP_2: NavItem[] = [
  { id: "operators", label: "運営者"   },
  { id: "audit",     label: "監査ログ" },
];

const NAV_GROUP_3: NavItem[] = [
  { id: "billing", label: "請求・プラン" },
  { id: "danger",  label: "危険な操作"  },
];

const ALL_TABS: NavItem[] = [...NAV_GROUP_1, ...NAV_GROUP_2, ...NAV_GROUP_3];

// ─── Form atoms (module-level) ────────────────────────────────────────────

function Field({
  label,
  sub,
  children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[18px]">
      <div className="text-[11.5px] font-semibold text-[#1a1a1a] mb-1">{label}</div>
      {sub && (
        <div className="text-[10.5px] text-[#9a9aa0] mb-1.5">{sub}</div>
      )}
      {children}
    </div>
  );
}

function FieldInput({
  value,
  onChange,
  prefix,
  mono,
}: {
  value: string;
  onChange?: (val: string) => void;
  prefix?: string;
  mono?: boolean;
}) {
  return (
    <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center bg-white text-[12.5px] focus-within:border-[#6666ff]">
      {prefix && (
        <span className="text-[#9a9aa0] font-mono mr-1">{prefix}</span>
      )}
      <input
        className={`flex-1 outline-none bg-transparent ${mono ? "font-mono" : ""}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

function FieldTextarea({ value, onChange }: { value: string; onChange?: (val: string) => void }) {
  return (
    <textarea
      className="min-h-[72px] border border-[#dedee5] rounded-md px-3 py-2.5 bg-white text-[12.5px] leading-[1.55] text-[#1a1a1a] w-full outline-none focus:border-[#6666ff] resize-y"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}

function FieldSelect({ value, onChange }: { value: string; onChange?: (val: string) => void }) {
  return (
    <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center bg-white text-[12.5px] focus-within:border-[#6666ff]">
      <input
        className="flex-1 outline-none bg-transparent"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

// ─── Operators data ───────────────────────────────────────────────────────

const OPERATORS = [
  { id: "o1", name: "田中 太郎",   tone: 0, role: "スーパー管理者", email: "tanaka@daox.app",  last: "今",      status: "有効"   },
  { id: "o2", name: "伊藤 さくら", tone: 1, role: "モデレーター",   email: "ito@daox.app",     last: "5分前",   status: "有効"   },
  { id: "o3", name: "運営事務局",  tone: 0, role: "スーパー管理者", email: "admin@daox.app",   last: "1時間前", status: "有効"   },
  { id: "o4", name: "佐藤 一郎",   tone: 2, role: "モデレーター",   email: "sato@daox.app",    last: "昨日",    status: "招待中" },
];

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

const OP_COLS: ColDef[] = [
  { key: "name",   label: "名前",         flex: 2, bold: true },
  { key: "role",   label: "ロール",       flex: 1.5 },
  { key: "email",  label: "メール",       flex: 2, mono: true, muted: true },
  { key: "last",   label: "最終ログイン", flex: 1, muted: true },
  { key: "status", label: "ステータス",   flex: 1 },
  { key: "action", label: "",             w: 32 },
];

function buildOperatorRows() {
  return OPERATORS.map((o) => ({
    name: (
      <span className="flex items-center gap-2">
        <Avatar label={o.name.charAt(0)} size={26} tone={o.tone} />
        <span>{o.name}</span>
      </span>
    ),
    role: (
      <AdminPill tone={o.role === "スーパー管理者" ? "open" : "default"}>
        {o.role}
      </AdminPill>
    ),
    email: o.email,
    last: o.last,
    status: (
      <AdminPill tone={o.status === "有効" ? "success" : "warn"}>
        {o.status}
      </AdminPill>
    ),
    action: (
      <button className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[14px]">...</button>
    ),
  }));
}

// ─── PermToggle ───────────────────────────────────────────────────────────

function PermToggle({ on }: { on: boolean }) {
  return (
    <div
      className="w-[34px] h-[18px] rounded-full flex items-center transition-colors cursor-pointer"
      style={{ background: on ? "#6666ff" : "#dedee5", justifyContent: on ? "flex-end" : "flex-start", padding: "0 2px" }}
    >
      <div
        className="w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform"
      />
    </div>
  );
}

// ─── Audit data ───────────────────────────────────────────────────────────

const LOGS = [
  { t: "14:32", who: "田中 太郎",   tone: 0, action: "トークンを発行",   target: "+250 DAO (新規メンバー特典)",             ip: "210.x.x.45", sev: "info"  as const },
  { t: "14:18", who: "伊藤 さくら", tone: 1, action: "投稿を非公開化",   target: "チラシ配布スタッフ募集 (木村 弘)",         ip: "210.x.x.78", sev: "warn"  as const },
  { t: "13:55", who: "田中 太郎",   tone: 0, action: "メンバーを承認",   target: "鈴木 花子 (suzuki@example.com)",           ip: "210.x.x.45", sev: "info"  as const },
  { t: "13:40", who: "運営事務局",  tone: 0, action: "お知らせを配信",   target: "6月イベントのご案内",                      ip: "210.x.x.12", sev: "info"  as const },
  { t: "12:10", who: "田中 太郎",   tone: 0, action: "ランク条件を変更", target: "ゴールド: 500→750 DAO",                   ip: "210.x.x.45", sev: "warn"  as const },
  { t: "11:30", who: "伊藤 さくら", tone: 1, action: "メンバーを停止",   target: "山田 太一 (不正行為の疑い)",               ip: "210.x.x.78", sev: "warn"  as const },
  { t: "10:05", who: "田中 太郎",   tone: 0, action: "運営者を招待",     target: "佐藤 一郎 (sato@daox.app)",               ip: "210.x.x.45", sev: "info"  as const },
  { t: "09:20", who: "運営事務局",  tone: 0, action: "システム設定変更", target: "メール通知テンプレートを更新",             ip: "210.x.x.12", sev: "info"  as const },
];

const FILTER_CHIPS = ["すべて", "重要度: 高 (2)", "操作種別: トークン", "操作種別: メンバー"];

const SEV_LABEL: Record<string, string> = {
  info: "情報",
  warn: "注意",
};

const SEV_TONE: Record<string, PillTone> = {
  info: "info",
  warn: "warn",
};

const AUDIT_COLS: ColDef[] = [
  { key: "time",   label: "時刻",     w: 60,  mono: true, muted: true },
  { key: "who",    label: "実行者",   flex: 1.5, bold: true },
  { key: "action", label: "操作",     flex: 1.5 },
  { key: "target", label: "対象",     flex: 2.5, muted: true },
  { key: "ip",     label: "IP",       w: 100, mono: true, muted: true },
  { key: "sev",    label: "重要度",   w: 70 },
];

// ─── Sub-text per tab ─────────────────────────────────────────────────────

const TAB_SUB: Partial<Record<SettingsTab, string>> = {
  profile:   "コミュニティの基本情報を管理します",
  official:  "公式アカウントの設定",
  rules:     "コミュニティガイドラインの管理",
  notif:     "通知に関する設定",
  invite:    "招待・参加条件の設定",
  brand:     "ブランディングの管理",
  operators: "運営者の管理・権限設定",
  audit:     "運営操作の監査ログ",
  billing:   "請求・プランの管理",
  danger:    "危険な操作",
};

// ─── Profile initial values ───────────────────────────────────────────────

const INITIAL_VALUES = {
  communityName: "新富商店街コミュニティ",
  daoxUrl: "shintomi.daox.app",
  overview: "新富町商店街を中心とした地域コミュニティ。お仕事・物々交換・イベントを通じて地域を盛り上げます。",
  region: "千葉県中央区 新富町",
  language: "日本語",
};

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile form state
  const [communityName, setCommunityName] = useState(INITIAL_VALUES.communityName);
  const [daoxUrl, setDaoxUrl] = useState(INITIAL_VALUES.daoxUrl);
  const [overview, setOverview] = useState(INITIAL_VALUES.overview);
  const [region, setRegion] = useState(INITIAL_VALUES.region);
  const [language, setLanguage] = useState(INITIAL_VALUES.language);

  // Audit search state
  const [auditSearch, setAuditSearch] = useState("");
  const [auditFilter, setAuditFilter] = useState("すべて");

  const resetAll = () => {
    setCommunityName(INITIAL_VALUES.communityName);
    setDaoxUrl(INITIAL_VALUES.daoxUrl);
    setOverview(INITIAL_VALUES.overview);
    setRegion(INITIAL_VALUES.region);
    setLanguage(INITIAL_VALUES.language);
  };

  // ── Filtered audit logs ──
  const filteredLogs = LOGS.filter((log) => {
    // text search
    if (auditSearch) {
      const q = auditSearch.toLowerCase();
      const haystack = `${log.who} ${log.action} ${log.target} ${log.ip}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    // chip filter
    if (auditFilter === "重要度: 高 (2)") return log.sev === "warn";
    if (auditFilter === "操作種別: トークン") return log.action.includes("トークン");
    if (auditFilter === "操作種別: メンバー") return log.action.includes("メンバー");
    return true;
  });

  function buildAuditRows() {
    return filteredLogs.map((log) => ({
      time: log.t,
      who: (
        <span className="flex items-center gap-2">
          <Avatar label={log.who.charAt(0)} size={24} tone={log.tone} />
          <span>{log.who}</span>
        </span>
      ),
      action: log.action,
      target: log.target,
      ip: log.ip,
      sev: (
        <AdminPill tone={SEV_TONE[log.sev] ?? "default"}>
          {SEV_LABEL[log.sev] ?? log.sev}
        </AdminPill>
      ),
    }));
  }

  // ── Header actions per tab ──
  const headerActions = (() => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <AdminBtn variant="outline" onClick={resetAll}>変更を破棄</AdminBtn>
            <AdminBtn onClick={() => alert("コミュニティ設定を保存しました（デモ）")}>保存</AdminBtn>
          </>
        );
      case "operators":
        return (
          <AdminBtn onClick={() => alert("運営者の招待画面を開きます（デモ）")}>運営者を招待</AdminBtn>
        );
      case "audit":
        return (
          <>
            <AdminBtn variant="outline">期間: 今日</AdminBtn>
            <AdminBtn variant="outline" onClick={() => alert("CSVをエクスポートしました（デモ）")}>CSV書き出し</AdminBtn>
          </>
        );
      default:
        return null;
    }
  })();

  // ── Nav button renderer ──
  function renderNavBtn(item: NavItem) {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        className={[
          "w-full text-left px-2.5 py-[7px] rounded-md text-[12px] mb-0.5 border transition-colors whitespace-nowrap md:whitespace-normal flex-none md:flex-auto",
          isActive
            ? "bg-white text-[#1a1a1a] font-semibold border-[#dedee5]"
            : "bg-transparent text-[#525261] font-medium border-transparent hover:bg-white/60",
        ].join(" ")}
        onClick={() => setActiveTab(item.id)}
      >
        {item.label}
      </button>
    );
  }

  // ── Separator ──
  function NavSep() {
    return <div className="my-0.5 md:my-2 mx-2 border-t md:border-t border-[#dedee5] hidden md:block" />;
  }

  return (
    <AdminPageShell
      breadcrumbs="HOME › 設定"
      title="設定"
      sub={TAB_SUB[activeTab]}
      actions={headerActions}
    >
      <div className="flex flex-col md:flex-row overflow-hidden" style={{ minHeight: "calc(100vh - 120px)" }}>

        {/* ─── Left navigation ─── */}
        <div
          className="flex-none border-b md:border-b-0 md:border-r border-[#dedee5] bg-[#f1f1f5] p-2 md:p-3.5 md:w-[200px]"
        >
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {NAV_GROUP_1.map(renderNavBtn)}
            <NavSep />
            {NAV_GROUP_2.map(renderNavBtn)}
            <NavSep />
            {NAV_GROUP_3.map(renderNavBtn)}
          </div>
        </div>

        {/* ─── Content area ─── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* ──────── Profile tab ──────── */}
          {activeTab === "profile" && (
            <div className="max-w-[560px]">
              <div className="text-[15px] font-bold mb-4">プロフィール</div>

              {/* Logo */}
              <Field label="ロゴ画像" sub="正方形 256x256px 以上推奨">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-xl text-white text-[28px] font-bold flex-none"
                    style={{ width: 64, height: 64, background: "#1a1a1a" }}
                  >
                    新
                  </div>
                  <AdminBtn variant="outline" onClick={() => alert("画像の変更画面は今後実装予定です")}>画像を変更</AdminBtn>
                  <AdminBtn variant="ghost" onClick={() => alert("画像を削除しました（デモ）")}>削除</AdminBtn>
                </div>
              </Field>

              <Field label="コミュニティ名">
                <FieldInput value={communityName} onChange={setCommunityName} />
              </Field>

              <Field label="DAOX URL">
                <FieldInput value={daoxUrl} onChange={setDaoxUrl} prefix="https://" mono />
              </Field>

              <Field
                label="概要"
                sub="メンバー登録画面とプロフィールに表示されます"
              >
                <FieldTextarea value={overview} onChange={setOverview} />
              </Field>

              <Field label="主な活動地域">
                <FieldInput value={region} onChange={setRegion} />
              </Field>

              <Field label="言語">
                <FieldSelect value={language} onChange={setLanguage} />
              </Field>
            </div>
          )}

          {/* ──────── Operators tab ──────── */}
          {activeTab === "operators" && (
            <div>
              <div className="text-[15px] font-bold mb-4">運営者</div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Operators table */}
                <div className="flex-1 min-w-0">
                  <AdminTable cols={OP_COLS} rows={buildOperatorRows()} />
                </div>

                {/* Permission matrix */}
                <div className="w-full md:w-[340px] md:flex-none">
                  <div className="border border-[#dedee5] rounded-[10px] overflow-hidden bg-white">
                    {/* Matrix header */}
                    <div className="flex items-center px-4 bg-[#f1f1f5] border-b border-[#dedee5] text-[10.5px] text-[#9a9aa0] font-mono tracking-[0.5px] font-semibold" style={{ height: 32 }}>
                      <div className="flex-1">権限</div>
                      <div className="w-[72px] text-center">管理者</div>
                      <div className="w-[72px] text-center">モデレーター</div>
                    </div>
                    {/* Matrix rows */}
                    {PERMISSIONS.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center px-4 border-b last:border-b-0 border-[#dedee5] text-[12px]"
                        style={{ height: 40, background: i % 2 === 1 ? "#f8f8fb" : "transparent" }}
                      >
                        <div className="flex-1 text-[#1a1a1a] font-medium">{p.group}</div>
                        <div className="w-[72px] flex justify-center">
                          <PermToggle on={p.a} />
                        </div>
                        <div className="w-[72px] flex justify-center">
                          <PermToggle on={p.b} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────── Audit log tab ──────── */}
          {activeTab === "audit" && (
            <div>
              <div className="text-[15px] font-bold mb-4">監査ログ</div>

              {/* Search bar */}
              <div className="mb-3">
                <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center bg-white text-[12.5px] focus-within:border-[#6666ff] max-w-[400px]">
                  <span className="text-[#9a9aa0] mr-2 text-[14px]">&#x1F50D;</span>
                  <input
                    className="flex-1 outline-none bg-transparent"
                    placeholder="操作内容・実行者・IPで検索..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter chips */}
              <div className="flex gap-1.5 mb-4 flex-wrap">
                {FILTER_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    className={[
                      "px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors",
                      auditFilter === chip
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                        : "bg-white text-[#525261] border-[#dedee5] hover:border-[#9a9aa0]",
                    ].join(" ")}
                    onClick={() => setAuditFilter(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Log table */}
              <AdminTable cols={AUDIT_COLS} rows={buildAuditRows()} />

              {/* Summary */}
              <div className="mt-3 text-[11px] text-[#9a9aa0] font-mono">
                {filteredLogs.length} 件表示 / 全 {LOGS.length} 件
              </div>
            </div>
          )}

          {/* ──────── Coming-soon tabs ──────── */}
          {activeTab !== "profile" && activeTab !== "operators" && activeTab !== "audit" && (
            <div className="flex flex-col items-center justify-center py-20 text-[#9a9aa0]">
              <div className="text-[32px] mb-3">&#x2699;</div>
              <div className="text-[13px]">
                {ALL_TABS.find((t) => t.id === activeTab)?.label} の設定
              </div>
              <div className="text-[11px] mt-1">このセクションは準備中です</div>
            </div>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
