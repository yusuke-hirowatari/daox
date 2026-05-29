import type { CouponTemplate, CouponInstance } from "./types";

// ─── CouponTemplate (店舗発行・在庫管理) ─────────────────────────────────
export const COUPON_CATALOG: CouponTemplate[] = [
  {
    id:        "ct1",
    title:     "コーヒー1杯無料",
    issuer:    "カフェ ことり",
    icon:      "☕",
    cost:      50,
    validDays: 30,
    stock:     12,
    terms:     "1回1枚まで。他クーポンとの併用不可。",
    isHot:     true,
  },
  {
    id:        "ct2",
    title:     "パン10%OFF",
    issuer:    "ベーカリー麦の穂",
    icon:      "🥐",
    cost:      30,
    validDays: 30,
    stock:     28,
    terms:     "1,000円以上のお買い物で利用可。",
  },
  {
    id:        "ct3",
    title:     "商店街お買物券",
    issuer:    "商店街本部",
    icon:      "🎟",
    cost:      100,
    validDays: 60,
    stock:     50,
    terms:     "加盟店舗 38店で利用可。",
  },
  {
    id:        "ct4",
    title:     "理容カット 500円OFF",
    issuer:    "理容 たかはし",
    icon:      "✂️",
    cost:      80,
    validDays: 90,
    stock:     5,
    terms:     "土曜は対象外。",
    isLow:     true,
  },
  {
    id:        "ct5",
    title:     "夏祭り 1ドリンク券",
    issuer:    "商店街本部",
    icon:      "🍻",
    cost:      60,
    validDays: 14,
    stock:     0,
    terms:     "6/15 夏祭り会場のみ。",
    isSoldout: true,
    isLimited: true,
  },
];

// ─── CouponInstance (保有1枚・固有 redeemCode) ────────────────────────────
// 同テンプレ複数枚保有可 (×N 集約は UI 側で処理)
export const MY_COUPONS: CouponInstance[] = [
  {
    id:          "ci1",
    templateId:  "ct1",
    title:       "コーヒー1杯無料",
    issuer:      "カフェ ことり",
    icon:        "☕",
    issuedAt:    "2026-05-22",
    expiresAt:   "2026-06-21",
    daysLeft:    24,
    status:      "active",
    redeemCode:  "CT-9X4K-22",
  },
  {
    id:          "ci2",
    templateId:  "ct3",
    title:       "商店街お買物券",
    issuer:      "商店街本部",
    icon:        "🎟",
    issuedAt:    "2026-05-10",
    expiresAt:   "2026-07-09",
    daysLeft:    42,
    status:      "active",
    redeemCode:  "SK-7Y8M-10",
  },
  // 同テンプレ(ct2)を2枚保有 — UI上は「×2」で集約表示
  {
    id:          "ci3",
    templateId:  "ct2",
    title:       "パン10%OFF",
    issuer:      "ベーカリー麦の穂",
    icon:        "🥐",
    issuedAt:    "2026-05-24",
    expiresAt:   "2026-06-23",
    daysLeft:    26,
    status:      "active",
    redeemCode:  "PN-3Q1P-24",
  },
  {
    id:          "ci4",
    templateId:  "ct2",
    title:       "パン10%OFF",
    issuer:      "ベーカリー麦の穂",
    icon:        "🥐",
    issuedAt:    "2026-05-20",
    expiresAt:   "2026-06-19",
    daysLeft:    22,
    status:      "active",
    redeemCode:  "PN-8R7W-20",
  },
  // 使用済み・期限切れ
  {
    id:         "ci5",
    templateId: "ct1",
    title:      "コーヒー1杯無料",
    issuer:     "カフェ ことり",
    icon:       "☕",
    issuedAt:   "2026-04-01",
    status:     "used",
    redeemCode: "CT-4A1B-01",
    usedAt:     "2026-04-12",
  },
  {
    id:         "ci6",
    templateId: "ct4",
    title:      "理容カット 500円OFF",
    issuer:     "理容 たかはし",
    icon:       "✂️",
    issuedAt:   "2026-02-15",
    expiresAt:  "2026-05-15",
    status:     "expired",
    redeemCode: "HR-2F5D-15",
  },
];

// ─── ヘルパー ─────────────────────────────────────────────────────────────

/** 有効なクーポン一覧 (×N 集約表示用のグルーピング) */
export function getActiveCoupons(): CouponInstance[] {
  return MY_COUPONS.filter((c) => c.status === "active");
}

/** 使用済み・期限切れ一覧 */
export function getInactiveCoupons(): CouponInstance[] {
  return MY_COUPONS.filter((c) => c.status !== "active");
}

/** templateId ごとの件数 (×N 表示用) */
export function getCouponCountByTemplate(): Map<string, number> {
  return MY_COUPONS.reduce((map, ci) => {
    if (ci.status === "active") {
      map.set(ci.templateId, (map.get(ci.templateId) ?? 0) + 1);
    }
    return map;
  }, new Map<string, number>());
}
