import type { Notice, BoardPost, Vote } from "./types";
import type { Announcement } from "@/components/atoms/AnnouncementBar";

// ─── お知らせ ─────────────────────────────────────────────────────────────
export const NOTICES: Notice[] = [
  {
    id:           "n1",
    tag:          "重要",
    date:         "5/20",
    title:        "今週の市役所窓口の臨時休業について",
    body:         "5月23日(金)は終日休業となります。ご注意ください。",
    isPinned:     true,
    showInBanner: true,
    authorId:     "u_admin",
  },
  {
    id:           "n2",
    tag:          "お知らせ",
    date:         "5/19",
    title:        "夏祭り 出店者募集のお知らせ",
    body:         "8/15開催。締切6/30まで。詳細は事務局まで。",
    showInBanner: true,
    authorId:     "u_admin",
  },
  {
    id:           "n3",
    tag:          "イベント",
    date:         "5/17",
    title:        "商店街クリーン作戦のご案内",
    body:         "6/1朝7時集合、ポイント付与あり。参加者はグループチャットへ。",
    showInBanner: true,
    authorId:     "u_admin",
  },
  {
    id:       "n4",
    tag:      "お知らせ",
    date:     "5/15",
    title:    "新メンバー歓迎会 5月末開催予定です",
    body:     "場所・時間は決まり次第お知らせします。",
    authorId: "u_admin",
  },
];

// ─── アナウンスバー用データ (showInBanner=true の Notice を変換) ──────────
export const BANNER_NOTICES: Announcement[] = NOTICES
  .filter((n) => n.showInBanner)
  .map((n) => ({ title: n.title, author: "運営事務局 @ 新富町" }));

// ─── 掲示板投稿 ───────────────────────────────────────────────────────────
export const BOARD_POSTS: BoardPost[] = [
  {
    id:         "bp1",
    authorId:   "u1",
    authorName: "田中",
    tone:       0,
    xp:         1240,
    time:       "12分前",
    tokens:     50,
    title:      "看板のリペイント手伝ってくれる人",
    body:       "土曜の朝3時間程度。経験不問、道具はこちらで。",
    isUnread:   true,
  },
  {
    id:         "bp2",
    authorId:   "u2",
    authorName: "伊藤",
    tone:       1,
    xp:         4820,
    time:       "1時間前",
    tokens:     null,
    title:      "新メニュー試食モニター募集",
    body:       "カフェ「ことり」より、5名様限定。",
    isUnread:   false,
  },
  {
    id:         "bp3",
    authorId:   "u3",
    authorName: "佐藤",
    tone:       2,
    xp:         980,
    time:       "3時間前",
    tokens:     20,
    title:      "家庭菜園のトマト譲ります",
    body:       "たくさん採れたので。容器持参希望。",
    isUnread:   false,
  },
  {
    id:         "bp4",
    authorId:   "u4",
    authorName: "木村",
    tone:       3,
    xp:         620,
    time:       "昨日",
    tokens:     120,
    title:      "チラシ配布スタッフ募集",
    body:       "配布エリア応相談、約2時間。",
    isUnread:   false,
  },
];

// ─── 投票 ─────────────────────────────────────────────────────────────────
export const VOTES: Vote[] = [
  {
    id:       "v1",
    title:    "盆踊り会場の候補について",
    deadline: "5/25まで",
    voted:    47,
    total:    120,
    options:  [
      { label: "中央公園",  voteCount: 22 },
      { label: "河川敷",    voteCount: 15 },
      { label: "体育館",    voteCount: 10 },
    ],
    status:   "open",
  },
  {
    id:       "v2",
    title:    "新ロゴデザイン案の選択",
    deadline: "5/30まで",
    voted:    82,
    total:    120,
    options:  [
      { label: "A案", voteCount: 40 },
      { label: "B案", voteCount: 28 },
      { label: "C案", voteCount: 14 },
    ],
    status:   "open",
  },
];
