"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { TASK_TEMPLATES, TASK_TICKETS } from "@/mocks/tasks";
import { getUserById } from "@/mocks/users";

function ModalHandle() {
  return (
    <div className="flex-none flex justify-center py-2">
      <div className="w-10 h-1 rounded-full bg-[#bbbbc0]" />
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="text-[11px] font-semibold text-[#525261] mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </div>
  );
}

// ─── Return Modal ──────────────────────────────────────────────────────────────

const RETURN_REASONS = [
  "都合がつかなくなった",
  "想定と内容が違った",
  "他の方が向いていそう",
  "その他 (記述)",
];

interface ReturnModalProps {
  ticketId: string;
  onCancel: () => void;
  onReturn: () => void;
}

export function ReturnModal({ ticketId, onCancel, onReturn }: ReturnModalProps) {
  const [reason, setReason] = useState(0);
  const [note, setNote] = useState("");

  const ticket = TASK_TICKETS.find((t) => t.id === ticketId);
  const tmpl = ticket ? TASK_TEMPLATES.find((t) => t.id === ticket.templateId) : null;
  const orderer = tmpl ? getUserById(tmpl.ordererId) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onCancel}
      />
      {/* Sheet */}
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.1)] max-h-[85%] flex flex-col">
        <ModalHandle />
        <div className="px-5 pb-3 border-b border-[#dedee5]">
          <div className="text-[15px] font-bold mb-1.5">このタスクを返却しますか?</div>
          <div className="text-[11px] text-[#9a9aa0] leading-relaxed">
            返却するとあなたのマイタスクから消え、再び募集中に戻ります。発注主に通知が届きます。
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3.5">
          {/* Task card */}
          {ticket && tmpl && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 border border-[#dedee5] rounded-lg bg-[#f1f1f5] mb-3.5">
              {orderer && (
                <Avatar size={28} label={orderer.initial} tone={orderer.tone} />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold truncate">{tmpl.title}</div>
                <div className="text-[10px] text-[#9a9aa0] mt-0.5">
                  {orderer?.name ?? "?"}さんから #{ticket.id.split("-").pop()}
                </div>
              </div>
            </div>
          )}

          <FieldLabel>返却理由 (任意・発注主に伝わります)</FieldLabel>
          <div className="flex flex-col gap-1.5 mb-3">
            {RETURN_REASONS.map((r, i) => {
              const on = reason === i;
              return (
                <button
                  key={r}
                  onClick={() => setReason(i)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    on
                      ? "border-[#1a1a1a] bg-[#f1f1f5]"
                      : "border-[#dedee5] bg-transparent"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex-none transition-colors ${
                      on ? "border-[#1a1a1a] bg-[#1a1a1a]" : "border-[#bbbbc0] bg-transparent"
                    }`}
                  />
                  <span className={`text-[12px] ${on ? "font-semibold" : "font-medium"}`}>{r}</span>
                </button>
              );
            })}
          </div>

          <FieldLabel>補足メッセージ (任意)</FieldLabel>
          <textarea
            className="w-full px-3 py-2.5 border border-[#dedee5] rounded-lg text-[11.5px] min-h-[50px] resize-none outline-none focus:border-[#1a1a1a] text-[#525261] leading-relaxed"
            placeholder="急に予定が入ってしまいました。すみません。"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex-none flex gap-2 px-4 py-3.5 border-t border-[#dedee5]">
          <Button variant="ghost" onClick={onCancel}>キャンセル</Button>
          <Button full onClick={onReturn}>返却する</Button>
        </div>
      </div>
    </>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────

const REJECT_REASONS = [
  "完了状態の写真が不足",
  "報告内容が具体的でない",
  "追加作業が必要",
  "その他 (記述)",
];

interface RejectModalProps {
  ticketId: string;
  onCancel: () => void;
  onReject: () => void;
}

export function RejectModal({ ticketId, onCancel, onReject }: RejectModalProps) {
  const [reason, setReason] = useState(0);
  const [comment, setComment] = useState("");

  const ticket = TASK_TICKETS.find((t) => t.id === ticketId);
  const tmpl = ticket ? TASK_TEMPLATES.find((t) => t.id === ticket.templateId) : null;
  const acceptor = ticket?.acceptedById ? getUserById(ticket.acceptedById) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onCancel}
      />
      {/* Sheet */}
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.1)] max-h-[85%] flex flex-col">
        <ModalHandle />
        <div className="px-5 pb-3 border-b border-[#dedee5]">
          <div className="text-[15px] font-bold mb-1.5">実施報告を差し戻します</div>
          <div className="text-[11px] text-[#9a9aa0] leading-relaxed">
            受注者にあなたのコメントが届き、再度実施報告を求めます。承認・支払いはまだ発生しません。
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3.5">
          {/* Report card */}
          {ticket && tmpl && acceptor && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 border border-[#dedee5] rounded-lg bg-[#f1f1f5] mb-3.5">
              <Avatar size={28} label={acceptor.initial} tone={acceptor.tone} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold">{acceptor.name}さんからの実施報告</div>
                <div className="text-[10px] text-[#9a9aa0] mt-0.5">
                  {tmpl.title} #{ticket.id.split("-").pop()} · {ticket.updatedAt.slice(11, 16)}
                </div>
              </div>
            </div>
          )}

          <FieldLabel required>差し戻し理由</FieldLabel>
          <div className="flex flex-col gap-1.5 mb-3">
            {REJECT_REASONS.map((r, i) => {
              const on = reason === i;
              return (
                <button
                  key={r}
                  onClick={() => setReason(i)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    on
                      ? "border-[#1a1a1a] bg-[#f1f1f5]"
                      : "border-[#dedee5] bg-transparent"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex-none transition-colors ${
                      on ? "border-[#1a1a1a] bg-[#1a1a1a]" : "border-[#bbbbc0] bg-transparent"
                    }`}
                  />
                  <span className={`text-[12px] ${on ? "font-semibold" : "font-medium"}`}>{r}</span>
                </button>
              );
            })}
          </div>

          <FieldLabel required>受注者へのコメント</FieldLabel>
          <textarea
            className="w-full px-3 py-2.5 border-[1.5px] border-[#1a1a1a] rounded-lg text-[12px] min-h-[70px] resize-none outline-none text-[#1a1a1a] leading-relaxed mb-3"
            placeholder="仕上がり、ありがとうございます。看板の全体写真を1枚追加してもらえますか?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />

          <div className="flex gap-2 px-3 py-2.5 bg-[#fff3d6] rounded-lg text-[10.5px] text-[#7a5200] leading-relaxed">
            <span className="text-[13px] flex-none">ⓘ</span>
            <span>
              差し戻しは何度でも可能ですが、3回以上続く場合は{" "}
              <strong>運営に相談</strong> をおすすめします。
            </span>
          </div>
        </div>

        <div className="flex-none flex gap-2 px-4 py-3.5 border-t border-[#dedee5]">
          <Button variant="ghost" onClick={onCancel}>キャンセル</Button>
          <Button full onClick={onReject} disabled={!comment.trim()}>差し戻す</Button>
        </div>
      </div>
    </>
  );
}
