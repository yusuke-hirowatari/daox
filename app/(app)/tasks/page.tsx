"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { StatusPill } from "@/components/atoms/StatusPill";
import { TaskDetailPanel, type DetailContext } from "@/components/tasks/TaskDetailPanel";
import { TaskCreatePage } from "@/components/tasks/TaskCreatePage";
import { TaskReportPage } from "@/components/tasks/TaskReportPage";
import { TaskApprovePage } from "@/components/tasks/TaskApprovePage";
import { ReturnModal, RejectModal } from "@/components/tasks/TaskModals";
import { fmtAmount, amountColor, statusVariant, statusLabel } from "@/components/tasks/utils";
import { TaskProvider, useTaskContext, type CreateTemplateData } from "@/components/tasks/TaskContext";
import { getUserById, CURRENT_USER_ID } from "@/mocks/users";
import type { TaskTemplate, TaskTicket } from "@/mocks/types";

// ─── State types ──────────────────────────────────────────────────────────────

type SubTab = 0 | 1 | 2;

type DetailState = {
  templateId: string;
  ticketId?: string;
  context: DetailContext;
} | null;

type ModalState =
  | { type: "return"; ticketId: string }
  | { type: "reject"; ticketId: string }
  | null;

type PageMode =
  | { type: "list" }
  | { type: "create" }
  | { type: "edit"; templateId: string }
  | { type: "report"; ticketId: string }
  | { type: "approve"; ticketId: string };

// ─── Sub-components ───────────────────────────────────────────────────────────

function TaskCard({
  tmpl,
  ticket,
  onOpen,
}: {
  tmpl: TaskTemplate;
  ticket?: TaskTicket;
  onOpen: () => void;
}) {
  const { getTicketsByTemplate } = useTaskContext();
  const orderer = getUserById(tmpl.ordererId);
  const activeTickets = getTicketsByTemplate(tmpl.id);
  const isContinue = tmpl.type === "continue";
  const displayAmount = ticket?.amount ?? tmpl.defaultAmount;

  return (
    <div
      className="px-4 py-3.5 border-b border-[#dedee5] cursor-pointer hover:bg-[#fafafa] transition-colors"
      onClick={onOpen}
    >
      <div className="flex items-center gap-2 mb-2">
        {orderer && <Avatar size={24} label={orderer.initial} tone={orderer.tone} />}
        <span className="text-[11.5px] font-semibold truncate">{orderer?.name ?? "不明"}</span>
        {isContinue ? (
          <StatusPill status="continue" label="継続" />
        ) : (
          <span className="text-[10px] font-mono text-[#9a9aa0]">
            {activeTickets.filter((t) => t.status !== "open").length}/{tmpl.totalSlots}人
          </span>
        )}
        <div className="flex-1" />
        <span
          className="text-[13px] font-bold font-mono whitespace-nowrap"
          style={{ color: amountColor(displayAmount) }}
        >
          {fmtAmount(displayAmount)}
        </span>
      </div>
      <div className="text-[14px] font-bold leading-snug mb-1">{tmpl.title}</div>
      <div className="text-[11.5px] text-[#525261] line-clamp-1 mb-1.5">{tmpl.desc}</div>
      <div className="flex items-center gap-1 text-[10.5px] text-[#9a9aa0] font-mono">
        <span className="text-[11px]">⏱</span>
        {ticket?.time ?? tmpl.defaultTime}
      </div>
    </div>
  );
}

