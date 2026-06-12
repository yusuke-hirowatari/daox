"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  TASK_TEMPLATES as INITIAL_TEMPLATES,
  TASK_TICKETS as INITIAL_TICKETS,
} from "@/mocks/tasks";
import { CURRENT_USER_ID } from "@/mocks/users";
import type { TaskTemplate, TaskTicket, TaskAmount, TaskType } from "@/mocks/types";

// ─── Context types ───────────────────────────────────────────────────────────

interface TaskState {
  templates: TaskTemplate[];
  tickets: TaskTicket[];
}

interface TaskActions {
  /** タスク受注 (open ticket → accepted) */
  acceptTicket: (ticketId: string) => void;
  /** 実施報告送信 (accepted → pending_approval) */
  submitReport: (ticketId: string, reportText: string) => void;
  /** 承認 (pending_approval → done) */
  approveTicket: (ticketId: string, amount: number) => void;
  /** 返却 (accepted → returned + deletedFlag) */
  returnTicket: (ticketId: string) => void;
  /** 差し戻し (pending_approval → accepted) */
  rejectTicket: (ticketId: string) => void;
  /** テンプレート新規作成 */
  createTemplate: (data: CreateTemplateData) => void;
  /** テンプレート編集 */
  updateTemplate: (id: string, data: Partial<CreateTemplateData>) => void;
}

// ─── Helpers (pure, operating on state arrays) ───────────────────────────────

function ticketsByTemplate(tickets: TaskTicket[], templateId: string): TaskTicket[] {
  return tickets.filter((t) => t.templateId === templateId && !t.deletedFlag);
}

function myActiveTickets(
  tickets: TaskTicket[],
  templates: TaskTemplate[],
): (TaskTicket & { template: TaskTemplate })[] {
  return tickets
    .filter(
      (t) =>
        t.acceptedById === CURRENT_USER_ID &&
        (t.status === "accepted" || t.status === "pending_approval"),
    )
    .map((t) => ({
      ...t,
      template: templates.find((tmpl) => tmpl.id === t.templateId)!,
    }));
}

function myOrderedTemplates(templates: TaskTemplate[]): TaskTemplate[] {
  return templates.filter((t) => t.ordererId === CURRENT_USER_ID);
}

// ─── Public helpers exposed via context ──────────────────────────────────────

export interface TaskHelpers {
  getTicketsByTemplate: (templateId: string) => TaskTicket[];
  getMyActiveTickets: () => (TaskTicket & { template: TaskTemplate })[];
  getMyOrderedTemplates: () => TaskTemplate[];
  getTemplateById: (id: string) => TaskTemplate | undefined;
  getTicketById: (id: string) => TaskTicket | undefined;
}

// ─── Create template input ──────────────────────────────────────────────────

export interface CreateTemplateData {
  title: string;
  desc: string;
  defaultAmount: TaskAmount;
  defaultTime: string;
  deadline: string;
  type: TaskType;
  totalSlots: number;
  tags?: string[];
}

// ─── Context ─────────────────────────────────────────────────────────────────

const TaskContext = createContext<(TaskState & TaskActions & TaskHelpers) | null>(null);

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used within TaskProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function TaskProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<TaskTemplate[]>(INITIAL_TEMPLATES);
  const [tickets, setTickets] = useState<TaskTicket[]>(INITIAL_TICKETS);

  const now = () => new Date().toISOString();

  // ── Actions ──

  const acceptTicket = useCallback((ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: "accepted" as const, acceptedById: CURRENT_USER_ID, updatedAt: now() }
          : t,
      ),
    );
  }, []);

  const submitReport = useCallback((ticketId: string, reportText: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: "pending_approval" as const, reportText, updatedAt: now() }
          : t,
      ),
    );
  }, []);

  const approveTicket = useCallback((ticketId: string, amount: number) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: "done" as const, confirmedAmount: amount, updatedAt: now() }
          : t,
      ),
    );
  }, []);

  const returnTicket = useCallback((ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "returned" as const,
              deletedFlag: true,
              acceptedById: undefined,
              updatedAt: now(),
            }
          : t,
      ),
    );
  }, []);

  const rejectTicket = useCallback((ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: "accepted" as const, reportText: undefined, updatedAt: now() }
          : t,
      ),
    );
  }, []);

  const createTemplate = useCallback((data: CreateTemplateData) => {
    const seq = String(templates.length + 1).padStart(3, "0");
    const tmplId = `tmpl-${seq}`;
    const newTemplate: TaskTemplate = {
      id: tmplId,
      title: data.title,
      desc: data.desc,
      ordererId: CURRENT_USER_ID,
      totalSlots: data.totalSlots,
      defaultAmount: data.defaultAmount,
      defaultTime: data.defaultTime,
      deadline: data.deadline,
      type: data.type,
      tags: data.tags,
      createdAt: now(),
    };

    // チケットも自動生成
    const newTickets: TaskTicket[] = Array.from({ length: data.totalSlots }, (_, i) => ({
      id: `tkt-${seq}-${String(i + 1).padStart(3, "0")}`,
      templateId: tmplId,
      amount: data.defaultAmount,
      time: data.defaultTime,
      status: "open" as const,
      createdAt: now(),
      updatedAt: now(),
    }));

    setTemplates((prev) => [...prev, newTemplate]);
    setTickets((prev) => [...prev, ...newTickets]);
  }, [templates.length]);

  const updateTemplate = useCallback((id: string, data: Partial<CreateTemplateData>) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          ...(data.title !== undefined && { title: data.title }),
          ...(data.desc !== undefined && { desc: data.desc }),
          ...(data.defaultAmount !== undefined && { defaultAmount: data.defaultAmount }),
          ...(data.defaultTime !== undefined && { defaultTime: data.defaultTime }),
          ...(data.deadline !== undefined && { deadline: data.deadline }),
          ...(data.type !== undefined && { type: data.type }),
          ...(data.totalSlots !== undefined && { totalSlots: data.totalSlots }),
          ...(data.tags !== undefined && { tags: data.tags }),
        };
      }),
    );
  }, []);

  // ── Helpers ──

  const getTicketsByTemplate = useCallback(
    (templateId: string) => ticketsByTemplate(tickets, templateId),
    [tickets],
  );

  const getMyActiveTicketsHelper = useCallback(
    () => myActiveTickets(tickets, templates),
    [tickets, templates],
  );

  const getMyOrderedTemplatesHelper = useCallback(
    () => myOrderedTemplates(templates),
    [templates],
  );

  const getTemplateById = useCallback(
    (id: string) => templates.find((t) => t.id === id),
    [templates],
  );

  const getTicketById = useCallback(
    (id: string) => tickets.find((t) => t.id === id),
    [tickets],
  );

  return (
    <TaskContext.Provider
      value={{
        templates,
        tickets,
        acceptTicket,
        submitReport,
        approveTicket,
        returnTicket,
        rejectTicket,
        createTemplate,
        updateTemplate,
        getTicketsByTemplate,
        getMyActiveTickets: getMyActiveTicketsHelper,
        getMyOrderedTemplates: getMyOrderedTemplatesHelper,
        getTemplateById,
        getTicketById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
