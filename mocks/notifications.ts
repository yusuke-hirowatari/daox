import type { Notification } from "./types";

export const NOTIFICATIONS_TODAY: Notification[] = [
  {
    id:            "notif-1",
    kind:          "token",
    fromUserId:    "u2",
    fromUserName:  "伊藤 さくら",
    fromUserTone:  1,
    text:          "からトークンを受け取りました",
    meta:          "+120 DAO",
    time:          "14:20",
    isUnread:      true,
  },
  {
    id:            "notif-2",
    kind:          "task",
    fromUserId:    "u1",
    fromUserName:  "田中 太郎",
    fromUserTone:  0,
    text:          "があなたの実施報告を承認しました",
    meta:          "看板リペイント",
    time:          "13:05",
    isUnread:      true,
  },
  {
    id:            "notif-3",
    kind:          "dm",
    fromUserId:    "u2",
    fromUserName:  "伊藤 さくら",
    fromUserTone:  1,
    text:          "からメッセージ",
    meta:          "ありがとうございました!",
    time:          "14:20",
    isUnread:      true,
  },
  {
    id:            "notif-4",
    kind:          "vote",
    fromUserName:  "運営事務局",
    fromUserTone:  0,
    text:          "新しい投票が始まりました",
    meta:          "盆踊り会場の候補について",
    time:          "11:30",
    isUnread:      false,
  },
];

export const NOTIFICATIONS_EARLIER: Notification[] = [
  {
    id:       "notif-5",
    kind:     "rank",
    text:     "プレミアム達成まであと1条件です",
    meta:     "担い手活動 1回で達成",
    time:     "昨日",
    isUnread: false,
  },
  {
    id:            "notif-6",
    kind:          "task",
    fromUserId:    "u3",
    fromUserName:  "佐藤 一郎",
    fromUserTone:  2,
    text:          "からタスクの応募がありました",
    meta:          "チラシ配布スタッフ",
    time:          "昨日",
    isUnread:      false,
  },
  {
    id:       "notif-7",
    kind:     "system",
    text:     "お知らせ: 夏祭り 出店者募集",
    meta:     "締切 6/30",
    time:     "5/19",
    isUnread: false,
  },
  {
    id:            "notif-8",
    kind:          "token",
    fromUserId:    "u6",
    fromUserName:  "中島 健",
    fromUserTone:  0,
    text:          "からトークンを受け取りました",
    meta:          "+30 DAO",
    time:          "5/18",
    isUnread:      false,
  },
];

export const ALL_NOTIFICATIONS: Notification[] = [
  ...NOTIFICATIONS_TODAY,
  ...NOTIFICATIONS_EARLIER,
];

export function getUnreadCount(): number {
  return ALL_NOTIFICATIONS.filter((n) => n.isUnread).length;
}
