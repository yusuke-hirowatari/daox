"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar, BackButton } from "@/components/atoms/TopBar";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { TRANSACTIONS, DAO_BALANCE } from "@/mocks/wallet";
import { USERS, getCurrentUser } from "@/mocks/users";
import type { Transaction } from "@/mocks/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type WalletView =
  | "main"
  | "send"
  | "send_confirm"
  | "send_success"
  | "tx_detail"
  | "receive";

interface SendState {
  recipientId: string;
  amount: number;
  message: string;
}

// ─── Fake QR SVG ──────────────────────────────────────────────────────────────

function QrFinder({ x, y, cell }: { x: number; y: number; cell: number }) {
  return (
    <g>
      <rect x={x} y={y} width={cell * 7} height={cell * 7} fill="#1a1a1a" />
      <rect x={x + cell} y={y + cell} width={cell * 5} height={cell * 5} fill="white" />
      <rect x={x + cell * 2} y={y + cell * 2} width={cell * 3} height={cell * 3} fill="#1a1a1a" />
    </g>
  );
}

function FakeQR({ size = 160 }: { size?: number }) {
  const N = 21;
  const cell = size / N;
  const dots: React.ReactElement[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const tl = x < 7 && y < 7;
      const tr = x > 13 && y < 7;
      const bl = x < 7 && y > 13;
      if (tl || tr || bl) continue;
      const seed = (x * 7 + y * 13 + x * y) % 5;
      if (seed < 2) {
        dots.push(
          <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill="#1a1a1a" />
        );
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      {dots}
      <QrFinder x={0} y={0} cell={cell} />
      <QrFinder x={cell * 14} y={0} cell={cell} />
      <QrFinder x={0} y={cell * 14} cell={cell} />
    </svg>
  );
}

// ─── Transaction row ──────────────────────────────────────────────────────────

function TxRow({
  tx,
  onClick,
}: {
  tx: Transaction;
  onClick: () => void;
}) {
  const isIn = tx.direction === "in";
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-[#dedee5] cursor-pointer hover:bg-[#fafafa] transition-colors"
      onClick={onClick}
    >
      <div
        className={`w-8 h-8 rounded-full flex-none flex items-center justify-center text-[14px] font-bold ${
          isIn
            ? "bg-[#eeeeff] text-[#6666ff]"
            : "bg-[#f1f1f5] text-[#525261]"
        }`}
      >
        {isIn ? "↓" : "↑"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold truncate">{tx.counterparty}</div>
        <div className="text-[10.5px] text-[#9a9aa0] mt-0.5 truncate">
          {tx.desc} · {tx.time}
        </div>
      </div>
      <div
        className={`text-[13px] font-bold font-mono whitespace-nowrap ${
          isIn ? "text-[#6666ff]" : "text-[#525261]"
        }`}
      >
        {isIn ? "+" : "−"}{tx.amount}
      </div>
    </div>
  );
}

// ─── DetailRow helper ─────────────────────────────────────────────────────────

function DetailRow({
  k,
  v,
  mono,
  muted,
  children,
}: {
  k: string;
  v?: string;
  mono?: boolean;
  muted?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-[11.5px]">
      <span className="text-[#9a9aa0] min-w-[56px]">{k}</span>
      <span
        className={`flex-1 text-right ${
          muted ? "text-[#9a9aa0]" : "text-[#1a1a1a]"
        } ${mono ? "font-semibold font-mono" : "font-medium"}`}
      >
        {children ?? v}
      </span>
    </div>
  );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-[#525261] mb-2">{children}</div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WalletPage() {
  const currentUser = getCurrentUser();
  const router = useRouter();
  const [view, setView] = useState<WalletView>("main");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [txList, setTxList] = useState<Transaction[]>(TRANSACTIONS);
  const [balance, setBalance] = useState(DAO_BALANCE);

  // Send flow state
  const [sendState, setSendState] = useState<SendState>({
    recipientId: "u2",
    amount: 120,
    message: "",
  });

  // Clipboard copy toast
  const [copied, setCopied] = useState(false);

  // Receive: specify amount
  const [specifyAmount, setSpecifyAmount] = useState(false);
  const [requestAmount, setRequestAmount] = useState(100);

  const recipient = USERS.find((u) => u.id === sendState.recipientId);

  // PC history tab
  const [pcTab, setPcTab] = useState(0);

  // ── Send confirm ──────────────────────────────────────────────────────────

  const handleSendConfirm = () => {
    const newBalance = balance - sendState.amount;
    const newTx: Transaction = {
      id: `tx_send_${Date.now()}`,
      direction: "out",
      kind: "transfer",
      counterparty: recipient?.name ?? "不明",
      desc: sendState.message || "送金",
      amount: sendState.amount,
      time: "たった今",
      balanceAfter: newBalance,
    };
    setTxList([newTx, ...txList]);
    setBalance(newBalance);
    setView("send_success");
  };

  // ─── SP VIEWS ─────────────────────────────────────────────────────────────

  // A — Main wallet
  if (view === "main") {
    return (
      <div className="flex flex-col h-full">
        {/* ── SP ──────────────────────────────────────────────────────────── */}
        <div className="md:hidden flex flex-col h-full">
          <TopBar title="ウォレット" />
          <div className="flex-1 overflow-y-auto">
            {/* Balance hero */}
            <div className="px-5 py-6 bg-[#1a1a1a] text-white">
              <div className="text-[11px] opacity-60 font-mono tracking-widest">BALANCE</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[40px] font-bold font-mono leading-none">{balance}</span>
                <span className="text-[14px] opacity-70">DAO</span>
              </div>
              <div className="text-[10px] opacity-50 mt-1.5">今月 +185 DAO</div>
              <div className="flex gap-2 mt-5">
                {[
                  { label: "送る",     action: () => setView("send") },
                  { label: "受け取る", action: () => setView("receive") },
                  { label: "交換",     action: () => router.push("/coupons") },
                ].map((b) => (
                  <button
                    key={b.label}
                    onClick={b.action}
                    className="flex-1 py-2 text-[12px] font-semibold text-white rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon entry */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-[#dedee5] bg-[#f1f1f5] cursor-pointer hover:bg-[#e8e8f0] transition-colors"
              onClick={() => router.push("/coupons?tab=my_list")}
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-[#dedee5] flex items-center justify-center text-[18px]">
                🎟
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold">持っているクーポン</div>
                <div className="text-[10.5px] text-[#9a9aa0] mt-0.5">4枚 (うち1枚 まもなく期限)</div>
              </div>
              <span className="text-[16px] text-[#9a9aa0]">›</span>
            </div>

            {/* History header */}
            <div className="px-4 pt-3.5 pb-1.5 text-[11px] font-semibold text-[#525261]">取引履歴</div>

            {/* History list */}
            {txList.map((tx) => (
              <TxRow
                key={tx.id}
                tx={tx}
                onClick={() => {
                  setSelectedTx(tx);
                  setView("tx_detail");
                }}
              />
            ))}
          </div>
        </div>

        {/* ── PC ──────────────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {/* Balance hero area */}
            <div className="flex gap-4 px-6 py-5">
              {/* Balance card */}
              <div className="flex-1 px-6 py-5 bg-[#1a1a1a] text-white rounded-xl flex flex-col gap-3.5">
                <div className="text-[11px] opacity-60 font-mono tracking-widest">BALANCE</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[48px] font-bold font-mono leading-none">{balance}</span>
                  <span className="text-[16px] opacity-70">DAO</span>
                  <span className="ml-auto text-[11px] opacity-70 px-2 py-1 rounded-full bg-white/10 whitespace-nowrap">
                    今月 +185 DAO
                  </span>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: "送る",          action: () => setView("send") },
                    { label: "受け取る",       action: () => setView("receive") },
                    { label: "クーポンと交換", action: () => router.push("/coupons") },
                  ].map((b) => (
                    <button
                      key={b.label}
                      onClick={b.action}
                      className="flex-1 py-2 text-[12px] font-semibold text-white rounded-full bg-white/15 hover:bg-white/25 transition-colors border border-transparent"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats sub-card */}
              <div className="w-[280px] px-4 py-3.5 border border-[#dedee5] rounded-xl bg-[#f1f1f5] flex flex-col gap-3">
                <div className="text-[11px] font-semibold text-[#525261]">持っているクーポン</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[28px] font-bold font-mono leading-none">4</span>
                  <span className="text-[11px] text-[#525261]">枚</span>
                  <span className="ml-auto text-[10px] font-bold text-[#a06b00] whitespace-nowrap">1枚 期限間近</span>
                </div>
                <div className="flex gap-1.5">
                  {["☕", "🎟", "🥐"].map((c) => (
                    <span
                      key={c}
                      className="w-8 h-8 rounded-md bg-white border border-[#dedee5] inline-flex items-center justify-center text-[16px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div
                  className="text-[11px] font-semibold text-[#6666ff] cursor-pointer hover:underline"
                  onClick={() => router.push("/coupons?tab=my_list")}
                >
                  持っているクーポンを見る →
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-[#dedee5] px-6">
              {["取引履歴", "クーポン履歴", "チェックイン履歴"].map((t, i) => {
                const on = pcTab === i;
                return (
                  <button
                    key={t}
                    onClick={() => setPcTab(i)}
                    className={`px-3.5 py-2.5 text-[12px] font-${on ? "semibold" : "medium"} border-b-2 -mb-px transition-colors ${
                      on
                        ? "text-[#1a1a1a] border-[#1a1a1a]"
                        : "text-[#9a9aa0] border-transparent"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* History table */}
            <div className="px-6 py-2">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="text-[#9a9aa0] text-[10.5px] font-semibold text-left">
                    <th className="px-2 py-2 border-b border-[#dedee5] w-9"></th>
                    <th className="px-2 py-2 border-b border-[#dedee5]">相手 / 内容</th>
                    <th className="px-2 py-2 border-b border-[#dedee5] w-[120px]">時刻</th>
                    <th className="px-2 py-2 border-b border-[#dedee5] w-[100px] text-right">金額</th>
                    <th className="px-2 py-2 border-b border-[#dedee5] w-[100px] text-right">残高</th>
                  </tr>
                </thead>
                <tbody>
                  {txList.map((h) => {
                    const isIn = h.direction === "in";
                    return (
                      <tr
                        key={h.id}
                        className="cursor-pointer hover:bg-[#fafafa] transition-colors"
                        onClick={() => {
                          setSelectedTx(h);
                          setView("tx_detail");
                        }}
                      >
                        <td className="px-2 py-3 border-b border-[#dedee5]">
                          <span
                            className={`inline-flex w-6 h-6 rounded-full items-center justify-center font-bold text-[12px] ${
                              isIn
                                ? "bg-[#eeeeff] text-[#6666ff]"
                                : "bg-[#f1f1f5] text-[#525261]"
                            }`}
                          >
                            {isIn ? "↓" : "↑"}
                          </span>
                        </td>
                        <td className="px-2 py-3 border-b border-[#dedee5]">
                          <div className="font-semibold">{h.counterparty}</div>
                          <div className="text-[10.5px] text-[#9a9aa0] mt-0.5">{h.desc}</div>
                        </td>
                        <td className="px-2 py-3 border-b border-[#dedee5] text-[10.5px] text-[#9a9aa0]">
                          {h.time}
                        </td>
                        <td
                          className={`px-2 py-3 border-b border-[#dedee5] font-bold font-mono text-right ${
                            isIn ? "text-[#6666ff]" : "text-[#525261]"
                          }`}
                        >
                          {isIn ? "+" : "−"}{h.amount}
                        </td>
                        <td className="px-2 py-3 border-b border-[#dedee5] font-mono text-[#9a9aa0] text-right">
                          {h.balanceAfter}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // B — Send flow
  if (view === "send") {
    const afterBalance = balance - sendState.amount;
    return (
      <div className="flex flex-col h-full bg-white">
        <TopBar
          title="トークンを送る"
          left={<BackButton onClick={() => setView("main")} />}
        />
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col">
          {/* Recipient */}
          <FieldLabel>送り先</FieldLabel>
          <div className="flex items-center gap-3 px-3 py-3 border border-[#dedee5] rounded-xl mb-5">
            {recipient && (
              <Avatar size={40} label={recipient.initial} tone={recipient.tone} />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold">{recipient?.name ?? "不明"}</div>
              <div className="text-[10.5px] text-[#9a9aa0] font-mono">@{recipient?.id ?? ""}</div>
            </div>
            <button
              className="text-[11px] font-semibold text-[#6666ff]"
              onClick={() => {
                const next = USERS.find((u) => u.id !== sendState.recipientId && u.id !== "u1");
                if (next) setSendState({ ...sendState, recipientId: next.id });
              }}
            >
              変更
            </button>
          </div>

          {/* Amount */}
          <FieldLabel>金額</FieldLabel>
          <div className="flex items-baseline justify-center gap-2 px-4 py-6 border-[1.5px] border-[#1a1a1a] rounded-xl bg-[#f1f1f5] mb-2">
            <input
              type="number"
              className="text-[48px] font-bold font-mono leading-none outline-none bg-transparent w-32 text-center"
              value={sendState.amount}
              onChange={(e) =>
                setSendState({ ...sendState, amount: Number(e.target.value) })
              }
              min={0}
              max={balance}
            />
            <span className="text-[16px] font-semibold text-[#525261]">DAO</span>
          </div>
          <div className="text-[10.5px] text-[#9a9aa0] text-center mb-5">
            残高 {balance} DAO · 送付後 {afterBalance >= 0 ? afterBalance : 0} DAO
          </div>

          {/* Message */}
          <FieldLabel>メッセージ (任意)</FieldLabel>
          <textarea
            className="w-full px-3 py-2.5 border border-[#dedee5] rounded-xl text-[12px] min-h-[60px] resize-none outline-none focus:border-[#1a1a1a] text-[#525261] leading-relaxed"
            placeholder="チラシ配布ありがとうございました!"
            value={sendState.message}
            onChange={(e) => setSendState({ ...sendState, message: e.target.value })}
            rows={3}
          />

          <div className="flex-1" />

          <div className="mt-4">
            <Button
              full
              disabled={sendState.amount <= 0 || sendState.amount > balance}
              onClick={() => setView("send_confirm")}
            >
              確認画面へ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // B — Send confirm
  if (view === "send_confirm") {
    const afterBalance = balance - sendState.amount;
    return (
      <div className="flex flex-col h-full bg-white">
        <TopBar
          title="送金の確認"
          left={<BackButton onClick={() => setView("send")} />}
        />
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col">
          <div className="px-4 py-4 border border-[#dedee5] rounded-xl mb-5 flex flex-col gap-3">
            <div className="text-[12px] font-semibold text-[#525261] text-center mb-1">
              以下の内容で送金します
            </div>
            <DetailRow k="送り先">
              <span className="inline-flex items-center gap-1.5">
                {recipient && (
                  <Avatar size={18} label={recipient.initial} tone={recipient.tone} />
                )}
                {recipient?.name ?? "不明"}
              </span>
            </DetailRow>
            <DetailRow k="金額" v={`${sendState.amount} DAO`} mono />
            {sendState.message && (
              <DetailRow k="メモ" v={sendState.message} />
            )}
            <DetailRow k="送付後残高" v={`${afterBalance} DAO`} mono />
          </div>
          <p className="text-[10.5px] text-[#9a9aa0] text-center mb-6 leading-relaxed">
            ※ 送金は取消できません。内容をご確認ください。
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setView("send")}>修正</Button>
            <Button full onClick={handleSendConfirm}>送金する</Button>
          </div>
        </div>
      </div>
    );
  }

  // C/D — Send success
  if (view === "send_success") {
    const tx = txList[0];
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-none flex items-center border-b border-[#dedee5] px-4 h-12">
          <button
            onClick={() => setView("main")}
            className="text-[16px] text-[#525261]"
          >
            ✕
          </button>
          <div className="flex-1 text-center text-[13px] font-semibold">送金完了</div>
          <div className="w-6" />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-9 pb-5">
          {/* Check icon */}
          <div className="w-[72px] h-[72px] rounded-full bg-[#eeeeff] text-[#6666ff] flex items-center justify-center text-[36px] font-bold">
            ✓
          </div>
          <div className="text-[14px] text-[#525261] mt-4">送金しました</div>
          <div className="text-[32px] font-bold font-mono mt-1 tracking-tight">
            {sendState.amount} DAO
          </div>

          <div className="mt-5 px-4 py-3 border border-[#dedee5] rounded-xl w-full flex flex-col gap-2.5">
            <DetailRow k="宛先">
              <span className="inline-flex items-center gap-1.5">
                {recipient && (
                  <Avatar size={18} label={recipient.initial} tone={recipient.tone} />
                )}
                {recipient?.name ?? "不明"}
              </span>
            </DetailRow>
            {sendState.message && (
              <DetailRow k="メモ" v={sendState.message} />
            )}
            <DetailRow k="時刻" v={new Date().toLocaleString("ja-JP")} mono />
            <DetailRow k="残高" v={`${balance} DAO`} mono />
            {tx && <DetailRow k="取引ID" v={tx.id.slice(0, 16) + "..."} mono muted />}
          </div>

          <div className="flex-1" />
          <div className="flex gap-2 w-full mt-4">
            <Button variant="outline" full onClick={() => router.push("/dm")}>DMで知らせる</Button>
            <Button full onClick={() => setView("main")}>完了</Button>
          </div>
        </div>
      </div>
    );
  }

  // E — Transaction detail
  if (view === "tx_detail" && selectedTx) {
    const tx = selectedTx;
    const isIn = tx.direction === "in";
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-none flex items-center gap-2.5 border-b border-[#dedee5] px-4 h-12">
          <BackButton onClick={() => setView("main")} />
          <div className="flex-1 text-[13px] font-semibold">取引詳細</div>
          <button
            onClick={() => {
              const detail = `${tx.desc}\n${tx.direction === "in" ? "+" : "-"}${tx.amount} DAO\n${tx.time}`;
              navigator.clipboard.writeText(detail).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="relative text-[14px] text-[#9a9aa0]"
          >
            ⤴
            {copied && (
              <span className="absolute -bottom-7 right-0 whitespace-nowrap text-[10px] font-semibold text-[#6666ff] bg-[#eeeeff] px-2 py-1 rounded-md shadow">
                ✓ コピーしました
              </span>
            )}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Amount hero */}
          <div className="flex flex-col items-center px-4 pt-6 pb-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-[22px] font-bold mb-3 ${
                isIn ? "bg-[#eeeeff] text-[#6666ff]" : "bg-[#f1f1f5] text-[#525261]"
              }`}
            >
              {isIn ? "↓" : "↑"}
            </div>
            <div className="text-[11.5px] text-[#9a9aa0] mb-1">
              {isIn ? "受け取り" : "送金"}
            </div>
            <div
              className={`text-[30px] font-bold font-mono tracking-tight ${
                isIn ? "text-[#6666ff]" : "text-[#1a1a1a]"
              }`}
            >
              {isIn ? "+" : "−"}{tx.amount} DAO
            </div>
          </div>

          {/* Detail card */}
          <div className="px-4 pb-4">
            <div className="px-4 py-3.5 border border-[#dedee5] rounded-xl flex flex-col gap-2.5">
              <DetailRow k={isIn ? "送信者" : "受信者"} v={tx.counterparty} />
              <DetailRow k="メモ" v={tx.desc} />
              {tx.relatedTaskId && (
                <DetailRow k="関連タスク" v={tx.relatedTaskId} />
              )}
              <DetailRow k="時刻" v={tx.time} mono />
              <DetailRow k="取引後残高" v={`${tx.balanceAfter} DAO`} mono />
              <DetailRow k="取引ID" v={tx.id} mono muted />
            </div>
          </div>

          <div className="px-4 pb-3">
            <div className="flex gap-2">
              <Button variant="outline" full onClick={() => router.push("/dm")}>✎ DMを開く</Button>
              {isIn && (
                <Button
                  full
                  onClick={() => {
                    setSendState({ recipientId: "u2", amount: tx.amount, message: "" });
                    setView("send");
                  }}
                >
                  お返しする
                </Button>
              )}
            </div>
          </div>
          <p className="px-4 pb-4 text-[10.5px] text-[#9a9aa0] leading-relaxed">
            ※ この取引は取消できません。問題があれば運営事務局までご連絡ください。
          </p>
        </div>
      </div>
    );
  }

  // F — Receive (QR + ID)
  if (view === "receive") {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-none flex items-center border-b border-[#dedee5] px-4 h-12">
          <button
            onClick={() => setView("main")}
            className="text-[16px] text-[#525261]"
          >
            ✕
          </button>
          <div className="flex-1 text-center text-[13px] font-semibold">受け取り</div>
          <div className="w-6" />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 py-5">
          {/* User info */}
          <div className="flex items-center gap-2.5 mb-4">
            <Avatar size={36} label={currentUser.initial} tone={currentUser.tone} />
            <div>
              <div className="text-[13px] font-bold">{currentUser.name}</div>
              <div className="text-[10px] text-[#9a9aa0] font-mono">@tanaka.daox</div>
            </div>
          </div>

          {/* QR */}
          <div className="p-2.5 bg-white border border-[#dedee5] rounded-xl">
            <FakeQR size={176} />
          </div>

          <p className="text-[11.5px] text-[#9a9aa0] mt-3 text-center leading-relaxed">
            このQRコードを読み取ってもらうと<br />あなたにトークンを送れます
          </p>

          {/* ID copy */}
          <div className="flex items-center gap-2.5 px-3.5 py-3 w-full border border-[#dedee5] rounded-xl bg-[#f1f1f5] mt-3.5">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-[#9a9aa0] mb-0.5">あなたのDAOX ID</div>
              <div className="text-[13px] font-bold font-mono truncate">tanaka.daox</div>
            </div>
            <button
              className="text-[10.5px] font-bold px-3 py-1.5 border border-[#1a1a1a] rounded-full whitespace-nowrap"
              onClick={() => navigator.clipboard.writeText("tanaka.daox")}
            >
              コピー
            </button>
          </div>

          {/* Specify amount inline input */}
          {specifyAmount && (
            <div className="mt-3.5 w-full px-3.5 py-3 border border-[#dedee5] rounded-xl bg-[#f1f1f5]">
              <div className="text-[10px] text-[#9a9aa0] mb-1.5">リクエスト金額</div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="flex-1 text-[24px] font-bold font-mono leading-none outline-none bg-transparent w-20 text-center"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(Number(e.target.value))}
                  min={1}
                />
                <span className="text-[13px] font-semibold text-[#525261]">DAO</span>
              </div>
            </div>
          )}

          <div className="flex-1" />
          <div className="flex gap-2 w-full mt-4">
            <Button variant="outline" full onClick={() => setSpecifyAmount((v) => !v)}>
              {specifyAmount ? "金額を解除" : "金額を指定"}
            </Button>
            <Button full onClick={() => router.push("/dm")}>DMで送る</Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
