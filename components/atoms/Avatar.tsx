import { NEBULA } from "@/lib/tokens";

const TONES = [
  NEBULA[300], NEBULA[400], "#a8b0c2", "#b0a8c2", "#9ba8b5",
] as const;

interface AvatarProps {
  /** 頭文字 (1〜2文字) */
  label?: string;
  size?: number;
  /** 0〜4のトーンインデックス */
  tone?: number;
  className?: string;
}

export function Avatar({ label = "?", size = 32, tone = 0, className }: AvatarProps) {
  const bg = TONES[tone % TONES.length];
  const fontSize = Math.round(size * 0.38);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        fontWeight: 600,
        color: "#1a1a1a",
        letterSpacing: "0.5px",
        userSelect: "none",
      }}
    >
      {label}
    </div>
  );
}
