/**
 * DAOX 共通型定義
 * ここに全エンティティの型をまとめる。
 * 将来 Supabase / prisma の型に差し替える際はここだけ変更する。
 */

// ─── ユーザー ────────────────────────────────────────────────────────────
export type Role  = "member" | "moderator" | "superadmin";
export type Rank  = "basic"  | "premium";

export interface User {
  id:         string;
  name:       string;
  /** アバター頭文字 (1〜2文字) */
  initial:    string;
  /** アバター色トーン 0〜4 */
  tone:       number;
  role:       Role;
  rank:       Rank;
  xp:         number;
  daoBalance: number;
  tags:       string[];
  bio?:       string;
  joinedAt:   string;
  isOnline?:  boolean;
}

// ─── タスク (2層構造) ─────────────────────────────────────────────────────
/** 金額の型: 数値 or "未定" */
export type TaskAmount = number | "undecided";

/** タスク種別 */
export type TaskType = "once" | "continue";

/** タスクステータス — 各チケット独立 */
export type TaskStatus =
  | "open"              // 募集中
  | "accepted"          // 受注中
  | "pending_approval"  // 承認待ち
  | "done"              // 実施済み
  | "returned";         // 返却 (deletedFlag=true で枠回復)

/** Q&A エントリ */
export interface TaskQA {
  id:        string;
  userId:    string;
  question:  string;
  answer?:   string;
  createdAt: string;
}

/**
 * テンプレート — 募集全体のメタ情報
 * 「説明文・募集期間・募集人数」はテンプレートが保持
 */
export interface TaskTemplate {
  id:          string;
  title:       string;
  desc:        string;
  ordererId:   string;  // User.id
  totalSlots:  number;  // 募集人数 (分母 = 不変)
  /** テンプレートのデフォルト金額 → チケット作成時にコピー、個別上書き可 */
  defaultAmount: TaskAmount;
  /** テンプレートのデフォルト実施希望 → チケット作成時にコピー、個別上書き可 */
  defaultTime:   string;
  deadline:    string;  // 募集期間
  type:        TaskType;
  tags?:       string[];
  qaList?:     TaskQA[];
  createdAt:   string;
}

/**
 * チケット — 1人分の受注枠
 * ID形式: "tkt-<templateSeq>-<ticketSeq>" (例: tkt-001-002)
 * 「金額・実施希望」はテンプレートからコピーし個別上書き可
 * 「状態」は各チケット独立
 */
export interface TaskTicket {
  id:           string;
  templateId:   string;
  /** テンプレートからコピー・個別上書き可 */
  amount:       TaskAmount;
  /** テンプレートからコピー・個別上書き可 */
  time:         string;
  status:       TaskStatus;
  acceptedById?: string;  // User.id
  deletedFlag?:  boolean;  // 返却フラグ (true → 枠回復、分母は不変)
  /** 受注者の一言 (実施報告画面で入力) */
  reportText?:  string;
  /** 承認時の確定金額 (金額未定タスクの場合に記入) */
  confirmedAmount?: number;
  createdAt:    string;
  updatedAt:    string;
}

// ─── トークン交換 (2層構造) ────────────────────────────────────────────────
export type VoucherStatus = "active" | "used" | "expired";

/** 交換先カタログ — 交換できるもの一覧 */
export interface ExchangeItem {
  id:          string;
  title:       string;
  issuerName:  string;
  icon:        string;
  cost:        number;      // 必要 DAOトークン
  validDays:   number;
  stock:       number;      // 現在庫
  description: string;
  isHot?:      boolean;
  isLow?:      boolean;
  isSoldout?:  boolean;
  isLimited?:  boolean;
}

/** 交換券 — ユーザーが保有する1枚、固有 redeemCode */
export interface ExchangeVoucher {
  id:          string;
  itemId:      string;
  title:       string;
  issuerName:  string;
  icon:        string;
  issuedAt:    string;
  expiresAt?:  string;
  daysLeft?:   number;
  status:      VoucherStatus;
  redeemCode:  string;   // 固有コード (QR表示用)
  usedAt?:     string;
}

// ─── ウォレット ──────────────────────────────────────────────────────────
export type TxDirection = "in" | "out";
export type TxKind = "task" | "transfer" | "exchange" | "reward" | "vote_reward";

export interface Transaction {
  id:                string;
  direction:         TxDirection;
  kind:              TxKind;
  counterparty:      string;   // 相手名 or システム名
  desc:              string;
  amount:            number;
  time:              string;
  balanceAfter:      number;
  relatedTaskId?:    string;
  relatedExchangeId?: string;
}

// ─── お知らせ / 掲示板 / 投票 ───────────────────────────────────────────
export type NoticeTag = "重要" | "お知らせ" | "イベント";

export interface Notice {
  id:            string;
  tag:           NoticeTag;
  date:          string;
  title:         string;
  body:          string;
  isPinned?:     boolean;
  showInBanner?: boolean;
  authorId:      string;
}

export interface BoardPost {
  id:         string;
  authorId:   string;
  authorName: string;
  tone:       number;
  xp:         number;
  time:       string;
  tokens?:    number | null;
  title:      string;
  body:       string;
  isUnread?:  boolean;
}

export interface VoteOption {
  label:     string;
  voteCount: number;
}

export interface Vote {
  id:       string;
  title:    string;
  deadline: string;
  voted:    number;
  total:    number;
  options:  VoteOption[];
  status:   "open" | "closed";
}

// ─── DM ─────────────────────────────────────────────────────────────────
export interface DmThread {
  id:               string;
  participantIds:   string[];
  isGroup:          boolean;
  groupName?:       string;
  lastMessage:      string;
  lastMessageTime:  string;
  unreadCount:      number;
  isOnline?:        boolean;
  isOfficial?:      boolean;
}

export type MessageKind = "text" | "token" | "system";

export interface DmMessage {
  id:           string;
  threadId:     string;
  /** 送信者 ID、"me" は現在ログイン中ユーザー */
  senderId:     string;
  senderName?:  string;
  senderTone?:  number;
  kind:         MessageKind;
  text?:        string;
  tokenAmount?: number;
  time:         string;
}

// ─── 通知 ────────────────────────────────────────────────────────────────
export type NotifKind = "token" | "task" | "dm" | "vote" | "rank" | "system";

export interface Notification {
  id:             string;
  kind:           NotifKind;
  fromUserId?:    string;
  fromUserName?:  string;
  fromUserTone?:  number;
  text:           string;
  meta?:          string;
  time:           string;
  isUnread:       boolean;
}

// ─── ランク ──────────────────────────────────────────────────────────────
export interface RankDef {
  id:    Rank;
  name:  string;
  sub:   string;
  glyph: string;
  color: string;
}

export interface PremiumRequirements {
  visits: number;  // 年間チェックイン回数
  duties: number;  // 担い手活動回数
}
