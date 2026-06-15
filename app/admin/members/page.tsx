"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/atoms/Avatar";
import { ProfileModal } from "@/components/shared/ProfileModal";
import type { User } from "@/mocks/types";
import {
  AdminBtn,
  AdminPill,
  AdminTable,
  type ColDef,
  type PillTone,
} from "@/components/admin/atoms";

// ─── Static data ──────────────────────────────────────────────────────────

type MemberStatus = "有効" | "要確認" | "停止中";
type MemberRole   = "運営" | "店主" | "メンバー";

interface Member {
  id:     string;
  name:   string;
  tone:   number;
  role:   MemberRole;
  status: MemberStatus;
  joined: string;
  xp:     number;
  dao:    number;
  last:   string;
}

const INITIAL_MEMBERS: Member[] = [
  { id: "m1", name: "田中 太郎",   tone: 0, role: "運営",     status: "有効",   joined: "2024/01/12", xp: 1240, dao: 420,  last: "今" },
  { id: "m2", name: "伊藤 さくら", tone: 1, role: "店主",     status: "有効",   joined: "2024/02/08", xp: 4820, dao: 1240, last: "5分前" },
  { id: "m3", name: "佐藤 一郎",   tone: 2, role: "メンバー", status: "有効",   joined: "2024/03/22", xp: 980,  dao: 320,  last: "昨日" },
  { id: "m4", name: "木村 弘",     tone: 3, role: "メンバー", status: "要確認", joined: "2024/04/01", xp: 620,  dao: 180,  last: "昨日" },
  { id: "m5", name: "高橋 美咲",   tone: 4, role: "メンバー", status: "有効",   joined: "2024/05/10", xp: 760,  dao: 95,   last: "3時間前" },
  { id: "m6", name: "中島 健",     tone: 0, role: "店主",     status: "有効",   joined: "2024/01/20", xp: 3640, dao: 560,  last: "5/22" },
  { id: "m7", name: "小林 真理",   tone: 1, role: "メンバー", status: "停止中", joined: "2024/04/18", xp: 420,  dao: 78,   last: "5/15" },
];

const FILTER_TABS = [
  "すべて (312)",
  "運営 (4)",
  "店主 (28)",
  "メンバー (280)",
  "要確認 (3)",
  "停止中 (2)",
];

const STATUS_TONE: Record<MemberStatus, PillTone> = {
  "有効":   "success",
  "要確認": "warn",
  "停止中": "muted",
};

const ROLE_TONE: Record<MemberRole, PillTone> = {
  "運営":     "info",
  "店主":     "default",
  "メンバー": "muted",
};

// ─── Member → User 変換 ──────────────────────────────────────────────────

const MEMBER_ROLE_MAP: Record<MemberRole, User["role"]> = {
  "運営":     "superadmin",
  "店主":     "moderator",
  "メンバー": "member",
};

function memberToUser(m: Member): User {
  return {
    id:         m.id,
    name:       m.name,
    initial:    m.name[0],
    tone:       m.tone,
    role:       MEMBER_ROLE_MAP[m.role],
    rank:       m.xp >= 3000 ? "premium" : "basic",
    xp:         m.xp,
    daoBalance: m.dao,
    tags:       [],
    joinedAt:   m.joined,
    isOnline:   m.last === "今" || m.last.includes("分前"),
  };
}

// ─── Table column definition ──────────────────────────────────────────────

const COLS: ColDef[] = [
  { key: "sel",    label: "",           flex: 0,   w: 28 },
  { key: "name",   label: "メンバー",   flex: 1.7, bold: true },
  { key: "role",   label: "ロール",     flex: 0.9 },
  { key: "status", label: "ステータス", flex: 0.9 },
  { key: "joined", label: "参加日",     flex: 1,   mono: true, muted: true },
  { key: "xp",     label: "XP",         flex: 0.7, mono: true, align: "right" },
  { key: "dao",    label: "DAO",        flex: 0.8, mono: true, align: "right" },
  { key: "last",   label: "最終アクティブ", flex: 0.9, muted: true },
  { key: "act",    label: "",           flex: 0.4, align: "right" },
];

