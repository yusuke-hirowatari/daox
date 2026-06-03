/**
 * DAOX API レイヤ
 *
 * 現在はモックデータをラップするだけ。
 * 将来 Supabase / REST API に差し替える際はここの実装を変更する。
 * 呼び出し側のコードは変更不要。
 *
 * すべての関数は Promise を返すように設計し、
 * 将来の非同期 fetch への差替えを容易にする。
 */

import {
  USERS, getUserById, getCurrentUser, CURRENT_USER_ID,
  TASK_TEMPLATES, TASK_TICKETS,
  getTicketsByTemplateId, getRemainingSlots,
  getMyActiveTickets, getMyOrderedTemplates,
  EXCHANGE_ITEMS, MY_VOUCHERS,
  getActiveVouchers, getInactiveVouchers,
  NOTICES, BOARD_POSTS, VOTES, BANNER_NOTICES,
  TRANSACTIONS, DAO_BALANCE, getBalance,
  DM_THREADS, getMessagesByThreadId, DM_SUGGESTIONS,
  ALL_NOTIFICATIONS, getUnreadCount,
  RANKS, PREMIUM_REQS,
} from "@/mocks";

import type {
  User, TaskTemplate, TaskTicket,
  ExchangeItem, ExchangeVoucher,
  Notice, BoardPost, Vote,
  Transaction, DmThread, DmMessage, Notification,
  RankDef, PremiumRequirements,
} from "@/mocks";

// ─── Users ───────────────────────────────────────────────────────────────
export const api = {
  users: {
    getAll:    async (): Promise<User[]>               => USERS,
    getById:   async (id: string): Promise<User | undefined> => getUserById(id),
    getCurrent: async (): Promise<User>                => getCurrentUser(),
  },

  // ─── Tasks ─────────────────────────────────────────────────────────────
  tasks: {
    getTemplates:        async (): Promise<TaskTemplate[]>  => TASK_TEMPLATES,
    getTemplateById:     async (id: string): Promise<TaskTemplate | undefined> =>
                           TASK_TEMPLATES.find((t) => t.id === id),
    getTickets:          async (): Promise<TaskTicket[]>    => TASK_TICKETS,
    getTicketsByTemplate: async (templateId: string): Promise<TaskTicket[]> =>
                           getTicketsByTemplateId(templateId),
    getRemainingSlots:   async (template: TaskTemplate): Promise<number> =>
                           getRemainingSlots(template),
    getMyActiveTickets:  async () => getMyActiveTickets(),
    getMyOrderedTemplates: async (): Promise<TaskTemplate[]> =>
                           getMyOrderedTemplates(),
  },

  // ─── Exchange ───────────────────────────────────────────────────────────
  exchange: {
    getItems:      async (): Promise<ExchangeItem[]>    => EXCHANGE_ITEMS,
    getItemById:   async (id: string): Promise<ExchangeItem | undefined> =>
                   EXCHANGE_ITEMS.find((c) => c.id === id),
    getMyVouchers: async (): Promise<ExchangeVoucher[]> => MY_VOUCHERS,
    getActive:     async (): Promise<ExchangeVoucher[]> => getActiveVouchers(),
    getInactive:   async (): Promise<ExchangeVoucher[]> => getInactiveVouchers(),
  },

  // ─── Home / Community ───────────────────────────────────────────────────
  community: {
    getNotices:       async (): Promise<Notice[]>    => NOTICES,
    getBoardPosts:    async (): Promise<BoardPost[]> => BOARD_POSTS,
    getVotes:         async (): Promise<Vote[]>      => VOTES,
    getBannerNotices: async ()                       => BANNER_NOTICES,
  },

  // ─── Wallet ─────────────────────────────────────────────────────────────
  wallet: {
    getBalance:      async (userId?: string): Promise<number>       => getBalance(userId),
    getTransactions: async (): Promise<Transaction[]>               => TRANSACTIONS,
  },

  // ─── DM ─────────────────────────────────────────────────────────────────
  dm: {
    getThreads:    async (): Promise<DmThread[]>                      => DM_THREADS,
    getMessages:   async (threadId: string): Promise<DmMessage[]>    => getMessagesByThreadId(threadId),
    getSuggestions: async () => DM_SUGGESTIONS,
  },

  // ─── Notifications ───────────────────────────────────────────────────────
  notifications: {
    getAll:         async (): Promise<Notification[]> => ALL_NOTIFICATIONS,
    getUnreadCount: async (): Promise<number>         => getUnreadCount(),
  },

  // ─── Rank ────────────────────────────────────────────────────────────────
  rank: {
    getAll:       async (): Promise<Record<string, RankDef>> => RANKS,
    getRequirements: async (): Promise<PremiumRequirements>  => PREMIUM_REQS,
  },

  // ─── 定数 ────────────────────────────────────────────────────────────────
  constants: {
    CURRENT_USER_ID,
    DAO_BALANCE,
  },
} as const;

export type Api = typeof api;

// 個別エクスポート (直接インポートしたい場合)
export {
  CURRENT_USER_ID,
  getUserById, getCurrentUser,
  getTicketsByTemplateId, getRemainingSlots,
  getMyActiveTickets, getMyOrderedTemplates,
  getActiveVouchers, getInactiveVouchers,
  getMessagesByThreadId,
  getUnreadCount,
};
