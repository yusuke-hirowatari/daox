"use client";

import { useState } from "react";
import { TopBar, PcHeader, BackButton } from "@/components/atoms/TopBar";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { RankBadge } from "@/components/atoms/RankBadge";
import { getCurrentUser } from "@/mocks/users";
import { RANKS, PREMIUM_REQS, DUTY_TYPES } from "@/mocks/rank";

// ─── Types ────────────────────────────────────────────────────────────────────

type SpView =
  | "hub"
  | "activity"
  | "settings"
  | "rank_detail"
  | "leaderboard"
  | "level_up"
  | "edit";

// ─── Static mock data ─────────────────────────────────────────────────────────

const CURRENT_VISITS = 2;
const CURRENT_DUTIES = 0;
const CURRENT_XP = 1240;
const DAO_BALANCE = 420;
const CHECKIN_COUNT = 14;
const TASK_DONE = 8;

const NAV_ITEMS = [
  { icon: "◈",  label: "ランクとXP",        sub: "プレミアムまであと 1条件", view: "rank_detail" as SpView },
  { icon: "🏆", label: "ランキング",         sub: "今月 3位 / 312人中",       view: "leaderboard" as SpView },
  { icon: "📜", label: "アクティビティ履歴", sub: null,                       view: "activity" as SpView },
  { icon: "⚙",  label: "アカウント設定",     sub: null,                       view: "settings" as SpView },
];

const ACTIVITY_SP = [
  { t: "今日 12:34", desc: "ことりでチェックイン",            amt: "+10",  kind: "check" },
  { t: "今日 09:02", desc: "掲示板に「お仕事」を投稿",         amt: null,   kind: "post" },
  { t: "昨日",       desc: "伊藤さんからお礼を受領",           amt: "+120", kind: "tx" },
  { t: "昨日",       desc: "佐藤さんからトマト購入",           amt: "-20",  kind: "tx" },
  { t: "5/19",       desc: "タスク「商店街の朝清掃」完了",     amt: "+100", kind: "task" },
  { t: "5/18",       desc: "クリーン作戦に参加",               amt: "+50",  kind: "duty" },
  { t: "5/17",       desc: "「夏祭り運営」にエントリー",        amt: null,   kind: "duty" },
  { t: "5/16",       desc: "ロゴ案投票に参加",                 amt: "+5",   kind: "vote" },
];

const ACTIVITY_PC = [
  { d: "今日 12:34", what: "カフェ ことり にチェックイン",           xp: 10,  kind: "check", amt: null as number | null },
  { d: "今日 09:02", what: "掲示板に投稿: 看板リペイント手伝い",      xp: 15,  kind: "post",  amt: null },
  { d: "昨日 18:20", what: "タスク完了: チラシ配布",                  xp: 60,  kind: "task",  amt: 120 },
  { d: "昨日 09:15", what: "投票: ロゴ案A",                          xp: 5,   kind: "vote",  amt: null },
  { d: "5/22 11:08", what: "交換券引換: コーヒー1杯無料",             xp: null as number | null, kind: "exchange", amt: -50 },
  { d: "5/20",       what: "タスク公開: 看板リペイント手伝い",         xp: null, kind: "order", amt: null },
];

const PC_KIND_ICON: Record<string, string> = {
  check: "◎", post: "✎", task: "☑", vote: "🗳", coupon: "🎟", order: "＋",
};

const LEADERBOARD = [
  { rank: 1, who: "伊藤 さくら", tone: 1, xp: 4820, delta: "+520", premium: true,  me: false },
  { rank: 2, who: "中島 健",     tone: 0, xp: 3640, delta: "+280", premium: true,  me: false },
  { rank: 3, who: "田中 太郎",   tone: 0, xp: 1240, delta: "+185", premium: false, me: true  },
  { rank: 4, who: "佐藤 一郎",   tone: 2, xp: 980,  delta: "+90",  premium: false, me: false },
  { rank: 5, who: "高橋 美咲",   tone: 4, xp: 760,  delta: "+125", premium: false, me: false },
  { rank: 6, who: "木村 弘",     tone: 3, xp: 620,  delta: "+45",  premium: false, me: false },
  { rank: 7, who: "小林 真理",   tone: 1, xp: 420,  delta: "+20",  premium: false, me: false },
];

