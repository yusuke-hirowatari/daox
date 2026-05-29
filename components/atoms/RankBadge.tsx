/** XP またはランク名からバッジ表示する小型コンポーネント */

interface RankBadgeProps {
  /** XP 値 (xp指定時はしきい値で自動判定) */
  xp?: number;
  /** ランク名を直接指定 */
  tier?: "basic" | "premium";
  /** コンパクト表示 (◇/★ のみ) */
  compact?: boolean;
  showName?: boolean;
}


export function RankBadge({ xp, tier, compact = false, showName = true }: RankBadgeProps) {
  const isPremium = tier === "premium" || (xp !== undefined && xp >= 3000);
  const glyph  = isPremium ? "★" : "◇";
  const color  = isPremium ? "#c96442" : "#9c958a";
  const label  = isPremium ? "プレミアム" : "ベーシック";

  if (compact && !showName) {
    return (
      <span className="text-[11px] leading-none" style={{ color }}>
        {glyph}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-semibold leading-none"
      style={{ color }}
    >
      {glyph}
      {(!compact || showName) && <span>{label}</span>}
    </span>
  );
}
