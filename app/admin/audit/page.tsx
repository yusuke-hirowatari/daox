"use client";

import { useState } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { AdminBtn, AdminPill, AdminPageShell, type PillTone } from "@/components/admin/atoms";

// ─── Data ─────────────────────────────────────────────────────────────────

type Severity = "high" | "warn" | "info" | "muted";

interface LogEntry {
  t:      string;
  who:    string;
  tone:   number;
  action: string;
  target: string;
  ip:     string;
  sev:    Severity;
}

const LOGS: LogEntry[] = [
  { t: "14:32", who: "田中 太郎",   tone: 0, action: "トークンを発行",   target: "+250 DAO (新規メンバー特典)",             ip: "210.x.x.45", sev: "info" },
  { t: "14:18", who: "伊藤 さくら", tone: 1, action: "投稿を非公開化",   target: "チラシ配布スタッフ募集 (木村 弘)",         ip: "210.x.x.78", sev: "warn" },
  { t: "13:55", who: "田中 太郎",   tone: 0, action: "ランク条件を変更", target: "プレミアム達成条件 (チェックイン 12 → 10回)", ip: "210.x.x.45", sev: "high" },
  { t: "13:02", who: "田中 太郎",   tone: 0, action: "運営者を招待",     target: "佐藤 一郎 (モデレーター)",               ip: "210.x.x.45", sev: "info" },
  { t: "12:45", who: "伊藤 さくら", tone: 1, action: "お知らせを配信",   target: "夏祭り 出店者募集のお知らせ",             ip: "210.x.x.78", sev: "info" },
  { t: "11:30", who: "田中 太郎",   tone: 0, action: "メンバーを停止",   target: "小林 真理 (不正利用の疑い)",             ip: "210.x.x.45", sev: "high" },
  { t: "10:14", who: "system",      tone: 0, action: "自動バックアップ", target: "日次バックアップ正常完了",               ip: "internal",    sev: "muted" },
  { t: "09:20", who: "田中 太郎",   tone: 0, action: "ログイン",         target: "— (2FA成功)",                           ip: "210.x.x.45", sev: "info" },
];

const SEV_TONE: Record<Severity, PillTone> = {
  high:  "warn",
  warn:  "open",
  info:  "info",
  muted: "muted",
};

const SEV_LABEL: Record<Severity, string> = {
  high:  "高",
  warn:  "中",
  info:  "info",
  muted: "低",
};

const FILTER_CHIPS = [
  "すべて",
  "重要度: 高 (2)",
  "操作種別: トークン",
  "操作種別: メンバー",
];

// ─── Page ─────────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = ["今日", "今週", "今月", "全期間"] as const;

export default function AdminAuditPage() {
  const [filterIdx, setFilterIdx] = useState(0);
  const [periodIdx, setPeriodIdx] = useState(0); // default "今日"
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AdminPageShell
      breadcrumbs="HOME › 監査ログ"
      title="監査ログ"
      sub="運営者の操作履歴 ・ 30日間保持"
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
            onClick={() => alert("監査ログのCSVダウンロードを開始しました（デモ）")}
          >
            CSV書き出し
          </AdminBtn>
        </>
      }
    >
      <div className="p-5 flex flex-col gap-3">

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-[7px] border border-[#dedee5] rounded-md bg-white max-w-[320px] w-full">
            <span className="text-[#9a9aa0] text-[13px]">⌕</span>
            <input
              type="text"
              className="flex-1 text-[12px] outline-none bg-transparent placeholder:text-[#9a9aa0]"
              placeholder="運営者・アクションで検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {FILTER_CHIPS.map((f, i) => (
            <button
              key={f}
              className={[
                "px-3 py-[5px] rounded-[999px] text-[11.5px] font-medium border transition-colors whitespace-nowrap",
                filterIdx === i
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "bg-white text-[#525261] border-[#dedee5] hover:border-[#9a9aa0]",
              ].join(" ")}
              onClick={() => setFilterIdx(i)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Log table */}
        <div className="border border-[#dedee5] rounded-[10px] overflow-hidden bg-white">
          {/* Header */}
          <div
            className="flex px-3.5 bg-[#f1f1f5] border-b border-[#dedee5] text-[10.5px] text-[#9a9aa0] font-mono font-semibold tracking-[0.5px] items-center"
            style={{ height: 32 }}
          >
            <span className="w-14 flex-none">時刻</span>
            <span className="w-12 flex-none">重要度</span>
            <span className="w-40 flex-none">運営者</span>
            <span className="w-44 flex-none">アクション</span>
            <span className="flex-1">対象</span>
            <span className="w-28 flex-none">IP</span>
          </div>

          {/* Rows */}
          {LOGS.filter((l) => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return l.who.toLowerCase().includes(q) || l.action.toLowerCase().includes(q);
          }).map((l, i) => (
            <div
              key={i}
              className="flex px-3.5 items-center border-b last:border-b-0 border-[#dedee5] text-[12px]"
              style={{
                height: 38,
                background: i % 2 === 1 ? "#f8f8fb" : "transparent",
              }}
            >
              <span className="w-14 flex-none text-[11px] text-[#9a9aa0] font-mono">
                {l.t}
              </span>
              <span className="w-12 flex-none">
                <AdminPill tone={SEV_TONE[l.sev]}>{SEV_LABEL[l.sev]}</AdminPill>
              </span>
              <span className="w-40 flex-none inline-flex items-center gap-1.5">
                <Avatar size={18} label={l.who[0]} tone={l.tone} />
                <span className="truncate">{l.who}</span>
              </span>
              <span className="w-44 flex-none font-semibold truncate">{l.action}</span>
              <span className="flex-1 text-[#525261] truncate min-w-0">{l.target}</span>
              <span className="w-28 flex-none text-[#9a9aa0] font-mono text-[10.5px]">
                {l.ip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
