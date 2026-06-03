import type { Transaction } from "./types";
import { CURRENT_USER_ID } from "./users";

export const DAO_BALANCE = 420;

export const TRANSACTIONS: Transaction[] = [
  {
    id:           "tx_8a4f5c2d92e1b7",
    direction:    "in",
    kind:         "transfer",
    counterparty: "伊藤 さくら",
    desc:         "チラシ配布のお礼",
    amount:       120,
    time:         "今日 14:20",
    balanceAfter: 420,
    relatedTaskId: "tmpl-003",
  },
  {
    id:           "tx_transfer_01",
    direction:    "out",
    kind:         "transfer",
    counterparty: "佐藤 一郎",
    desc:         "トマト購入",
    amount:       20,
    time:         "昨日 18:02",
    balanceAfter: 290,
  },
  {
    id:           "tx_vote_01",
    direction:    "in",
    kind:         "vote_reward",
    counterparty: "投票報酬",
    desc:         "ロゴ案投票",
    amount:       5,
    time:         "昨日 09:15",
    balanceAfter: 310,
  },
  {
    id:           "tx_coupon_01",
    direction:    "out",
    kind:         "exchange",
    counterparty: "商店街本部",
    desc:         "クリーン作戦景品",
    amount:       50,
    time:         "5/18",
    balanceAfter: 305,
    relatedExchangeId: "ei3",
  },
  {
    id:           "tx_task_01",
    direction:    "in",
    kind:         "task",
    counterparty: "タスク報酬",
    desc:         "商店街の朝清掃 (5/19分)",
    amount:       100,
    time:         "5/20",
    balanceAfter: 355,
    relatedTaskId: "tkt-001-002",
  },
  {
    id:           "tx_transfer_02",
    direction:    "out",
    kind:         "transfer",
    counterparty: "中島 健",
    desc:         "物品購入",
    amount:       30,
    time:         "5/18",
    balanceAfter: 255,
  },
];

/** 取引詳細サンプル */
export const TX_DETAIL_SAMPLE = {
  id:           "tx_8a4f5c2d92e1b7",
  direction:    "in" as const,
  amount:       120,
  counterparty: { name: "伊藤 さくら", sub: "カフェ ことり", tone: 1 },
  memo:         "チラシ配布のお礼",
  time:         "2026/05/25 14:20",
  balance:      420,
  txId:         "tx_8a4f5c2d92e1b7",
  relatedTask:  "チラシ配布スタッフ",
};

/** userId に基づくウォレット残高 (STEP後半でAPIに差替) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getBalance(_userId: string = CURRENT_USER_ID): number {
  return DAO_BALANCE;
}
