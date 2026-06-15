"use client";

import { useState, useRef, useEffect } from "react";
import { DAOXMark } from "@/components/atoms/DAOXLogo";

interface Community {
  id: string;
  name: string;
  icon: string;
  members: number;
}

const COMMUNITIES: Community[] = [
  { id: "c1", name: "新富商店街コミュニティ", icon: "🏘", members: 312 },
  { id: "c2", name: "渋谷エリアDAO",         icon: "🌆", members: 1204 },
  { id: "c3", name: "下北沢商店会",          icon: "🎸", members: 87 },
];

export function CommunitySwitcher({ variant = "pc" }: { variant?: "pc" | "sp" | "header" }) {
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState("c1");
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinDone, setJoinDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset join form state when dropdown closes
  useEffect(() => {
    if (!open) {
      setShowJoin(false);
      setJoinCode("");
      setJoinDone(false);
    }
  }, [open]);

  const current = COMMUNITIES.find((c) => c.id === currentId)!;

  function handleSwitch(c: Community) {
    setCurrentId(c.id);
    setOpen(false);
  }

  function handleJoinSubmit() {
    if (!joinCode.trim()) return;
    setJoinDone(true);
    setTimeout(() => {
      setOpen(false);
    }, 1200);
  }

  function renderCommunityList(iconSize: string, nameSize: string) {
    return COMMUNITIES.map((c) => (
      <button
        key={c.id}
        onClick={() => handleSwitch(c)}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
          c.id === currentId ? "bg-[#f2f2ff]" : "hover:bg-[#f1f1f5]"
        }`}
      >
        <span className={`text-[${iconSize}] shrink-0`}>{c.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-[${nameSize}] font-semibold truncate`}>{c.name}</div>
          <div className="text-[10px] text-[#9a9aa0]">{c.members}人</div>
        </div>
        {c.id === currentId && (
          <span className="text-[10px] font-bold text-[#6666ff] shrink-0">現在</span>
        )}
      </button>
    ));
  }

  function renderJoinSection(btnSize: string) {
    if (joinDone) {
      return (
        <div className="border-t border-[#dedee5] px-3 py-2.5">
          <span className="text-[11px] font-semibold text-[#2d7a4a]">参加リクエストを送信しました</span>
        </div>
      );
    }

    if (showJoin) {
      return (
        <div className="border-t border-[#dedee5] px-3 py-2.5">
          <div className="text-[10px] font-semibold text-[#9a9aa0] mb-1.5">参加コード入力</div>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoinSubmit(); }}
              placeholder="コードを入力"
              className="flex-1 min-w-0 text-[11px] px-2 py-1.5 border border-[#dedee5] rounded-md outline-none focus:border-[#6666ff] transition-colors"
              autoFocus
            />
            <button
              onClick={handleJoinSubmit}
              className="text-[11px] font-semibold text-white bg-[#6666ff] px-3 py-1.5 rounded-md hover:opacity-80 transition-opacity shrink-0"
            >
              参加
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="border-t border-[#dedee5] px-3 py-2.5">
        <button
          onClick={() => setShowJoin(true)}
          className={`text-[${btnSize}] font-semibold text-[#6666ff] hover:opacity-70 transition-opacity`}
        >
          + 新しいコミュニティに参加
        </button>
      </div>
    );
  }

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
            {renderCommunityList("20px", "12.5px")}
            {renderJoinSection("11.5px")}
          </div>
        )}
      </div>
    );
  }

  // Header variant (inside PC content header)
  if (variant === "header") {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 py-0.5 rounded-lg hover:opacity-70 transition-opacity"
        >
          <DAOXMark size={22} />
          <span className="text-[16px] font-bold text-[#1a1a1a] truncate max-w-[240px]">{current.name}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1.5 w-[280px] bg-white border border-[#dedee5] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,.12)] z-[70] overflow-hidden">
            <div className="px-3 py-2 text-[10px] font-semibold text-[#9a9aa0] uppercase tracking-wider">
              コミュニティを切り替え
            </div>
            {renderCommunityList("18px", "12px")}
            {renderJoinSection("11px")}
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
          {renderCommunityList("18px", "12px")}
          {renderJoinSection("11px")}
        </div>
      )}
    </div>
  );
}
