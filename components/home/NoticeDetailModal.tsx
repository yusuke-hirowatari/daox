"use client";

import type { Notice } from "@/mocks/types";

interface NoticeDetailModalProps {
  notice: Notice | null;
  onClose: () => void;
}

export function NoticeDetailModal({ notice, onClose }: NoticeDetailModalProps) {
  if (!notice) return null;

  const tagStyle =
    notice.tag === "重要"
      ? { background: "#f2f2ff", color: "#6666ff" }
      : notice.tag === "イベント"
        ? { background: "#e4f3eb", color: "#2d7a4a" }
        : { background: "#dedee5", color: "#525261" };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-14 md:bottom-0 z-[60] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full md:max-w-[480px] bg-white rounded-t-2xl md:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Handle (SP) */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-9 h-1 rounded-full bg-[#dedee5]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 md:py-3 border-b border-[#dedee5] shrink-0">
          <span className="text-[14px] font-bold">お知らせ詳細</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-[4px]"
              style={tagStyle}
            >
              {notice.tag}
            </span>
            <span className="text-[11px] text-[#9a9aa0] font-mono">{notice.date}</span>
            {notice.isPinned && (
              <span className="text-[10px] text-[#6666ff]">📌 ピン留め</span>
            )}
          </div>

          <h2 className="text-[16px] font-bold mb-3 leading-snug">{notice.title}</h2>

          <div className="text-[13px] text-[#525261] leading-relaxed whitespace-pre-wrap">
            {notice.body}
          </div>
        </div>
      </div>
    </div>
  );
}
