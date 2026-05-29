interface ChipProps {
  children: React.ReactNode;
  /** アクティブ状態: 黒背景+白文字 */
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ children, active = false, onClick, className = "" }: ChipProps) {
  return (
    <span
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={[
        "inline-flex items-center gap-1",
        "rounded-[999px] px-2.5 py-1",
        "text-[11px] font-medium border",
        "whitespace-nowrap",
        active
          ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
          : "bg-transparent text-[#525261] border-[#dedee5]",
        onClick ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