function buildRows(
  members: Member[],
  selected: Set<string>,
  toggle: (id: string) => void,
  menuOpen: string | null,
  setMenuOpen: (id: string | null) => void,
  onProfile: (m: Member) => void,
  onDM: () => void,
  onRoleChange: (m: Member) => void,
  onSuspend: (m: Member) => void,
): Record<string, ReactNode>[] {
  return members.map((m) => ({
    sel: (
      <button
        className="w-3.5 h-3.5 rounded-[3px] border-[1.5px] border-[#c8c8d0] flex items-center justify-center flex-none"
        style={{
          background: selected.has(m.id) ? "#1a1a1a" : "transparent",
          borderColor: selected.has(m.id) ? "#1a1a1a" : "#c8c8d0",
        }}
        onClick={() => toggle(m.id)}
        aria-label={`${m.name}を選択`}
      >
        {selected.has(m.id) && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2 3-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    ),
    name: (
      <span className="inline-flex items-center gap-2">
        <Avatar size={22} label={m.name[0]} tone={m.tone} />
        {m.name}
      </span>
    ),
    role:   <AdminPill tone={ROLE_TONE[m.role]}>{m.role}</AdminPill>,
    status: <AdminPill tone={STATUS_TONE[m.status]}>{m.status}</AdminPill>,
    joined: m.joined,
    xp:     m.xp.toLocaleString(),
    dao:    m.dao.toLocaleString(),
    last:   m.last,
    act: (
      <div className="relative">
        <button
          className="text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === m.id ? null : m.id); }}
        >
          ⋯
        </button>
        {menuOpen === m.id && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#dedee5] rounded-lg shadow-lg z-20 py-1">
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { onProfile(m); setMenuOpen(null); }}
            >
              プロフィールを見る
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { onDM(); setMenuOpen(null); }}
            >
              DMを送る
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { onRoleChange(m); setMenuOpen(null); }}
            >
              ロールを変更
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] text-[#6666ff] hover:bg-[#f1f1f5]"
              onClick={() => { onSuspend(m); setMenuOpen(null); }}
            >
              停止する
            </button>
          </div>
        )}
      </div>
    ),
  }));
}

// ─── Pagination ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
const TOTAL_MEMBERS  = 312;
const TOTAL_PAGES    = Math.ceil(TOTAL_MEMBERS / ITEMS_PER_PAGE);

// ─── Page ─────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  "参加日 (新しい順)",
  "参加日 (古い順)",
  "名前 (あ→わ)",
  "XP (多い順)",
] as const;

type SortMode = typeof SORT_OPTIONS[number];

