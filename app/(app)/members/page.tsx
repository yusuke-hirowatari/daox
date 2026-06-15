"use client";

import { useState } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { ProfileModal } from "@/components/shared/ProfileModal";
import { USERS } from "@/mocks/users";
import type { User } from "@/mocks/types";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = USERS.filter(
    (u) => !search || u.name.includes(search) || (u.tags ?? []).some((t) => t.includes(search))
  );

  const premiumCount = USERS.filter((u) => u.rank === "premium").length;

  return (
    <div className="flex flex-col h-full">
      {/* ── SP ── */}
      <div className="md:hidden flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {/* Community overview */}
          <div className="px-4 py-4 bg-[#f1f1f5] border-b border-[#dedee5]">
            <div className="text-[15px] font-bold mb-1">新富商店街コミュニティ</div>
            <div className="text-[11.5px] text-[#525261] leading-relaxed mb-2">
              地域の商店街メンバーが集まるコミュニティ。タスクの受発注、チェックイン、情報共有を行っています。
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="font-mono font-semibold">{USERS.length}人</span>
              <span className="text-[#9a9aa0]">|</span>
              <span className="text-[#6666ff] font-semibold">★ {premiumCount}人 プレミアム</span>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-2.5 border-b border-[#dedee5] sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#f1f1f5] rounded-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9aa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="名前やタグで検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-[#9a9aa0]"
              />
            </div>
          </div>

          {/* Member list */}
          {filtered.map((user) => (
            <button
              key={user.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-[#dedee5] w-full text-left hover:bg-[#fafafa] transition-colors"
              onClick={() => setSelectedUser(user)}
            >
              <Avatar size={36} label={user.initial} tone={user.tone} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold">{user.name}</span>
                  {user.rank === "premium" && (
                    <span className="text-[9px] font-bold px-1.5 py-[1px] rounded bg-[#f2f2ff] text-[#6666ff]">★ プレミアム</span>
                  )}
                  {user.isOnline && (
                    <span className="w-2 h-2 rounded-full bg-[#2d7a4a] flex-none" />
                  )}
                </div>
                <div className="text-[11px] text-[#9a9aa0] mt-0.5">
                  {user.tags?.slice(0, 3).join(" · ") || "タグなし"}
                </div>
              </div>
              <div className="text-right flex-none">
                <div className="text-[11px] font-bold font-mono text-[#6666ff]">{user.daoBalance} DAO</div>
                <div className="text-[10px] text-[#9a9aa0] font-mono">{user.xp.toLocaleString()} XP</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── PC ── */}
      <div className="hidden md:flex md:flex-col md:flex-1 md:overflow-hidden">

        <div className="flex-1 overflow-y-auto">
          {/* Community overview */}
          <div className="px-6 py-5 bg-[#f1f1f5] border-b border-[#dedee5]">
            <div className="text-[17px] font-bold mb-1.5">新富商店街コミュニティ</div>
            <div className="text-[13px] text-[#525261] leading-relaxed mb-3 max-w-[600px]">
              地域の商店街メンバーが集まるコミュニティ。タスクの受発注、チェックイン、情報共有を行っています。
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              <span className="font-mono font-bold">{USERS.length}人 参加中</span>
              <span className="text-[#6666ff] font-semibold">★ {premiumCount}人 プレミアム</span>
              <span className="text-[#2d7a4a] font-semibold">{USERS.filter(u => u.isOnline).length}人 オンライン</span>
            </div>
          </div>

          {/* Member grid */}
          <div className="p-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((user) => (
              <button
                key={user.id}
                className="flex items-center gap-3 p-3 border border-[#dedee5] rounded-xl bg-white hover:border-[#9a9aa0] transition-colors text-left"
                onClick={() => setSelectedUser(user)}
              >
                <Avatar size={40} label={user.initial} tone={user.tone} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold truncate">{user.name}</span>
                    {user.isOnline && (
                      <span className="w-2 h-2 rounded-full bg-[#2d7a4a] flex-none" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {user.rank === "premium" && (
                      <span className="text-[9px] font-bold px-1.5 py-[1px] rounded bg-[#f2f2ff] text-[#6666ff]">★</span>
                    )}
                    <span className="text-[10.5px] text-[#9a9aa0] truncate">{user.tags?.slice(0, 2).join(" · ")}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10.5px] font-mono">
                    <span className="text-[#6666ff] font-bold">{user.daoBalance} DAO</span>
                    <span className="text-[#9a9aa0]">{user.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