function MyTaskCard({
  ticket,
  tmpl,
  onOpen,
}: {
  ticket: TaskTicket;
  tmpl: TaskTemplate;
  onOpen: () => void;
}) {
  const orderer = getUserById(tmpl.ordererId);
  const isDone = ticket.status === "done" || ticket.status === "returned";
  const sv = statusVariant(ticket.status, ticket.confirmedAmount);
  const sl = statusLabel(ticket.status, ticket.confirmedAmount);

  return (
    <div
      className="px-4 py-3 border-b border-[#dedee5] cursor-pointer hover:bg-[#fafafa] transition-colors"
      onClick={onOpen}
    >
      <div className="flex items-start gap-2 mb-1.5">
        {orderer && <Avatar size={22} label={orderer.initial} tone={orderer.tone} />}
        <span className="text-[11.5px] font-semibold pt-[2px] truncate">{orderer?.name ?? "不明"}</span>
        {tmpl.type === "continue" && <StatusPill status="continue" label="継続" />}
        <div className="flex-1" />
        {isDone && ticket.confirmedAmount !== undefined ? (
          <div className="text-right">
            <div className="text-[9.5px] font-mono text-[#9a9aa0] line-through leading-none">
              元 {ticket.amount === "undecided" ? "未定" : `${ticket.amount}`}
            </div>
            <div className={`text-[13.5px] font-bold font-mono mt-0.5 ${ticket.confirmedAmount > 0 ? "text-[#6666ff]" : "text-[#1a1a1a]"}`}>
              {ticket.confirmedAmount > 0 ? "+" : ""}{ticket.confirmedAmount} DAO
            </div>
          </div>
        ) : (
          <span
            className="text-[13px] font-bold font-mono whitespace-nowrap pt-[2px]"
            style={{ color: amountColor(ticket.amount) }}
          >
            {fmtAmount(ticket.amount)}
          </span>
        )}
      </div>
      <div className="text-[13px] font-semibold mb-1.5 flex items-center gap-1.5">
        {tmpl.title}
        <span className="text-[10.5px] font-mono text-[#9a9aa0]">#{ticket.id.split("-").pop()}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10.5px] font-mono text-[#9a9aa0] flex-1">⏱ {ticket.time}</span>
        {isDone ? (
          <StatusPill status={sv} label={sl} />
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
          >
            実施報告
          </Button>
        )}
      </div>
    </div>
  );
}

