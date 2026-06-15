"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { StatusPill } from "@/components/atoms/StatusPill";
import { Divider } from "@/components/atoms/Divider";
import { TaskPartyRow } from "./PartyRow";
import { fmtAmount, amountColor, statusVariant, statusLabel } from "./utils";
import { useTaskContext } from "./TaskContext";
import { getUserById, CURRENT_USER_ID } from "@/mocks/users";

export type DetailContext =
  | "browse"          // C: 募集中 → 受注ボタン
  | "my_task"         // C2: マイタスク → 実施報告ボタン
  | "owner"           // C3: 発注主 → テンプレ詳細
  | "approve_pending" // C4: 発注主・承認待ち → 承認ボタン

interface Props {
  templateId: string;
  ticketId?: string;
  context: DetailContext;
  onClose: () => void;
  onAccept: () => void;
  onReport: (ticketId: string) => void;
  onApprove: (ticketId: string) => void;
  onReturn: (ticketId: string) => void;
  onReject: (ticketId: string) => void;
  onEdit?: (templateId: string) => void;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ModalHandle() {
  return (
    <div className="flex-none flex justify-center py-2">
      <div className="w-10 h-1 rounded-full bg-[#bbbbc0]" />
    </div>
  );
}

function FieldSection({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="px-5 py-2.5 bg-[#f1f1f5] border-t border-b border-[#dedee5] flex items-baseline gap-2">
      <span className="text-[11px] font-bold text-[#1a1a1a]">{label}</span>
      {sub && <span className="text-[10px] text-[#9a9aa0]">{sub}</span>}
    </div>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between items-center py-[5px] border-b border-[#dedee5] text-[11.5px]">
      <span className="text-[#525261]">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

// ─── Shared detail body ───────────────────────────────────────────────────────

interface DetailBodyProps {
  templateId: string;
  ticketId?: string;
  context: DetailContext;
  onReport: (id: string) => void;
  onApprove: (id: string) => void;
  onReturn: (id: string) => void;
  onReject: (id: string) => void;
}

function DetailBody({
  templateId,
  ticketId,
  context,
  onApprove,
}: DetailBodyProps) {
  const [openTpl, setOpenTpl] = useState(false);
  const [ownerTab, setOwnerTab] = useState(0);
  const [showQa, setShowQa] = useState(false);
  const [ticketAdded, setTicketAdded] = useState(false);
  const [showQaForm, setShowQaForm] = useState(false);
  const [qaInput, setQaInput] = useState("");
  const [localQaList, setLocalQaList] = useState<{ id: string; question: string; createdAt: string }[]>([]);
  const router = useRouter();
  const { getTemplateById, getTicketById, getTicketsByTemplate, tickets } = useTaskContext();

  const tmpl = getTemplateById(templateId);
  if (!tmpl) return null;

  const ticket = ticketId ? getTicketById(ticketId) : undefined;

  const orderer = getUserById(tmpl.ordererId);
  const acceptor = ticket?.acceptedById
    ? getUserById(ticket.acceptedById)
    : undefined;

  const allTickets = tickets.filter((t) => t.templateId === templateId);
  const activeTickets = getTicketsByTemplate(templateId);
  const qaList = tmpl.qaList ?? [];

  const displayAmount = ticket?.amount ?? tmpl.defaultAmount;
  const isUndecided = displayAmount === "undecided";
  const displayTime = ticket?.time ?? tmpl.defaultTime;

  // ── Owner view (C3) ──────────────────────────────────────────────────────
  if (context === "owner") {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-1.5">
            <StatusPill status="open" label="公開中" />
            <span className="text-[9.5px] font-bold px-2 py-px rounded-full bg-[#dedee5] text-[#525261] font-mono">
              テンプレ
            </span>
          </div>
          <div className="text-[17px] font-bold leading-snug mb-1">{tmpl.title}</div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[22px] font-bold font-mono leading-none"
              style={{ color: amountColor(tmpl.defaultAmount) }}
            >
              {isUndecided ? "金額未定" : tmpl.defaultAmount}
            </span>
            {!isUndecided && <span className="text-[11px] text-[#525261]">DAO</span>}
            {!isUndecided && (
              <span className="text-[10px] text-[#9a9aa0] ml-1">(初期値・チケットごとに変更可)</span>
            )}
          </div>
        </div>
        <Divider />

        <div className="flex-none flex border-b border-[#dedee5] px-3">
          {["チケット一覧", "Q&A"].map((label, i) => {
            const on = i === ownerTab;
            return (
              <button
                key={label}
                onClick={() => setOwnerTab(i)}
                className={`px-3 py-2.5 text-[12px] font-${on ? "semibold" : "medium"} flex items-center gap-1.5 border-b-2 -mb-px ${
                  on ? "text-[#1a1a1a] border-[#1a1a1a]" : "text-[#9a9aa0] border-transparent"
                }`}
              >
                {label}
                <span
                  className={`text-[9.5px] font-bold font-mono px-1.5 py-px rounded-full ${
                    on ? "bg-[#1a1a1a] text-white" : "bg-[#dedee5] text-[#9a9aa0]"
                  }`}
                >
                  {i === 0 ? allTickets.length : qaList.length}
                </span>
              </button>
            );
          })}
        </div>

        {ownerTab === 0 ? (
          <>
            <FieldSection label="募集全体の設定" sub="変更は今後の全チケットに反映" />
            <div className="px-5 py-2">
              <div className="text-[10.5px] font-semibold text-[#525261] mb-1">説明</div>
              <div className="text-[12px] leading-relaxed text-[#1a1a1a]">{tmpl.desc}</div>
            </div>
            <div className="px-5">
              <MetaRow k="募集期間" v={`〜 ${tmpl.deadline}`} />
              <MetaRow
                k="募集人数"
                v={`残り${Math.max(0, tmpl.totalSlots - activeTickets.filter(t => t.status !== "open").length)}人 (${activeTickets.filter(t=>t.status !== "open").length}/${tmpl.totalSlots})`}
              />
            </div>
            <FieldSection label="チケットごとに設定" sub="各チケットで上書き可・ここは既定値" />
            <div className="px-5">
              <MetaRow k="金額(既定)" v={isUndecided ? "未定" : `${tmpl.defaultAmount} DAO`} />
              <MetaRow k="実施希望" v={tmpl.defaultTime} />
            </div>

            <div className="px-4 py-2 bg-[#f1f1f5] border-t border-b border-[#dedee5] flex items-center gap-2 mt-1">
              <span className="text-[11px] font-mono text-[#9a9aa0]">━━ 発行済みチケット</span>
              <span className="text-[9.5px] font-bold font-mono px-1.5 py-px rounded-full bg-[#1a1a1a] text-white">
                {allTickets.length}
              </span>
            </div>
            {allTickets.map((tk) => {
              const acc = tk.acceptedById ? getUserById(tk.acceptedById) : null;
              const sv = statusVariant(tk.status, tk.confirmedAmount);
              const sl = statusLabel(tk.status, tk.confirmedAmount);
              const isPending = tk.status === "pending_approval";
              return (
                <div
                  key={tk.id}
                  className={`px-4 py-2.5 border-b border-[#dedee5] ${tk.deletedFlag ? "opacity-55" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9.5px] font-mono text-[#9a9aa0] px-1.5 py-px bg-[#f1f1f5] rounded">
                      #{tk.id.split("-").pop()}
                    </span>
                    <StatusPill status={sv} label={sl} />
                    <div className="flex-1" />
                    <span className="text-[11px] font-bold font-mono text-[#1a1a1a]">
                      {fmtAmount(tk.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {acc ? (
                      <>
                        <Avatar size={18} label={acc.initial} tone={acc.tone} />
                        <span className="text-[11.5px] font-semibold">{acc.name}さん</span>
                      </>
                    ) : (
                      <>
                        <div className="w-[18px] h-[18px] rounded-full border border-dashed border-[#bbbbc0]" />
                        <span className="text-[11.5px] text-[#9a9aa0]">
                          {tk.deletedFlag ? "返却済み (再募集中)" : "受注者未定"}
                        </span>
                      </>
                    )}
                    <span className="text-[10px] text-[#9a9aa0] flex-1 text-right">{tk.time}</span>
                    {isPending && (
                      <button
                        onClick={() => onApprove(tk.id)}
                        className="text-[10.5px] font-bold px-2.5 py-1 bg-[#1a1a1a] text-white rounded-md"
                      >
                        承認
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="px-4 py-2.5">
              <button
                onClick={() => {
                  setTicketAdded(true);
                  setTimeout(() => setTicketAdded(false), 2000);
                }}
                className="w-full py-2 border border-dashed border-[#bbbbc0] rounded-lg text-center text-[11.5px] font-semibold text-[#525261] hover:bg-[#f1f1f5] transition-colors"
              >
                {ticketAdded ? "--- チケットを追加しました ---" : "+ チケットを追加発行 (残り枠を増やす)"}
              </button>
            </div>

            <ShareLinkBar templateId={templateId} />
          </>
        ) : (
          <>
            <div className="px-4 py-2.5 bg-[#f2f2ff] border-b border-[#dedee5]">
              <span className="text-[11px] font-bold text-[#6666ff]">このタスクのQ&A</span>
              <span className="ml-2 text-[10.5px] text-[#525261]">
                このタスクを見ている全員に公開。個別の確認はDMへ。
              </span>
            </div>
            {qaList.length === 0 ? (
              <p className="p-5 text-[12px] text-[#9a9aa0] text-center">質問はまだありません</p>
            ) : (
              qaList.map((q) => {
                const u = getUserById(q.userId);
                return (
                  <div key={q.id} className="px-4 py-3 border-b border-[#dedee5] flex gap-2.5">
                    <Avatar size={28} label={u?.initial ?? "?"} tone={u?.tone ?? 0} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold mb-0.5">{q.question}</div>
                      {q.answer && (
                        <div className="text-[11.5px] text-[#525261] mt-1 pl-2 border-l-2 border-[#6666ff]">
                          {q.answer}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            {localQaList.map((lq) => (
              <div key={lq.id} className="px-4 py-3 border-b border-[#dedee5] flex gap-2.5">
                <Avatar size={28} label="田" tone={0} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold mb-0.5">{lq.question}</div>
                  <div className="text-[10.5px] text-[#9a9aa0] italic">未回答</div>
                </div>
              </div>
            ))}
            <div className="p-3.5">
              {showQaForm ? (
                <div className="border border-[#dedee5] rounded-lg p-3">
                  <textarea
                    className="w-full px-2 py-2 border border-[#dedee5] rounded-md text-[11.5px] min-h-[48px] resize-none mb-2 outline-none focus:border-[#1a1a1a]"
                    placeholder="質問・お知らせの内容を入力..."
                    value={qaInput}
                    onChange={(e) => setQaInput(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setShowQaForm(false); setQaInput(""); }}
                      className="px-3 py-1.5 text-[11px] font-semibold text-[#525261] border border-[#dedee5] rounded-md hover:bg-[#f1f1f5] transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => {
                        if (qaInput.trim()) {
                          setLocalQaList((prev) => [
                            ...prev,
                            { id: `local-qa-${Date.now()}`, question: qaInput.trim(), createdAt: new Date().toISOString() },
                          ]);
                          setQaInput("");
                          setShowQaForm(false);
                        }
                      }}
                      disabled={!qaInput.trim()}
                      className="px-3 py-1.5 text-[11px] font-semibold text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition-colors disabled:opacity-40"
                    >
                      投稿する
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowQaForm(true)}
                  className="w-full py-2.5 border border-[#bbbbc0] rounded-full text-center text-[11.5px] text-[#9a9aa0] hover:bg-[#f1f1f5] transition-colors"
                >
                  + 質問・お知らせを投稿
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Common detail body (C / C2 / C4) ─────────────────────────────────────
  const isOrdererMe = tmpl.ordererId === CURRENT_USER_ID;
  const isAcceptorMe = ticket?.acceptedById === CURRENT_USER_ID;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <StatusPill
            status={statusVariant(ticket?.status ?? "open", ticket?.confirmedAmount)}
            label={statusLabel(ticket?.status ?? "open", ticket?.confirmedAmount)}
          />
          {ticket && (
            <span className="text-[9.5px] font-mono text-[#9a9aa0] px-1.5 py-px bg-[#f1f1f5] rounded">
              #{ticket.id.split("-").pop()}
            </span>
          )}
        </div>
        <div className="text-[17px] font-bold leading-snug mb-2">{tmpl.title}</div>
        {isUndecided ? (
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-bold text-[#9a9aa0] leading-none">金額未定</span>
            <span className="text-[10.5px] text-[#9a9aa0] ml-1">承認時に発注主が決定</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold font-mono text-[#6666ff] leading-none">
              {displayAmount as number}
            </span>
            <span className="text-[11px] text-[#525261]">DAO</span>
          </div>
        )}
      </div>
      <Divider />

      <TaskPartyRow
        orderer={orderer?.name ?? "不明"}
        ordererTone={orderer?.tone ?? 0}
        ordererIsMe={isOrdererMe}
        acceptor={acceptor?.name}
        acceptorTone={acceptor?.tone}
        acceptorIsMe={isAcceptorMe}
      />
      <Divider />

      <div className="px-5 py-2.5">
        <div className="text-[10.5px] font-semibold text-[#525261] mb-1">説明</div>
        <div className="text-[12px] leading-relaxed text-[#1a1a1a]">{tmpl.desc}</div>
      </div>

      <div className="px-5 pb-2">
        <MetaRow k="実施希望" v={displayTime} />
        <MetaRow k="発行" v={`${orderer?.name ?? "?"} · ${tmpl.createdAt.slice(0, 10)}`} />
      </div>

      <div className="px-5 pb-3">
        <button
          onClick={() => setOpenTpl(!openTpl)}
          className="w-full flex items-center gap-2 px-2.5 py-2 bg-[#f1f1f5] rounded-lg text-[11px] font-semibold text-[#525261]"
        >
          <span className="text-[9px] text-[#9a9aa0]">{openTpl ? "▾" : "▸"}</span>
          このタスクの募集全体を見る
          <span className="ml-auto text-[10px] text-[#9a9aa0] font-mono">
            {tmpl.type === "continue"
              ? "継続"
              : `${getTicketsByTemplate(templateId).filter(t => t.status !== "open").length} / ${tmpl.totalSlots}人`}
          </span>
        </button>
        {openTpl && (
          <div className="px-2.5 pt-2">
            <div className="flex justify-between py-1 text-[11px]">
              <span className="text-[#9a9aa0]">募集期間</span>
              <span className="text-[#525261]">〜 {tmpl.deadline}</span>
            </div>
            <div className="flex justify-between py-1 text-[11px]">
              <span className="text-[#9a9aa0]">募集人数</span>
              <span className="text-[#525261]">
                {tmpl.type === "continue" ? "継続 (定員なし)" : `${tmpl.totalSlots}人`}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-4">
        <div className="text-[10.5px] font-semibold text-[#525261] mb-2">
          質問
          <span className="ml-2 font-normal text-[#9a9aa0] text-[9.5px]">
            個別の確認はDM、皆で共有したいものはQ&Aへ
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dm")}
            className="flex-1 py-2 border border-[#bbbbc0] rounded-lg text-[11px] text-[#525261] text-center hover:bg-[#f1f1f5] transition-colors"
          >
            ✉ {isOrdererMe ? "受注者にDM" : "発注主にDM"}
          </button>
          <button
            onClick={() => setShowQa((v) => !v)}
            className={`flex-1 py-2 border rounded-lg text-[11px] text-center transition-colors ${
              showQa ? "border-[#1a1a1a] bg-[#1a1a1a] text-white" : "border-[#bbbbc0] text-[#525261] hover:bg-[#f1f1f5]"
            }`}
          >
            ≡ Q&Aを見る
            <span className={`text-[9.5px] ml-1 ${showQa ? "text-white/60" : "text-[#9a9aa0]"}`}>({qaList.length})</span>
          </button>
        </div>
        {showQa && (
          <div className="mt-2 border border-[#dedee5] rounded-lg overflow-hidden">
            {qaList.length === 0 ? (
              <div className="px-3 py-4 text-[11px] text-[#9a9aa0] text-center">
                まだ質問はありません
              </div>
            ) : (
              qaList.map((q) => {
                const qUser = getUserById(q.userId);
                return (
                  <div key={q.id} className="px-3 py-2.5 border-b border-[#f1f1f5] last:border-b-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-semibold text-[#525261]">{qUser?.name ?? "?"}</span>
                      <span className="text-[9px] text-[#9a9aa0]">{q.createdAt}</span>
                    </div>
                    <div className="text-[11.5px] text-[#1a1a1a] mb-1">Q: {q.question}</div>
                    {q.answer ? (
                      <div className="text-[11.5px] text-[#6666ff]">A: {q.answer}</div>
                    ) : (
                      <div className="text-[10.5px] text-[#9a9aa0] italic">未回答</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <ShareLinkBar templateId={templateId} ticketId={ticketId} />
    </div>
  );
}

// ─── Share link bar ──────────────────────────────────────────────────────────

function ShareLinkBar({ templateId, ticketId }: { templateId: string; ticketId?: string }) {
  const [copied, setCopied] = useState(false);

  const taskUrl = typeof window !== "undefined"
    ? `${window.location.origin}/tasks?template=${templateId}${ticketId ? `&ticket=${ticketId}` : ""}`
    : `/tasks?template=${templateId}${ticketId ? `&ticket=${ticketId}` : ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(taskUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-2.5 bg-[#f1f1f5] rounded-lg border border-[#dedee5]">
      <div className="flex-1 min-w-0 text-[10.5px] font-mono text-[#9a9aa0] truncate">
        {taskUrl}
      </div>
      <button
        onClick={handleCopy}
        className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors ${
          copied
            ? "bg-[#dfeede] text-[#3d6b3d]"
            : "bg-[#1a1a1a] text-white hover:bg-[#333]"
        }`}
      >
        {copied ? "コピーしました" : "リンクをコピー"}
      </button>
    </div>
  );
}

// ─── Bottom action bar per context ───────────────────────────────────────────

function ActionBar({
  context,
  ticketId,
  templateId,
  onAccept,
  onReport,
  onApprove,
  onReturn,
  onClose,
  onEdit,
}: {
  context: DetailContext;
  ticketId?: string;
  templateId: string;
  onAccept: () => void;
  onReport: (id: string) => void;
  onApprove: (id: string) => void;
  onReturn: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
  onEdit?: (templateId: string) => void;
}) {
  const { getTicketById } = useTaskContext();
  const ticket = ticketId ? getTicketById(ticketId) : undefined;

  if (context === "browse") {
    return (
      <div className="flex-none px-3.5 py-3.5 border-t border-[#dedee5]">
        <Button full onClick={onAccept}>このタスクを受注</Button>
      </div>
    );
  }

  if (context === "my_task" && ticketId) {
    const isDone = ticket?.status === "done" || ticket?.status === "returned";
    if (isDone) return null;
    return (
      <div className="flex-none px-3.5 py-3.5 border-t border-[#dedee5] flex gap-2">
        <Button variant="ghost" onClick={() => onReturn(ticketId)}>返却する</Button>
        <Button full onClick={() => onReport(ticketId)}>実施報告</Button>
      </div>
    );
  }

  if (context === "approve_pending" && ticketId) {
    const amt = ticket?.amount;
    return (
      <div className="flex-none px-3.5 py-3.5 border-t border-[#dedee5] flex gap-2">
        <Button variant="ghost" onClick={() => onReturn(ticketId)}>差し戻し</Button>
        <Button full onClick={() => onApprove(ticketId)}>
          承認 ({amt === "undecided" ? "金額未定" : `${amt} DAO 支払`})
        </Button>
      </div>
    );
  }

  if (context === "owner") {
    return (
      <div className="flex-none px-3.5 py-3.5 border-t border-[#dedee5] flex gap-2">
        <Button variant="ghost" onClick={() => { if (window.confirm("この募集を中止しますか？")) onClose(); }}>募集を中止</Button>
        <Button full onClick={() => onEdit?.(templateId)}>テンプレを編集</Button>
      </div>
    );
  }

  return null;
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function TaskDetailPanel({
  templateId,
  ticketId,
  context,
  onClose,
  onAccept,
  onReport,
  onApprove,
  onReturn,
  onReject,
  onEdit,
}: Props) {
  const title =
    context === "owner" ? "タスク詳細(テンプレ)"
    : "タスク詳細";

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <ModalHandle />
      <div className="flex-none flex items-center gap-2.5 px-4 pb-3 border-b border-[#dedee5]">
        <div className="flex-1 min-w-0 text-[14px] font-semibold">{title}</div>
        <button
          onClick={onClose}
          className="text-[18px] text-[#525261] w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>
      </div>
      <DetailBody
        templateId={templateId}
        ticketId={ticketId}
        context={context}
        onReport={onReport}
        onApprove={onApprove}
        onReturn={onReturn}
        onReject={onReject}
      />
      <ActionBar
        context={context}
        ticketId={ticketId}
        templateId={templateId}
        onAccept={onAccept}
        onReport={onReport}
        onApprove={onApprove}
        onReturn={onReturn}
        onReject={onReject}
        onClose={onClose}
        onEdit={onEdit}
      />
    </div>
  );
}
