import type { TaskTemplate, TaskTicket, TaskQA } from "./types";
import { CURRENT_USER_ID } from "./users";

// ─── Q&A サンプル ─────────────────────────────────────────────────────────
const qa_t2: TaskQA[] = [
  {
    id:        "qa-t2-1",
    userId:    "u3",
    question:  "道具の種類を教えてください",
    answer:    "ローラーと刷毛を用意しています。汚れてもいい服でお越しください。",
    createdAt: "2026-05-20T09:00:00Z",
  },
  {
    id:        "qa-t2-2",
    userId:    "u5",
    question:  "駐車場はありますか？",
    createdAt: "2026-05-21T14:30:00Z",
  },
];

// ─── TaskTemplate ─────────────────────────────────────────────────────────

export const TASK_TEMPLATES: TaskTemplate[] = [
  // tmpl-001: 継続タスク (毎朝清掃)
  {
    id:             "tmpl-001",
    title:          "商店街の朝清掃",
    desc:           "メイン通りのゴミ拾い。終わったら集会所に集合。道具は現地に用意しています。",
    ordererId:      "u_admin",
    totalSlots:     5,
    defaultAmount:  100,
    defaultTime:    "毎朝 7:00–7:30",
    deadline:       "2026-12-31",
    type:           "continue",
    tags:           ["清掃", "継続"],
    createdAt:      "2026-01-01T06:00:00Z",
  },
  // tmpl-002: 看板リペイント (現在ログインユーザーが発注主)
  {
    id:             "tmpl-002",
    title:          "看板リペイント手伝い",
    desc:           "経験不問、道具はこちらで準備します。元気な方大歓迎！",
    ordererId:      CURRENT_USER_ID,   // u1 = 田中 太郎
    totalSlots:     2,
    defaultAmount:  500,
    defaultTime:    "5/24(土) 10:00–13:00",
    deadline:       "2026-05-23",
    type:           "once",
    tags:           ["作業", "塗装"],
    qaList:         qa_t2,
    createdAt:      "2026-05-19T10:00:00Z",
  },
  // tmpl-003: チラシ配布
  {
    id:             "tmpl-003",
    title:          "チラシ配布スタッフ",
    desc:           "商店街周辺、エリア応相談。雨天中止。",
    ordererId:      "u4",   // 木村
    totalSlots:     5,
    defaultAmount:  120,
    defaultTime:    "5/28(水) 13:00–15:00",
    deadline:       "2026-05-27",
    type:           "once",
    tags:           ["配布", "屋外"],
    createdAt:      "2026-05-19T12:00:00Z",
  },
  // tmpl-004: 試食モニター (金額未定)
  {
    id:             "tmpl-004",
    title:          "新メニュー試食モニター",
    desc:           "カフェ「ことり」新メニュー5品、感想記入あり。所要 30分程度。",
    ordererId:      "u2",   // 伊藤
    totalSlots:     5,
    defaultAmount:  "undecided",
    defaultTime:    "6/5までいつでも",
    deadline:       "2026-06-05",
    type:           "once",
    tags:           ["飲食", "モニター"],
    createdAt:      "2026-05-20T09:00:00Z",
  },
  // tmpl-005: ポスター制作 (提案型・高額)
  {
    id:             "tmpl-005",
    title:          "夏祭りポスター制作",
    desc:           "掲示用A2サイズ。初稿1週間、修正2回まで含む。",
    ordererId:      "u_admin",
    totalSlots:     1,
    defaultAmount:  1000,
    defaultTime:    "6/15まで",
    deadline:       "2026-06-10",
    type:           "once",
    tags:           ["デザイン", "印刷"],
    createdAt:      "2026-05-18T11:00:00Z",
  },
];

// ─── TaskTicket ───────────────────────────────────────────────────────────
// ID形式: "tkt-<templateSeq>-<ticketSeq>"
// 返却 = deletedFlag:true で残り枠が回復するが totalSlots は不変