function OrdererTab({
  onOpenTemplate,
  onOpenPendingTicket,
  onEditTemplate,
}: {
  onOpenTemplate: (templateId: string) => void;
  onOpenPendingTicket: (templateId: string, ticketId: string) => void;
  onEditTemplate: (templateId: string) => void;
}) {
  const { templates, tickets, getTicketsByTemplate, getMyOrderedTemplates } = useTaskContext();
  const myTemplates = getMyOrderedTemplates();

  const pendingTickets = tickets.filter(
    (t) =>
      myTemplates.some((tmpl) => tmpl.id === t.templateId) &&
      t.status === "pending_approval"
  );
  const doneTickets = tickets.filter(
    (t) =>
      myTemplates.some((tmpl) => tmpl.id === t.templateId) &&
      t.status === "done" &&
      !t.deletedFlag
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {pendingTickets.length > 0 && (
        <>
          <div className="flex items-center gap-2 px-4 py-3.5 bg-[#f1f1f5] border-b border-[#dedee5]">
            <span className="text-[11px] font-mono text-[#525261]">━━ 承認待ち</span>
            <span className="text-[10px] font-bold font-mono px-1.5 py-px rounded-full bg-[#6666ff] text-white">
              {pendingTickets.length}
            </span>
          </div>
          {pendingTickets.map((tk) => {
            const tmpl = templates.find((t) => t.id === tk.templateId)!;
            const acceptor = tk.acceptedById ? getUserById(tk.acceptedById) : null;
            return (
              <div
                key={tk.id}
                className="px-4 py-3 border-b border-[#dedee5] cursor-pointer hover:bg-[#fafafa]"
                onClick={() => onOpenPendingTicket(tmpl.id, tk.id)}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9.5px] font-mono text-[#9a9aa0] px-1.5 py-px bg-[#f1f1f5] rounded">
                    #{tk.id.split("-").pop()}
                  </span>
                  <span className="text-[11px] font-semibold text-[#525261] flex-1 truncate">{tmpl.title}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {acceptor && <Avatar size={28} label={acceptor.initial} tone={acceptor.tone} />}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-semibold">{acceptor?.name ?? "不明"}さん</div>
                    <div className="text-[10px] text-[#9a9aa0] mt-0.5">
                      {tk.updatedAt.slice(5, 10).replace("-", "/")} 実施報告
                    </div>
                  </div>
                  <span
                    className="text-[13px] font-bold font-mono whitespace-nowrap"
                    style={{ color: amountColor(tk.amount) }}
                  >
                    {fmtAmount(tk.amount)}
                  </span>
                  <Button
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onOpenPendingTicket(tmpl.id, tk.id); }}
                  >
                    承認 ({fmtAmount(tk.amount)})
                  </Button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {myTemplates.length > 0 && (
        <>
          <div className="px-4 py-3.5 bg-[#f1f1f5] border-b border-[#dedee5]">
            <span className="text-[11px] font-mono text-[#525261]">━━ 募集中 (自分が公開)</span>
          </div>
          {myTemplates.map((tmpl) => {
            const active = getTicketsByTemplate(tmpl.id);
            return (
              <div
                key={tmpl.id}
                className="px-4 py-3 border-b border-[#dedee5] cursor-pointer hover:bg-[#fafafa]"
                onClick={() => onOpenTemplate(tmpl.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12.5px] font-semibold flex-1 truncate">{tmpl.title}</span>
                  <span
                    className="text-[13px] font-bold font-mono whitespace-nowrap"
                    style={{ color: amountColor(tmpl.defaultAmount) }}
                  >
                    {fmtAmount(tmpl.defaultAmount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] text-[#9a9aa0] flex-1">
                    応募 {active.filter((t) => t.status !== "open").length}/{tmpl.totalSlots}人 · ⏱ {tmpl.deadline}
                  </span>
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onEditTemplate(tmpl.id); }}>
                    編集
                  </Button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {doneTickets.length > 0 && (
        <>
          <div className="px-4 py-3.5 bg-[#f1f1f5] border-b border-[#dedee5]">
            <span className="text-[11px] font-mono text-[#525261]">━━ 完了</span>
          </div>
          {doneTickets.map((tk) => {
            const tmpl = templates.find((t) => t.id === tk.templateId)!;
            const acceptor = tk.acceptedById ? getUserById(tk.acceptedById) : null;
            return (
              <div key={tk.id} className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#dedee5]">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium truncate">{tmpl.title}</div>
                  <div className="text-[10.5px] text-[#9a9aa0] mt-0.5">→ {acceptor?.name ?? "不明"}さんへ支払い</div>
                </div>
                <span className="text-[12.5px] font-bold font-mono text-[#525261] whitespace-nowrap">
                  −{tk.confirmedAmount ?? 0} DAO
                </span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── PC Sub-components ────────────────────────────────────────────────────────

function PcSubNav({
  subtab, onChangeTab,
}: {
  subtab: SubTab; onChangeTab: (t: SubTab) => void;
}) {
  const { templates, tickets, getTicketsByTemplate, getMyActiveTickets, getMyOrderedTemplates } = useTaskContext();
  const tabs = [
    { label: "募集中",     count: templates.filter((tmpl) => getTicketsByTemplate(tmpl.id).some((t) => t.status === "open")).length },
    { label: "マイタスク", count: getMyActiveTickets().length + tickets.filter((t) => t.acceptedById === CURRENT_USER_ID && t.status === "done").length },
    { label: "タスク発注", count: getMyOrderedTemplates().length },
  ];

  return (
    <div className="w-[180px] border-r border-[#dedee5] bg-[#f1f1f5] px-2 py-3 flex flex-col gap-0.5 flex-none">
      {tabs.map((t, i) => {
        const on = i === subtab;
        return (
          <button
            key={t.label}
            onClick={() => onChangeTab(i as SubTab)}
            className={`flex items-center px-3 py-2 rounded-md text-[12px] font-${on ? "semibold" : "medium"} transition-colors ${
              on ? "bg-white text-[#1a1a1a] border border-[#dedee5] shadow-sm" : "text-[#525261] hover:bg-white/60"
            }`}
          >
            <span className="flex-1">{t.label}</span>
            <span className={`text-[10px] font-bold font-mono px-1.5 py-px rounded-full ${on ? "bg-[#1a1a1a] text-white" : "bg-[#dedee5] text-[#9a9aa0]"}`}>
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PcTaskList({
  subtab, selectedId, onSelect,
}: {
  subtab: SubTab; selectedId: string | null;
  onSelect: (templateId: string, ticketId?: string, context?: DetailContext) => void;
}) {
  const { templates, tickets, getTicketsByTemplate, getMyActiveTickets } = useTaskContext();

  if (subtab === 0) {
    const openTemplates = templates.filter((tmpl) =>
      getTicketsByTemplate(tmpl.id).some((t) => t.status === "open")
    );
    return (
      <div className="w-[300px] flex-none border-r border-[#dedee5] overflow-y-auto">
        {openTemplates.map((tmpl) => {
          const openTicket = getTicketsByTemplate(tmpl.id).find((t) => t.status === "open");
          const orderer = getUserById(tmpl.ordererId);
          const sel = selectedId === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onSelect(tmpl.id, openTicket?.id, "browse")}
              className={`px-4 py-3 border-b border-[#dedee5] cursor-pointer transition-colors border-l-[3px] ${
                sel ? "bg-[#eeeeff] border-l-[#6666ff]" : "border-l-transparent hover:bg-[#fafafa]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {orderer && <Avatar size={20} label={orderer.initial} tone={orderer.tone} />}
                <span className="text-[11.5px] font-semibold truncate">{orderer?.name ?? "不明"}</span>
                <span className="text-[10px] font-mono text-[#9a9aa0] ml-auto">
                  {tmpl.type === "continue" ? "継続" : `${getTicketsByTemplate(tmpl.id).filter((t) => t.status !== "open").length}/${tmpl.totalSlots}人`}
                </span>
              </div>
              <div className="text-[13px] font-semibold mb-1 truncate">{tmpl.title}</div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold font-mono" style={{ color: amountColor(tmpl.defaultAmount) }}>
                  {fmtAmount(tmpl.defaultAmount)}
                </span>
                <span className="text-[10.5px] text-[#9a9aa0] font-mono ml-auto">⏱ {tmpl.defaultTime}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (subtab === 1) {
    const myTickets = getMyActiveTickets();
    const doneTickets = tickets
      .filter((t) => t.acceptedById === CURRENT_USER_ID && t.status === "done")
      .map((t) => ({ ...t, template: templates.find((tmpl) => tmpl.id === t.templateId)! }));
    const allTickets = [...myTickets, ...doneTickets];
    return (
      <div className="w-[300px] flex-none border-r border-[#dedee5] overflow-y-auto">
        {allTickets.map(({ template: tmpl, ...ticket }) => {
          const orderer = getUserById(tmpl.ordererId);
          const sel = selectedId === ticket.id;
          const sv = statusVariant(ticket.status, ticket.confirmedAmount);
          const sl = statusLabel(ticket.status, ticket.confirmedAmount);
          return (
            <div
              key={ticket.id}
              onClick={() => onSelect(tmpl.id, ticket.id, "my_task")}
              className={`px-4 py-3 border-b border-[#dedee5] cursor-pointer transition-colors border-l-[3px] ${
                sel ? "bg-[#eeeeff] border-l-[#6666ff]" : "border-l-transparent hover:bg-[#fafafa]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {orderer && <Avatar size={20} label={orderer.initial} tone={orderer.tone} />}
                <span className="text-[11.5px] font-semibold truncate">{orderer?.name ?? "不明"}</span>
                <span className="text-[10px] font-mono text-[#9a9aa0] ml-auto">#{ticket.id.split("-").pop()}</span>
              </div>
              <div className="text-[13px] font-semibold mb-1 truncate">{tmpl.title}</div>
              <div className="flex items-center gap-1.5">
                <StatusPill status={sv} label={sl} />
                <span className="text-[10.5px] text-[#9a9aa0] font-mono ml-auto">⏱ {ticket.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <div className="w-[300px] flex-none border-r border-[#dedee5]" />;
}

// ─── Main Page (inner, within provider) ──────────────────────────────────────

function TasksPageInner() {
  const ctx = useTaskContext();
  const [subtab, setSubtab] = useState<SubTab>(0);
  const [detail, setDetail] = useState<DetailState>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [pageMode, setPageMode] = useState<PageMode>({ type: "list" });

  const [pcSelectedId, setPcSelectedId] = useState<string | null>(null);
  const [pcDetail, setPcDetail] = useState<DetailState>(null);

  // ── handlers ──
  const openDetail = (templateId: string, ticketId: string | undefined, context: DetailContext) =>
    setDetail({ templateId, ticketId, context });
  const closeDetail = () => setDetail(null);

  const handleAccept = () => {
    if (!detail?.ticketId) return;
    ctx.acceptTicket(detail.ticketId);
    closeDetail();
  };

  const handleReport = (ticketId: string) => {
    closeDetail();
    setPageMode({ type: "report", ticketId });
  };

  const handleApproveOpen = (ticketId: string) => {
    closeDetail();
    setPageMode({ type: "approve", ticketId });
  };

  const handleApproveSubmit = (amount: number) => {
    if (pageMode.type === "approve") {
      ctx.approveTicket(pageMode.ticketId, amount);
    }
    setPageMode({ type: "list" });
  };

  const handleReturn = (ticketId: string) => setModal({ type: "return", ticketId });
  const handleReject = (ticketId: string) => setModal({ type: "reject", ticketId });

  const handleEdit = (templateId: string) => {
    closeDetail();
    setPcDetail(null);
    setPageMode({ type: "edit", templateId });
  };

  // ── Open ticket helpers ──
  const openBrowseTicket = (tmpl: TaskTemplate) => {
    const openTicket = ctx.getTicketsByTemplate(tmpl.id).find((t) => t.status === "open");
    const isOwner = tmpl.ordererId === CURRENT_USER_ID;
    openDetail(tmpl.id, openTicket?.id, isOwner ? "owner" : "browse");
  };

  const openMyTicket = (ticket: TaskTicket) => openDetail(ticket.templateId, ticket.id, "my_task");
  const openPendingTicket = (templateId: string, ticketId: string) => openDetail(templateId, ticketId, "approve_pending");
  const openOwnerTemplate = (templateId: string) => openDetail(templateId, undefined, "owner");

  const handlePcSelect = (templateId: string, ticketId?: string, context?: DetailContext) => {
    setPcSelectedId(ticketId ?? templateId);
    setPcDetail({ templateId, ticketId, context: context ?? "browse" });
  };

  // ── Subtab data ──
  const openTemplates = ctx.templates.filter((tmpl) =>
    ctx.getTicketsByTemplate(tmpl.id).some((t) => t.status === "open")
  );

  const myActiveTickets = ctx.getMyActiveTickets();
  const myDoneTickets = ctx.tickets
    .filter((t) => t.acceptedById === CURRENT_USER_ID && t.status === "done")
    .map((t) => ({ ...t, template: ctx.templates.find((tmpl) => tmpl.id === t.templateId)! }));
  const myAllTickets = [...myActiveTickets, ...myDoneTickets];

  const SUBTAB_LABELS = [
    { label: "募集中",     count: openTemplates.length },
    { label: "マイタスク", count: myActiveTickets.length },
    { label: "タスク発注", count: ctx.getMyOrderedTemplates().length },
  ];

  // ── Non-list modes ──
  if (pageMode.type === "create") {
    return (
      <TaskCreatePage
        onBack={() => setPageMode({ type: "list" })}
        onPublish={(data) => {
          ctx.createTemplate(data);
          setPageMode({ type: "list" });
          setSubtab(2); // 発注タブに切り替え
        }}
      />
    );
  }

  if (pageMode.type === "edit") {
    const tmpl = ctx.getTemplateById(pageMode.templateId);
    return (
      <TaskCreatePage
        initial={tmpl}
        onBack={() => setPageMode({ type: "list" })}
        onPublish={(data) => {
          ctx.updateTemplate(pageMode.templateId, data);
          setPageMode({ type: "list" });
        }}
      />
    );
  }

  if (pageMode.type === "report") {
    return (
      <TaskReportPage
        ticketId={pageMode.ticketId}
        onBack={() => setPageMode({ type: "list" })}
        onSubmit={(reportText) => {
          ctx.submitReport(pageMode.ticketId, reportText);
          setPageMode({ type: "list" });
        }}
      />
    );
  }

  if (pageMode.type === "approve") {
    return (
      <TaskApprovePage
        ticketId={pageMode.ticketId}
        onBack={() => setPageMode({ type: "list" })}
        onApprove={handleApproveSubmit}
      />
    );
  }

  // ── Main list view ──
  return (
    <div className="flex flex-col h-full relative">
      {/* ── SP ── */}
      <div className="md:hidden flex flex-col h-full">
        <div className="sticky top-0 z-20 bg-white flex-none flex border-b border-[#dedee5] px-3">
          {SUBTAB_LABELS.map((t, i) => {
            const on = i === subtab;
            return (
              <button
                key={t.label}
                onClick={() => setSubtab(i as SubTab)}
                className={`px-2.5 py-3 text-[12.5px] font-${on ? "semibold" : "medium"} flex items-center gap-1.5 border-b-2 -mb-px transition-colors ${
                  on ? "text-[#1a1a1a] border-[#1a1a1a]" : "text-[#9a9aa0] border-transparent"
                }`}
              >
                {t.label}
                <span className={`text-[9.5px] font-bold font-mono px-1.5 py-px rounded-full ${on ? "bg-[#1a1a1a] text-white" : "bg-[#dedee5] text-[#9a9aa0]"}`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          {subtab === 0 && openTemplates.map((tmpl) => (
            <TaskCard key={tmpl.id} tmpl={tmpl} onOpen={() => openBrowseTicket(tmpl)} />
          ))}
          {subtab === 1 && myAllTickets.map(({ template: tmpl, ...ticket }) => (
            <MyTaskCard key={ticket.id} ticket={ticket} tmpl={tmpl} onOpen={() => openMyTicket(ticket)} />
          ))}
          {subtab === 2 && (
            <OrdererTab
              onOpenTemplate={openOwnerTemplate}
              onOpenPendingTicket={openPendingTicket}
              onEditTemplate={handleEdit}
            />
          )}
        </div>

        <button
          onClick={() => setPageMode({ type: "create" })}
          className="absolute right-4 bottom-4 w-[52px] h-[52px] rounded-full bg-[#1a1a1a] text-white text-[24px] font-light flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,.15)] hover:bg-[#333] transition-colors z-10"
          aria-label="新規タスク"
        >
          +
        </button>
      </div>

      {/* ── PC ── */}
      <div className="hidden md:flex flex-col h-full relative">
        <div className="flex flex-1 overflow-hidden">
          <PcSubNav
            subtab={subtab}
            onChangeTab={(t) => { setSubtab(t); setPcDetail(null); setPcSelectedId(null); }}
          />
          <PcTaskList subtab={subtab} selectedId={pcSelectedId} onSelect={handlePcSelect} />
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {subtab === 2 ? (
              <OrdererTab
                onOpenTemplate={(tid) => handlePcSelect(tid, undefined, "owner")}
                onOpenPendingTicket={(tid, tkid) => handlePcSelect(tid, tkid, "approve_pending")}
                onEditTemplate={handleEdit}
              />
            ) : pcDetail ? (
              <TaskDetailPanel
                templateId={pcDetail.templateId}
                ticketId={pcDetail.ticketId}
                context={pcDetail.context}
                onClose={() => { setPcDetail(null); setPcSelectedId(null); }}
                onAccept={() => {
                  if (pcDetail.ticketId) ctx.acceptTicket(pcDetail.ticketId);
                  setPcDetail(null); setPcSelectedId(null);
                }}
                onReport={(id) => setPageMode({ type: "report", ticketId: id })}
                onApprove={(id) => setPageMode({ type: "approve", ticketId: id })}
                onReturn={(id) => setModal({ type: "return", ticketId: id })}
                onReject={(id) => setModal({ type: "reject", ticketId: id })}
                onEdit={handleEdit}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#9a9aa0] text-[13px]">
                タスクを選択してください
              </div>
            )}
          </div>
        </div>

        {/* FAB */}
        <button
          onClick={() => setPageMode({ type: "create" })}
          className="absolute right-6 bottom-6 w-[52px] h-[52px] rounded-full bg-[#1a1a1a] text-white text-[24px] font-light flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,.15)] hover:bg-[#333] transition-colors z-10"
          aria-label="新規タスク"
        >
          +
        </button>
      </div>

      {/* ── SP Detail bottom sheet ── */}
      {detail && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/40 z-50" onClick={closeDetail} />
          <div className="fixed left-0 right-0 z-50 bg-white rounded-t-2xl flex flex-col" style={{ bottom: 56, maxHeight: "calc(90dvh - 56px)" }}>
            <TaskDetailPanel
              templateId={detail.templateId}
              ticketId={detail.ticketId}
              context={detail.context}
              onClose={closeDetail}
              onAccept={handleAccept}
              onReport={handleReport}
              onApprove={handleApproveOpen}
              onReturn={handleReturn}
              onReject={handleReject}
              onEdit={handleEdit}
            />
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {modal?.type === "return" && (
        <ReturnModal
          ticketId={modal.ticketId}
          onCancel={() => setModal(null)}
          onReturn={() => {
            ctx.returnTicket(modal.ticketId);
            setModal(null);
            closeDetail();
          }}
        />
      )}
      {modal?.type === "reject" && (
        <RejectModal
          ticketId={modal.ticketId}
          onCancel={() => setModal(null)}
          onReject={() => {
            ctx.rejectTicket(modal.ticketId);
            setModal(null);
            closeDetail();
          }}
        />
      )}
    </div>
  );
}

// ─── Wrapped export ──────────────────────────────────────────────────────────

export default function TasksPage() {
  return (
    <TaskProvider>
      <TasksPageInner />
    </TaskProvider>
  );
}
