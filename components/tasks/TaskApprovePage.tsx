"use client";

import { useState } from "react";
import { TopBar, BackButton } from "@/components/atoms/TopBar";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { StatusPill } from "@/components/atoms/StatusPill";
import { TASK_TEMPLATES, TASK_TICKETS } from "@/mocks/tasks";
import { getUserById } from "@/mocks/users";

interface Props {
  ticketId: string;
  onBack: () => void;
  onApprove: (amount: number) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-[#525261] mb-1.5">{children}</div>
  );
}

export function TaskApprovePage({ ticketId, onBack, onApprove }: Props) {
  const ticket = TASK_TICKETS.find((t) => t.id === ticketId);
  const tmpl = ticket ? TASK_TEMPLATES.find((t) => t.id === ticket.templateId) : null;
  const acceptor = ticket?.acceptedById ? getUserById(ticket.acceptedById) : null;

  const isUndecided = ticket?.amount === "undecided";
  const defaultAmt = isUndecided ? 300 : (ticket?.amount as number ?? 0);

  const [selectedAmount, setSelectedAmount] = useState(defaultAmt);
  const [message, setMessage] = useState("");

  if (!ticket || !tmpl) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-[#9a9aa0] text-sm">チケットが見つかりません</p>
      </div>
    );
  }

  const UNDECIDED_PRESETS = [100, 200, 300, 500, 1000];
  const NORMAL_PRESETS: { label: string; value: number }[] = [
    { label: "満額",      value: ticket.amount === "undecided" ? 0 : (ticket.amount as number) },
    { label: "半額",      value: Math.floor((ticket.amount === "undecided" ? 0 : (ticket.amount as number)) / 2) },
    { label: "少し色付け", value: Math.ceil((ticket.amount === "undecided" ? 0 : (ticket.amount as number)) * 1.2) },
    { label: "0",         value: 0 },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="md:hidden">
        <TopBar
          title="承認"
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
        <span className="text-[15px] font-semibold">承認</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Acceptor + task info card */}
        <div className="px-3 py-3 bg-[#f1f1f5] rounded-xl border border-[#dedee5] mb-4">
          <div className="flex items-center gap-2.5 mb-2">
            {acceptor && (
              <Avatar size={36} label={acceptor.initial} tone={acceptor.tone} />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#9a9aa0]">受注主</div>
              <div className="text-[13px] font-semibold">{acceptor?.name ?? "不明"}</div>
            </div>
            <StatusPill status="pending" label="実施報告済" />
          </div>
          <div className="text-[13px] font-semibold mb-1">{tmpl.title}</div>
          <div className="text-[10.5px] text-[#9a9aa0]">
            実施報告 {ticket.updatedAt.slice(0, 10)} · 設定金額{" "}
            {isUndecided ? "未定 (承認時に決定)" : `${ticket.amount} DAO`}
          </div>
        </div>

        {/* Warning for undecided amount */}
        {isUndecided && (
          <div className="flex gap-2 px-3 py-2.5 bg-[#fff3d6] rounded-lg text-[10.5px] text-[#7a5200] leading-relaxed mb-3.5">
            <span className="text-[13px] flex-none">⚠</span>
            <span>
              <strong>このタスクは金額未定で公開されました。</strong>
              受注者は「何DAOになるかは承認時に決める」と了承しています。
            </span>
          </div>
        )}

        {/* Amount field */}
        <FieldLabel>支払い金額</FieldLabel>
        <div className="flex items-baseline justify-center gap-2 px-4 py-5 border-[1.5px] border-[#1a1a1a] rounded-xl bg-white mb-2">
          <input
            type="number"
            className="text-[44px] font-bold font-mono leading-none outline-none bg-transparent w-28 text-center"
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(Number(e.target.value))}
            min={0}
          />
          <span className="text-[14px] font-semibold text-[#525261]">DAO</span>
        </div>

        {isUndecided ? (
          <>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {UNDECIDED_PRESETS.map((v) => {
                const on = selectedAmount === v;
                return (
                  <button
                    key={v}
                    onClick={() => setSelectedAmount(v)}
                    className={`text-[11px] font-semibold font-mono px-3 py-1.5 rounded-full border transition-colors ${
                      on
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                        : "bg-white text-[#525261] border-[#bbbbc0]"
                    }`}
                  >
                    {v} DAO
                  </button>
                );
              })}
            </div>
            <p className="text-[10.5px] text-[#9a9aa0] mb-4">
              残高 420 → 承認後{" "}
              <strong className="text-[#1a1a1a]">{420 - selectedAmount} DAO</strong> / 任意金額OK(0も可)
            </p>
          </>
        ) : (
          <>
            <div className="flex gap-1.5 mb-4">
              {NORMAL_PRESETS.map((p) => {
                const on = selectedAmount === p.value;
                return (
                  <button
                    key={p.label}
                    onClick={() => setSelectedAmount(p.value)}
                    className={`flex-1 py-1.5 rounded-lg border text-center transition-colors ${
                      on
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                        : "bg-transparent text-[#525261] border-[#dedee5]"
                    }`}
                  >
                    <div className="text-[10px] font-semibold">{p.label}</div>
                    <div className="text-[10px] font-mono mt-0.5">{p.value}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10.5px] text-[#9a9aa0] mb-4">
              残高 420 → 承認後 -{(ticket.amount as number) - selectedAmount < 0 ? 0 : selectedAmount} DAO ※ 任意金額OK(0でも可)
            </p>
          </>
        )}

        {/* Message */}
        <FieldLabel>メッセージ (任意)</FieldLabel>
        <textarea
          className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[12px] min-h-[50px] resize-none outline-none focus:border-[#1a1a1a] text-[#525261] leading-relaxed"
          placeholder="キレイになりました！ありがとうございます。"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex-none flex gap-2 px-4 py-3.5 border-t border-[#dedee5]">
        <Button variant="ghost" onClick={() => onApprove(0)}>0で承認</Button>
        <Button full onClick={() => onApprove(selectedAmount)}>
          承認 ({selectedAmount} DAO 支払)
        </Button>
      </div>
    </div>
  );
}