const DUTY_OFFERINGS = [
  { name: "商店街クリーン作戦",   date: "6/1 (土) 朝7:00", spots: "残 4/12", tag: "半日",  xp: 60  },
  { name: "夏祭り 出店サポート",  date: "8/15 終日",         spots: "残 6/20", tag: "1日",   xp: 120 },
  { name: "見守り隊 (今月分)",   date: "随時 30分〜",        spots: "随時受付", tag: "短時間", xp: 30  },
  { name: "新メンバー案内役",     date: "随時",              spots: "随時受付", tag: "随時",  xp: 40  },
];

const XP_WAYS = [
  { k: "チェックイン",   v: "+10",      sub: "1日1回" },
  { k: "投稿・コメント", v: "+15",      sub: "掲示板" },
  { k: "お仕事完了",     v: "+50〜200", sub: "依頼内容次第" },
  { k: "投票参加",       v: "+5",       sub: "1件あたり" },
  { k: "メンバー招待",   v: "+100",     sub: "紹介者にも還元" },
  { k: "担い手活動",     v: "+30〜120", sub: "主催から付与" },
];

const RECENT_XP = [
  { d: "今日 12:34", what: "チェックイン (ことり)",    xp: 10 },
  { d: "今日 09:02", what: "掲示板に投稿",             xp: 15 },
  { d: "昨日 18:20", what: "お仕事完了 (チラシ配布)",  xp: 60 },
  { d: "5/18",       what: "クリーン作戦に申込",        xp: 5  },
];

const SETTINGS_GROUPS = [
  {
    label: "アカウント",
    items: [
      { k: "名前",             v: "田中 太郎" },
      { k: "メール",           v: "taro@example.com" },
      { k: "プロフィール公開", v: "公開" },
    ],
  },
  {
    label: "通知",
    items: [
      { k: "掲示板の新着",         v: "ON" },
      { k: "DM",                   v: "ON" },
      { k: "タスク承認・申込",     v: "ON" },
      { k: "チェックインリマインド", v: "OFF" },
    ],
  },
  {
    label: "コミュニティ",
    items: [
      { k: "所属",       v: "新富商店街" },
      { k: "招待コード", v: "SHIN-7K2X" },
    ],
  },
];

const BADGES = [
  { icon: "🎖", name: "初回チェックイン" },
  { icon: "🌟", name: "担い手デビュー" },
  { icon: "🗳", name: "投票参加者" },
];

const ACTIVITY_FILTER_TAGS = ["すべて", "チェックイン", "タスク", "トークン", "投票"];

// ─── RankProgressCard ─────────────────────────────────────────────────────────

