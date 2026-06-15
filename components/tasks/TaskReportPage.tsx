"use client";

import { useState, useRef } from "react";
import { TopBar, BackButton } from "@/components/atoms/TopBar";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { TASK_TEMPLATES, TASK_TICKETS } from "@/mocks/tasks";
import { getUserById } from "@/mocks/users";
import { fmtAmount } from "./utils";

interface Props {
  ticketId: string;
  onBack: () => void;
  onSubmit: (reportText: string) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-[#525261] mb-1.5">{children}</div>
  );
}

export function TaskReportPage({ ticketId, onBack, onSubmit }: Props) {
  const [reportText, setReportText] = useState("");
  const [reportDate, setReportDate] = useState("2026-05-28");
  const [photoNames, setPhotoNames] = useState<(string | null)[]>([null, null, null]);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const ticket = TASK_TICKETS.find((t) => t.id === ticketId);
  const tmpl = ticket ? TASK_TEMPLATES.find((t) => t.id === ticket.templateId) : null;
  const orderer = tmpl ? getUserById(tmpl.ordererId) : null;

  if (!ticket || !tmpl) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-[#9a9aa0] text-sm">チケットが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="md:hidden">
        <TopBar
          title="実施報告"
          left={<BackButton onClick={onBack} />}
        />
      </div>
      <div className="hidden md:flex shrink-0 items-center gap-2 border-b border-[#dedee5] px-6 h-14">
        <button
          onClick={onBack}
          className="text-[#525261] text-[13px] font-semibold hover:text-[#1a1a1a] transition-colors"
        >
          ← 戻る
        </button>
        <span className="text-[#dedee5] mx-1">|</span>
        <span className="text-[15px] font-semibold">実施報告</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        {/* Task summary card */}
        <div className="px-3 py-2.5 bg-[#f1f1f5] rounded-xl border border-[#dedee5] mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            {orderer && (
              <Avatar size={20} label={orderer.initial} tone={orderer.tone} />
            )}
            <span className="text-[11px] font-semibold text-[#525261]">
              {orderer?.name ?? "?"}さん発注
            </span>
            <div className="flex-1" />
            <span
              className="text-[13px] font-bold font-mono"
              style={{ color: ticket.amount === "undecided" ? "#9a9aa0" : "#6666ff" }}
            >
              {fmtAmount(ticket.amount)}
            </span>
          </div>
          <div className="text-[12.5px] font-bold">{tmpl.title}</div>
          <div className="text-[10px] text-[#9a9aa0] mt-0.5">⏱ {ticket.time}</div>
        </div>

        {/* 実施日時 */}
        <FieldLabel>実施日時</FieldLabel>
        <div className="flex items-center gap-2 px-3 py-2.5 border border-[#dedee5] rounded-lg mb-3 text-[12px]">
          <span className="flex-1 font-semibold">
            {reportDate ? reportDate.replace(/-/g, "/") : "日時を選択"}
          </span>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="text-[10.5px] text-[#6666ff] font-semibold outline-none border-none bg-transparent"
          />
        </div>

        {/* 実施内容 */}
        <FieldLabel>実施内容 (任意)</FieldLabel>
        <textarea
          className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[11.5px] min-h-[48px] resize-none mb-3 outline-none focus:border-[#1a1a1a] text-[#1a1a1a] leading-relaxed"
          placeholder="作業の様子、気になったことなど"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          rows={3}
        />

        {/* 写真 */}
        <FieldLabel>写真 (任意)</FieldLabel>
        <div className="flex gap-2 mb-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <input
                ref={fileInputRefs[i]}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhotoNames((prev) => {
                      const next = [...prev];
                      next[i] = file.name;
                      return next;
                    });
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRefs[i].current?.click()}
                className={`w-[60px] h-[60px] rounded-lg border border-dashed flex items-center justify-center text-[10.5px] cursor-pointer transition-colors ${
                  photoNames[i]
                    ? "border-[#6666ff] bg-[#eeeeff] text-[#6666ff] font-semibold"
                    : "border-[#bbbbc0] bg-[#f1f1f5] text-[#9a9aa0] hover:bg-[#e8e8ef]"
                }`}
              >
                {photoNames[i] ? "選択済" : (i === 0 ? "+ 写真" : "")}
              </button>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="px-3 py-2.5 bg-[#eeeeff] rounded-lg text-[10.5px] text-[#525261] leading-relaxed">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[12px]">ℹ</span>
            <span className="font-bold text-[#6666ff]">承認待ちに進みます</span>
          </div>
          発注主({orderer?.name ?? "?"}さん)に通知 → 承認後に報酬支払い(金額は変更される可能性あり、0も可)。
        </div>
      </div>

      <div className="flex-none flex gap-2 px-4 py-3.5 border-t border-[#dedee5]">
        <Button variant="ghost" onClick={onBack}>キャンセル</Button>
        <Button full onClick={() => onSubmit(reportText)}>実施報告を送る</Button>
      </div>
    </div>
  );
}
