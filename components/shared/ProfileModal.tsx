"use client";

import Link from "next/link";
import { Avatar } from "@/components/atoms/Avatar";
import type { User } from "@/mocks/types";

interface ProfileModalProps {
  user: User | null;
  onClose: () => void;
  /** DM ボタンの遷移先。省略時は "/dm" */
  dmHref?: string;
  /** DM ボタンの代わりにカスタムアクション */
  onDm?: (user: User) => void;
}

export function ProfileModal({ user, onClose, dmHref = "/dm", onDm }: ProfileModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:max-w-[420px] bg-white rounded-t-2xl md:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Handle (SP) */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-9 h-1 rounded-full bg-[#dedee5]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 md:py-3 border-b border-[#dedee5] shrink-0">
          <span className="text-[14px] font-bold">プロフィール</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar size={56} label={user.initial} tone={user.tone} />
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[17px] font-bold">{user.name}</div>
                {user.isOnline && (
                  <span className="text-[10px] text-[#2d7a4a] font-semibold">オンライン</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {user.rank === "premium" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f2f2ff] text-[#6666ff]">★ プレミアム</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f1f1f5] text-[#9a9aa0]">◇ ベーシック</span>
                )}
                <span className="text-[10.5px] text-[#9a9aa0]">{user.joinedAt} 参加</span>
              </div>
            </div>
          </div>

          {user.bio && (
            <div className="text-[12.5px] text-[#525261] leading-relaxed mb-4 p-3 bg-[#f1f1f5] rounded-lg">
              {user.bio}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 border border-[#dedee5] rounded-lg text-center">
              <div className="text-[10px] text-[#9a9aa0] mb-1">XP</div>
              <div className="text-[18px] font-bold font-mono">{user.xp.toLocaleString()}</div>
            </div>
            <div className="p-3 border border-[#dedee5] rounded-lg text-center">
              <div className="text-[10px] text-[#9a9aa0] mb-1">DAO</div>
              <div className="text-[18px] font-bold font-mono text-[#6666ff]">{user.daoBalance.toLocaleString()}</div>
            </div>
          </div>

          {user.tags && user.tags.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-semibold text-[#9a9aa0] mb-2">タグ</div>
              <div className="flex flex-wrap gap-1.5">
                {user.tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 bg-[#f1f1f5] rounded-full text-[#525261]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {onDm ? (
              <button
                onClick={() => { onDm(user); onClose(); }}
                className="flex-1 h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-white text-[12.5px] font-semibold hover:bg-[#333] transition-colors"
              >
                DMを送る
              </button>
            ) : (
              <Link
                href={dmHref}
                className="flex-1 h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-white text-[12.5px] font-semibold hover:bg-[#333] transition-colors"
                onClick={onClose}
              >
                DMを送る
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
