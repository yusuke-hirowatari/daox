"use client";

import { useState } from "react";
import Link from "next/link";
import { SegmentedTabs } from "@/components/atoms/Tabs";
import { EmptyState } from "@/components/atoms/EmptyState";
import {
  NOTIFICATIONS_TODAY,
  NOTIFICATIONS_EARLIER,
} from "@/mocks/notifications";
import type { Notification, NotifKind } from "@/mocks/types";

// ─── Kind config ──────────────────────────────────────────────────────────

const KIND_META: Record<NotifKind, { glyph: string; accent: boolean }> = {
  token:  { glyph: "◈", accent: true  },
  task:   { glyph: "☑", accent: false },
  dm:     { glyph: "◐", accent: false },
  vote:   { glyph: "◇", accent: false },
  rank:   { glyph: "★", accent: true  },
  system: { glyph: "!",  accent: false },
};

// ─── Module-level atoms ───────────────────────────────────────────────────

function NotifIcon({ kind, size = 32 }: { kind: NotifKind; size?: number }) {
  const m = KIND_META[kind];
  return (
    <div
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className={`flex-none flex items-center justify-center font-bold text-[14px] ${
        m.accent
          ? "bg-[#ebebff] text-[#6666ff]"
          : "bg-[#f1f1f5] text-[#7a7a84]"
      }`}
    >
      {m.glyph}
    </div>
  );
}

function NotifRow({ n }: { n: Notification }) {
  return (
    <div
      className={`flex gap-2.5 items-start px-4 py-[11px] border-b border-[#dedee5] ${
        n.isUnread ? "bg-[#f8f8ff]" : "bg-transparent"
      }`}
    >
      <NotifIcon kind={n.kind} />
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] leading-[1.4]">
          {n.fromUserName && (
            <span className="font-bold">{n.fromUserName}</span>
          )}
          <span className="text-[#7a7a84]">
            {n.fromUserName ? " " : ""}
            {n.text}
          </span>
        </div>
        {n.meta && (
          <div
            className={`text-[11px] mt-[3px] ${
              n.kind === "token"
                ? "text-[#6666ff] font-bold font-mono"
                : "text-[#9a9aa0] font-medium"
            }`}
          >
            {n.meta}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-[5px] flex-none">
        <span className="text-[10px] text-[#9a9aa0] font-mono">{n.time}</span>
        {n.isUnread && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#6666ff]" />
        )}
      </div>
    </div>
  );
}

// ─── Filter helpers ───────────────────────────────────────────────────────

const MENTION_KINDS: NotifKind[] = ["dm", "token"];
const NOTICE_KINDS: NotifKind[] = ["task", "vote", "rank", "system"];

function filterByTab(notifs: Notification[], tab: number): Notification[] {
  if (tab === 1) return notifs.filter((n) => MENTION_KINDS.includes(n.kind));
  if (tab === 2) return notifs.filter((n) => NOTICE_KINDS.includes(n.kind));
  return notifs;
}

// ─── PC group data ────────────────────────────────────────────────────────

type PcItem = {
  ico: string;
  accent: boolean;
  who: string;
  text: string;
  amt?: string;
  cta?: string;
  ctaHref?: string;
  ago: string;
};

