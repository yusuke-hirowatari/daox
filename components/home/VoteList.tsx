"use client";

import { useState } from "react";
import type { Vote } from "@/mocks/types";

interface VoteListProps {
  votes: Vote[];
  onVote?: (voteId: string, optionLabel: string) => void;
  votedMap?: Record<string, string>; // voteId → 選んだ label
}

export function VoteList({ votes, onVote, votedMap = {} }: VoteListProps) {
  // ローカルの選択状態（確定前）
  const [selected, setSelected] = useState<Record<string, string>>({});

  return (
    <div className="flex flex-col gap-2.5 p-4">
      {votes.map((v) => {
        const pct = Math.round((v.voted / v.total) * 100);
        const myVote = votedMap[v.id];
        const mySelection = selected[v.id];
        const isVoted = !!myVote;

        return (
          <div key={v.id} className="border border-[#dedee5] rounded-xl p-3 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[10px] font-semibold font-mono ${isVoted ? "text-[#2d7a4a]" : "text-[#6666ff]"}`}>
                {isVoted ? "投票済み" : "投票受付中"}
              </span>
              <span className="text-[10px] text-[#9a9aa0]">{v.deadline}</span>
            </div>
            <div className="text-[13px] font-semibold mb-2 leading-snug">{v.title}</div>

            {/* 選択肢 */}
            <div className="flex flex-col gap-1.5 mb-3">
              {v.options.map((o) => {
                const optPct = v.total > 0 ? Math.round((o.voteCount / v.total) * 100) : 0;
                const isMyVote = myVote === o.label;
                const isSelected = mySelection === o.label;

                return (
                  <button
                    key={o.label}
                    type="button"
                    disabled={isVoted}
                    onClick={() => {
                      if (!isVoted) {
                        setSelected((prev) => ({
                          ...prev,
                          [v.id]: prev[v.id] === o.label ? "" : o.label,
                        }));
                      }
                    }}
                    className={[
                      "relative text-left w-full",
                      !isVoted && "cursor-pointer hover:border-[#6666ff]",
                      isVoted && "cursor-default",
                    ].filter(Boolean).join(" ")}
                  >
                    {/* バー */}
                    <div
                      className={`absolute inset-y-0 left-0 rounded-md ${isMyVote ? "bg-[#e5e5ff]" : "bg-[#f2f2ff]"}`}
                      style={{ width: `${optPct}%` }}
                    />
                    <div
                      className={[
                        "relative flex items-center justify-between px-2.5 py-1.5 rounded-md border text-[11.5px] transition-colors",
                        isMyVote
                          ? "border-[#6666ff] bg-[#f2f2ff]/50"
                          : isSelected
                            ? "border-[#6666ff] bg-white"
                            : "border-[#dedee5]",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-1.5">
                        {/* ラジオインジケーター */}
                        {!isVoted && (
                          <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-[#6666ff]" : "border-[#bbbbc0]"}`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#6666ff]" />}
                          </span>
                        )}
                        {isMyVote && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6666ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        <span className="text-[#525261]">{o.label}</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#9a9aa0]">{optPct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#9a9aa0]">
              <span>{v.voted} / {v.total}人 投票済</span>
              <span className="font-mono">{pct}%</span>
            </div>

            {/* 投票ボタン or 投票済み表示 */}
            {isVoted ? (
              <div className="mt-2.5 w-full text-center text-[11px] text-[#9a9aa0] py-2">
                「{myVote}」に投票しました
              </div>
            ) : (
              <button
                disabled={!mySelection}
                onClick={() => {
                  if (mySelection && onVote) {
                    onVote(v.id, mySelection);
                    setSelected((prev) => {
                      const next = { ...prev };
                      delete next[v.id];
                      return next;
                    });
                  }
                }}
                className={[
                  "mt-2.5 w-full text-[12px] font-semibold py-2 rounded-[999px] transition-colors",
                  mySelection
                    ? "bg-[#1a1a1a] text-white hover:bg-[#333]"
                    : "bg-[#dedee5] text-[#9a9aa0] cursor-not-allowed",
                ].join(" ")}
              >
                投票する
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
