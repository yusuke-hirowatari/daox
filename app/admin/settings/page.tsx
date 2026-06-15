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

function buildOperatorRows(
  opMenuOpen: string | null,
  setOpMenuOpen: (id: string | null) => void,
  operators: typeof OPERATORS,
  setOperators: React.Dispatch<React.SetStateAction<typeof OPERATORS>>,
  suspendConfirmId: string | null,
  setSuspendConfirmId: (id: string | null) => void,
) {
  return operators.map((o) => ({
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
      <AdminPill tone={o.status === "有効" ? "success" : ("warn" as PillTone)}>
        {o.status}
      </AdminPill>
    ),
    action: (
      <div className="relative">
        {suspendConfirmId === o.id ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#e53e3e] font-semibold whitespace-nowrap">停止する？</span>
            <button
              className="px-2 py-1 rounded bg-[#e53e3e] text-white text-[11px] font-semibold hover:bg-[#c53030] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setOperators(prev => prev.map(op => op.id === o.id ? {...op, status: "停止"} : op));
                setSuspendConfirmId(null);
              }}
            >
              確認
            </button>
            <button
              className="px-2 py-1 rounded border border-[#dedee5] text-[11px] text-[#525261] hover:bg-[#f1f1f5] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSuspendConfirmId(null);
              }}
            >
              取消
            </button>
          </div>
        ) : (
          <>
            <button
              className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[14px] cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setOpMenuOpen(opMenuOpen === o.id ? null : o.id); }}
            >
              ...
            </button>
            {opMenuOpen === o.id && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#dedee5] rounded-lg shadow-lg z-20 py-1">
                <button className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]" onClick={() => {
                  const newRole = o.role === "スーパー管理者" ? "モデレーター" : "スーパー管理者";
                  setOperators(prev => prev.map(op => op.id === o.id ? {...op, role: newRole} : op));
                  setOpMenuOpen(null);
                }}>
                  権限を変更
                </button>
                <button className="w-full text-left px-3 py-2 text-[12px] text-[#6666ff] hover:bg-[#f1f1f5]" onClick={() => {
                  setOpMenuOpen(null);
                  setSuspendConfirmId(o.id);
                }}>
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

// ─── PermToggle ───────────────────────────────────────────────────────────

