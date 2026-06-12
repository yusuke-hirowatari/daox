"use client";

import { useState } from "react";
import { TopBar, BackButton } from "@/components/atoms/TopBar";
import { Button } from "@/components/atoms/Button";
import type { TaskTemplate, TaskAmount, TaskType } from "@/mocks/types";

type SlotType = "once" | "continue";

interface Props {
  onBack: () => void;
  onPublish: (data: {
    title: string;
    desc: string;
    defaultAmount: TaskAmount;
    defaultTime: string;
    deadline: string;
    type: TaskType;
    totalSlots: number;
  }) => void;
  /** 編集モード: 既存テンプレートを渡す */
  initial?: TaskTemplate;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-[#525261] mb-1.5">{children}</div>
  );
}

export function TaskCreatePage({ onBack, onPublish, initial }: Props) {
  const isEdit = !!initial;

  const initAmount = initial?.defaultAmount;
  const initUndecided = initAmount === "undecided";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [amount, setAmount] = useState(initUndecided ? "500" : String(initAmount ?? "500"));
  const [undecided, setUndecided] = useState(initUndecided);
  const [time, setTime] = useState(initial?.defaultTime ?? "");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");

  const initSlotType: SlotType =
    initial?.type === "continue" ? "continue" : "once";
  const [slotType, setSlotType] = useState<SlotType>(initSlotType);
  const [slotCount, setSlotCount] = useState(String(initial?.totalSlots ?? 1));

  const SLOT_OPTIONS: { type: SlotType; label: string }[] = [
    { type: "once",     label: "人数限定" },
    { type: "continue", label: "継続(消えない)" },
  ];

  const canSubmit = title.trim().length > 0 && desc.trim().length > 0 && time.trim().length > 0;

  function handlePublish() {
    if (!canSubmit) return;
    const totalSlots =
      slotType === "continue" ? 5 : Math.max(1, parseInt(slotCount, 10) || 1);
    onPublish({
      title: title.trim(),
      desc: desc.trim(),
      defaultAmount: undecided ? "undecided" : parseInt(amount, 10) || 0,
      defaultTime: time.trim(),
      deadline: deadline || "2026-12-31",
      type: slotType === "continue" ? "continue" : "once",
      totalSlots,
    });
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* SP Header */}
      <div className="md:hidden">
        <TopBar
          title={isEdit ? "タスクを編集" : "タスクを作る"}
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
        <span className="text-[15px] font-semibold">{isEdit ? "タスクを編集" : "タスクを作る"}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        {/* Copy from past (新規のみ) */}
        {!isEdit && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 border border-dashed border-[#bbbbc0] rounded-lg bg-[#f1f1f5] mb-4 text-[11.5px] text-[#525261]">
            <span className="text-[14px]">⎘</span>
            <span className="flex-1">過去のタスクからコピー</span>
            <span className="text-[#6666ff] font-semibold">選ぶ →</span>
          </div>
        )}

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

        {/* Deadline */}
        <FieldLabel>募集期限</FieldLabel>
        <input
          type="date"
          className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[12px] mb-3.5 outline-none focus:border-[#1a1a1a]"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        {/* Slot type */}
        <FieldLabel>受注枠</FieldLabel>
        <div className="flex gap-1.5 mb-2">
          {SLOT_OPTIONS.map((o) => {
            const on = slotType === o.type;
            return (
              <button
                key={o.type}
                onClick={() => setSlotType(o.type)}
                className={`flex-1 px-1.5 py-2.5 border rounded-lg text-[11px] font-semibold leading-snug text-center transition-colors ${
                  on
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-transparent text-[#525261] border-[#dedee5]"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
        {slotType === "once" && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] text-[#525261]">受注人数</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSlotCount(String(Math.max(1, (parseInt(slotCount, 10) || 1) - 1)))}
                className="w-7 h-7 rounded-md border border-[#dedee5] text-[14px] text-[#525261] flex items-center justify-center hover:bg-[#f1f1f5] transition-colors"
              >
                −
              </button>
              <input
                className="w-10 text-center text-[13px] font-bold font-mono border border-[#dedee5] rounded-md py-1 outline-none focus:border-[#1a1a1a]"
                value={slotCount}
                onChange={(e) => setSlotCount(e.target.value)}
              />
              <button
                onClick={() => setSlotCount(String((parseInt(slotCount, 10) || 1) + 1))}
                className="w-7 h-7 rounded-md border border-[#dedee5] text-[14px] text-[#525261] flex items-center justify-center hover:bg-[#f1f1f5] transition-colors"
              >
                +
              </button>
              <span className="text-[11px] text-[#525261] ml-0.5">人</span>
            </div>
          </div>
        )}
        <p className="text-[10.5px] text-[#9a9aa0] mb-3.5">
          {slotType === "once"
            ? "指定した人数が受注したら募集を締め切ります"
            : "毎朝の掃除など、繰り返しタスク向け"}
        </p>

        {/* Approver */}
        <div className="flex items-center gap-2.5 py-3 border-t border-[#dedee5]">
          <div className="flex-1">
            <div className="text-[12.5px] font-semibold">承認者</div>
            <div className="text-[10.5px] text-[#9a9aa0] mt-0.5">自分(発注主)</div>
          </div>
          <button
            onClick={() => alert("承認者の変更機能は今後実装予定です")}
            className="text-[11px] font-semibold text-[#6666ff]"
          >
            変更
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex-none flex gap-2 px-4 py-3.5 border-t border-[#dedee5]">
        {!isEdit && <Button variant="ghost">下書き保存</Button>}
        <Button full onClick={handlePublish} disabled={!canSubmit}>
          {isEdit ? "変更を保存" : "タスクを公開"}
        </Button>
      </div>
    </div>
  );
}
