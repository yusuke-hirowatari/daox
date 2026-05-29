"use client";

import { useState } from "react";

interface TabsProps {
  tabs: string[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

/** アンダーライン型タブ (HOME の お知らせ/掲示板/投票 など) */
export function TopTabs({ tabs, defaultIndex = 0, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);

  function handleClick(i: number) {
    setActive(i);
    onChange?.(i);
  }

  return (
    <div className="shrink-0 flex border-b border-[#dedee5] px-4">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => handleClick(i)}
          className={[
            "px-3.5 py-3 text-[13px] font-medium -mb-px border-b-2 transition-colors whitespace-nowrap",
            active === i
              ? "text-[#1a1a1a] border-[#1a1a1a] font-semibold"
              : "text-[#9a9aa0] border-transparent",
          ].join(" ")}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/** ピル型タブ */
export function PillTabs({ tabs, defaultIndex = 0, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);

  function handleClick(i: number) {
    setActive(i);
    onChange?.(i);
  }

  return (
    <div className="shrink-0 flex gap-1.5 px-4 py-2.5">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => handleClick(i)}
          className={[
            "px-3 py-1.5 text-[12px] font-semibold rounded-[999px] border transition-colors whitespace-nowrap",
            active === i
              ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
              : "bg-transparent text-[#525261] border-[#dedee5]",
          ].join(" ")}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/** セグメント型タブ (iOS 風) */
export function SegmentedTabs({ tabs, defaultIndex = 0, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);

  function handleClick(i: number) {
    setActive(i);
    onChange?.(i);
  }

  return (
    <div className="shrink-0 px-4 py-2">
      <div className="flex rounded-lg bg-[#dedee5] p-0.5">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => handleClick(i)}
            className={[
              "flex-1 text-center py-1.5 text-[12px] font-semibold rounded-md transition-all whitespace-nowrap",
              active === i
                ? "bg-white text-[#1a1a1a] shadow-[0_1px_2px_rgba(0,0,0,.06)]"
                : "text-[#9a9aa0]",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
