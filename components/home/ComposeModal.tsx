"use client";

import { useState } from "react";

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; body: string }) => void;
}

export function ComposeModal({ open, onClose, onSubmit }: ComposeModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!open) return null;

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      body: body.trim(),
    });
    setTitle("");
    setBody("");
    onClose();
  }

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
          <button onClick={onClose} className="text-[13px] text-[#9a9aa0] font-semibold">
            キャンセル
          </button>
          <span className="text-[14px] font-bold">新規投稿</span>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={[
              "text-[13px] font-bold",
              canSubmit ? "text-[#6666ff]" : "text-[#bbbbc0]",
            ].join(" ")}
          >
            投稿
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-semibold text-[#9a9aa0] uppercase tracking-wider mb-1 block">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="投稿のタイトル"
              className="w-full px-3 py-2.5 rounded-xl border border-[#dedee5] text-[13px] outline-none focus:border-[#9a9aa0] transition-colors placeholder:text-[#bbbbc0]"
              autoFocus
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#9a9aa0] uppercase tracking-wider mb-1 block">
              本文
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="投稿の内容を入力..."
              rows={5}
              className="w-full px-3 py-2.5 rounded-xl border border-[#dedee5] text-[13px] outline-none focus:border-[#9a9aa0] transition-colors resize-none placeholder:text-[#bbbbc0]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
