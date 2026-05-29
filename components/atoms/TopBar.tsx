/**
 * MobileTopBar — SP 画面上部のページヘッダー
 *
 * レイアウトルール (CLAUDE.md):
 * - 右側ボタンクラスタ: flex-none (縮小禁止)
 * - タイトル: flex-1 min-w-0 (スペース不足時はタイトルが省略)
 */

interface TopBarProps {
  title: string;
  sub?: string;
  /** 左端要素 (戻るボタン等) */
  left?: React.ReactNode;
  /** 右端要素 (アクションボタン群) */
  right?: React.ReactNode;
}

export function TopBar({ title, sub, left, right }: TopBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-[#dedee5] px-4 py-2.5">
      {left && <div className="shrink-0">{left}</div>}

      {/* タイトル: flex-1 + min-w-0 でスペース不足時は省略 */}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold leading-snug truncate">{title}</div>
        {sub && <div className="text-[10.5px] text-[#9a9aa0] mt-0.5 truncate">{sub}</div>}
      </div>

      {/* 右ボタンクラスタ: flex-none で縮小禁止 */}
      {right && <div className="flex-none flex items-center gap-1.5">{right}</div>}
    </div>
  );
}

/** PC ヘッダー — タイトル + 右ボタンクラスタ */
export function PcHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-[#dedee5] px-6 h-14">
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold truncate">{title}</div>
        {sub && <div className="text-[11px] text-[#9a9aa0] mt-0.5 truncate">{sub}</div>}
      </div>
      {right && <div className="flex-none flex items-center gap-2">{right}</div>}
    </div>
  );
}

/** 戻るボタン */
export function BackButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#f1f1f5] transition-colors"
      aria-label="戻る"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