function PermToggle({ on, onClick }: { on: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
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

  // Save button state
  const [saved, setSaved] = useState(false);

  // Logo state
  const [logoChanged, setLogoChanged] = useState(false);

  // Operator invite state
  const [invitingOp, setInvitingOp] = useState(false);
  const [opEmail, setOpEmail] = useState("");
  const [opRole, setOpRole] = useState("モデレーター");
  const [opInviteSent, setOpInviteSent] = useState(false);

  // Operator menu state
  const [opMenuOpen, setOpMenuOpen] = useState<string | null>(null);
  const [operators, setOperators] = useState(OPERATORS);

  // Permissions state
  const [permissions, setPermissions] = useState(PERMISSIONS);

  // Audit period state
  const [auditPeriod, setAuditPeriod] = useState("今日");

  // Audit search state
  const [auditSearch, setAuditSearch] = useState("");
  const [auditFilter, setAuditFilter] = useState("すべて");

  // Official account state
  const [officialName, setOfficialName] = useState("新富商店街コミュニティ 運営事務局");
  const [officialReply, setOfficialReply] = useState("お問い合わせありがとうございます。運営チームが確認後、ご連絡いたします。");
  const [officialSaved, setOfficialSaved] = useState(false);

  // Guidelines state
  const [guidelinesText, setGuidelinesText] = useState("1. 相互尊重\nメンバー同士は敬意を持って接しましょう。\n\n2. 個人情報の保護\n他のメンバーの個人情報を無断で共有しないでください。\n\n3. スパム・宣伝の禁止\n商業的な宣伝やスパム行為は禁止です。\n\n4. 不適切なコンテンツ\n暴力的、差別的、または不快な内容の投稿は禁止です。\n\n5. 違反への対応\n違反が確認された場合、警告→投稿非公開→アカウント停止の順で対応します。");
  const [guidelinesSaved, setGuidelinesSaved] = useState(false);

  // Invite tab state
  const [joinMethod, setJoinMethod] = useState("招待リンクのみ");

  // Brand tab state
  const [brandColor, setBrandColor] = useState("#1a1a1a");

  // Danger tab state
  const [deletionRequested, setDeletionRequested] = useState(false);

  // Operator suspension inline confirm state
  const [suspendConfirmId, setSuspendConfirmId] = useState<string | null>(null);

  // Notification settings state
  const [notifSettings, setNotifSettings] = useState([
    { label: "お知らせ配信時", on: true },
    { label: "新規メンバー参加時", on: true },
    { label: "タスク完了時", on: true },
    { label: "通報受信時", on: true },
    { label: "トークン発行時", on: false },
    { label: "チェックイン時", on: false },
  ]);
  const [notifSaved, setNotifSaved] = useState(false);

  const resetAll = () => {
    setCommunityName(INITIAL_VALUES.communityName);
    setDaoxUrl(INITIAL_VALUES.daoxUrl);
    setOverview(INITIAL_VALUES.overview);
    setRegion(INITIAL_VALUES.region);
    setLanguage(INITIAL_VALUES.language);
  };

  // Close operator menu on outside click
  useEffect(() => {
    if (!opMenuOpen) return;
    const handler = () => setOpMenuOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [opMenuOpen]);

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
            <AdminBtn onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>{saved ? "✓ 保存しました" : "保存"}</AdminBtn>
          </>
        );
      case "operators":
        return (
          <AdminBtn onClick={() => setInvitingOp(true)}>運営者を招待</AdminBtn>
        );
      case "audit":
        return (
          <>
            <AdminBtn variant="outline" onClick={() => { const periods = ["今日","今週","今月","全期間"]; setAuditPeriod(periods[(periods.indexOf(auditPeriod)+1) % periods.length]); }}>期間: {auditPeriod}</AdminBtn>
            <AdminBtn variant="outline" onClick={() => {
              const header = "時刻,実行者,操作,対象,IP,重要度";
              const csvRows = filteredLogs.map(l => [l.t, l.who, l.action, l.target, l.ip, l.sev].join(","));
              const csv = [header, ...csvRows].join("\n");
              const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `audit_log_${new Date().toISOString().slice(0,10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}>CSV書き出し</AdminBtn>
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
                    {logoChanged ? "✓" : "新"}
                  </div>
                  <AdminBtn variant="outline" onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = () => {
                      if (input.files && input.files.length > 0) {
                        setLogoChanged(true);
                      }
                    };
                    input.click();
                  }}>画像を変更</AdminBtn>
                  <AdminBtn variant="ghost" onClick={() => setLogoChanged(false)}>削除</AdminBtn>
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

              {invitingOp && (
                <div className="border-[1.5px] border-[#6666ff] rounded-[10px] bg-white p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[14px] font-bold">運営者を招待</div>
                    <button onClick={() => { setInvitingOp(false); setOpEmail(""); setOpInviteSent(false); }} className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[18px] leading-none">×</button>
                  </div>
                  {opInviteSent ? (
                    <div className="text-[12.5px] text-[#2d7a4a] font-semibold py-2">✓ {opEmail} に招待を送信しました</div>
                  ) : (
                    <div className="flex items-end gap-3 flex-wrap">
                      <div>
                        <div className="text-[11px] font-semibold text-[#525261] mb-1">メールアドレス</div>
                        <input type="email" className="h-9 w-[280px] px-3 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]" placeholder="operator@example.com" value={opEmail} onChange={(e) => setOpEmail(e.target.value)} />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-[#525261] mb-1">ロール</div>
                        <select className="h-9 px-3 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff] bg-white" value={opRole} onChange={(e) => setOpRole(e.target.value)}>
                          <option value="モデレーター">モデレーター</option>
                          <option value="スーパー管理者">スーパー管理者</option>
                        </select>
                      </div>
                      <AdminBtn disabled={!opEmail.trim() || !opEmail.includes("@")} onClick={() => setOpInviteSent(true)}>招待を送信</AdminBtn>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6">
                {/* Operators table */}
                <div className="flex-1 min-w-0">
                  <AdminTable cols={OP_COLS} rows={buildOperatorRows(opMenuOpen, setOpMenuOpen, operators, setOperators, suspendConfirmId, setSuspendConfirmId)} />
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
                    {permissions.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center px-4 border-b last:border-b-0 border-[#dedee5] text-[12px]"
                        style={{ height: 40, background: i % 2 === 1 ? "#f8f8fb" : "transparent" }}
                      >
                        <div className="flex-1 text-[#1a1a1a] font-medium">{p.group}</div>
                        <div className="w-[72px] flex justify-center">
                          <PermToggle on={p.a} onClick={() => setPermissions(prev => prev.map((pp, j) => j === i ? {...pp, a: !pp.a} : pp))} />
                        </div>
                        <div className="w-[72px] flex justify-center">
                          <PermToggle on={p.b} onClick={() => setPermissions(prev => prev.map((pp, j) => j === i ? {...pp, b: !pp.b} : pp))} />
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

          {/* ──────── Official account tab ──────── */}
          {activeTab === "official" && (
            <div className="max-w-[560px]">
              <div className="text-[15px] font-bold mb-4">公式アカウント</div>
              <div className="mb-4">
                <div className="text-[11.5px] font-semibold mb-1.5">表示名</div>
                <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center bg-white text-[12.5px] focus-within:border-[#6666ff]">
                  <input className="flex-1 outline-none bg-transparent" value={officialName} onChange={(e) => setOfficialName(e.target.value)} />
                </div>
              </div>
              <div className="mb-4">
                <div className="text-[11.5px] font-semibold mb-1.5">自動返信メッセージ</div>
                <textarea className="min-h-[80px] border border-[#dedee5] rounded-md px-3 py-2.5 bg-white text-[12.5px] leading-[1.55] w-full outline-none focus:border-[#6666ff] resize-y" value={officialReply} onChange={(e) => setOfficialReply(e.target.value)} />
              </div>
              <div className="mt-4">
                <AdminBtn onClick={() => { setOfficialSaved(true); setTimeout(() => setOfficialSaved(false), 2000); }}>{officialSaved ? "✓ 保存しました" : "保存"}</AdminBtn>
              </div>
            </div>
          )}

          {/* ──────── Rules tab ──────── */}
          {activeTab === "rules" && (
            <div className="max-w-[560px]">
              <div className="text-[15px] font-bold mb-4">コミュニティガイドライン</div>
              <textarea className="min-h-[300px] border border-[#dedee5] rounded-md px-3 py-2.5 bg-white text-[12.5px] leading-[1.7] w-full outline-none focus:border-[#6666ff] resize-y" value={guidelinesText} onChange={(e) => setGuidelinesText(e.target.value)} />
              <div className="mt-4">
                <AdminBtn onClick={() => { setGuidelinesSaved(true); setTimeout(() => setGuidelinesSaved(false), 2000); }}>{guidelinesSaved ? "✓ 保存しました" : "保存"}</AdminBtn>
              </div>
            </div>
          )}

          {/* ──────── Notification tab ──────── */}
          {activeTab === "notif" && (
            <div className="max-w-[560px]">
              <div className="text-[15px] font-bold mb-4">通知設定</div>
              {notifSettings.map((n, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#dedee5] text-[12.5px]">
                  <span>{n.label}</span>
                  <PermToggle on={n.on} onClick={() => setNotifSettings(prev => prev.map((item, j) => j === i ? { ...item, on: !item.on } : item))} />
                </div>
              ))}
              <div className="mt-4">
                <AdminBtn onClick={() => { setNotifSaved(true); setTimeout(() => setNotifSaved(false), 2000); }}>{notifSaved ? "✓ 保存しました" : "通知設定を保存"}</AdminBtn>
              </div>
            </div>
          )}

          {/* ──────── Invite tab ──────── */}
          {activeTab === "invite" && (
            <div className="max-w-[560px]">
              <div className="text-[15px] font-bold mb-4">招待・参加条件</div>
              <div className="mb-4">
                <div className="text-[11.5px] font-semibold mb-1.5">参加方法</div>
                <select className="h-9 border border-[#dedee5] rounded-md px-3 text-[12.5px] bg-white w-full outline-none focus:border-[#6666ff]" value={joinMethod} onChange={(e) => setJoinMethod(e.target.value)}>
                  <option value="招待リンクのみ">招待リンクのみ</option>
                  <option value="誰でも参加可能">誰でも参加可能</option>
                  <option value="承認制">承認制</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="text-[11.5px] font-semibold mb-1.5">招待リンク</div>
                <div className="h-9 border border-[#dedee5] rounded-md px-3 flex items-center bg-[#f1f1f5] text-[12px] font-mono text-[#525261]">
                  https://shintomi.daox.app/invite/abc123
                </div>
              </div>
            </div>
          )}

          {/* ──────── Brand tab ──────── */}
          {activeTab === "brand" && (
            <div className="max-w-[560px]">
              <div className="text-[15px] font-bold mb-4">ブランディング</div>
              <div className="mb-4">
                <div className="text-[11.5px] font-semibold mb-1.5">テーマカラー</div>
                <div className="flex items-center gap-3">
                  {["#1a1a1a","#6666ff","#2d7a4a","#d69e2e","#e53e3e"].map(c => (
                    <div
                      key={c}
                      className={`w-8 h-8 rounded-full shadow cursor-pointer hover:scale-110 transition-transform flex items-center justify-center ${brandColor === c ? "border-[3px] border-[#6666ff] ring-2 ring-[#6666ff]/30" : "border-2 border-white"}`}
                      style={{ background: c }}
                      onClick={() => setBrandColor(c)}
                    >
                      {brandColor === c && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5L5.5 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────── Billing tab ──────── */}
          {activeTab === "billing" && (
            <div className="max-w-[560px]">
              <div className="text-[15px] font-bold mb-4">請求・プラン</div>
              <div className="p-4 border border-[#dedee5] rounded-[10px] bg-white mb-4">
                <div className="text-[11px] text-[#9a9aa0] font-mono mb-1">CURRENT PLAN</div>
                <div className="text-[18px] font-bold">コミュニティ プラン</div>
                <div className="text-[12px] text-[#525261] mt-1">メンバー上限: 500人 ・ ストレージ: 10GB</div>
              </div>
              <div className="text-[12px] text-[#9a9aa0]">次回請求日: 2026/07/01 ・ ¥5,000/月</div>
            </div>
          )}

          {/* ──────── Danger tab ──────── */}
          {activeTab === "danger" && (
            <div className="max-w-[560px]">
              <div className="text-[15px] font-bold mb-4 text-[#e53e3e]">危険な操作</div>
              <div className="p-4 border border-[#e53e3e] rounded-[10px] bg-[#fef2f2] mb-4">
                <div className="text-[13px] font-bold text-[#e53e3e] mb-2">コミュニティを削除</div>
                <div className="text-[12px] text-[#525261] mb-3">この操作は取り消せません。すべてのデータが完全に削除されます。</div>
                {deletionRequested ? (
                  <div className="text-[12.5px] text-[#2d7a4a] font-semibold py-2">削除リクエストを送信しました</div>
                ) : (
                  <button className="px-4 py-2 rounded-md bg-[#e53e3e] text-white text-[12px] font-semibold hover:bg-[#c53030] transition-colors" onClick={() => {
                    if (window.confirm("本当にコミュニティを削除しますか？この操作は取り消せません。")) {
                      if (window.confirm("最終確認: すべてのメンバーデータ、トークン、投稿が削除されます。続行しますか？")) {
                        setDeletionRequested(true);
                      }
                    }
                  }}>コミュニティを削除する</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
