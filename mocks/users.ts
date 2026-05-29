import type { User } from "./types";

/** 現在ログイン中のユーザーID */
export const CURRENT_USER_ID = "u1";

export const USERS: User[] = [
  {
    id:         "u1",
    name:       "田中 太郎",
    initial:    "田",
    tone:       0,
    role:       "member",
    rank:       "basic",
    xp:         1240,
    daoBalance: 420,
    tags:       ["商店街", "イベント", "掃除"],
    bio:        "新富商店街のメンバーです。地域のお役に立てることがあればお気軽に。",
    joinedAt:   "2024-01-15",
    isOnline:   true,
  },
  {
    id:         "u2",
    name:       "伊藤 さくら",
    initial:    "伊",
    tone:       1,
    role:       "member",
    rank:       "premium",
    xp:         4820,
    daoBalance: 680,
    tags:       ["飲食", "カフェ", "イベント運営"],
    bio:        "商店街の中心でカフェを営んでいます。日々のお仕事や物々交換、お気軽にどうぞ。",
    joinedAt:   "2023-02-01",
    isOnline:   true,
  },
  {
    id:         "u3",
    name:       "佐藤 一郎",
    initial:    "佐",
    tone:       2,
    role:       "member",
    rank:       "basic",
    xp:         980,
    daoBalance: 210,
    tags:       ["農家"],
    joinedAt:   "2024-03-10",
    isOnline:   false,
  },
  {
    id:         "u4",
    name:       "木村 弘",
    initial:    "木",
    tone:       3,
    role:       "member",
    rank:       "basic",
    xp:         620,
    daoBalance: 150,
    tags:       ["デザイン"],
    joinedAt:   "2024-05-01",
    isOnline:   false,
  },
  {
    id:         "u5",
    name:       "高橋 美咲",
    initial:    "高",
    tone:       4,
    role:       "member",
    rank:       "basic",
    xp:         3200,
    daoBalance: 320,
    tags:       ["写真", "子育て"],
    joinedAt:   "2023-08-20",
    isOnline:   true,
  },
  {
    id:         "u6",
    name:       "中島 健",
    initial:    "中",
    tone:       0,
    role:       "member",
    rank:       "premium",
    xp:         2800,
    daoBalance: 540,
    tags:       ["物販"],
    joinedAt:   "2023-06-12",
    isOnline:   false,
  },
  {
    id:         "u7",
    name:       "小林 真理",
    initial:    "小",
    tone:       1,
    role:       "member",
    rank:       "basic",
    xp:         510,
    daoBalance: 90,
    tags:       ["子育て"],
    joinedAt:   "2024-04-01",
    isOnline:   false,
  },
  {
    id:         "u_admin",
    name:       "廣渡 (管理者)",
    initial:    "廣",
    tone:       4,
    role:       "superadmin",
    rank:       "premium",
    xp:         9999,
    daoBalance: 5000,
    tags:       ["運営", "DAO"],
    joinedAt:   "2023-01-01",
    isOnline:   true,
  },
];

/** IDでユーザーを検索 */
export function getUserById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}

/** 現在のログインユーザー */
export function getCurrentUser(): User {
  return USERS.find((u) => u.id === CURRENT_USER_ID)!;
}
