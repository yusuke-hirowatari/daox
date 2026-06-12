"use client";

import { useState } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import type { Vote } from "@/mocks/types";

const UPCOMING_EVENTS = [
  { date: "6/1",  day: "土", title: "商店街クリーン作戦", reward: 50 },
  { date: "6/15", day: "日", title: "夏祭り 設営手伝い",  reward: 100 },
] as const;

const NEW_MEMBERS = [
  { who: "吉田", tone: 2, when: "今日参加" },
  { who: "中村", tone: 4, when: "昨日参加" },
  { who: "高橋", tone: 1, when: "3日前" },
] as const;

interface RightPaneProps {
  votes: Vote[];
}

export function RightPane({ votes }: RightPaneProps) {
  const [greeted, setGreeted] = useState<Set<string>>(new Set());
  const topVote = votes[0];
  const topPct = topVote ? Math.round((topVote.voted / topVote.total) * 100) : 0;

  return (
    <div
      className="shrink-0 border-l border-[#dedee5] bg-[#f1f1f5] overflow-y-auto p-4"
      style={{ width: 260 }}
    >
      {/* 投票受付中 */}
      <p className="text-[10px] font-mono text-[#9a9aa0] uppercase tracking-widest mb-2.5">
        ━━ 投票受付中
      </p>
      {topVote && (
        <div className="border border-[#dedee5] bg-white rounded-lg p-2.5 mb-4">
          <div className="text-[12px] font-semibold mb-1 leading-snug">{topVote.title}</div>
          <div className="text-[10px] text-[#9a9aa0]">{topVote.deadline} · {topPct}% 投票済</div>
        </div>
      )}

      {/* 今後の予定 */}
      <p className="text-[10px] font-mono text-[#9a9aa0] uppercase tracking-widest mb-2.5">
        ━━ 今後の予定
      </p>
      <div className="flex flex-col">
        {UPCOMING_EVENTS.map((e, i) => (
          <div
            key={e.date}
            className={`flex gap-2.5 py-2 ${i < UPCOMING_EVENTS.length - 1 ? "border-b border-[#dedee5]" : ""}`}
          >
            <div className="w-9 text-center shrink-0">
              <div className="text-[15px] font-bold font-mono leading-none">{e.date}</div>
              <div className="text-[9.5px] text-[#9a9aa0] mt-0.5">{e.day}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-semibold leading-snug">{e.title}</div>
              <div className="text-[10px] font-bold font-mono text-[#6666ff] mt-0.5">
                チェックイン +{e.reward} DAO
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 新着メンバー */}
      <p className="text-[10px] font-mono text-[#9a9aa0] uppercase tracking-widest mt-4 mb-2.5">
        ━━ 新着メンバー
      </p>
      <div className="flex flex-col">
        {NEW_MEMBERS.map((m) => (
          <div key={m.who} className="flex items-center gap-2 py-1.5">
            <Avatar size={28} label={m.who[0]} tone={m.tone} />
            <div className="flex-1">
              <div className="text-[11.5px] font-semibold">{m.who}さん</div>
              <div className="text-[9.5px] text-[#9a9aa0]">{m.when}</div>
            </div>
            {greeted.has(m.who) ? (
              <span className="text-[10px] px-2 py-[3px] rounded-[999px] bg-[#e8e8f0] text-[#9a9aa0] font-semibold">
                送信済
              </span>
            ) : (
              <button
                onClick={() => setGreeted((prev) => new Set(prev).add(m.who))}
                className="text-[10px] px-2 py-[3px] rounded-[999px] border border-[#bbbbc0] text-[#525261] font-semibold hover:bg-white transition-colors"
              >
                挨拶
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
