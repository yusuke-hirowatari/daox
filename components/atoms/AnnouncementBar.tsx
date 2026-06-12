"use client";

import { useState, useEffect } from "react";

export interface Announcement {
  title: string;
  author: string;
}

/* ── shared store for dismiss state (localStorage 同期) ── */
const annStore = {
  get dismissed(): boolean {
    if (typeof window === "undefined") return false;
    try { return localStorage.getItem("daox.ann.dismissed") === "1"; } catch { return false; }
  },
  set dismissed(v: boolean) {
    try { localStorage.setItem("daox.ann.dismissed", v ? "1" : "0"); } catch {}
    annStore._listeners.forEach((l) => l());
  },
  _listeners: new Set<() => void>(),
  subscribe(l: () => void) {
    annStore._listeners.add(l);
    return () => { annStore._listeners.delete(l); };
  },
};

function useAnnDismissed() {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    setDismissed(annStore.dismissed);
    return annStore.subscribe(() => setDismissed(annStore.dismissed));
  }, []);
  return dismissed;
}

export function resetAnnouncements() {
  annStore.dismissed = false;
}

/* ── component ── */
interface AnnouncementBarProps {
  items: Announcement[];
}

export function AnnouncementBar({ items }: AnnouncementBarProps) {
  const dismissed = useAnnDismissed();
  const [expanded, setExpanded] = useState(false);

  if (dismissed || items.length === 0) return null;

  if (!expanded) {
    return (
      <div
        onClick={() => setExpanded(true)}
        className="mx-2.5 mt-2 shrink-0 flex items-center gap-2.5 rounded-[10px] border border-[#dedee5] bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,.06)] cursor-pointer"
      >
        <MegaphoneIcon />
        <span className="flex-1 min-w-0 text-[12px] text-[#1a1a1a] truncate">{items[0].title}</span>
        <span className="text-[11px] text-[#9a9aa0] leading-none">▾</span>
      </div>
    );
  }

  return (
    <div className="absolute top-2 left-2.5 right-2.5 z-10 rounded-[10px] border border-[#dedee5] bg-white overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,.12)]">
      {items.map((a, i) => (
        <div
          key={i}
          className={[
            "flex items-start gap-2.5 px-3 py-2.5",
            i < items.length - 1 ? "border-b border-[#dedee5]" : "",
          ].join(" ")}
        >
          <MegaphoneIcon className="mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] text-[#1a1a1a] leading-snug truncate">{a.title}</div>
            <div className="text-[10px] text-[#9a9aa0] mt-0.5">{a.author}</div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3.5 px-3 py-2.5 border-t border-[#dedee5] bg-[#f1f1f5] text-[11.5px] font-semibold">
        <button
          onClick={(e) => { e.stopPropagation(); annStore.dismissed = true; }}
          className="text-[#525261]"
        >
          今後は表示しない
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
          className="text-[#525261]"
        >
          最小化
        </button>
        <div className="flex-1" />
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
          className="text-[12px] text-[#9a9aa0]"
        >
          ▴
        </button>
      </div>
    </div>
  );
}

function MegaphoneIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`shrink-0 text-[#525261] ${className}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" />
        <path d="M15 8a4 4 0 0 1 0 8" />
      </svg>
    </span>
  );
}
