"use client";

import { Avatar } from "@/components/atoms/Avatar";
import { RankBadge } from "@/components/atoms/RankBadge";
import type { BoardPost } from "@/mocks/types";

interface BoardListProps {
  posts: BoardPost[];
}

export function BoardList({ posts }: BoardListProps) {
  return (
    <div className="flex flex-col">
      {/* 投稿リスト */}
      {posts.map((b) => (
        <div
          key={b.id}
          className="flex gap-2.5 px-4 py-3 border-b border-[#dedee5] cursor-pointer hover:bg-[#f1f1f5] transition-colors"
        >
          <Avatar size={32} label={b.authorName[0]} tone={b.tone} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[11.5px] font-semibold">{b.authorName}</span>
              <RankBadge xp={b.xp} compact showName={false} />
              <span className="text-[10px] text-[#9a9aa0]">{b.time}</span>
              {b.tokens != null && (
                <span className="text-[10px] font-bold font-mono text-[#6666ff]">
                  +{b.tokens} DAO
                </span>
              )}
              {b.isUnread && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#6666ff] shrink-0" />
              )}
            </div>
            <div className="text-[12.5px] font-semibold mb-1 leading-snug">{b.title}</div>
            <div className="text-[11px] text-[#525261] leading-snug line-clamp-2">{b.body}</div>
          </div>
        </div>
      ))}

      <div className="py-4 text-center">
        <button className="text-[11px] text-[#525261] font-semibold px-3.5 py-1.5 rounded-[999px] border border-[#bbbbc0] bg-white hover:bg-[#f1f1f5] transition-colors">
          もっと見る
        </button>
      </div>
    </div>
  );
}