function RankProgressCard({
  visits,
  duties,
  xp,
}: {
  visits: number;
  duties: number;
  xp: number;
}) {
  const isPremium = visits >= PREMIUM_REQS.visits && duties >= PREMIUM_REQS.duties;
  const tier = isPremium ? RANKS.premium : RANKS.basic;
  const visitsPct = Math.min(100, Math.round((visits / PREMIUM_REQS.visits) * 100));
  const dutiesDone = duties >= PREMIUM_REQS.duties;

  return (
    <div className="border border-[#dedee5] rounded-xl p-3.5 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-[22px] font-bold text-white flex-none"
          style={{ background: tier.color }}
        >
          {tier.glyph}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-[#9a9aa0] font-mono tracking-widest">現在のランク</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[17px] font-bold">{tier.name}</span>
            <span className="text-[10.5px] text-[#9a9aa0]">{tier.sub}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[16px] font-bold font-mono">{xp.toLocaleString()}</div>
          <div className="text-[9px] text-[#9a9aa0] font-mono">XP</div>
        </div>
      </div>

      {isPremium ? (
        <div className="px-2.5 py-2 rounded-lg bg-[#eeeeff] text-[11px] text-[#6666ff] font-semibold text-center">
          ★ プレミアム達成中 · 今年
        </div>
      ) : (
        <>
          <div className="text-[10px] text-[#9a9aa0] font-mono tracking-widest mb-2">
            プレミアム条件 (今年)
          </div>
          {/* Visits */}
          <div className="mb-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <CheckDot done={visits >= PREMIUM_REQS.visits} />
              <span className="text-[12px] flex-1">
                年に{PREMIUM_REQS.visits}回以上のチェックイン
              </span>
              <span className="text-[11px] font-mono font-bold text-[#525261]">
                {visits} / {PREMIUM_REQS.visits}
              </span>
            </div>
            <div className="ml-6 h-1.5 bg-[#e8e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a1a1a] rounded-full"
                style={{ width: `${visitsPct}%` }}
              />
            </div>
          </div>
          {/* Duties */}
          <div>
            <div className="flex items-center gap-2">
              <CheckDot done={dutiesDone} />
              <span className="text-[12px] flex-1">地域の担い手活動を完了</span>
              <span className="text-[11px] font-mono font-bold text-[#525261]">
                {duties} / {PREMIUM_REQS.duties}
              </span>
            </div>
            {!dutiesDone && (
              <div className="mt-1.5 ml-6 text-[10.5px] text-[#9a9aa0] leading-relaxed">
                例: {DUTY_TYPES.slice(0, 3).join(" / ")} など
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function CheckDot({ done }: { done: boolean }) {
  return (
    <span
      className="w-4 h-4 rounded-full flex-none flex items-center justify-center text-[10px] font-bold text-white"
      style={{
        background: done ? "#6666ff" : "transparent",
        border: done ? "1px solid #6666ff" : "1.5px solid #bbbbc0",
      }}
    >
      {done ? "✓" : ""}
    </span>
  );
}

// ─── EditProfileForm ──────────────────────────────────────────────────────────

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[11.5px] font-semibold text-[#1a1a1a] mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function EditProfileForm() {
  const [tags, setTags] = useState(["カフェ", "イベント運営", "写真"]);
  const [addingTag, setAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));
  const commitTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) setTags((prev) => [...prev, v]);
    setTagInput("");
    setAddingTag(false);
  };

  return (
    <div>
      {/* Avatar */}
      <EditField label="アイコン画像">
        <div className="flex items-center gap-4">
          <Avatar size={56} label="田" tone={0} />
          <button className="text-[12px] font-semibold px-3 py-2 border border-[#dedee5] rounded-lg hover:bg-[#f1f1f5] transition-colors">
            画像を変更
          </button>
        </div>
      </EditField>

      {/* Name */}
      <EditField label="表示名">
        <div className="h-10 border border-[#dedee5] rounded-lg px-3 flex items-center text-[13px] bg-white">
          田中 太郎
        </div>
      </EditField>

      {/* Handle */}
      <EditField label="ハンドル">
        <div className="h-10 border border-[#dedee5] rounded-lg px-3 flex items-center text-[13px] font-mono bg-white text-[#525261]">
          @taro.tanaka
        </div>
      </EditField>

      {/* Bio */}
      <EditField label="自己紹介">
        <div className="min-h-[80px] border border-[#dedee5] rounded-lg px-3 py-2.5 text-[13px] bg-white text-[#1a1a1a] leading-relaxed">
          地元のカフェ巡りが好きです。週末は商店街の手伝いをしています。
        </div>
      </EditField>

      {/* Interests */}
      <EditField label="興味・タグ">
        <div className="flex flex-wrap gap-1.5 p-2.5 border border-[#dedee5] rounded-lg bg-white min-h-[48px]">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => removeTag(t)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f1f1f5] border border-[#dedee5] text-[#525261] hover:bg-[#fee] hover:border-[#f99] transition-colors"
            >
              {t} ×
            </button>
          ))}
          {addingTag ? (
            <input
              autoFocus
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitTag(); } if (e.key === "Escape") { setAddingTag(false); setTagInput(""); } }}
              onBlur={commitTag}
              placeholder="タグを入力"
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-[#6666ff] outline-none w-24"
            />
          ) : (
            <button
              onClick={() => setAddingTag(true)}
              className="text-[11px] text-[#6666ff] font-semibold px-2 hover:opacity-70 transition-opacity"
            >
              + 追加
            </button>
          )}
        </div>
      </EditField>

      <div className="text-[10.5px] text-[#9a9aa0] mt-2 leading-relaxed">
        ※ このページはモックです。変更は保存されません。
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyPage() {
  const user = getCurrentUser();

  const [view, setView] = useState<SpView>("hub");
  const [actFilter, setActFilter] = useState(0);
  const [lbTab, setLbTab] = useState(0);
  const [pcTab, setPcTab] = useState(0);

  const isPremium = CURRENT_VISITS >= PREMIUM_REQS.visits && CURRENT_DUTIES >= PREMIUM_REQS.duties;

  // ─── PC section ───────────────────────────────────────────────────────────

  const pcSection = (
    <div className="hidden md:flex flex-col h-full bg-white">
      <PcHeader
        title={user.name}
        sub={`@taro.tanaka · 新富商店街コミュニティ`}
        right={
          <button
            onClick={() => setView("edit")}
            className="text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-[#dedee5] hover:bg-[#f1f1f5] transition-colors"
          >
            プロフィールを編集
          </button>
        }
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left identity panel */}
        <div className="w-[280px] flex-none border-r border-[#dedee5] bg-[#f1f1f5] p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col items-center gap-2">
            <Avatar size={80} label={user.initial} tone={user.tone} />
            <div className="text-[16px] font-bold">{user.name}</div>
            <RankBadge xp={CURRENT_XP} />
          </div>

          {/* Stats 2×2 */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: DAO_BALANCE.toString(), k: "DAO残高", accent: true },
              { v: CHECKIN_COUNT.toString(), k: "チェックイン" },
              { v: TASK_DONE.toString(), k: "タスク完了" },
              { v: "4", k: "クーポン" },
            ].map((s) => (
              <div
                key={s.k}
                className="p-2.5 border border-[#dedee5] rounded-lg bg-white text-center"
              >
                <div
                  className="text-[18px] font-bold font-mono leading-none"
                  style={{ color: s.accent ? "#6666ff" : "#1a1a1a" }}
                >
                  {s.v}
                </div>
                <div className="text-[10px] text-[#9a9aa0] mt-1">{s.k}</div>
              </div>
            ))}
          </div>

          {/* Premium progress summary */}
          <div className="p-3 border border-[#dedee5] rounded-lg bg-white text-[11px] leading-relaxed">
            <div className="font-bold mb-1">プレミアム達成まで</div>
            <div className="text-[#525261]">
              チェックインあと <strong>{PREMIUM_REQS.visits - CURRENT_VISITS}回</strong> / 担い手活動あと{" "}
              <strong>{Math.max(0, PREMIUM_REQS.duties - CURRENT_DUTIES)}件</strong>
            </div>
          </div>
        </div>

        {/* Right: tabs + content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[#dedee5] px-6">
            {["アクティビティ", "ランクとXP", "獲得バッジ", "設定"].map((t, i) => (
              <button
                key={t}
                onClick={() => setPcTab(i)}
                className={`py-3 px-3.5 text-[12px] border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  i === pcTab
                    ? "font-semibold text-[#1a1a1a] border-[#1a1a1a]"
                    : "font-medium text-[#9a9aa0] border-transparent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Tab 0: Activity */}
            {pcTab === 0 && (
              <div className="flex flex-col">
                {ACTIVITY_PC.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2.5 border-b border-[#dedee5]"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#e8e8f0] text-[#525261] text-[14px] font-bold flex items-center justify-center flex-none">
                      {PC_KIND_ICON[a.kind]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium">{a.what}</div>
                      <div className="text-[10px] text-[#9a9aa0] font-mono mt-0.5">{a.d}</div>
                    </div>
                    {a.xp !== null && (
                      <span className="text-[11px] font-mono font-semibold text-[#525261]">
                        +{a.xp} XP
                      </span>
                    )}
                    {a.amt !== null && (
                      <span
                        className="text-[11.5px] font-mono font-bold"
                        style={{ color: (a.amt ?? 0) > 0 ? "#6666ff" : "#525261" }}
                      >
                        {(a.amt ?? 0) > 0 ? "+" : ""}
                        {a.amt} DAO
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 1: Rank & XP */}
            {pcTab === 1 && (
              <div className="max-w-xl">
                <RankProgressCard
                  visits={CURRENT_VISITS}
                  duties={CURRENT_DUTIES}
                  xp={CURRENT_XP}
                />
                <div className="mt-4 text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono mb-2">
                  ━━ XPの稼ぎ方
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {XP_WAYS.map((w) => (
                    <div
                      key={w.k}
                      className="border border-[#dedee5] rounded-lg p-2.5"
                    >
                      <div className="text-[11.5px] font-semibold">{w.k}</div>
                      <div className="text-[13px] font-bold font-mono text-[#6666ff] mt-0.5">
                        {w.v} XP
                      </div>
                      <div className="text-[9.5px] text-[#9a9aa0] mt-0.5">{w.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono mb-2">
                  ━━ 最近の獲得
                </div>
                {RECENT_XP.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2.5 border-b border-[#dedee5]"
                  >
                    <div className="flex-1">
                      <div className="text-[12px]">{r.what}</div>
                      <div className="text-[10px] text-[#9a9aa0] font-mono mt-0.5">{r.d}</div>
                    </div>
                    <span className="text-[12px] text-[#6666ff] font-bold font-mono">
                      +{r.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Badges */}
            {pcTab === 2 && (
              <div className="grid grid-cols-3 gap-3 max-w-lg">
                {BADGES.map((b) => (
                  <div
                    key={b.name}
                    className="border border-[#dedee5] rounded-xl p-4 flex flex-col items-center gap-2 bg-[#f1f1f5]"
                  >
                    <span className="text-[32px]">{b.icon}</span>
                    <span className="text-[11px] font-semibold text-center leading-snug">
                      {b.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Settings */}
            {pcTab === 3 && (
              <div className="max-w-lg">
                {SETTINGS_GROUPS.map((g) => (
                  <div key={g.label} className="mb-4">
                    <div className="text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono uppercase pb-1.5">
                      {g.label}
                    </div>
                    {g.items.map((it, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-0 py-3 border-b border-[#dedee5] text-[12.5px]"
                      >
                        <span>{it.k}</span>
                        <span className="text-[#9a9aa0]">{it.v} ›</span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="pt-4">
                  <Button variant="ghost" full>
                    ログアウト
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ─── SP: Hub ──────────────────────────────────────────────────────────────

  if (view === "hub") {
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full">
          <TopBar
            title="マイページ"
            left={<BackButton />}
            right={
              <button className="text-[14px] text-[#9a9aa0]">⚙</button>
            }
          />
          <div className="flex-1 overflow-y-auto">
            {/* Identity */}
            <div className="flex items-center gap-3.5 px-5 pt-4 pb-3">
              <Avatar size={56} label={user.initial} tone={user.tone} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] font-bold">{user.name}</span>
                  <RankBadge xp={CURRENT_XP} compact />
                </div>
                <div className="text-[10.5px] text-[#9a9aa0] font-mono mt-0.5">
                  @taro.tanaka
                </div>
                <div className="text-[10.5px] text-[#525261] mt-0.5">
                  新富商店街 · 加入 6ヶ月
                </div>
              </div>
              <button
                onClick={() => setView("edit")}
                className="text-[11px] text-[#6666ff] font-semibold"
              >
                編集
              </button>
            </div>

            {/* Rank progress */}
            <div className="px-5 pb-3">
              <RankProgressCard
                visits={CURRENT_VISITS}
                duties={CURRENT_DUTIES}
                xp={CURRENT_XP}
              />
            </div>

            {/* Stats */}
            <div className="mx-5 mb-3.5 px-2 py-3 bg-[#f1f1f5] rounded-xl border border-[#dedee5] flex items-center justify-around">
              {[
                { v: DAO_BALANCE.toString(), k: "DAO残高", accent: true },
                { v: CHECKIN_COUNT.toString(), k: "チェックイン" },
                { v: TASK_DONE.toString(), k: "タスク完了" },
              ].map((s) => (
                <div key={s.k} className="text-center flex-1">
                  <div
                    className="text-[20px] font-bold font-mono leading-none"
                    style={{ color: s.accent ? "#6666ff" : "#1a1a1a" }}
                  >
                    {s.v}
                  </div>
                  <div className="text-[9.5px] text-[#9a9aa0] mt-0.5">{s.k}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="px-5 pb-1.5 text-[11.5px] text-[#525261] leading-relaxed">
              地元のカフェ巡りが好きです。週末は商店街の手伝いをしています。
            </div>
            <div className="flex flex-wrap gap-1.5 px-5 pb-3.5">
              {["カフェ", "イベント運営", "写真"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f1f1f5] border border-[#dedee5] text-[#525261]"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="border-t border-[#dedee5] mb-0" />

            {/* Nav list */}
            {NAV_ITEMS.map((row) => (
              <button
                key={row.label}
                onClick={() => setView(row.view)}
                className="w-full flex items-center gap-3 px-5 py-2.5 border-b border-[#dedee5] hover:bg-[#fafafa] transition-colors text-left"
              >
                <span className="text-[14px] w-5 text-center flex-none">{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium">{row.label}</div>
                  {row.sub && (
                    <div className="text-[9.5px] text-[#9a9aa0] mt-0.5">{row.sub}</div>
                  )}
                </div>
                <span className="text-[14px] text-[#9a9aa0]">›</span>
              </button>
            ))}

            {/* Level-up demo button (only shown if not premium) */}
            {!isPremium && (
              <button
                onClick={() => setView("level_up")}
                className="w-full flex items-center gap-3 px-5 py-2.5 border-b border-[#dedee5] hover:bg-[#fafafa] transition-colors text-left"
              >
                <span className="text-[14px] w-5 text-center flex-none">🎖</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium">プレミアム達成イメージ</div>
                  <div className="text-[9.5px] text-[#9a9aa0] mt-0.5">達成通知のプレビュー</div>
                </div>
                <span className="text-[14px] text-[#9a9aa0]">›</span>
              </button>
            )}
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // ─── SP: Activity ─────────────────────────────────────────────────────────

  if (view === "activity") {
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full">
          <TopBar
            title="アクティビティ履歴"
            left={<BackButton onClick={() => setView("hub")} />}
          />
          {/* Filter chips */}
          <div className="flex-none flex gap-1.5 px-4 py-2 overflow-x-auto border-b border-[#dedee5]">
            {ACTIVITY_FILTER_TAGS.map((t, i) => (
              <button
                key={t}
                onClick={() => setActFilter(i)}
                className={`flex-none text-[11px] px-3 py-1 rounded-full border whitespace-nowrap transition-colors ${
                  i === actFilter
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-semibold"
                    : "bg-white text-[#525261] border-[#dedee5] font-medium"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto py-1.5">
            {ACTIVITY_SP.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-5 py-2.5"
              >
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1a1a1a] flex-none ring-1 ring-[#dedee5] ring-offset-1" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-[#1a1a1a]">{a.desc}</div>
                  <div className="text-[10px] text-[#9a9aa0] font-mono mt-0.5">{a.t}</div>
                </div>
                {a.amt && (
                  <span
                    className="text-[11px] font-bold font-mono"
                    style={{ color: a.amt.startsWith("+") ? "#6666ff" : "#525261" }}
                  >
                    {a.amt}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // ─── SP: Settings ─────────────────────────────────────────────────────────

  if (view === "settings") {
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full">
          <TopBar
            title="アカウント設定"
            left={<BackButton onClick={() => setView("hub")} />}
          />
          <div className="flex-1 overflow-y-auto">
            {SETTINGS_GROUPS.map((g) => (
              <div key={g.label}>
                <div className="px-5 pt-3.5 pb-1.5 text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono uppercase">
                  {g.label}
                </div>
                {g.items.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3 border-b border-[#dedee5] bg-white text-[12.5px]"
                  >
                    <span>{it.k}</span>
                    <span className="text-[#9a9aa0] text-[12px]">{it.v} ›</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="px-5 py-5">
              <Button variant="ghost" full>
                ログアウト
              </Button>
            </div>
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // ─── SP: Rank Detail ──────────────────────────────────────────────────────

  if (view === "rank_detail") {
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full">
          <TopBar
            title="ランクとXP"
            left={<BackButton onClick={() => setView("hub")} />}
            right={<span className="text-[13px] text-[#9a9aa0]">履歴</span>}
          />
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-3.5">
              <RankProgressCard
                visits={CURRENT_VISITS}
                duties={CURRENT_DUTIES}
                xp={CURRENT_XP}
              />
            </div>

            <div className="border-t border-[#dedee5]" />
            <div className="px-4 pt-3.5 pb-1.5 text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono">
              ━━ ランクの仕組み
            </div>
            <div className="px-4 pb-3.5 flex flex-col gap-2">
              {[
                {
                  tier: RANKS.basic,
                  note: "加入時点で全員。投稿・DM・投票・チェックインが利用可能。",
                },
                {
                  tier: RANKS.premium,
                  note: "年に3回以上の訪問 + 担い手活動の完了で達成。優先依頼・特別バッジ・運営者専用チャンネルへの参加権。",
                },
              ].map((row) => (
                <div
                  key={row.tier.id}
                  className="border border-[#dedee5] rounded-xl p-3 flex gap-3 items-start"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[16px] font-bold text-white flex-none"
                    style={{ background: row.tier.color }}
                  >
                    {row.tier.glyph}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold">{row.tier.name}</div>
                    <div className="text-[11px] text-[#525261] leading-relaxed mt-0.5">
                      {row.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#dedee5]" />
            <div className="flex items-center justify-between px-4 pt-3.5 pb-1.5">
              <div className="text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono">
                ━━ 募集中の担い手活動
              </div>
              <span className="text-[10px] text-[#9a9aa0]">すべて →</span>
            </div>
            <div className="px-4 pb-3.5 flex flex-col gap-2">
              {DUTY_OFFERINGS.map((d, i) => (
                <div
                  key={i}
                  className="border border-[#dedee5] rounded-xl px-3 py-2.5 flex items-center gap-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[12px] font-bold">{d.name}</span>
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#e8e8f0] text-[#525261]">
                        {d.tag}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-[#9a9aa0] font-mono">
                      {d.date} · {d.spots}
                    </div>
                  </div>
                  <div className="text-right flex-none">
                    <div className="text-[11px] font-bold font-mono text-[#6666ff]">
                      +{d.xp} XP
                    </div>
                    <button className="mt-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-white">
                      申込
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#dedee5]" />
            <div className="px-4 pt-3.5 pb-1.5 text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono">
              ━━ XPの稼ぎ方
            </div>
            <div className="px-4 pb-3.5 grid grid-cols-2 gap-2">
              {XP_WAYS.map((w) => (
                <div key={w.k} className="border border-[#dedee5] rounded-lg p-2.5">
                  <div className="text-[11.5px] font-semibold">{w.k}</div>
                  <div className="text-[13px] font-bold font-mono text-[#6666ff] mt-0.5">
                    {w.v} XP
                  </div>
                  <div className="text-[9.5px] text-[#9a9aa0] mt-0.5">{w.sub}</div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-2 text-[10.5px] text-[#9a9aa0] leading-relaxed">
              ※ XPは活動量の目安です。ランクの判定はチェックイン回数と担い手活動の完了で行われます。
            </div>

            <div className="border-t border-[#dedee5]" />
            <div className="px-4 pt-3.5 pb-1.5 text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono">
              ━━ 最近の獲得
            </div>
            {RECENT_XP.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-[#dedee5]"
              >
                <div className="flex-1">
                  <div className="text-[12px]">{r.what}</div>
                  <div className="text-[10px] text-[#9a9aa0] font-mono mt-0.5">{r.d}</div>
                </div>
                <span className="text-[12px] text-[#6666ff] font-bold font-mono">
                  +{r.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // ─── SP: Leaderboard ──────────────────────────────────────────────────────

  if (view === "leaderboard") {
    const podium = [LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]]; // 2nd, 1st, 3rd
    const podiumHeights = [70, 90, 56];
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full">
          <TopBar
            title="ランキング"
            left={<BackButton onClick={() => setView("hub")} />}
          />
          {/* Segmented tabs */}
          <div className="flex-none flex gap-1 p-2 border-b border-[#dedee5] bg-[#f1f1f5]">
            {["今月", "今年", "全期間"].map((t, i) => (
              <button
                key={t}
                onClick={() => setLbTab(i)}
                className={`flex-1 py-1.5 text-[12px] rounded-md transition-colors ${
                  i === lbTab
                    ? "bg-white font-semibold text-[#1a1a1a] shadow-sm"
                    : "font-medium text-[#9a9aa0]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Podium */}
            <div className="flex items-end justify-around gap-2 px-4 py-4">
              {podium.map((p, idx) => (
                <div key={p.who} className="flex flex-col items-center flex-1">
                  <Avatar size={idx === 1 ? 46 : 38} label={p.who[0]} tone={p.tone} />
                  <div className="text-[10.5px] font-semibold mt-1 text-center leading-tight">
                    {p.who}
                  </div>
                  <div className="text-[10px] text-[#9a9aa0] font-mono">
                    {p.xp.toLocaleString()} XP
                  </div>
                  <div
                    className="w-full rounded-t-sm mt-1.5 flex items-start justify-center pt-1 text-[14px] font-bold font-mono"
                    style={{
                      height: podiumHeights[idx],
                      background: idx === 1 ? "#1a1a1a" : "#e8e8f0",
                      color: idx === 1 ? "white" : "#525261",
                      border: idx === 1 ? "none" : "1px solid #dedee5",
                    }}
                  >
                    {p.rank}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#dedee5]" />
            {/* Full list */}
            {LEADERBOARD.map((p) => (
              <div
                key={p.rank}
                className={`flex items-center gap-2.5 px-4 py-2.5 border-b border-[#dedee5] ${
                  p.me ? "bg-[#eeeeff]" : ""
                }`}
              >
                <span
                  className="text-[12px] font-bold font-mono w-5 text-center"
                  style={{ color: p.rank <= 3 ? "#6666ff" : "#9a9aa0" }}
                >
                  {p.rank}
                </span>
                <Avatar size={32} label={p.who[0]} tone={p.tone} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold">{p.who}</span>
                    <RankBadge tier={p.premium ? "premium" : "basic"} compact />
                  </div>
                  <div className="text-[10px] text-[#9a9aa0] font-mono mt-0.5">
                    {p.xp.toLocaleString()} XP
                  </div>
                </div>
                <span className="text-[10px] font-bold font-mono text-[#6666ff]">
                  {p.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // ─── SP: Level Up (Premium achievement) ───────────────────────────────────

  if (view === "level_up") {
    const r = RANKS.premium;
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full bg-[#f1f1f5]">
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            <div className="text-[10px] text-[#6666ff] font-bold font-mono tracking-widest mb-6">
              PREMIUM UNLOCKED
            </div>
            <div
              className="w-[120px] h-[120px] rounded-full flex items-center justify-center text-[56px] font-bold text-white mb-7"
              style={{
                background: r.color,
                boxShadow: `0 0 0 8px white, 0 0 0 9px ${r.color}40, 0 12px 30px rgba(0,0,0,.15)`,
              }}
            >
              {r.glyph}
            </div>
            <div className="text-[13px] text-[#9a9aa0] mb-1">プレミアムランクに到達!</div>
            <div className="text-[28px] font-bold mb-1.5">{r.name}</div>
            <div className="text-[12px] text-[#525261] mb-6 text-center leading-relaxed">
              年3回の訪問 ✓<br />地域の担い手活動 ✓
            </div>
            <div className="w-full px-4 py-3.5 bg-white border border-[#dedee5] rounded-xl mb-6">
              <div className="text-[10px] text-[#9a9aa0] font-mono tracking-widest mb-2">
                解放された特典
              </div>
              {["優先依頼の閲覧・応募", "運営者専用チャンネル参加", "プレミアムバッジ表示"].map(
                (b) => (
                  <div key={b} className="text-[12px] font-semibold mb-1">
                    ✓ {b}
                  </div>
                )
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Button full>シェアする</Button>
              <Button variant="ghost" full onClick={() => setView("hub")}>
                続ける
              </Button>
            </div>
          </div>
        </div>
        {pcSection}
      </div>
    );
  }

  // ─── Edit profile ─────────────────────────────────────────────────────────

  if (view === "edit") {
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full">
          <TopBar
            title="プロフィールを編集"
            left={<BackButton onClick={() => setView("hub")} />}
            right={
              <button
                onClick={() => setView("hub")}
                className="text-[12px] font-semibold text-[#6666ff]"
              >
                保存
              </button>
            }
          />
          <div className="flex-1 overflow-y-auto p-4">
            <EditProfileForm />
          </div>
        </div>
        <div className="hidden md:flex flex-col h-full">
          <PcHeader
            title="プロフィールを編集"
            right={
              <>
                <button
                  onClick={() => setView("hub")}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-[#dedee5] hover:bg-[#f1f1f5] transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => setView("hub")}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors"
                >
                  保存
                </button>
              </>
            }
          />
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[560px] mx-auto p-6">
              <EditProfileForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="md:hidden" />
      {pcSection}
    </div>
  );
}
