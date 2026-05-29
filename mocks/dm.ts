import type { DmThread, DmMessage } from "./types";

// ─── スレッド一覧 ─────────────────────────────────────────────────────────
export const DM_THREADS: DmThread[] = [
  {
    id:              "th1",
    participantIds:  ["u1", "u2"],
    isGroup:         false,
    lastMessage:     "ありがとうございました!",
    lastMessageTime: "14:20",
    unreadCount:     2,
    isOnline:        true,
  },
  {
    id:              "th2",
    participantIds:  ["u1", "u2", "u3", "u4", "u5"],
    isGroup:         true,
    groupName:       "商店街グループ",
    lastMessage:     "田中: 土曜の件、了解です",
    lastMessageTime: "12:01",
    unreadCount:     5,
  },
  {
    id:              "th3",
    participantIds:  ["u1", "u3"],
    isGroup:         false,
    lastMessage:     "トマト取りに行きますね",
    lastMessageTime: "昨日",
    unreadCount:     0,
    isOnline:        false,
  },
  {
    id:              "th4",
    participantIds:  ["u1", "u4"],
    isGroup:         false,
    lastMessage:     "配布完了しました",
    lastMessageTime: "昨日",
    unreadCount:     0,
    isOnline:        false,
  },
  {
    id:              "th5",
    participantIds:  ["u1", "u_admin"],
    isGroup:         false,
    lastMessage:     "【お知らせ】今週のイベント...",
    lastMessageTime: "5/18",
    unreadCount:     0,
    isOfficial:      true,
  },
  {
    id:              "th6",
    participantIds:  ["u1", "u5"],
    isGroup:         false,
    lastMessage:     "カフェ良かったですね",
    lastMessageTime: "5/17",
    unreadCount:     0,
    isOnline:        true,
  },
];

// ─── メッセージ (スレッドth1: 伊藤さくらとの会話) ─────────────────────
export const MESSAGES_TH1: DmMessage[] = [
  {
    id:       "msg-th1-1",
    threadId: "th1",
    senderId: "u2",
    senderName: "伊藤 さくら",
    senderTone: 1,
    kind:     "text",
    text:     "チラシ配布お疲れさまでした!",
    time:     "14:15",
  },
  {
    id:       "msg-th1-2",
    threadId: "th1",
    senderId: "me",
    kind:     "text",
    text:     "こちらこそありがとうございます。",
    time:     "14:17",
  },
  {
    id:       "msg-th1-3",
    threadId: "th1",
    senderId: "u2",
    senderName: "伊藤 さくら",
    senderTone: 1,
    kind:     "text",
    text:     "少しですが、お礼にお送りします。",
    time:     "14:19",
  },
  {
    id:          "msg-th1-4",
    threadId:    "th1",
    senderId:    "u2",
    senderName:  "伊藤 さくら",
    senderTone:  1,
    kind:        "token",
    tokenAmount: 120,
    time:        "14:20",
  },
  {
    id:       "msg-th1-5",
    threadId: "th1",
    senderId: "u2",
    senderName: "伊藤 さくら",
    senderTone: 1,
    kind:     "text",
    text:     "ありがとうございました!",
    time:     "14:20",
  },
];

// ─── グループメッセージ (スレッドth2) ────────────────────────────────────
export const MESSAGES_TH2: DmMessage[] = [
  {
    id:         "msg-th2-1",
    threadId:   "th2",
    senderId:   "u1",
    senderName: "田中",
    senderTone: 0,
    kind:       "text",
    text:       "土曜の集合場所、商店街入口でOKですか？",
    time:       "11:42",
  },
  {
    id:         "msg-th2-2",
    threadId:   "th2",
    senderId:   "u2",
    senderName: "伊藤",
    senderTone: 1,
    kind:       "text",
    text:       "はい、入口で大丈夫です。",
    time:       "11:50",
  },
  {
    id:       "msg-th2-3",
    threadId: "th2",
    senderId: "me",
    kind:     "text",
    text:     "了解です！",
    time:     "11:55",
  },
  {
    id:         "msg-th2-4",
    threadId:   "th2",
    senderId:   "u1",
    senderName: "田中 太郎",
    senderTone: 0,
    kind:       "system",
    text:       "田中 太郎 が「夏祭り 出店サポート」を共有しました",
    time:       "12:00",
  },
  {
    id:         "msg-th2-5",
    threadId:   "th2",
    senderId:   "u1",
    senderName: "田中",
    senderTone: 0,
    kind:       "text",
    text:       "土曜の件、了解です。よろしくお願いします。",
    time:       "12:01",
  },
];

/** 新規DM作成候補ユーザー */
export const DM_SUGGESTIONS = [
  { userId: "u1",     name: "田中 太郎",   tone: 0, sub: "商店街本部" },
  { userId: "u2",     name: "伊藤 さくら", tone: 1, sub: "カフェ ことり" },
  { userId: "u3",     name: "佐藤 一郎",   tone: 2, sub: "農家" },
  { userId: "u4",     name: "木村 弘",     tone: 3, sub: "デザイナー" },
];

/** スレッドIDからメッセージを取得 */
export function getMessagesByThreadId(threadId: string): DmMessage[] {
  const map: Record<string, DmMessage[]> = {
    th1: MESSAGES_TH1,
    th2: MESSAGES_TH2,
  };
  return map[threadId] ?? [];
}