export const TASK_TICKETS: TaskTicket[] = [
  // ── tmpl-001 (継続 · 朝清掃) ── 今日分チケット
  {
    id:          "tkt-001-001",
    templateId:  "tmpl-001",
    amount:      100,
    time:        "5/29(木) 7:00–7:30",
    status:      "open",
    createdAt:   "2026-05-29T00:00:00Z",
    updatedAt:   "2026-05-29T00:00:00Z",
  },
  // 過去分チケット (u1=現在ユーザーが実施済み)
  {
    id:           "tkt-001-002",
    templateId:   "tmpl-001",
    amount:       100,
    time:         "5/19(日) 7:00–7:30",
    status:       "done",
    acceptedById: CURRENT_USER_ID,
    confirmedAmount: 100,
    createdAt:    "2026-05-19T00:00:00Z",
    updatedAt:    "2026-05-20T08:00:00Z",
  },

  // ── tmpl-002 (看板リペイント · u1=発注主) ──
  // チケット001: 佐藤が承認待ち
  {
    id:           "tkt-002-001",
    templateId:   "tmpl-002",
    amount:       500,
    time:         "5/24(土) 10:00–13:00",
    status:       "pending_approval",
    acceptedById: "u3",
    reportText:   "リペイント完了しました。思ったより広かったですが無事きれいになりました！",
    createdAt:    "2026-05-20T10:00:00Z",
    updatedAt:    "2026-05-24T14:20:00Z",
  },
  // チケット002: 木村が受注中
  {
    id:           "tkt-002-002",
    templateId:   "tmpl-002",
    amount:       500,
    time:         "5/24(土) 10:00–13:00",
    status:       "accepted",
    acceptedById: "u4",
    createdAt:    "2026-05-20T10:00:00Z",
    updatedAt:    "2026-05-22T09:00:00Z",
  },
  // チケット003: 田中が返却 → 募集中に戻る (deletedFlag)
  {
    id:           "tkt-002-003",
    templateId:   "tmpl-002",
    amount:       500,
    time:         "5/24(土) 10:00–13:00",
    status:       "returned",
    acceptedById: CURRENT_USER_ID,
    deletedFlag:  true,
    createdAt:    "2026-05-20T10:00:00Z",
    updatedAt:    "2026-05-23T10:00:00Z",
  },

  // ── tmpl-003 (チラシ配布 · 木村発注) ──
  {
    id:           "tkt-003-001",
    templateId:   "tmpl-003",
    amount:       120,
    time:         "5/28(水) 13:00–15:00",
    status:       "accepted",
    acceptedById: "u3",
    createdAt:    "2026-05-20T12:00:00Z",
    updatedAt:    "2026-05-21T09:00:00Z",
  },
  {
    id:           "tkt-003-002",
    templateId:   "tmpl-003",
    amount:       120,
    time:         "5/28(水) 13:00–15:00",
    status:       "accepted",
    acceptedById: CURRENT_USER_ID,  // u1 が受注中 → マイタスクに表示
    createdAt:    "2026-05-20T12:00:00Z",
    updatedAt:    "2026-05-22T10:00:00Z",
  },
  {
    id:          "tkt-003-003",
    templateId:  "tmpl-003",
    amount:      120,
    time:        "5/28(水) 13:00–15:00",
    status:      "open",
    createdAt:   "2026-05-20T12:00:00Z",
    updatedAt:   "2026-05-20T12:00:00Z",
  },
  {
    id:          "tkt-003-004",
    templateId:  "tmpl-003",
    amount:      120,
    time:        "5/28(水) 13:00–15:00",
    status:      "open",
    createdAt:   "2026-05-20T12:00:00Z",
    updatedAt:   "2026-05-20T12:00:00Z",
  },
  {
    id:          "tkt-003-005",
    templateId:  "tmpl-003",
    amount:      120,
    time:        "5/28(水) 13:00–15:00",
    status:      "open",
    createdAt:   "2026-05-20T12:00:00Z",
    updatedAt:   "2026-05-20T12:00:00Z",
  },

  // ── tmpl-004 (試食モニター · 伊藤発注 · 金額未定) ──
  {
    id:           "tkt-004-001",
    templateId:   "tmpl-004",
    amount:       "undecided",
    time:         "6/5までいつでも",
    status:       "accepted",
    acceptedById: CURRENT_USER_ID,  // u1 が受注中
    createdAt:    "2026-05-21T11:00:00Z",
    updatedAt:    "2026-05-22T09:00:00Z",
  },
  {
    id:           "tkt-004-002",
    templateId:   "tmpl-004",
    amount:       "undecided",
    time:         "6/5までいつでも",
    status:       "accepted",
    acceptedById: "u5",
    createdAt:    "2026-05-21T11:00:00Z",
    updatedAt:    "2026-05-22T12:00:00Z",
  },
  {
    id:          "tkt-004-003",
    templateId:  "tmpl-004",
    amount:      "undecided",
    time:        "6/5までいつでも",
    status:      "open",
    createdAt:   "2026-05-21T11:00:00Z",
    updatedAt:   "2026-05-21T11:00:00Z",
  },
  {
    id:          "tkt-004-004",
    templateId:  "tmpl-004",
    amount:      "undecided",
    time:        "6/5までいつでも",
    status:      "open",
    createdAt:   "2026-05-21T11:00:00Z",
    updatedAt:   "2026-05-21T11:00:00Z",
  },
  {
    id:          "tkt-004-005",
    templateId:  "tmpl-004",
    amount:      "undecided",
    time:        "6/5までいつでも",
    status:      "open",
    createdAt:   "2026-05-21T11:00:00Z",
    updatedAt:   "2026-05-21T11:00:00Z",
  },

  // ── tmpl-005 (ポスター制作) ──
  {
    id:          "tkt-005-001",
    templateId:  "tmpl-005",
    amount:      1000,
    time:        "6/15まで",
    status:      "open",
    createdAt:   "2026-05-18T11:00:00Z",
    updatedAt:   "2026-05-18T11:00:00Z",
  },
];

// ─── ヘルパー ─────────────────────────────────────────────────────────────

/** テンプレートに紐づくチケット一覧 (deletedFlag=true は除外) */
export function getTicketsByTemplateId(templateId: string): TaskTicket[] {
  return TASK_TICKETS.filter(
    (t) => t.templateId === templateId && !t.deletedFlag
  );
}

/** 「残り枠数」= totalSlots - (accepted + pending_approval + done チケット数) */
export function getRemainingSlots(template: TaskTemplate): number {
  const active = getTicketsByTemplateId(template.id).filter(
    (t) => t.status === "accepted" || t.status === "pending_approval" || t.status === "done"
  ).length;
  return Math.max(0, template.totalSlots - active);
}

/** 現在ユーザーのマイタスク (受注中・承認待ち) */
export function getMyActiveTickets(): (TaskTicket & { template: TaskTemplate })[] {
  const activeStatuses: TaskTicket["status"][] = ["accepted", "pending_approval"];
  return TASK_TICKETS
    .filter((t) => t.acceptedById === CURRENT_USER_ID && activeStatuses.includes(t.status))
    .map((t) => ({
      ...t,
      template: TASK_TEMPLATES.find((tmpl) => tmpl.id === t.templateId)!,
    }));
}

/** 現在ユーザーが発注主のテンプレート */
export function getMyOrderedTemplates(): TaskTemplate[] {
  return TASK_TEMPLATES.filter((t) => t.ordererId === CURRENT_USER_ID);
}
