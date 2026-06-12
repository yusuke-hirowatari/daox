"use client";

import { useState } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { RankBadge } from "@/components/atoms/RankBadge";
import type { BoardPost, BoardComment } from "@/mocks/types";

interface PostDetailModalProps {
  post: BoardPost | null;
  comments: BoardComment[];
  onClose: () => void;
  onComment: (postId: string, text: string) => void;
}

export function PostDetailModal({ post, comments, onClose, onComment }: PostDetailModalProps) {
  const [text, setText] = useState("");

  if (!post) return null;

  const postComments = comments.filter((c) => c.postId === post.id);

  const handleSubmit = () => {
    const v = text.trim();
    if (!v) return;
    onComment(post.id, v);
    setText("");
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-14 md:bottom-0 z-[60] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full md:max-w-[520px] bg-white rounded-t-2xl md:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Handle (SP) */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-9 h-1 rounded-full bg-[#dedee5]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 md:py-3 border-b border-[#dedee5] shrink-0">
          <span className="text-[14px] font-bold">投稿詳細</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Original post */}
          <div className="p-4 border-b border-[#dedee5]">
            <div className="flex items-center gap-2.5 mb-3">
              <Avatar size={36} label={post.authorName[0]} tone={post.tone} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold">{post.authorName}</span>
                  <RankBadge xp={post.xp} compact showName={false} />
                </div>
                <span className="text-[10px] text-[#9a9aa0]">{post.time}</span>
              </div>
            </div>
            <h2 className="text-[15px] font-bold mb-2 leading-snug">{post.title}</h2>
            <div className="text-[13px] text-[#525261] leading-relaxed whitespace-pre-wrap">
              {post.body}
            </div>
          </div>

          {/* Comments section */}
          <div className="px-4 pt-3 pb-1">
            <div className="text-[11px] font-semibold text-[#9a9aa0] mb-2">
              コメント ({postComments.length})
            </div>
          </div>

          {postComments.length === 0 ? (
            <div className="px-4 pb-4 text-[12px] text-[#9a9aa0] text-center py-6">
              まだコメントはありません
            </div>
          ) : (
            <div className="flex flex-col">
              {postComments.map((c) => (
                <div key={c.id} className="flex gap-2.5 px-4 py-2.5 border-b border-[#f1f1f5]">
                  <Avatar size={28} label={c.authorName[0]} tone={c.tone} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11.5px] font-semibold">{c.authorName}</span>
                      <RankBadge xp={c.xp} compact showName={false} />
                      <span className="text-[9.5px] text-[#9a9aa0]">{c.time}</span>
                    </div>
                    <div className="text-[12px] text-[#1a1a1a] leading-relaxed">
                      {c.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment input */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-t border-[#dedee5] bg-white">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); handleSubmit(); } }}
            placeholder="コメントを入力…"
            className="flex-1 h-9 px-3 text-[12.5px] border border-[#dedee5] rounded-full outline-none focus:border-[#1a1a1a] bg-[#f1f1f5]"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="shrink-0 h-9 px-4 rounded-full bg-[#1a1a1a] text-white text-[12px] font-semibold disabled:opacity-30 transition-opacity"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