const PC_GROUPS: { date: string; items: PcItem[] }[] = [
  {
    date: "今日",
    items: [
      {
        ico: "☑", accent: true,
        who: "佐藤 健太",
        text: "があなたのタスク「看板リペイント手伝い」の実施報告を送信しました",
        cta: "承認画面へ", ctaHref: "/tasks",
        ago: "14:20",
      },
      {
        ico: "◈", accent: false,
        who: "伊藤 さくら",
        text: "からトークンを受け取りました",
        amt: "+120 DAO",
        ago: "14:20",
      },
      {
        ico: "💬", accent: false,
        who: "商店街本部",
        text: "からDMが届いています: 「夏祭りの件、改めて連絡します」",
        ago: "11:08",
      },
    ],
  },
  {
    date: "昨日",
    items: [
      {
        ico: "🎟", accent: false,
        who: "カフェ ことり",
        text: "のクーポンを使用しました",
        ago: "11:08",
      },
      {
        ico: "🗳", accent: false,
        who: "盆踊り会場の候補について",
        text: "の投票が開始されました",
        cta: "投票する", ctaHref: "/home",
        ago: "09:15",
      },
    ],
  },
  {
    date: "5/22",
    items: [
      {
        ico: "🎖", accent: true,
        who: "プレミアム達成",
        text: "間近です — チェックインあと3回!",
        ago: "08:00",
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [spTab, setSpTab] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([
    ...NOTIFICATIONS_TODAY,
    ...NOTIFICATIONS_EARLIER,
  ]);

  const todayNotifs = filterByTab(
    notifications.slice(0, NOTIFICATIONS_TODAY.length),
    spTab,
  );
  const earlierNotifs = filterByTab(
    notifications.slice(NOTIFICATIONS_TODAY.length),
    spTab,
  );

  const [showSettings, setShowSettings] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    token: true, task: true, dm: true, vote: true, rank: true, system: true,
  });
  const hasUnread = notifications.some((n) => n.isUnread);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));

  return (
    <div className="flex flex-col h-full">

      {/* ══════════════════════════════════════════
          MOBILE レイアウト
      ══════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 overflow-hidden md:hidden">

        {/* Mark all read + Tabs */}
        <div className="flex-none flex items-center justify-end px-4 pt-1 pb-0">
          <button
            className="text-[10.5px] text-[#7a7a84] font-semibold disabled:opacity-40"
            onClick={markAllRead}
            disabled={!hasUnread}
          >
            すべて既読
          </button>
        </div>

        {/* Tabs */}
        <SegmentedTabs
          tabs={["すべて", "メンション", "お知らせ"]}
          defaultIndex={spTab}
          onChange={setSpTab}
        />

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {/* 今日 */}
          {todayNotifs.length > 0 && (
            <>
              <div className="px-4 pt-2 pb-1 text-[10.5px] text-[#9a9aa0] font-mono tracking-wide">
                ━━ 今日
              </div>
              {todayNotifs.map((n) => (
                <NotifRow key={n.id} n={n} />
              ))}
            </>
          )}

          {/* それより前 */}
          {earlierNotifs.length > 0 && (
            <>
              <div className="px-4 pt-3.5 pb-1 text-[10.5px] text-[#9a9aa0] font-mono tracking-wide">
                ━━ それより前
              </div>
              {earlierNotifs.map((n) => (
                <NotifRow key={n.id} n={n} />
              ))}
            </>
          )}

          {/* Empty state */}
          {todayNotifs.length === 0 && earlierNotifs.length === 0 && (
            <EmptyState
              variant="notification"
              title="通知はありません"
              sub="新しいアクティビティがあればここに表示されます"
            />
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PC (Desktop) レイアウト
      ══════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col flex-1 overflow-hidden">


        {/* PC Notification Settings dropdown */}
        {showSettings && (
          <div className="flex-none border-b border-[#dedee5] bg-[#f9f9fb] px-6 py-3">
            <div className="max-w-[720px] mx-auto">
              <div className="text-[11px] font-bold text-[#9a9aa0] mb-2">通知カテゴリ</div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["token", "トークン"],
                    ["task", "タスク"],
                    ["dm", "DM"],
                    ["vote", "投票"],
                    ["rank", "ランク"],
                    ["system", "システム"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setNotifSettings((s) => ({ ...s, [key]: !s[key] }))
                    }
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      notifSettings[key]
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                        : "bg-white text-[#9a9aa0] border-[#dedee5]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PC Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[720px] w-full mx-auto px-6 py-4">
            {PC_GROUPS.map((g) => (
              <div key={g.date} className="mb-[18px]">
                {/* Date label */}
                <div className="text-[11px] font-bold text-[#9a9aa0] tracking-[0.4px] px-1 mb-1.5">
                  {g.date}
                </div>
                {/* Items */}
                {g.items.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3.5 py-3 border border-[#dedee5] rounded-[10px] bg-white mb-1.5"
                  >
                    {/* Icon */}
                    <span
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-[16px] font-bold flex-none ${
                        it.accent
                          ? "bg-[#ebebff] text-[#6666ff]"
                          : "bg-[#f1f1f5] text-[#7a7a84]"
                      }`}
                    >
                      {it.ico}
                    </span>
                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px]">
                        <span className="font-bold">{it.who}</span>
                        {it.text}
                      </div>
                      <div className="text-[10px] text-[#9a9aa0] font-mono mt-0.5">
                        {it.ago}
                      </div>
                    </div>
                    {/* Amount */}
                    {it.amt && (
                      <span className="text-[13px] font-bold font-mono text-[#6666ff] flex-none">
                        {it.amt}
                      </span>
                    )}
                    {/* CTA */}
                    {it.cta && (
                      <Link
                        href={it.ctaHref ?? "#"}
                        className="flex-none text-[12px] font-semibold px-3 py-1.5 rounded-[999px] bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors whitespace-nowrap"
                      >
                        {it.cta}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
