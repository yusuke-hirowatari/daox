"use client";

import { useState, useRef } from "react";
import { TopBar, PcHeader } from "@/components/atoms/TopBar";
import { Avatar } from "@/components/atoms/Avatar";
import { RankBadge } from "@/components/atoms/RankBadge";
import { EmptyState } from "@/components/atoms/EmptyState";
import {
  DM_THREADS,
  DM_SUGGESTIONS,
  getMessagesByThreadId,
} from "@/mocks/dm";
import { USERS, getUserById, CURRENT_USER_ID } from "@/mocks/users";
import type { DmThread, DmMessage } from "@/mocks/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type SpView = "list" | "thread" | "new" | "members";

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
          <Avatar size={32} label={name[0]} tone={tone} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold">{name}</span>
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
        </div>
        <button className="text-[16px] text-[#9a9aa0]">⋯</button>
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
    return USERS.filter((u) => u.id !== CURRENT_USER_ID).map((u) => {
      const role = getMemberRole(u.id);
      return (
        <div
          key={u.id}
          className="flex items-center gap-3 px-4 py-2.5 border-b border-[#dedee5]"
        >
          <div className="relative flex-none">
            <Avatar size={36} label={u.initial} tone={u.tone} />
            {u.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#5da177] border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12.5px] font-semibold">{u.name}</span>
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
          </div>
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

  // ─── Group member strip ─────────────────────────────────────────────────────

  const groupMembers = [
    { who: "田中", tone: 0 },
    { who: "伊藤", tone: 1 },
    { who: "佐藤", tone: 2 },
    { who: "木村", tone: 3 },
    { who: "高橋", tone: 4 },
  ];

  // ─── PC Section ───────────────────────────────────────────────────────────

  const pcSection = (
    <div className="hidden md:flex flex-col h-full bg-white">
      <PcHeader
        title="DM"
        right={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-[#dedee5] rounded-lg bg-[#f1f1f5]">
              <span className="text-[12px] text-[#9a9aa0]">⌕</span>
              <input
                className="text-[12px] outline-none bg-transparent w-40 placeholder:text-[#9a9aa0]"
                placeholder="メンバー・スレッドを検索"
              />
            </div>
            <button
              onClick={() => setPcTab(1)}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-white whitespace-nowrap"
            >
              + 新規DM
            </button>
          </div>
        }
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: threads / members */}
        <div className="w-[280px] flex-none border-r border-[#dedee5] flex flex-col overflow-hidden">
          {/* Tab switcher */}
          <div className="flex gap-1 px-3 py-2.5 border-b border-[#dedee5]">
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
          </div>

          {/* Thread list or member list */}
          <div className="flex-1 overflow-y-auto">
            {pcTab === 0 ? (
              threads.map((th) => (
                <ThreadRow
                  key={th.id}
                  thread={th}
                  active={pcThreadId === th.id}
                  onClick={() => {
                    setPcThreadId(th.id);
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
                  <span className="text-[#9a9aa0] cursor-pointer">並び替え ▾</span>
                </div>
                {USERS.filter((u) => u.id !== CURRENT_USER_ID).map((u) => {
                  const role = getMemberRole(u.id);
                  return (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 px-4 py-2.5 border-b border-[#dedee5]"
                    >
                      <div className="relative flex-none">
                        <Avatar size={32} label={u.initial} tone={u.tone} />
                        {u.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#5da177] border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[12px] font-semibold truncate">{u.name}</span>
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
                      </div>
                      <button
                        onClick={() => {
                          const existing = threads.find(
                            (t) =>
                              !t.isGroup &&
                              t.participantIds.includes(u.id) &&
                              t.participantIds.includes(CURRENT_USER_ID)
                          );
                          if (existing) {
                            setPcThreadId(existing.id);
                            setPcTab(0);
                          }
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

        {/* Right: conversation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {pcThread ? (
            <>
              {/* Conversation header */}
              <div className="flex-none flex items-center gap-2.5 px-5 py-3 border-b border-[#dedee5]">
                {pcThread.isGroup ? (
                  <div className="w-8 h-8 rounded-lg bg-[#e8e8f0] flex items-center justify-center text-[12px] font-bold text-[#525261]">
                    G
                  </div>
                ) : (
                  <Avatar
                    size={32}
                    label={getThreadDisplayName(pcThread)[0]}
                    tone={getThreadTone(pcThread)}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold">
                    {getThreadDisplayName(pcThread)}
                  </div>
                  <div className="text-[10px] text-[#9a9aa0] font-mono">
                    {pcThread.isOnline ? "オンライン · 最終ログイン 5分前" : "オフライン"}
                  </div>
                </div>
                <button className="text-[12px] font-semibold text-[#525261] px-3 py-1.5 rounded-lg hover:bg-[#f1f1f5] transition-colors">
                  プロフィール
                </button>
                <button className="text-[12px] font-semibold text-[#525261] px-2 py-1.5 rounded-lg hover:bg-[#f1f1f5] transition-colors">
                  ⋯
                </button>
              </div>

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
        <div className="md:hidden flex flex-col h-full">
          <TopBar
            title="メッセージ"
            right={
              <button
                onClick={() => setSpView("new")}
                className="text-[18px] text-[#525261]"
              >
                ✎
              </button>
            }
          />
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
                  <span className="text-[12px] text-[#9a9aa0]">検索</span>
                </div>
              </div>
              {/* Thread list */}
              <div className="flex-1 overflow-y-auto">
                {threads.map((th) => (
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
                <span className="text-[10px] text-[#9a9aa0] cursor-pointer">
                  並び替え ▾
                </span>
              </div>
              {/* Filter chips */}
              <div className="flex-none flex gap-1.5 px-4 pb-2 overflow-x-auto">
                {MEMBER_FILTER_TAGS.map((t, i) => (
                  <span
                    key={t}
                    className={`flex-none text-[11px] px-3 py-1 rounded-full border whitespace-nowrap ${
                      i === 0
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-semibold"
                        : "bg-white text-[#525261] border-[#dedee5] font-medium"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {/* Member list */}
              <div className="flex-1 overflow-y-auto">
                {memberList((userId) => {
                  const existing = threads.find(
                    (t) =>
                      !t.isGroup &&
                      t.participantIds.includes(userId) &&
                      t.participantIds.includes(CURRENT_USER_ID)
                  );
                  if (existing) openThread(existing.id);
                })}
              </div>
            </>
          )}
        </div>

        {pcSection}
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
          {isGroup && (
            <div className="flex-none flex items-center gap-2 px-4 py-2 border-b border-[#dedee5] bg-[#f1f1f5] overflow-x-auto">
              {groupMembers.map((m) => (
                <div
                  key={m.who}
                  className="flex-none flex flex-col items-center gap-0.5"
                >
                  <Avatar size={28} label={m.who[0]} tone={m.tone} />
                  <span className="text-[9px] text-[#525261]">{m.who}</span>
                </div>
              ))}
              <div className="flex-none w-7 h-7 rounded-full border border-dashed border-[#bbbbc0] flex items-center justify-center text-[12px] text-[#9a9aa0]">
                +7
              </div>
            </div>
          )}

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
      </div>
    );
  }

  // ─── SP: New DM ────────────────────────────────────────────────────────────

  if (spView === "new") {
    return (
      <div className="flex flex-col h-full">
        <div className="md:hidden flex flex-col h-full bg-white">
          <TopBar
            title="新しいメッセージ"
            left={
              <button
                onClick={() => setSpView("list")}
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
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-[#e8e8f0] rounded-full">
                伊藤 さくら <span className="text-[#9a9aa0] cursor-pointer">✕</span>
              </span>
              <span className="text-[12px] text-[#9a9aa0]">名前またはIDを入力</span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-[#9a9aa0] tracking-widest font-mono">
            最近のやり取り
          </div>
          <div className="flex-1 overflow-y-auto">
            {DM_SUGGESTIONS.map((s) => (
              <div
                key={s.userId}
                onClick={() => {
                  const existing = threads.find(
                    (t) =>
                      !t.isGroup &&
                      t.participantIds.includes(s.userId) &&
                      t.participantIds.includes(CURRENT_USER_ID)
                  );
                  if (existing) openThread(existing.id);
                }}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[#fafafa] transition-colors"
              >
                <Avatar size={36} label={s.name[0]} tone={s.tone} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold">{s.name}</div>
                  <div className="text-[10.5px] text-[#9a9aa0] mt-0.5">{s.sub}</div>
                </div>
                <span className="text-[16px] text-[#9a9aa0]">+</span>
              </div>
            ))}
          </div>
        </div>

        {pcSection}
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex flex-col h-full">
      <div className="md:hidden" />
      {pcSection}
    </div>
  );
}