export default function AdminMembersPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [filterIdx, setFilterIdx] = useState(0);
  const [selected,  setSelected]  = useState<Set<string>>(new Set(["m1", "m3"]));
  const [menuOpen,  setMenuOpen]  = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("参加日 (新しい順)");
  const sortRef = useRef<HTMLDivElement>(null);

  // Invite states
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("メンバー");
  const [inviteSent, setInviteSent] = useState(false);

  // Profile modal
  const [profileMember, setProfileMember] = useState<Member | null>(null);

  // Inline confirm states
  const [confirmSuspendId, setConfirmSuspendId] = useState<string | null>(null);
  const [confirmBulkSuspend, setConfirmBulkSuspend] = useState(false);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  // Filter by search query + filter chip + sort
  const filteredMembers = useMemo(() => {
    let list = [...members];

    // Filter by chip category
    switch (filterIdx) {
      case 1: list = list.filter((m) => m.role === "運営"); break;
      case 2: list = list.filter((m) => m.role === "店主"); break;
      case 3: list = list.filter((m) => m.role === "メンバー"); break;
      case 4: list = list.filter((m) => m.status === "要確認"); break;
      case 5: list = list.filter((m) => m.status === "停止中"); break;
      // case 0: "すべて" – no filter
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q)
      );
    }
    // Sort
    switch (sortMode) {
      case "参加日 (新しい順)":
        list.sort((a, b) => b.joined.localeCompare(a.joined));
        break;
      case "参加日 (古い順)":
        list.sort((a, b) => a.joined.localeCompare(b.joined));
        break;
      case "名前 (あ→わ)":
        list.sort((a, b) => a.name.localeCompare(b.name, "ja"));
        break;
      case "XP (多い順)":
        list.sort((a, b) => b.xp - a.xp);
        break;
    }
    return list;
  }, [members, filterIdx, searchQuery, sortMode]);

  // Pagination: slice the member list for the current page
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, TOTAL_MEMBERS);
  // We only have 7 demo members, so show them on page 1 and empty on other pages
  const pagedMembers = currentPage === 1 ? filteredMembers : [];

  // Row action handlers
  const handleProfile = (m: Member) => setProfileMember(m);
  const handleDM = () => router.push("/dm");
  const handleRoleChange = (m: Member) => {
    const newRole: MemberRole = m.role === "メンバー" ? "店主" : m.role === "店主" ? "運営" : "メンバー";
    setMembers(prev => prev.map(x => x.id === m.id ? { ...x, role: newRole } : x));
  };
  const handleSuspend = (m: Member) => {
    setConfirmSuspendId(m.id);
  };
  const executeSuspend = (id: string) => {
    setMembers(prev => prev.map(x => x.id === id ? { ...x, status: "停止中" as MemberStatus } : x));
    setConfirmSuspendId(null);
  };

  const rows = buildRows(pagedMembers, selected, toggleSelect, menuOpen, setMenuOpen, handleProfile, handleDM, handleRoleChange, handleSuspend);

  // Build page numbers to display
  function getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    if (TOTAL_PAGES <= 7) {
      for (let i = 1; i <= TOTAL_PAGES; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(TOTAL_PAGES - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < TOTAL_PAGES - 2) pages.push("...");
      pages.push(TOTAL_PAGES);
    }
    return pages;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex-none flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 px-4 md:px-6 py-2.5 md:py-3.5 border-b border-[#dedee5]">
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] text-[#9a9aa0] font-mono mb-1 hidden md:block">
            HOME &rsaquo; メンバー
          </div>
          <div className="text-[15px] md:text-[17px] font-bold leading-tight">メンバー</div>
          <div className="text-[11px] text-[#9a9aa0] mt-0.5">
            312人 ・ 今週 +8人
          </div>
        </div>
        <AdminBtn variant="outline" icon="↓" onClick={() => {
          const header = "名前,ロール,ステータス,参加日,XP,DAO,最終アクティブ";
          const csvRows = members.map(m => [m.name, m.role, m.status, m.joined, m.xp, m.dao, m.last].join(","));
          const csv = [header, ...csvRows].join("\n");
          const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `members_${new Date().toISOString().slice(0, 10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }}>CSV書き出し</AdminBtn>
        <AdminBtn icon="✉" onClick={() => setInviting(true)}>招待を送る</AdminBtn>
      </div>

      {/* Invite form */}
      {inviting && (
        <div className="flex-none border-b border-[#dedee5] bg-[#f0f0ff] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px] font-bold">メンバーを招待</div>
            <button onClick={() => { setInviting(false); setInviteEmail(""); setInviteSent(false); }} className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[18px]">&times;</button>
          </div>
          {inviteSent ? (
            <div className="text-[12.5px] text-[#2d7a4a] font-semibold py-2">
              &#10003; {inviteEmail} に招待メールを送信しました
            </div>
          ) : (
            <div className="flex items-end gap-3 flex-wrap">
              <div>
                <div className="text-[11px] font-semibold text-[#525261] mb-1">メールアドレス</div>
                <input
                  type="email"
                  className="h-9 w-[280px] px-3 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]"
                  placeholder="example@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#525261] mb-1">ロール</div>
                <select
                  className="h-9 px-3 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff] bg-white"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as MemberRole)}
                >
                  <option value="メンバー">メンバー</option>
                  <option value="店主">店主</option>
                  <option value="運営">運営</option>
                </select>
              </div>
              <AdminBtn
                disabled={!inviteEmail.trim() || !inviteEmail.includes("@")}
                onClick={() => setInviteSent(true)}
              >
                招待を送信
              </AdminBtn>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa] p-3 md:p-5">
        <div className="flex flex-col gap-3">

          {/* Filter bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-[7px] border border-[#dedee5] rounded-md bg-white max-w-[280px] w-full">
              <span className="text-[#9a9aa0] text-[13px] flex-none">&#x2315;</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="名前・ID・メールで検索"
                className="text-[12px] text-[#1a1a1a] placeholder:text-[#9a9aa0] bg-transparent outline-none w-full"
              />
            </div>
            {/* Filter chips */}
            {FILTER_TABS.map((f, i) => (
              <button
                key={f}
                className={[
                  "px-3 py-[5px] rounded-[999px] text-[11.5px] font-medium border transition-colors whitespace-nowrap",
                  filterIdx === i
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-white text-[#525261] border-[#dedee5] hover:border-[#9a9aa0]",
                ].join(" ")}
                onClick={() => setFilterIdx(i)}
              >
                {f}
              </button>
            ))}
            <div className="flex-1" />
            <div className="relative" ref={sortRef}>
              <button
                className="text-[11px] text-[#9a9aa0] whitespace-nowrap cursor-pointer hover:text-[#1a1a1a] transition-colors"
                onClick={() => setSortOpen((prev) => !prev)}
              >
                並び: {sortMode} &#x25BE;
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-[#dedee5] rounded-lg shadow-lg z-20 py-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      className={[
                        "w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5] transition-colors",
                        sortMode === opt ? "font-bold text-[#1a1a1a]" : "text-[#525261]",
                      ].join(" ")}
                      onClick={() => { setSortMode(opt); setSortOpen(false); }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#f1f1f5] border border-[#dedee5] flex-wrap">
              <span className="text-[11.5px] text-[#525261]">
                <strong>{selected.size}件</strong> 選択中
              </span>
              <span className="flex-1" />
              <AdminBtn variant="ghost" onClick={() => {
                setMembers(prev => prev.map(m => selected.has(m.id) ? { ...m, role: m.role === "メンバー" ? "店主" : m.role === "店主" ? "運営" : "メンバー" } : m));
                setSelected(new Set());
              }}>ロール変更</AdminBtn>
              <AdminBtn variant="ghost" onClick={() => router.push("/dm")}>DM一斉送信</AdminBtn>
              {confirmBulkSuspend ? (
                <span className="inline-flex items-center gap-2 text-[11.5px]">
                  <span className="text-[#c44]">選択した {selected.size} 件を停止しますか？</span>
                  <AdminBtn variant="danger" onClick={() => {
                    setMembers(prev => prev.map(m => selected.has(m.id) ? { ...m, status: "停止中" as MemberStatus } : m));
                    setSelected(new Set());
                    setConfirmBulkSuspend(false);
                  }}>確認</AdminBtn>
                  <AdminBtn variant="ghost" onClick={() => setConfirmBulkSuspend(false)}>キャンセル</AdminBtn>
                </span>
              ) : (
                <AdminBtn variant="danger" onClick={() => setConfirmBulkSuspend(true)}>停止</AdminBtn>
              )}
            </div>
          )}

          {/* Single-member suspend confirmation */}
          {confirmSuspendId && (() => {
            const target = members.find(m => m.id === confirmSuspendId);
            return target ? (
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-[#fff5f5] border border-[#e5c0c0] flex-wrap">
                <span className="text-[11.5px] text-[#525261]">
                  「<strong>{target.name}</strong>」のアカウントを停止しますか？この操作は管理者が解除するまで有効です。
                </span>
                <span className="flex-1" />
                <AdminBtn variant="danger" onClick={() => executeSuspend(confirmSuspendId)}>確認</AdminBtn>
                <AdminBtn variant="ghost" onClick={() => setConfirmSuspendId(null)}>キャンセル</AdminBtn>
              </div>
            ) : null;
          })()}

          {/* Table */}
          <AdminTable cols={COLS} rows={rows} rowHeight={44} />

          {/* Pagination */}
          <div className="flex items-center justify-between text-[11px] text-[#9a9aa0] flex-wrap gap-2">
            <span>{startIdx + 1}-{endIdx} / {TOTAL_MEMBERS} 件を表示</span>
            <div className="flex items-center gap-1.5">
              <button
                className="px-1 hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                &lsaquo;
              </button>
              {getPageNumbers().map((p, i) => (
                <span
                  key={i}
                  className={`px-2 py-[2px] rounded ${typeof p === "number" ? "cursor-pointer" : ""}`}
                  style={
                    p === currentPage
                      ? { background: "#1a1a1a", color: "#fff" }
                      : { color: "#525261" }
                  }
                  onClick={() => {
                    if (typeof p === "number") setCurrentPage(p);
                  }}
                >
                  {typeof p === "string" ? "\u2026" : p}
                </span>
              ))}
              <button
                className="px-1 hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                disabled={currentPage === TOTAL_PAGES}
                onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              >
                &rsaquo;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile modal (shared component) + admin actions */}
      {profileMember && (
        <>
          <ProfileModal
            user={memberToUser(profileMember)}
            onClose={() => setProfileMember(null)}
            onDm={() => router.push("/dm")}
          />
          {/* Admin actions overlay – positioned on top of the ProfileModal */}
          <div className="fixed inset-0 z-[61] flex items-end md:items-center justify-center pointer-events-none">
            <div className="relative w-full md:max-w-[420px] pointer-events-auto mb-4 md:mb-0 md:mt-[calc(85vh-40px)] flex flex-col items-center">
              <div className="w-[calc(100%-32px)] bg-white border border-[#dedee5] rounded-xl shadow-lg p-3">
                <div className="text-[11px] font-semibold text-[#9a9aa0] mb-2">管理者アクション</div>
                <div className="flex items-center gap-2 text-[12px]">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#525261] mr-auto">
                    <AdminPill tone={ROLE_TONE[profileMember.role]}>{profileMember.role}</AdminPill>
                    <AdminPill tone={STATUS_TONE[profileMember.status]}>{profileMember.status}</AdminPill>
                  </div>
                  <AdminBtn
                    variant="outline"
                    onClick={() => {
                      handleRoleChange(profileMember);
                      setProfileMember(null);
                    }}
                  >
                    ロール変更
                  </AdminBtn>
                  <AdminBtn
                    variant="danger"
                    onClick={() => {
                      handleSuspend(profileMember);
                      setProfileMember(null);
                    }}
                  >
                    停止
                  </AdminBtn>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
