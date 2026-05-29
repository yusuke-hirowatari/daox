import { STATUS_STYLES, type StatusVariant } from "@/lib/tokens";

interface StatusPillProps {
  status: StatusVariant;
  /** カスタムラベル（省略時はトークン定義のデフォルトラベル） */
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className = "" }: StatusPillProps) {
  const { bg, fg, label: defaultLabel } = STATUS_STYLES[status] ?? STATUS_STYLES.default;
  const text = label ?? defaultLabel;

  return (
    <span
      className={[
        "inline-flex items-center",
        "rounded-[999px] px-2.5 py-1",
        "text-[11px] font-semibold",
        "whitespace-nowrap", // ← 改行禁止
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ background: bg, color: fg }}
    >
      {text}
    </span>
  );
}
