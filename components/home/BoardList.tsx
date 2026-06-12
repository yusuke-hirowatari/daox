"use client";

import { Avatar } from "@/components/atoms/Avatar";
import { RankBadge } from "@/components/atoms/RankBadge";
import type { BoardPost, BoardComment } from "@/mocks/types";

interface BoardListProps {
  posts: BoardPost[];
  comments?: BoardComment[];
  onSelect?: (post: BoardPost) => void;
}

export function BoardList({ posts, comments = [], onSelect }: BoardListProps) {
  const countByPost = comments.reduce((m, c) => {
    m.set(c.postId, (m.get(c.postId) ?? 0) + 1);
    return m;
  }, new Map<string, number>());

  return (
    <div className="flex flex-col">
      {posts.map((b) => {
        const cc = countByPost.get(b.id) ?? 0;
        return (
          <div
            key={b.id}
            onClick={() => onSelect?.(b)}
            className="flex gap-2.5 px-4 py-3 border-b border-[#dedee5] cursor-pointer hover:bg-[#f1f1f5] transition-colors"
          >
            <Avatar size={32} label={b.authorName[0]} tone={b.tone} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="text-[11.5px] font-semibold">{b.authorName}</span>
                <RankBadge xp={b.xp} compact showName={false} />
                <span className="text-[10px] text-[#9a9aa0]">{b.time}</span>
                {b.isUnread && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6666ff] shrink-0" />
                )}
              </div>
              <div className="text-[12.5px] font-semibold mb-1 leading-snug">{b.title}</div>
              <div className="text-[11px] text-[#525261] leading-snug line-clamp-2">{b.body}</div>
              {cc > 0 && (
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-[#9a9aa0]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="font-semibold">{cc}件のコメント</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="py-4 text-center">
        <button className="text-[11px] text-[#525261] font-semibold px-3.5 py-1.5 rounded-[999px] border border-[#bbbbc0] bg-white hover:bg-[#f1f1f5] transition-colors">
          もっと見る
        </button>
      </div>
    </div>
  );
}
