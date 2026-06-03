import type { ExchangeItem, ExchangeVoucher } from "./types";

// ─── ExchangeItem (交換先カタログ) ───────────────────────────────────────
export const EXCHANGE_ITEMS: ExchangeItem[] = [
  {
    id:          "ei1",
    title:       "コーヒー1杯無料",
    issuerName:  "カフェ ことり",
    icon:        "☕",
    cost:        50,
    validDays:   30,
    stock:       12,
    description: "1回1枚まで。他クーポンとの併用不可。",
    isHot:       true,
  },
  {
    id:          "ei2",
    title:       "パン10%OFF",
    issuerName:  "ベーカリー麦の穂",
    icon:        "🥐",
    cost:        30,
    validDays:   30,
    stock:       28,
    description: "1,000円以上のお買い物で利用可。",
  },
  {
    id:          "ei3",
    title:       "商店街お買物券",
    issuerName:  "商店街本部",
    icon:        "🎟",
    cost:        100,
    validDays:   60,
    stock:       50,
    description: "加盟店舗 38店で利用可。",
  },
  {
    id:          "ei4",
    title:       "理容カット 500円OFF",
    issuerName:  "理容 たかはし",
    icon:        "✂️",
    cost:        80,
    validDays:   90,
    stock:       5,
    description: "土曜は対象外。",
    isLow:       true,
  },
  {
    id:          "ei5",
    title:       "夏祭り 1ドリンク券",
    issuerName:  "商店街本部",
    icon:        "🍻",
    cost:        60,
    validDays:   14,
    stock:       0,
    description: "6/15 夏祭り会場のみ。",
    isSoldout:   true,
    isLimited:   true,
  },
];

// ─── ExchangeVoucher (保有1枚・固有 redeemCode) ────────────────────────
// 同アイテム複数枚保有可 (×N 集約は UI 側で処理)
export const MY_VOUCHERS: ExchangeVoucher[] = [
  {
    id:          "ev1",
    itemId:      "ei1",
    title:       "コーヒー1杯無料",
    issuerName:  "カフェ ことり",
    icon:        "☕",
    issuedAt:    "2026-05-22",
    expiresAt:   "2026-06-21",
    daysLeft:    24,
    status:      "active",
    redeemCode:  "CT-9X4K-22",
  },
  {
    id:          "ev2",
    itemId:      "ei3",
    title:       "商店街お買物券",
    issuerName:  "商店街本部",
    icon:        "🎟",
    issuedAt:    "2026-05-10",
    expiresAt:   "2026-07-09",
    daysLeft:    42,
    status:      "active",
    redeemCode:  "SK-7Y8M-10",
  },
  // 同アイテム(ei2)を2枚保有 — UI上は「×2」で集約表示
  {
    id:          "ev3",
    itemId:      "ei2",
    title:       "パン10%OFF",
    issuerName:  "ベーカリー麦の穂",
    icon:        "🥐",
    issuedAt:    "2026-05-24",
    expiresAt:   "2026-06-23",
    daysLeft:    26,
    status:      "active",
    redeemCode:  "PN-3Q1P-24",
  },
  {
    id:          "ev4",
    itemId:      "ei2",
    title:       "パン10%OFF",
    issuerName:  "ベーカリー麦の穂",
    icon:        "🥐",
    issuedAt:    "2026-05-20",
    expiresAt:   "2026-06-19",
    daysLeft:    22,
    status:      "active",
    redeemCode:  "PN-8R7W-20",
  },
  // 使用済み・期限切れ
  {
    id:         "ev5",
    itemId:     "ei1",
    title:      "コーヒー1杯無料",
    issuerName: "カフェ ことり",
    icon:       "☕",
    issuedAt:   "2026-04-01",
    status:     "used",
    redeemCode: "CT-4A1B-01",
    usedAt:     "2026-04-12",
  },
  {
    id:         "ev6",
    itemId:     "ei4",
    title:      "理容カット 500円OFF",
    issuerName: "理容 たかはし",
    icon:       "✂️",
    issuedAt:   "2026-02-15",
    expiresAt:  "2026-05-15",
    status:     "expired",
    redeemCode: "HR-2F5D-15",
  },
];

// ─── ヘルパー ─────────────────────────────────────────────────────────────

/** 有効な交換券一覧 */
export function getActiveVouchers(): ExchangeVoucher[] {
  return MY_VOUCHERS.filter((v) => v.status === "active");
}

/** 使用済み・期限切れ一覧 */
export function getInactiveVouchers(): ExchangeVoucher[] {
  return MY_VOUCHERS.filter((v) => v.status !== "active");
}

/** itemId ごとの件数 (×N 表示用) */
export function getVoucherCountByItem(): Map<string, number> {
  return MY_VOUCHERS.reduce((map, ev) => {
    if (ev.status === "active") {
      map.set(ev.itemId, (map.get(ev.itemId) ?? 0) + 1);
    }
    return map;
  }, new Map<string, number>());
}
