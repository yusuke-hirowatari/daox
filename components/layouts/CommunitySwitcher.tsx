"use client";

import { useState, useRef, useEffect } from "react";
import { DAOXMark } from "@/components/atoms/DAOXLogo";

interface Community {
  id: string;
  name: string;
  icon: string;
  members: number;
  isCurrent: boolean;
}

const COMMUNITIES: Community[] = [
  { id: "c1", name: "新富商店街コミュニティ", icon: "🏘", members: 312, isCurrent: true },
  { id: "c2", name: "渋谷エリアDAO",         icon: "🌆", members: 1204, isCurrent: false },
  { id: "c3", name: "下北沢商店会",          icon: "🎸", members: 87,  isCurrent: false },
];

export function CommunitySwitcher({ variant = "pc" }: { variant?: "pc" | "sp" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = COMMUNITIES.find((c) => c.isCurrent)!;

  if (variant === "sp") {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5"
        >
          <span className="text-[16px]">{current.icon}</span>
          <span className="text-[15px] font-semibold truncate max-w-[180px]">{current.name}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1.5 w-[260px] bg-white border border-[#dedee5] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,.12)] z-[70] overflow-hidden">
            <div className="px-3 py-2 text-[10px] font-semibold text-[#9a9aa0] uppercase tracking-wider">
              コミュニティを切り替え
            </div>
            {COMMUNITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setOpen(false)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                  c.isCurrent ? "bg-[#f2f2ff]" : "hover:bg-[#f1f1f5]"
                }`}
              >
                <span className="text-[20px] shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold truncate">{c.name}</div>
                  <div className="text-[10px] text-[#9a9aa0]">{c.members}人</div>
                </div>
                {c.isCurrent && (
                  <span className="text-[10px] font-bold text-[#6666ff] shrink-0">現在</span>
                )}
              </button>
            ))}
            <div className="border-t border-[#dedee5] px-3 py-2.5">
              <button
                onClick={() => {
                  setOpen(false);
                  alert("コミュニティ参加機能は今後実装予定です");
                }}
                className="text-[11.5px] font-semibold text-[#6666ff] hover:opacity-70 transition-opacity"
              >
                + 新しいコミュニティに参加
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // PC variant
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 w-full rounded-lg hover:bg-white/60 transition-colors"
      >
        <DAOXMark size={24} />
        <span className="text-[13px] font-bold text-[#1a1a1a] flex-1 text-left truncate">{current.name}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#dedee5] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,.12)] z-[70] overflow-hidden">
          <div className="px-3 py-2 text-[10px] font-semibold text-[#9a9aa0] uppercase tracking-wider">
            コミュニティを切り替え
          </div>
          {COMMUNITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setOpen(false)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                c.isCurrent ? "bg-[#f2f2ff]" : "hover:bg-[#f1f1f5]"
              }`}
            >
              <span className="text-[18px] shrink-0">{c.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold truncate">{c.name}</div>
                <div className="text-[10px] text-[#9a9aa0]">{c.members}人</div>
              </div>
              {c.isCurrent && (
                <span className="text-[10px] font-bold text-[#6666ff] shrink-0">現在</span>
              )}
            </button>
          ))}
          <div className="border-t border-[#dedee5] px-3 py-2.5">
            <button
              onClick={() => {
                setOpen(false);
                alert("コミュニティ参加機能は今後実装予定です");
              }}
              className="text-[11px] font-semibold text-[#6666ff] hover:opacity-70 transition-opacity"
            >
              + 新しいコミュニティに参加
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
