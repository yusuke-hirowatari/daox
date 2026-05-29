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
  COUPON_CATALOG, MY_COUPONS,
  getActiveCoupons, getInactiveCoupons,
  NOTICES, BOARD_POSTS, VOTES, ANNOUNCEMENTS,
  TRANSACTIONS, DAO_BALANCE, getBalance,
  DM_THREADS, getMessagesByThreadId, DM_SUGGESTIONS,
  ALL_NOTIFICATIONS, getUnreadCount,
  RANKS, PREMIUM_REQS,
} from "@/mocks";

import type {
  User, TaskTemplate, TaskTicket,
  CouponTemplate, CouponInstance,
  Notice, BoardPost, Vote, Announcement,
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

  // ─── Coupons ────────────────────────────────────────────────────────────
  coupons: {
    getCatalog:    async (): Promise<CouponTemplate[]>  => COUPON_CATALOG,
    getByTemplateId: async (id: string): Promise<CouponTemplate | undefined> =>
                     COUPON_CATALOG.find((c) => c.id === id),
    getMyCoupons:  async (): Promise<CouponInstance[]> => MY_COUPONS,
    getActive:     async (): Promise<CouponInstance[]> => getActiveCoupons(),
    getInactive:   async (): Promise<CouponInstance[]> => getInactiveCoupons(),
  },

  // ─── Home / Community ───────────────────────────────────────────────────
  community: {
    getNotices:       async (): Promise<Notice[]>       => NOTICES,
    getBoardPosts:    async (): Promise<BoardPost[]>    => BOARD_POSTS,
    getVotes:         async (): Promise<Vote[]>         => VOTES,
    getAnnouncements: async (): Promise<Announcement[]> => ANNOUNCEMENTS,
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
  getActiveCoupons, getInactiveCoupons,
  getMessagesByThreadId,
  getUnreadCount,
};
