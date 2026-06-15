"use client";

import { useState, useRef } from "react";
import { TopBar } from "@/components/atoms/TopBar";
import { Avatar } from "@/components/atoms/Avatar";
import { RankBadge } from "@/components/atoms/RankBadge";
import { EmptyState } from "@/components/atoms/EmptyState";
import {
  DM_THREADS,
  getMessagesByThreadId,
} from "@/mocks/dm";
import { ProfileModal } from "@/components/shared/ProfileModal";
import { USERS, getUserById, CURRENT_USER_ID } from "@/mocks/users";
import type { DmThread, DmMessage, User } from "@/mocks/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type SpView = "list" | "thread" | "new" | "members" | "group_settings";

// ─── Member data for メンバータブ ─────────────────────────────────────────────

const MEMBER_ROLES: Record<string, string> = {
  u1: "運営",
  u_admin: "運営",
  u2: "店主",
  u6: "店主",
};

function getMemberRole(userId: string): string {
  return MEMBER_ROLES[userId] ?? "メンバー";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getThreadDisplayName(thread: DmThread): string {
  if (thread.isGroup) return thread.groupName ?? "グループ";
  const otherId = thread.participantIds.find((id) => id !== CURRENT_USER_ID);
  const other = otherId ? getUserById(otherId) : undefined;
  return other?.name ?? "不明";
}

function getThreadTone(thread: DmThread): number {
  if (thread.isGroup) return 0;
  const otherId = thread.participantIds.find((id) => id !== CURRENT_USER_ID);
  const other = otherId ? getUserById(otherId) : undefined;
  return other?.tone ?? 0;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ThreadRow({
  thread,
  active,
  onClick,
}: {
  thread: DmThread;
  active?: boolean;
  onClick: () => void;
}) {
  const name = getThreadDisplayName(thread);
  const tone = getThreadTone(thread);
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 border-b border-[#dedee5] cursor-pointer transition-colors ${
        active
          ? "bg-[#eeeeff] border-l-[3px] border-l-[#6666ff]"
          : "hover:bg-[#fafafa] border-l-[3px] border-l-transparent"
      }`}
    >
      {/* Avatar with indicator */}
      <div className="relative flex-none">
        {thread.isGroup ? (
          <div className="w-11 h-11 rounded-xl bg-[#e8e8f0] flex items-center justify-center text-[13px] font-bold text-[#525261]">
            G
          </div>
        ) : (
          <Avatar size={44} label={name[0]} tone={tone} />
        )}
        {thread.isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#5da177] border-2 border-white" />
        )}
        {thread.isGroup && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[8px] font-bold border-2 border-white">
            G
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[13px] ${
              thread.unreadCount ? "font-bold" : "font-semibold"
            } truncate`}
          >
            {name}
          </span>
          {thread.isOfficial && (
            <span className="flex-none text-[8px] font-bold px-[5px] py-[1px] rounded bg-[#1a1a1a] text-white">
              公式
            </span>
          )}
        </div>
        <div
          className={`text-[11.5px] mt-0.5 truncate ${
            thread.unreadCount
              ? "text-[#1a1a1a] font-medium"
              : "text-[#9a9aa0]"
          }`}
        >
          {thread.lastMessage}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 flex-none">
        <span className="text-[10px] text-[#9a9aa0]">{thread.lastMessageTime}</span>
        {thread.unreadCount > 0 ? (
          <span className="text-[9px] font-bold bg-[#6666ff] text-white px-1.5 py-0.5 rounded-full min-w-[16px] text-center font-mono">
            {thread.unreadCount}
          </span>
        ) : (
          <span className="h-[18px]" />
        )}
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: DmMessage }) {
  const isMe = msg.senderId === "me";

  if (msg.kind === "system") {
    return (
      <div className="self-center max-w-[86%]">
        <div className="px-2.5 py-1.5 rounded-lg bg-[#e8e8f0] text-[10.5px] text-[#525261] text-center">
          {msg.text}
        </div>
        <div className="text-[9px] text-[#9a9aa0] mt-1 text-center">{msg.time}</div>
      </div>
    );
  }

  if (msg.kind === "token") {
    return (
      <div
        className={`${isMe ? "self-end" : "self-start"} max-w-[78%]`}
      >
        <div className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-[#1a1a1a] text-white">
          <span className="text-[20px]">◈</span>
          <div>
            <div className="text-[10px] opacity-60 font-mono">TOKEN</div>
            <div className="text-[16px] font-bold font-mono">+{msg.tokenAmount} DAO</div>
          </div>
        </div>
        <div
          className={`text-[9px] text-[#9a9aa0] mt-1 ${isMe ? "text-right" : "text-left"}`}
        >
          {msg.time}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isMe ? "self-end" : "self-start"} max-w-[78%]`}
    >
      <div
        className={`px-3 py-2 rounded-2xl text-[12.5px] leading-relaxed ${
          isMe
            ? "bg-[#1a1a1a] text-white"
            : "bg-white text-[#1a1a1a] border border-[#dedee5]"
        }`}
      >
        {msg.text}
      </div>
      <div
        className={`text-[9px] text-[#9a9aa0] mt-1 ${isMe ? "text-right" : "text-left"}`}
      >
        {msg.time}
      </div>
    </div>
  );
}

function GroupMessageBubble({
  msg,
  showSender,
}: {
  msg: DmMessage;
  showSender: boolean;
}) {
  const isMe = msg.senderId === "me";

  if (msg.kind === "system") {
    return (
      <div className="self-center max-w-[86%]">
        <div className="px-2.5 py-1.5 rounded-lg bg-[#e8e8f0] text-[10.5px] text-[#525261] text-center">
          {msg.text}
        </div>
        <div className="text-[9px] text-[#9a9aa0] mt-1 text-center">{msg.time}</div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-1.5 items-end ${isMe ? "flex-row-reverse" : "flex-row"} max-w-[78%] ${
        isMe ? "self-end" : "self-start"
      }`}
    >
      {!isMe && (
        <Avatar size={26} label={(msg.senderName ?? "?")[0]} tone={msg.senderTone ?? 0} />
      )}
      <div>
        {!isMe && showSender && (
          <div className="text-[10px] font-semibold text-[#525261] mb-0.5 ml-0.5">
            {msg.senderName}
          </div>
        )}
        <div
          className={`px-3 py-2 rounded-2xl text-[12.5px] leading-relaxed ${
            isMe
              ? "bg-[#1a1a1a] text-white"
              : "bg-white text-[#1a1a1a] border border-[#dedee5]"
          }`}
        >
          {msg.text}
        </div>
        <div
          className={`text-[9px] text-[#9a9aa0] mt-1 ${isMe ? "text-right" : "text-left"}`}
        >
          {msg.time}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DmPage() {
  const [spView, setSpView] = useState<SpView>("list");
  const [mainTab, setMainTab] = useState(0); // 0=メッセージ, 1=メンバー
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<DmThread[]>(DM_THREADS);
  const [messagesMap, setMessagesMap] = useState<Record<string, DmMessage[]>>(
    () => ({
      th1: getMessagesByThreadId("th1"),
      th2: getMessagesByThreadId("th2"),
    })
  );
  const [inputText, setInputText] = useState("");
  const [showTokenPanel, setShowTokenPanel] = useState(false);
  const [tokenAmt, setTokenAmt] = useState(50);

  // PC state
  const [pcTab, setPcTab] = useState(0); // 0=スレッド, 1=メンバー
  const [pcThreadId, setPcThreadId] = useState<string>("th1");
  const [pcInput, setPcInput] = useState("");
  const [pcShowToken, setPcShowToken] = useState(false);
  const [pcTokenAmt, setPcTokenAmt] = useState(50);

  // Compose (new DM) state — shared between SP and PC
  const [composeRecipients, setComposeRecipients] = useState<{ id: string; name: string; initial: string; tone: number }[]>([]);
  const [composeQuery, setComposeQuery] = useState("");
  const [composeInput, setComposeInput] = useState("");
  const [pcCompose, setPcCompose] = useState(false);

  // Group settings state
  const [pcGroupSettings, setPcGroupSettings] = useState(false);
  const [groupNameEdit, setGroupNameEdit] = useState("");
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [addMemberQuery, setAddMemberQuery] = useState("");
  const [profileUser, setProfileUser] = useState<User | null>(null);

  // Sort / filter state for member lists
  const [memberSort, setMemberSort] = useState<"name"|"online"|"role">("name");
  const [spSearchQuery, setSpSearchQuery] = useState("");
  const [memberFilter, setMemberFilter] = useState<"all"|"運営"|"店主">("all");

  const cycleMemberSort = () => {
    setMemberSort((prev) => {
      if (prev === "name") return "online";
      if (prev === "online") return "role";
      return "name";
    });
  };

  const memberSortLabel =
    memberSort === "name" ? "名前順 ▾" : memberSort === "online" ? "オンライン順 ▾" : "役職順 ▾";

  const ROLE_ORDER: Record<string, number> = { "運営": 0, "店主": 1, "メンバー": 2 };

  function sortedAndFilteredMembers(users: User[]) {
    let list = users.filter((u) => u.id !== CURRENT_USER_ID);

    // Apply member filter
    if (memberFilter !== "all") {
      list = list.filter((u) => getMemberRole(u.id) === memberFilter);
    }

    // Apply sort
    if (memberSort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "ja"));
    } else if (memberSort === "online") {
      list = [...list].sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));
    } else {
      list = [...list].sort(
        (a, b) => (ROLE_ORDER[getMemberRole(a.id)] ?? 2) - (ROLE_ORDER[getMemberRole(b.id)] ?? 2)
      );
    }
    return list;
  }

  const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null;
  const currentMessages = selectedThreadId
    ? (messagesMap[selectedThreadId] ?? [])
    : [];
  const pcThread = threads.find((t) => t.id === pcThreadId) ?? threads[0];
  const pcMessages = messagesMap[pcThreadId] ?? [];

  // Open thread (mark as read)
  const openThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
    setSpView("thread");
  };

  const msgSeq = useRef(0);

  // Send message
  const sendMessage = (threadId: string, text: string) => {
    if (!text.trim()) return;
    const seq = ++msgSeq.current;
    const newMsg: DmMessage = {
      id: `msg-${seq}`,
      threadId,
      senderId: "me",
      kind: "text",
      text: text.trim(),
      time: "今",
    };
    setMessagesMap((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), newMsg],
    }));
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, lastMessage: text.trim(), lastMessageTime: "今" }
          : t
      )
    );
  };

  // Send token message
  const sendToken = (threadId: string, amt: number) => {
    const seq = ++msgSeq.current;
    const newMsg: DmMessage = {
      id: `msg-token-${seq}`,
      threadId,
      senderId: "me",
      kind: "token",
      tokenAmount: amt,
      time: "今",
    };
    setMessagesMap((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), newMsg],
    }));
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, lastMessage: `◈ ${amt} DAO 送付`, lastMessageTime: "今" }
          : t
      )
    );
  };

  // Create a new 1:1 thread
  const createThread = (userId: string): string => {
    const user = getUserById(userId);
    const newId = `th_${Date.now()}`;
    const newThread: DmThread = {
      id: newId,
      participantIds: [CURRENT_USER_ID, userId],
      isGroup: false,
      lastMessage: "",
      lastMessageTime: "今",
      unreadCount: 0,
      isOnline: user?.isOnline ?? false,
    };
    setThreads((prev) => [newThread, ...prev]);
    setMessagesMap((prev) => ({ ...prev, [newId]: [] }));
    return newId;
  };

  // Create a group thread
  const createGroupThread = (userIds: string[]): string => {
    const newId = `th_${Date.now()}`;
    const names = userIds.map((id) => getUserById(id)?.name.split(" ")[0] ?? "?");
    const newThread: DmThread = {
      id: newId,
      participantIds: [CURRENT_USER_ID, ...userIds],
      isGroup: true,
      groupName: names.join(", "),
      lastMessage: "",
      lastMessageTime: "今",
      unreadCount: 0,
    };
    setThreads((prev) => [newThread, ...prev]);
    setMessagesMap((prev) => ({ ...prev, [newId]: [] }));
    return newId;
  };

  // Open existing thread or create new one for a user
  const openOrCreateThread = (userId: string) => {
    const existing = threads.find(
      (t) =>
        !t.isGroup &&
        t.participantIds.includes(userId) &&
        t.participantIds.includes(CURRENT_USER_ID)
    );
    if (existing) return existing.id;
    return createThread(userId);
  };

  // Start compose flow: create thread from recipients and send first message
  const startComposedThread = (recipients: { id: string }[], firstMessage: string) => {
    if (recipients.length === 0 || !firstMessage.trim()) return;
    let threadId: string;
    if (recipients.length === 1) {
      threadId = openOrCreateThread(recipients[0].id);
    } else {
      threadId = createGroupThread(recipients.map((r) => r.id));
    }
    sendMessage(threadId, firstMessage);
    return threadId;
  };

  // Reset compose state
  const resetCompose = () => {
    setComposeRecipients([]);
    setComposeQuery("");
    setComposeInput("");
  };

  // ─── Group management ───────────────────────────────────────────────────────

  const renameGroup = (threadId: string, newName: string) => {
    if (!newName.trim()) return;
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, groupName: newName.trim() } : t))
    );
    const seq = ++msgSeq.current;
    const sysMsg: DmMessage = {
      id: `msg-sys-${seq}`,
      threadId,
      senderId: "me",
      kind: "system",
      text: `グループ名が「${newName.trim()}」に変更されました`,
      time: "今",
    };
    setMessagesMap((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), sysMsg],
    }));
  };

  const addMemberToGroup = (threadId: string, userId: string) => {
    const user = getUserById(userId);
    if (!user) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, participantIds: [...t.participantIds, userId] }
          : t
      )
    );
    const seq = ++msgSeq.current;
    const sysMsg: DmMessage = {
      id: `msg-sys-${seq}`,
      threadId,
      senderId: "me",
      kind: "system",
      text: `${user.name} がグループに追加されました`,
      time: "今",
    };
    setMessagesMap((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), sysMsg],
    }));
  };

  const removeMemberFromGroup = (threadId: string, userId: string) => {
    const user = getUserById(userId);
    if (!user) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, participantIds: t.participantIds.filter((id) => id !== userId) }
          : t
      )
    );
    const seq = ++msgSeq.current;
    const sysMsg: DmMessage = {
      id: `msg-sys-${seq}`,
      threadId,
      senderId: "me",
      kind: "system",
      text: `${user.name} がグループから退出しました`,
      time: "今",
    };
    setMessagesMap((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), sysMsg],
    }));
  };

  const leaveGroup = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, participantIds: t.participantIds.filter((id) => id !== CURRENT_USER_ID) }
          : t
      )
    );
    // Remove thread from view
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
  };

  // ─── SP Thread Header ───────────────────────────────────────────────────────

  function spThreadHeader(thread: DmThread) {
    const name = getThreadDisplayName(thread);
    const tone = getThreadTone(thread);
    const otherId = thread.participantIds.find((id) => id !== CURRENT_USER_ID);
    const other = otherId ? getUserById(otherId) : undefined;

    return (
      <div className="flex-none flex items-center gap-2.5 px-4 py-2.5 border-b border-[#dedee5] bg-white">
        <button
          onClick={() => setSpView("list")}
          className="text-[18px] text-[#525261]"
        >
          ←
        </button>
        {thread.isGroup ? (
          <div className="w-8 h-8 rounded-lg bg-[#e8e8f0] flex items-center justify-center text-[12px] font-bold text-[#525261]">
            G
          </div>
        ) : (
          <button className="flex-none hover:opacity-70 transition-opacity" onClick={() => other && setProfileUser(other)}>
            <Avatar size={32} label={name[0]} tone={tone} />
          </button>
        )}
        <button className="flex-1 min-w-0 text-left" onClick={() => !thread.isGroup && other && setProfileUser(other)} disabled={thread.isGroup}>
          <div className="flex items-center gap-1.5">
            <span className={`text-[13px] font-bold ${!thread.isGroup ? "hover:underline" : ""}`}>{name}</span>
            {!thread.isGroup && other && (
              <RankBadge xp={other.xp} compact showName={false} />
            )}
          </div>
          <div className="text-[10px] text-[#9a9aa0]">
            {thread.isGroup
              ? `12人 · 5人オンライン`
              : thread.isOnline
              ? "オンライン"
              : "オフライン"}
          </div>
        </button>
        {thread.isGroup && (
          <button
            onClick={() => setSpView("group_settings")}
            className="text-[16px] text-[#9a9aa0]"
          >
            ⋯
          </button>
        )}
      </div>
    );
  }

  // ─── Message Input ──────────────────────────────────────────────────────────

  function spMessageInput(threadId: string) {
    return (
      <>
        {showTokenPanel && (
          <div className="flex-none px-4 py-3 border-t border-[#dedee5] bg-[#f1f1f5]">
            <div className="text-[11px] font-semibold text-[#525261] mb-2">
              ◈ トークン同梱
            </div>
            <div className="flex items-center gap-2">
              {[10, 50, 100, 200, 500].map((v) => (
                <button
                  key={v}
                  onClick={() => setTokenAmt(v)}
                  className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border transition-colors ${
                    tokenAmt === v
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-white text-[#525261] border-[#dedee5]"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                sendToken(threadId, tokenAmt);
                setShowTokenPanel(false);
              }}
              className="mt-2 w-full py-2 bg-[#1a1a1a] text-white rounded-lg text-[12px] font-semibold"
            >
              {tokenAmt} DAO を送る
            </button>
          </div>
        )}
        <div className="flex-none flex items-center gap-2 px-3 py-2 border-t border-[#dedee5] bg-white">
          <button
            onClick={() => setShowTokenPanel((v) => !v)}
            className="text-[18px] text-[#9a9aa0] hover:text-[#525261] transition-colors"
          >
            +
          </button>
          <input
            type="text"
            className="flex-1 px-3 py-2 bg-[#f1f1f5] rounded-full text-[12px] outline-none placeholder:text-[#9a9aa0]"
            placeholder={selectedThread?.isGroup ? "@メンション · メッセージ..." : "メッセージを入力..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(threadId, inputText);
                setInputText("");
              }
            }}
          />
          <button
            onClick={() => setShowTokenPanel((v) => !v)}
            className="text-[16px] text-[#9a9aa0] hover:text-[#6666ff] transition-colors"
          >
            ◈
          </button>
          <button
            onClick={() => {
              sendMessage(threadId, inputText);
              setInputText("");
            }}
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[14px] disabled:opacity-30 transition-opacity"
          >
            ↑
          </button>
        </div>
      </>
    );
  }

  // ─── Member list ────────────────────────────────────────────────────────────

  const MEMBER_FILTER_TAGS = ["すべて", "運営", "店主", "新規", "オンライン"];

  function memberList(onDm: (userId: string) => void) {
    return sortedAndFilteredMembers(USERS).map((u) => {
      const role = getMemberRole(u.id);
      return (
        <div
          key={u.id}
          className="flex items-center gap-3 px-4 py-2.5 border-b border-[#dedee5]"
        >
          <button className="relative flex-none hover:opacity-70 transition-opacity" onClick={() => setProfileUser(u)}>
            <Avatar size={36} label={u.initial} tone={u.tone} />
            {u.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#5da177] border-2 border-white" />
            )}
          </button>
          <button className="flex-1 min-w-0 text-left" onClick={() => setProfileUser(u)}>
            <div className="flex items-center gap-1.5">
              <span className="text-[12.5px] font-semibold hover:underline">{u.name}</span>
              {role !== "メンバー" && (
                <span
                  className={`text-[9px] font-bold px-[5px] py-[1px] rounded ${
                    role === "運営"
                      ? "bg-[#6666ff] text-white"
                      : "bg-[#e8e8f0] text-[#525261]"
                  }`}
                >
                  {role}
                </span>
              )}
            </div>
            <div className="text-[10.5px] text-[#9a9aa0] mt-0.5">
              {u.tags?.join(" · ")}
            </div>
          </button>
          <button
            onClick={() => onDm(u.id)}
            className="flex-none text-[10.5px] font-semibold text-[#525261] px-2.5 py-1.5 rounded-full border border-[#dedee5] hover:border-[#9a9aa0] transition-colors whitespace-nowrap"
          >
            ✎ DM
          </button>
        </div>
      );
    });
  }

  // ─── Group member strip (dynamic) ──────────────────────────────────────────

  function getGroupMembers(thread: DmThread) {
    return thread.participantIds
      .map((id) => getUserById(id))
      .filter((u): u is NonNullable<typeof u> => !!u);
  }

  // ─── PC Section ───────────────────────────────────────────────────────────

  const pcSection = (
    <div className="hidden md:flex flex-col h-full bg-white relative">
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: threads / members */}
        <div className="w-[280px] flex-none border-r border-[#dedee5] flex flex-col overflow-hidden">
          {/* Tab switcher + New DM */}
          <div className="flex items-center gap-1 px-3 py-2.5 border-b border-[#dedee5]">
            {["スレッド", "メンバー"].map((t, i) => (
              <button
                key={t}
                onClick={() => setPcTab(i)}
                className={`flex-1 py-1.5 text-[11.5px] text-center rounded-md transition-colors ${
                  i === pcTab
                    ? "font-semibold bg-[#f1f1f5] text-[#1a1a1a] border border-[#dedee5]"
                    : "font-medium text-[#9a9aa0]"
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => { setPcCompose(true); setPcThreadId(""); }}
              className="flex-none w-7 h-7 flex items-center justify-center rounded-md bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors"
              aria-label="新規DM"
              title="新規DM"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          {/* Thread list or member list */}
          <div className="flex-1 overflow-y-auto">
            {pcTab === 0 ? (
              threads.map((th) => (
                <ThreadRow
                  key={th.id}
                  thread={th}
                  active={!pcCompose && pcThreadId === th.id}
                  onClick={() => {
                    setPcThreadId(th.id);
                    setPcCompose(false);
                    setThreads((prev) =>
                      prev.map((t) =>
                        t.id === th.id ? { ...t, unreadCount: 0 } : t
                      )
                    );
                  }}
                />
              ))
            ) : (
              <div>
                <div className="flex items-center justify-between px-4 py-2.5 text-[11px]">
                  <span className="text-[#9a9aa0] font-mono tracking-wide">
                    {USERS.length} 人 · オンライン 3
                  </span>
                  <button onClick={cycleMemberSort} className="text-[#9a9aa0] cursor-pointer">{memberSortLabel}</button>
                </div>
                {sortedAndFilteredMembers(USERS).map((u) => {
                  const role = getMemberRole(u.id);
                  return (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 px-4 py-2.5 border-b border-[#dedee5]"
                    >
                      <button className="relative flex-none hover:opacity-70 transition-opacity" onClick={() => setProfileUser(u)}>
                        <Avatar size={32} label={u.initial} tone={u.tone} />
                        {u.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#5da177] border-2 border-white" />
                        )}
                      </button>
                      <button className="flex-1 min-w-0 text-left" onClick={() => setProfileUser(u)}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[12px] font-semibold truncate hover:underline">{u.name}</span>
                          {role !== "メンバー" && (
                            <span
                              className={`flex-none text-[9px] font-bold px-[4px] py-[1px] rounded ${
                                role === "運営"
                                  ? "bg-[#6666ff] text-white"
                                  : "bg-[#e8e8f0] text-[#525261]"
                              }`}
                            >
                              {role}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#9a9aa0] truncate">
                          {u.tags?.join(" · ")}
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          const threadId = openOrCreateThread(u.id);
                          setPcThreadId(threadId);
                          setPcCompose(false);
                          setPcTab(0);
                        }}
                        className="flex-none text-[10px] font-semibold text-[#525261] px-2 py-1 rounded border border-[#dedee5] hover:border-[#9a9aa0] whitespace-nowrap"
                      >
                        ✎ DM
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: conversation or compose */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {pcCompose ? (
            /* ── Compose new DM (Slack-style) ── */
            (() => {
              const selectedIds = new Set(composeRecipients.map((r) => r.id));
              const candidates = USERS.filter(
                (u) => u.id !== CURRENT_USER_ID && !selectedIds.has(u.id)
              );
              const filtered = composeQuery.trim()
                ? candidates.filter((u) => u.name.includes(composeQuery.trim()))
                : candidates;

              return (
                <>
                  {/* To: field */}
                  <div className="flex-none px-5 py-3 border-b border-[#dedee5]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[12px] font-semibold text-[#9a9aa0] flex-none">宛先:</span>
                      {composeRecipients.map((r) => (
                        <span
                          key={r.id}
                          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 bg-[#eeeeff] text-[#6666ff] rounded-full"
                        >
                          {r.name}
                          <button
                            onClick={() =>
                              setComposeRecipients((prev) => prev.filter((x) => x.id !== r.id))
                            }
                            className="text-[#9a9aa0] hover:text-[#525261] ml-0.5"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        className="flex-1 text-[12px] outline-none bg-transparent placeholder:text-[#9a9aa0] min-w-[100px] py-1"
                        placeholder={composeRecipients.length === 0 ? "名前を入力して検索..." : "追加..."}
                        value={composeQuery}
                        onChange={(e) => setComposeQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* User suggestions or empty conversation area */}
                  {composeQuery.trim() || composeRecipients.length === 0 ? (
                    <div className="flex-1 overflow-y-auto">
                      {composeRecipients.length === 0 && !composeQuery.trim() && (
                        <div className="px-5 pt-4 pb-2 text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono">
                          メンバー
                        </div>
                      )}
                      {composeQuery.trim() && filtered.length === 0 && (
                        <div className="px-5 py-8 text-center text-[12px] text-[#9a9aa0]">
                          該当するメンバーが見つかりません
                        </div>
                      )}
                      {(composeQuery.trim() ? filtered : candidates).map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setComposeRecipients((prev) => [
                              ...prev,
                              { id: u.id, name: u.name, initial: u.initial, tone: u.tone },
                            ]);
                            setComposeQuery("");
                          }}
                          className="flex items-center gap-3 px-5 py-2.5 cursor-pointer hover:bg-[#fafafa] transition-colors"
                        >
                          <div className="relative flex-none">
                            <Avatar size={32} label={u.initial} tone={u.tone} />
                            {u.isOnline && (
                              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#5da177] border-2 border-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-semibold">{u.name}</div>
                            <div className="text-[10px] text-[#9a9aa0]">{u.tags?.join(" · ")}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-[#fafafa]">
                      <div className="text-center">
                        <div className="text-[13px] font-semibold text-[#525261]">
                          {composeRecipients.length === 1
                            ? `${composeRecipients[0].name} にメッセージを送信`
                            : `${composeRecipients.length}人のグループDM`}
                        </div>
                        <div className="text-[11px] text-[#9a9aa0] mt-1">
                          下のフィールドからメッセージを送信してください
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Compose input */}
                  {composeRecipients.length > 0 && (
                    <div className="flex-none flex items-center gap-2 px-4 py-3.5 border-t border-[#dedee5] bg-white">
                      <input
                        type="text"
                        className="flex-1 px-3.5 py-2 border border-[#dedee5] rounded-full text-[12px] outline-none bg-[#f1f1f5] focus:border-[#9a9aa0] placeholder:text-[#9a9aa0]"
                        placeholder="メッセージを入力…"
                        value={composeInput}
                        onChange={(e) => setComposeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            if (!composeInput.trim()) return;
                            const threadId = startComposedThread(composeRecipients, composeInput);
                            if (threadId) {
                              setPcThreadId(threadId);
                              setPcCompose(false);
                              resetCompose();
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (!composeInput.trim()) return;
                          const threadId = startComposedThread(composeRecipients, composeInput);
                          if (threadId) {
                            setPcThreadId(threadId);
                            setPcCompose(false);
                            resetCompose();
                          }
                        }}
                        disabled={!composeInput.trim()}
                        className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-white disabled:opacity-30 whitespace-nowrap"
                      >
                        送信
                      </button>
                    </div>
                  )}
                </>
              );
            })()
          ) : pcThread ? (
            <>
              {/* Conversation header */}
              <div className="flex-none flex items-center gap-2.5 px-5 py-3 border-b border-[#dedee5]">
                {(() => {
                  const otherId = !pcThread.isGroup ? pcThread.participantIds.find((id) => id !== CURRENT_USER_ID) : undefined;
                  const otherUser = otherId ? getUserById(otherId) : undefined;
                  const handleClickUser = otherUser ? () => setProfileUser(otherUser) : undefined;
                  return (
                    <>
                      {pcThread.isGroup ? (
                        <div className="w-8 h-8 rounded-lg bg-[#e8e8f0] flex items-center justify-center text-[12px] font-bold text-[#525261]">
                          G
                        </div>
                      ) : (
                        <button onClick={handleClickUser} className="flex-none rounded-full hover:opacity-70 transition-opacity">
                          <Avatar
                            size={32}
                            label={getThreadDisplayName(pcThread)[0]}
                            tone={getThreadTone(pcThread)}
                          />
                        </button>
                      )}
                      <button onClick={handleClickUser} className="flex-1 min-w-0 text-left" disabled={!handleClickUser}>
                        <div className="text-[13px] font-bold hover:underline">
                          {getThreadDisplayName(pcThread)}
                        </div>
                        <div className="text-[10px] text-[#9a9aa0] font-mono">
                          {pcThread.isOnline ? "オンライン · 最終ログイン 5分前" : "オフライン"}
                        </div>
                      </button>
                    </>
                  );
                })()}
                {!pcThread.isGroup && (
                  <button
                    onClick={() => {
                      const otherId = pcThread.participantIds.find((id) => id !== CURRENT_USER_ID);
                      const other = otherId ? getUserById(otherId) : undefined;
                      if (other) setProfileUser(other);
                    }}
                    className="text-[12px] font-semibold text-[#525261] px-3 py-1.5 rounded-lg hover:bg-[#f1f1f5] transition-colors"
                  >
                    プロフィール
                  </button>
                )}
                {pcThread.isGroup && (
                  <button
                    onClick={() => {
                      setGroupNameEdit(pcThread.groupName ?? "");
                      setIsEditingGroupName(false);
                      setAddMemberQuery("");
                      setPcGroupSettings((v) => !v);
                    }}
                    className={`text-[12px] font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                      pcGroupSettings
                        ? "bg-[#1a1a1a] text-white"
                        : "text-[#525261] hover:bg-[#f1f1f5]"
                    }`}
                  >
                    ⋯
                  </button>
                )}
              </div>

              {/* Messages + optional settings side panel */}
              <div className="flex flex-1 overflow-hidden">
                {/* Chat column */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-5 py-3.5 flex flex-col gap-2.5 bg-[#fafafa]">
                    {pcMessages.map((m) =>
                      pcThread.isGroup ? (
                        <GroupMessageBubble key={m.id} msg={m} showSender={m.senderId !== "me"} />
                      ) : (
                        <MessageBubble key={m.id} msg={m} />
                      )
                    )}
                  </div>

                  {/* Token panel (PC) */}
                  {pcShowToken && (
                    <div className="flex-none px-4 py-3 border-t border-[#dedee5] bg-[#f1f1f5]">
                      <div className="text-[11px] font-semibold text-[#525261] mb-2">
                        ◈ トークン同梱
                      </div>
                      <div className="flex items-center gap-2">
                        {[10, 50, 100, 200, 500].map((v) => (
                          <button
                            key={v}
                            onClick={() => setPcTokenAmt(v)}
                            className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border transition-colors ${
                              pcTokenAmt === v
                                ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                                : "bg-white text-[#525261] border-[#dedee5]"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            sendToken(pcThreadId, pcTokenAmt);
                            setPcShowToken(false);
                          }}
                          className="ml-2 px-3 py-1.5 bg-[#1a1a1a] text-white rounded-lg text-[11px] font-semibold whitespace-nowrap"
                        >
                          {pcTokenAmt} DAO 送る
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input bar (PC) */}
                  <div className="flex-none flex items-center gap-2 px-4 py-3.5 border-t border-[#dedee5] bg-white">
                    <button
                      onClick={() => setPcShowToken((v) => !v)}
                      className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                        pcShowToken
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                          : "text-[#525261] border-[#dedee5] hover:border-[#9a9aa0]"
                      }`}
                    >
                      ◈ トークン同梱
                    </button>
                    <input
                      type="text"
                      className="flex-1 px-3.5 py-2 border border-[#dedee5] rounded-full text-[12px] outline-none bg-[#f1f1f5] focus:border-[#9a9aa0] placeholder:text-[#9a9aa0]"
                      placeholder="メッセージを入力…"
                      value={pcInput}
                      onChange={(e) => setPcInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(pcThreadId, pcInput);
                          setPcInput("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        sendMessage(pcThreadId, pcInput);
                        setPcInput("");
                      }}
                      disabled={!pcInput.trim()}
                      className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-white disabled:opacity-30 whitespace-nowrap"
                    >
                      送信
                    </button>
                  </div>
                </div>

                {/* ── PC Group Settings Side Panel ── */}
                {pcGroupSettings && pcThread.isGroup && (() => {
                  const members = getGroupMembers(pcThread);
                  const memberIds = new Set(pcThread.participantIds);
                  const addCandidates = USERS.filter(
                    (u) => !memberIds.has(u.id)
                  );
                  const filteredAdd = addMemberQuery.trim()
                    ? addCandidates.filter((u) => u.name.includes(addMemberQuery.trim()))
                    : [];

                  return (
                    <div className="w-[280px] flex-none border-l border-[#dedee5] flex flex-col overflow-hidden bg-white">
                      {/* Panel header */}
                      <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-[#dedee5]">
                        <span className="text-[13px] font-bold">グループ設定</span>
                        <button
                          onClick={() => setPcGroupSettings(false)}
                          className="text-[14px] text-[#9a9aa0] hover:text-[#525261]"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto">
                        {/* Group avatar + name */}
                        <div className="flex flex-col items-center py-5 border-b border-[#dedee5]">
                          <div className="w-14 h-14 rounded-xl bg-[#e8e8f0] flex items-center justify-center text-[20px] font-bold text-[#525261] mb-3">
                            G
                          </div>
                          {isEditingGroupName ? (
                            <div className="flex items-center gap-1.5 px-4 w-full">
                              <input
                                type="text"
                                className="flex-1 text-[13px] font-bold text-center border border-[#dedee5] rounded-lg px-2 py-1.5 outline-none focus:border-[#6666ff]"
                                value={groupNameEdit}
                                onChange={(e) => setGroupNameEdit(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    renameGroup(pcThreadId, groupNameEdit);
                                    setIsEditingGroupName(false);
                                  }
                                  if (e.key === "Escape") setIsEditingGroupName(false);
                                }}
                              />
                              <button
                                onClick={() => {
                                  renameGroup(pcThreadId, groupNameEdit);
                                  setIsEditingGroupName(false);
                                }}
                                className="text-[11px] font-semibold text-white bg-[#1a1a1a] px-2.5 py-1.5 rounded-lg"
                              >
                                保存
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setGroupNameEdit(pcThread.groupName ?? "");
                                setIsEditingGroupName(true);
                              }}
                              className="text-[13px] font-bold hover:text-[#6666ff] transition-colors flex items-center gap-1"
                            >
                              {pcThread.groupName ?? "グループ"}
                              <span className="text-[10px] text-[#9a9aa0]">✎</span>
                            </button>
                          )}
                          <div className="text-[10px] text-[#9a9aa0] mt-1">
                            メンバー {members.length}人
                          </div>
                        </div>

                        {/* Add member */}
                        <div className="px-4 py-3 border-b border-[#dedee5]">
                          <div className="text-[10px] font-bold text-[#9a9aa0] tracking-wider mb-2">
                            メンバーを追加
                          </div>
                          <input
                            type="text"
                            className="w-full px-3 py-2 text-[12px] border border-[#dedee5] rounded-lg outline-none focus:border-[#6666ff] placeholder:text-[#9a9aa0] bg-[#f1f1f5]"
                            placeholder="名前で検索..."
                            value={addMemberQuery}
                            onChange={(e) => setAddMemberQuery(e.target.value)}
                          />
                          {addMemberQuery.trim() && (
                            <div className="mt-1.5 max-h-[140px] overflow-y-auto">
                              {filteredAdd.length === 0 ? (
                                <div className="text-[11px] text-[#9a9aa0] py-2 text-center">
                                  見つかりません
                                </div>
                              ) : (
                                filteredAdd.map((u) => (
                                  <div
                                    key={u.id}
                                    onClick={() => {
                                      addMemberToGroup(pcThreadId, u.id);
                                      setAddMemberQuery("");
                                    }}
                                    className="flex items-center gap-2 py-1.5 px-1 cursor-pointer hover:bg-[#fafafa] rounded-md transition-colors"
                                  >
                                    <Avatar size={24} label={u.initial} tone={u.tone} />
                                    <span className="text-[11px] font-semibold flex-1">{u.name}</span>
                                    <span className="text-[10px] text-[#6666ff] font-semibold">追加</span>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>

                        {/* Member list */}
                        <div className="px-4 py-3">
                          <div className="text-[10px] font-bold text-[#9a9aa0] tracking-wider mb-2">
                            メンバー ({members.length})
                          </div>
                          <div className="flex flex-col gap-0.5">
                            {members.map((u) => {
                              const isMe = u.id === CURRENT_USER_ID;
                              return (
                                <div
                                  key={u.id}
                                  className="flex items-center gap-2.5 py-2 px-1 rounded-md"
                                >
                                  <div className="relative flex-none">
                                    <Avatar size={28} label={u.initial} tone={u.tone} />
                                    {u.isOnline && (
                                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#5da177] border-[1.5px] border-white" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[11.5px] font-semibold truncate block">
                                      {u.name}
                                      {isMe && <span className="text-[#9a9aa0] font-normal"> (自分)</span>}
                                    </span>
                                  </div>
                                  {!isMe && (
                                    <button
                                      onClick={() => removeMemberFromGroup(pcThreadId, u.id)}
                                      className="flex-none text-[10px] font-semibold text-[#e55] px-2 py-1 rounded border border-[#fcc] hover:bg-[#fff5f5] transition-colors"
                                    >
                                      退出
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Leave group */}
                      <div className="flex-none px-4 py-3 border-t border-[#dedee5]">
                        <button
                          onClick={() => {
                            leaveGroup(pcThreadId);
                            setPcGroupSettings(false);
                            setPcThreadId(threads[0]?.id ?? "");
                          }}
                          className="w-full py-2 text-[12px] font-semibold text-[#e55] border border-[#fcc] rounded-lg hover:bg-[#fff5f5] transition-colors"
                        >
                          グループを退出
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <EmptyState
              variant="chat"
              title="スレッドを選択してください"
              sub="左のリストからスレッドを選んでください"
            />
          )}
        </div>
      </div>

    </div>
  );

  // ─── SP: List ─────────────────────────────────────────────────────────────

  if (spView === "list" || spView === "members") {
    const showMembers = mainTab === 1 || spView === "members";
    return (
      <div className="flex flex-col h-full">
        {/* SP */}
        <div className="md:hidden flex flex-col h-full relative">
          {/* Tabs */}
          <div className="flex-none flex border-b border-[#dedee5]">
            {["メッセージ", "メンバー"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setMainTab(i)}
                className={`flex-1 py-3 text-[13px] border-b-2 -mb-px transition-colors ${
                  i === mainTab
                    ? "font-semibold text-[#1a1a1a] border-[#1a1a1a]"
                    : "font-medium text-[#9a9aa0] border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {!showMembers ? (
            <>
              {/* Search */}
              <div className="flex-none px-4 py-2 border-b border-[#dedee5]">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#f1f1f5] rounded-lg">
                  <span className="text-[#9a9aa0] text-[14px]">⌕</span>
                  <input
                    type="text"
                    value={spSearchQuery}
                    onChange={(e) => setSpSearchQuery(e.target.value)}
                    placeholder="検索"
                    className="flex-1 bg-transparent text-[12px] text-[#1a1a1a] placeholder-[#9a9aa0] outline-none"
                  />
                </div>
              </div>
              {/* Thread list */}
              <div className="flex-1 overflow-y-auto">
                {threads.filter((th) => spSearchQuery === "" || getThreadDisplayName(th).toLowerCase().includes(spSearchQuery.toLowerCase())).map((th) => (
                  <ThreadRow
                    key={th.id}
                    thread={th}
                    onClick={() => openThread(th.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Members header */}
              <div className="flex-none px-4 py-2 flex items-center justify-between">
                <span className="text-[11px] text-[#9a9aa0] font-mono tracking-wide">
                  312人 · オンライン 24
                </span>
                <button onClick={cycleMemberSort} className="text-[10px] text-[#9a9aa0] cursor-pointer">
                  {memberSortLabel}
                </button>
              </div>
              {/* Filter chips */}
              <div className="flex-none flex gap-1.5 px-4 pb-2 overflow-x-auto">
                {(["all", "運営", "店主"] as const).map((t) => {
                  const label = t === "all" ? "すべて" : t;
                  const isActive = memberFilter === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setMemberFilter(t)}
                      className={`flex-none text-[11px] px-3 py-1 rounded-full border whitespace-nowrap ${
                        isActive
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-semibold"
                          : "bg-white text-[#525261] border-[#dedee5] font-medium"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {/* Member list */}
              <div className="flex-1 overflow-y-auto">
                {memberList((userId) => {
                  const threadId = openOrCreateThread(userId);
                  openThread(threadId);
                })}
              </div>
            </>
          )}

          {/* FAB: new message */}
          <button
            onClick={() => setSpView("new")}
            className="absolute bottom-20 right-4 w-14 h-14 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[28px] shadow-lg active:scale-95 transition-transform z-10"
          >
            +
          </button>
        </div>

        {pcSection}
        <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} onDm={(u) => { const tid = openOrCreateThread(u.id); setPcThreadId(tid); setPcCompose(false); }} />
      </div>
    );
  }

  // ─── SP: Thread ────────────────────────────────────────────────────────────

  if (spView === "thread" && selectedThread) {
    const isGroup = selectedThread.isGroup;
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full">
          {spThreadHeader(selectedThread)}

          {/* Group member strip */}
          {isGroup && (() => {
            const members = getGroupMembers(selectedThread);
            return (
              <div className="flex-none flex items-center gap-2 px-4 py-2 border-b border-[#dedee5] bg-[#f1f1f5] overflow-x-auto">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex-none flex flex-col items-center gap-0.5"
                  >
                    <Avatar size={28} label={m.initial} tone={m.tone} />
                    <span className="text-[9px] text-[#525261]">{m.name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 bg-[#f9f9fb]">
            {currentMessages.map((m) =>
              isGroup ? (
                <GroupMessageBubble key={m.id} msg={m} showSender={m.senderId !== "me"} />
              ) : (
                <MessageBubble key={m.id} msg={m} />
              )
            )}
          </div>

          {spMessageInput(selectedThread.id)}
        </div>

        {pcSection}
        <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} onDm={(u) => { const tid = openOrCreateThread(u.id); setPcThreadId(tid); setPcCompose(false); }} />
      </div>
    );
  }

  // ─── SP: Group Settings ───────────────────────────────────────────────────

  if (spView === "group_settings" && selectedThread?.isGroup) {
    const members = getGroupMembers(selectedThread);
    const memberIds = new Set(selectedThread.participantIds);
    const addCandidates = USERS.filter((u) => !memberIds.has(u.id));
    const filteredAdd = addMemberQuery.trim()
      ? addCandidates.filter((u) => u.name.includes(addMemberQuery.trim()))
      : [];

    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full bg-white">
          <TopBar
            title="グループ設定"
            left={
              <button
                onClick={() => {
                  setSpView("thread");
                  setIsEditingGroupName(false);
                  setAddMemberQuery("");
                }}
                className="text-[18px] text-[#525261]"
              >
                ←
              </button>
            }
          />

          <div className="flex-1 overflow-y-auto">
            {/* Group avatar + name */}
            <div className="flex flex-col items-center py-6 border-b border-[#dedee5]">
              <div className="w-16 h-16 rounded-xl bg-[#e8e8f0] flex items-center justify-center text-[24px] font-bold text-[#525261] mb-3">
                G
              </div>
              {isEditingGroupName ? (
                <div className="flex items-center gap-2 px-6 w-full">
                  <input
                    type="text"
                    className="flex-1 text-[14px] font-bold text-center border border-[#dedee5] rounded-lg px-3 py-2 outline-none focus:border-[#6666ff]"
                    value={groupNameEdit}
                    onChange={(e) => setGroupNameEdit(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        renameGroup(selectedThread.id, groupNameEdit);
                        setIsEditingGroupName(false);
                      }
                      if (e.key === "Escape") setIsEditingGroupName(false);
                    }}
                  />
                  <button
                    onClick={() => {
                      renameGroup(selectedThread.id, groupNameEdit);
                      setIsEditingGroupName(false);
                    }}
                    className="text-[12px] font-semibold text-white bg-[#1a1a1a] px-3 py-2 rounded-lg"
                  >
                    保存
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setGroupNameEdit(selectedThread.groupName ?? "");
                    setIsEditingGroupName(true);
                  }}
                  className="text-[15px] font-bold flex items-center gap-1.5"
                >
                  {selectedThread.groupName ?? "グループ"}
                  <span className="text-[11px] text-[#9a9aa0]">✎</span>
                </button>
              )}
              <div className="text-[11px] text-[#9a9aa0] mt-1">
                メンバー {members.length}人
              </div>
            </div>

            {/* Add member */}
            <div className="px-4 py-4 border-b border-[#dedee5]">
              <div className="text-[11px] font-bold text-[#9a9aa0] tracking-wider mb-2">
                メンバーを追加
              </div>
              <input
                type="text"
                className="w-full px-3 py-2.5 text-[13px] border border-[#dedee5] rounded-lg outline-none focus:border-[#6666ff] placeholder:text-[#9a9aa0] bg-[#f1f1f5]"
                placeholder="名前で検索..."
                value={addMemberQuery}
                onChange={(e) => setAddMemberQuery(e.target.value)}
              />
              {addMemberQuery.trim() && (
                <div className="mt-2">
                  {filteredAdd.length === 0 ? (
                    <div className="text-[12px] text-[#9a9aa0] py-3 text-center">
                      見つかりません
                    </div>
                  ) : (
                    filteredAdd.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          addMemberToGroup(selectedThread.id, u.id);
                          setAddMemberQuery("");
                        }}
                        className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-[#fafafa] rounded-lg transition-colors"
                      >
                        <Avatar size={32} label={u.initial} tone={u.tone} />
                        <span className="text-[12.5px] font-semibold flex-1">{u.name}</span>
                        <span className="text-[11px] text-[#6666ff] font-semibold">+ 追加</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Member list */}
            <div className="px-4 py-4">
              <div className="text-[11px] font-bold text-[#9a9aa0] tracking-wider mb-2">
                メンバー ({members.length})
              </div>
              {members.map((u) => {
                const isMe = u.id === CURRENT_USER_ID;
                return (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 py-3 border-b border-[#f1f1f5]"
                  >
                    <div className="relative flex-none">
                      <Avatar size={36} label={u.initial} tone={u.tone} />
                      {u.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#5da177] border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold">
                        {u.name}
                        {isMe && <span className="text-[#9a9aa0] font-normal text-[11px]"> (自分)</span>}
                      </div>
                      <div className="text-[10.5px] text-[#9a9aa0]">{u.tags?.join(" · ")}</div>
                    </div>
                    {!isMe && (
                      <button
                        onClick={() => removeMemberFromGroup(selectedThread.id, u.id)}
                        className="flex-none text-[11px] font-semibold text-[#e55] px-3 py-1.5 rounded-full border border-[#fcc] hover:bg-[#fff5f5] transition-colors"
                      >
                        退出させる
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leave group */}
          <div className="flex-none px-4 py-3 border-t border-[#dedee5] bg-white">
            <button
              onClick={() => {
                leaveGroup(selectedThread.id);
                setSpView("list");
              }}
              className="w-full py-3 text-[13px] font-semibold text-[#e55] border border-[#fcc] rounded-lg hover:bg-[#fff5f5] transition-colors"
            >
              グループを退出
            </button>
          </div>
        </div>

        {pcSection}
        <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} onDm={(u) => { const tid = openOrCreateThread(u.id); setPcThreadId(tid); setPcCompose(false); }} />
      </div>
    );
  }

  // ─── SP: New DM ────────────────────────────────────────────────────────────

  if (spView === "new") {
    const selectedIds = new Set(composeRecipients.map((r) => r.id));
    const candidates = USERS.filter(
      (u) => u.id !== CURRENT_USER_ID && !selectedIds.has(u.id)
    );
    const filtered = composeQuery.trim()
      ? candidates.filter((u) => u.name.includes(composeQuery.trim()))
      : candidates;
    const showUserList = composeQuery.trim() || composeRecipients.length === 0;

    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full bg-white">
          <TopBar
            title="新しいメッセージ"
            left={
              <button
                onClick={() => {
                  setSpView("list");
                  resetCompose();
                }}
                className="text-[18px] text-[#525261]"
              >
                ✕
              </button>
            }
          />
          {/* Recipient area */}
          <div className="flex-none px-4 py-3 border-b border-[#dedee5]">
            <div className="text-[11px] font-semibold text-[#525261] mb-1.5">宛先</div>
            <div className="flex items-center gap-1.5 flex-wrap px-2 py-2 border border-[#dedee5] rounded-lg min-h-9">
              {composeRecipients.map((r) => (
                <span
                  key={r.id}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-[#eeeeff] text-[#6666ff] rounded-full"
                >
                  {r.name}
                  <button
                    onClick={() =>
                      setComposeRecipients((prev) => prev.filter((x) => x.id !== r.id))
                    }
                    className="text-[#9a9aa0] hover:text-[#525261] ml-0.5"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="flex-1 text-[12px] outline-none bg-transparent placeholder:text-[#9a9aa0] min-w-[100px]"
                placeholder={composeRecipients.length === 0 ? "名前を入力して検索..." : "追加..."}
                value={composeQuery}
                onChange={(e) => setComposeQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* User suggestions or prompt area */}
          {showUserList ? (
            <div className="flex-1 overflow-y-auto">
              {composeQuery.trim() && filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-[12px] text-[#9a9aa0]">
                  該当するメンバーが見つかりません
                </div>
              ) : (
                <>
                  <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono">
                    {composeQuery.trim() ? "検索結果" : "メンバー"}
                  </div>
                  {(composeQuery.trim() ? filtered : candidates).map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setComposeRecipients((prev) => [
                          ...prev,
                          { id: u.id, name: u.name, initial: u.initial, tone: u.tone },
                        ]);
                        setComposeQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[#fafafa] transition-colors"
                    >
                      <div className="relative flex-none">
                        <Avatar size={36} label={u.initial} tone={u.tone} />
                        {u.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#5da177] border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] font-semibold">{u.name}</div>
                        <div className="text-[10.5px] text-[#9a9aa0] mt-0.5">{u.tags?.join(" · ")}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#f9f9fb]">
              <div className="text-center">
                <div className="text-[13px] font-semibold text-[#525261]">
                  {composeRecipients.length === 1
                    ? `${composeRecipients[0].name} にメッセージを送信`
                    : `${composeRecipients.length}人のグループDM`}
                </div>
                <div className="text-[11px] text-[#9a9aa0] mt-1">
                  メッセージを入力して送信してください
                </div>
              </div>
            </div>
          )}

          {/* Message input (shown when recipients selected) */}
          {composeRecipients.length > 0 && (
            <div className="flex-none flex items-center gap-2 px-3 py-2 border-t border-[#dedee5] bg-white">
              <input
                type="text"
                className="flex-1 px-3 py-2 bg-[#f1f1f5] rounded-full text-[12px] outline-none placeholder:text-[#9a9aa0]"
                placeholder="メッセージを入力..."
                value={composeInput}
                onChange={(e) => setComposeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    if (!composeInput.trim()) return;
                    const threadId = startComposedThread(composeRecipients, composeInput);
                    if (threadId) {
                      resetCompose();
                      openThread(threadId);
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  if (!composeInput.trim()) return;
                  const threadId = startComposedThread(composeRecipients, composeInput);
                  if (threadId) {
                    resetCompose();
                    openThread(threadId);
                  }
                }}
                disabled={!composeInput.trim()}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[14px] disabled:opacity-30 transition-opacity"
              >
                ↑
              </button>
            </div>
          )}
        </div>

        {pcSection}
        <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} onDm={(u) => { const tid = openOrCreateThread(u.id); setPcThreadId(tid); setPcCompose(false); }} />
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex flex-col h-full">
      <div className="md:hidden" />
      {pcSection}
      <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} onDm={(u) => { const tid = openOrCreateThread(u.id); setPcThreadId(tid); setPcCompose(false); }} />
    </div>
  );
}
