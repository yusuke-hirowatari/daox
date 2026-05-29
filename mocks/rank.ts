import type { RankDef, PremiumRequirements } from "./types";

export const RANKS: Record<"basic" | "premium", RankDef> = {
  basic: {
    id:    "basic",
    name:  "ベーシック",
    sub:   "全メンバー",
    glyph: "◇",
    color: "#9c958a",
  },
  premium: {
    id:    "premium",
    name:  "プレミアム",
    sub:   "地域の担い手",
    glyph: "★",
    color: "#c96442",
  },
};

/** プレミアム達成条件 */
export const PREMIUM_REQS: PremiumRequirements = {
  visits: 3,  // 年間チェックイン回数
  duties: 1,  // 担い手活動回数
};

/** 担い手活動として認定されるタスク種別 */
export const DUTY_TYPES: string[] = [
  "商店街クリーン作戦",
  "イベント運営スタッフ",
  "夏祭り 出店サポート",
  "見守り隊参加",
  "新メンバー案内役",
  "掲示板モデレーター",
];

/** XP からランク判定 (ベーシック基準: XP制ではなくチェックイン+担い手) */
export function calcRankLabel(xp: number): string {
  return xp >= 1000 ? "ベーシック +" : "ベーシック";
}
