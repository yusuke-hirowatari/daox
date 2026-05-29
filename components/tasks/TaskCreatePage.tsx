"use client";

import { useState } from "react";
import { TopBar, BackButton } from "@/components/atoms/TopBar";
import { Button } from "@/components/atoms/Button";

type SlotType = "once" | "multi" | "continue";

interface Props {
  onBack: () => void;
  onPublish: () => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-[#525261] mb-1.5">{children}</div>
  );
}

export function TaskCreatePage({ onBack, onPublish }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("500");
  const [undecided, setUndecided] = useState(false);
  const [time, setTime] = useState("");
  const [slotType, setSlotType] = useState<SlotType>("once");
  const [slotCount, setSlotCount] = useState("3");

  const SLOT_OPTIONS: { type: SlotType; label: string }[] = [
    { type: "once",     label: "1人受注で消える" },
    { type: "multi",    label: "x人まで" },
    { type: "continue", label: "継続(消えない)" },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* SP Header */}
      <div className="md:hidden">
        <TopBar
          title="タスクを作る"
          left={<BackButton onClick={onBack} />}
        />
      </div>
      {/* PC Header */}
      <div className="hidden md:flex shrink-0 items-center gap-2 border-b border-[#dedee5] px-6 h-14">
        <button
          onClick={onBack}
          className="text-[#525261] text-[13px] font-semibold hover:text-[#1a1a1a] transition-colors"
        >
          ← 戻る
        </button>
        <span className="text-[#dedee5] mx-1">|</span>
        <span className="text-[15px] font-semibold">タスクを作る</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        {/* Copy from past */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 border border-dashed border-[#bbbbc0] rounded-lg bg-[#f1f1f5] mb-4 text-[11.5px] text-[#525261]">
          <span className="text-[14px]">⎘</span>
          <span className="flex-1">過去のタスクからコピー</span>
          <span className="text-[#6666ff] font-semibold">選ぶ →</span>
        </div>

        {/* Title */}
        <FieldLabel>タイトル</FieldLabel>
        <input
          className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[12px] mb-3.5 outline-none focus:border-[#1a1a1a]"
          placeholder="例: 看板リペイント手伝い"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <FieldLabel>説明</FieldLabel>
        <textarea
          className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[12px] min-h-[56px] resize-none mb-3.5 outline-none focus:border-[#1a1a1a]"
          placeholder="作業内容、持ち物、注意事項など"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
        />

        {/* Amount */}
        <div className="flex gap-2.5 mb-3.5">
          <div className="flex-1">
            <FieldLabel>金額 (DAO)</FieldLabel>
            <input
              className={`w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[14px] font-bold font-mono outline-none focus:border-[#1a1a1a] ${undecided ? "opacity-40 pointer-events-none" : ""}`}
              value={undecided ? "" : amount}
              placeholder={undecided ? "未定" : "500"}
              onChange={(e) => setAmount(e.target.value)}
              disabled={undecided}
            />
          </div>
          <div className="flex items-end pb-[10px]">
            <button
              onClick={() => setUndecided(!undecided)}
              className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold whitespace-nowrap transition-colors ${
                undecided
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "bg-white text-[#525261] border-[#dedee5]"
              }`}
            >
              金額未定
            </button>
          </div>
        </div>

        {/* Time */}
        <FieldLabel>時間帯</FieldLabel>
        <input
          className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[12px] mb-3.5 outline-none focus:border-[#1a1a1a]"
          placeholder="例: 5/24(土) 10:00–13:00"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        {/* Slot type */}
        <FieldLabel>受注枠</FieldLabel>
        <div className="flex gap-1.5 mb-1.5">
          {SLOT_OPTIONS.map((o) => {
            const on = slotType === o.type;
            return (
              <button
                key={o.type}
                onClick={() => setSlotType(o.type)}
                className={`flex-1 px-1.5 py-2.5 border rounded-lg text-[10.5px] font-semibold leading-snug text-center transition-colors ${
                  on
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-transparent text-[#525261] border-[#dedee5]"
                }`}
              >
                {o.label}
                {o.type === "multi" && (
                  <div className="mt-1">
                    <input
                      className={`w-12 text-center text-[11px] font-mono bg-transparent border-b outline-none ${on ? "border-white" : "border-[#bbbbc0]"}`}
                      value={slotCount}
                      onChange={(e) => setSlotCount(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-[10px]">人</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-[10.5px] text-[#9a9aa0] mb-3.5">
          「継続」は毎朝の掃除など、繰り返しタスク向け
        </p>

        {/* Approver */}
        <div className="flex items-center gap-2.5 py-3 border-t border-[#dedee5]">
          <div className="flex-1">
            <div className="text-[12.5px] font-semibold">承認者</div>
            <div className="text-[10.5px] text-[#9a9aa0] mt-0.5">自分(発注主)</div>
          </div>
          <button className="text-[11px] font-semibold text-[#6666ff]">変更</button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex-none flex gap-2 px-4 py-3.5 border-t border-[#dedee5]">
        <Button variant="ghost">下書き保存</Button>
        <Button full onClick={onPublish}>タスクを公開</Button>
      </div>
    </div>
  );
}
