import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 先頭アイコン */
  icon?: React.ReactNode;
  /** 後端要素 (クリアボタン等) */
  suffix?: React.ReactNode;
  className?: string;
}

export function Input({ icon, suffix, className = "", ...props }: InputProps) {
  return (
    <div
      className={[
        "flex items-center gap-2",
        "rounded-[16px] border border-[#dedee5] bg-white",
        "px-3 h-10",
        "text-[12px] text-[#9a9aa0]",
        "focus-within:border-[#9a9aa0] transition-colors",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && <span className="shrink-0 text-[#9a9aa0]">{icon}</span>}
      <input
        {...props}
        className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-[#9a9aa0] text-[#1a1a1a]"
      />
      {suffix && <span className="shrink-0">{suffix}</span>}
    </div>
  );
}
