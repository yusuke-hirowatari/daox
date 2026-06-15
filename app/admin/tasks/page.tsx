"use client";

import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import {
  AdminBtn,
  AdminPill,
  AdminTable,
  type ColDef,
  type PillTone,
} from "@/components/admin/atoms";

// ─── Static data ──────────────────────────────────────────────────────────

type TaskState = "承認待ち" | "実施中" | "募集中" | "完了" | "差戻し";

interface TaskRow {
  id:     string;
  state:  TaskState;
  tone:   PillTone;
  title:  string;
  owner:  string;
  worker: string;
  amt:    number;
  due:    string;
  age:    string;
}

const INITIAL_TASKS: TaskRow[] = [
  { id: "t1", state: "承認待ち", tone: "warn",    title: "チラシ配布スタッフ募集",     owner: "木村 弘",    worker: "佐藤 一郎",   amt: 120, due: "今日",   age: "2日" },
  { id: "t2", state: "承認待ち", tone: "warn",    title: "看板リペイント手伝い",         owner: "田中 太郎",  worker: "伊藤 さくら", amt: 50,  due: "昨日",   age: "1日" },
  { id: "t3", state: "実施中",   tone: "open",    title: "見守り隊 (今月分)",            owner: "運営事務局", worker: "高橋 美咲",   amt: 30,  due: "5/31",   age: "5日" },
  { id: "t4", state: "募集中",   tone: "info",    title: "夏祭り 出店サポート",          owner: "運営事務局", worker: "—",          amt: 120, due: "8/15",   age: "3日" },
  { id: "t5", state: "募集中",   tone: "info",    title: "新メンバー案内役",             owner: "運営事務局", worker: "—",          amt: 40,  due: "随時",   age: "1週" },
  { id: "t6", state: "完了",     tone: "success", title: "商店街クリーン作戦 (5月)",     owner: "運営事務局", worker: "田中ほか3名", amt: 50,  due: "完了",   age: "5/18" },
  { id: "t7", state: "差戻し",   tone: "muted",   title: "不適切な投稿(削除済)",         owner: "—",         worker: "—",          amt: 0,   due: "—",     age: "—" },
];

const FILTER_TABS = [
  "すべて (24)",
  "承認待ち (2)",
  "実施中 (5)",
  "募集中 (3)",
  "完了 (12)",
  "差戻し (2)",
];

// ─── Table columns ────────────────────────────────────────────────────────

const COLS: ColDef[] = [
  { key: "state",  label: "ステータス", flex: 0.9 },
  { key: "title",  label: "タスク",     flex: 2.2, bold: true },
  { key: "owner",  label: "発注主",     flex: 1.1, muted: true },
  { key: "worker", label: "受注者",     flex: 1.1, muted: true },
  { key: "amt",    label: "金額",       flex: 0.7, mono: true, align: "right" },
  { key: "due",    label: "期限",       flex: 0.7, mono: true, muted: true },
  { key: "age",    label: "経過",       flex: 0.6, mono: true, muted: true },
  { key: "act",    label: "",           flex: 0.4, align: "right" },
];

function buildRows(
  tasks: TaskRow[],
  menuOpen: string | null,
  setMenuOpen: (id: string | null) => void,
  onDetail: (t: TaskRow) => void,
  onEdit: (t: TaskRow) => void,
  onCancel: (t: TaskRow) => void,
): Record<string, ReactNode>[] {
  return tasks.map((t) => ({
    state:  <AdminPill tone={t.tone}>{t.state}</AdminPill>,
    title:  t.title,
    owner:
      t.owner === "—" ? (
        <span className="text-[#9a9aa0]">—</span>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          <Avatar size={18} label={t.owner[0]} tone={0} />
          {t.owner}
        </span>
      ),
    worker:
      t.worker === "—" ? (
        <span className="text-[#9a9aa0]">—</span>
      ) : (
        t.worker
      ),
    amt:
      t.amt > 0 ? (
        `${t.amt}`
      ) : (
        <span className="text-[#9a9aa0]">—</span>
      ),
    due:  t.due,
    age:  t.age,
    act: (
      <div className="relative">
        <button
          className="text-[#9a9aa0] cursor-pointer hover:text-[#1a1a1a]"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === t.id ? null : t.id); }}
        >
          ⋯
        </button>
        {menuOpen === t.id && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#dedee5] rounded-lg shadow-lg z-20 py-1">
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { onDetail(t); setMenuOpen(null); }}
            >
              詳細を見る
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f1f1f5]"
              onClick={() => { onEdit(t); setMenuOpen(null); }}
            >
              編集
            </button>
            <button
              className="w-full text-left px-3 py-2 text-[12px] text-[#6666ff] hover:bg-[#f1f1f5]"
              onClick={() => { onCancel(t); setMenuOpen(null); }}
            >
              募集を中止
            </button>
          </div>
        )}
      </div>
    ),
  }));
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskRow[]>(INITIAL_TASKS);
  const [filterIdx, setFilterIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Task creation states
  const [creating, setCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAmt, setNewTaskAmt] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");

  // Guideline modal
  const [showGuideline, setShowGuideline] = useState(false);

  // Reminder
  const [reminderSent, setReminderSent] = useState(false);

  // Inline confirm state
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  // Detail modal
  const [detailTask, setDetailTask] = useState<TaskRow | null>(null);

  // Edit modal
  const [editingTask, setEditingTask] = useState<TaskRow | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmt, setEditAmt] = useState("");
  const [editDue, setEditDue] = useState("");

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  // Sync edit form when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setEditTitle(editingTask.title);
      setEditAmt(editingTask.amt > 0 ? String(editingTask.amt) : "");
      setEditDue(editingTask.due);
    }
  }, [editingTask]);

  // Row action handlers
  const handleDetail = (t: TaskRow) => setDetailTask(t);
  const handleEdit = (t: TaskRow) => setEditingTask(t);
  const handleCancel = (t: TaskRow) => {
    setConfirmCancelId(t.id);
  };
  const executeCancel = (id: string) => {
    setTasks(prev => prev.map(x => x.id === id ? { ...x, state: "差戻し" as TaskState, tone: "muted" as PillTone } : x));
    setConfirmCancelId(null);
  };

  // Filter by chip + sort
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // Filter by chip category
    switch (filterIdx) {
      case 1: list = list.filter((t) => t.state === "承認待ち"); break;
      case 2: list = list.filter((t) => t.state === "実施中"); break;
      case 3: list = list.filter((t) => t.state === "募集中"); break;
      case 4: list = list.filter((t) => t.state === "完了"); break;
      case 5: list = list.filter((t) => t.state === "差戻し"); break;
      // case 0: "すべて" – no filter
    }

    if (!sortAsc) list.reverse();
    return list;
  }, [tasks, filterIdx, sortAsc]);

  const rows = buildRows(filteredTasks, menuOpen, setMenuOpen, handleDetail, handleEdit, handleCancel);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex-none flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 px-4 md:px-6 py-2.5 md:py-3.5 border-b border-[#dedee5]">
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] text-[#9a9aa0] font-mono mb-1 hidden md:block">
            HOME &rsaquo; タスク監視
          </div>
          <div className="text-[15px] md:text-[17px] font-bold leading-tight">タスク監視</div>
          <div className="text-[11px] text-[#9a9aa0] mt-0.5">
            承認待ち 2件 ・ 実施中 1件 ・ 募集中 2件
          </div>
        </div>
        <AdminBtn variant="outline" onClick={() => setShowGuideline(true)}>ガイドライン</AdminBtn>
        <AdminBtn onClick={() => setCreating(true)}>運営タスクを作成</AdminBtn>
      </div>

      {/* Task creation form */}
      {creating && (
        <div className="flex-none border-b border-[#dedee5] bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px] font-bold">運営タスクを作成</div>
            <button onClick={() => { setCreating(false); setNewTaskTitle(""); setNewTaskAmt(""); setNewTaskDue(""); }} className="text-[#9a9aa0] hover:text-[#1a1a1a] text-[18px]">&times;</button>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-[11px] font-semibold text-[#525261] mb-1">タスク名</div>
              <input className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]" placeholder="例: 夏祭り 出店サポート" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <div>
                <div className="text-[11px] font-semibold text-[#525261] mb-1">報酬 (DAO)</div>
                <input className="w-[160px] px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] font-mono outline-none focus:border-[#6666ff]" placeholder="0" value={newTaskAmt} onChange={(e) => setNewTaskAmt(e.target.value)} />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#525261] mb-1">期限</div>
                <input type="date" className="w-[180px] px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]" value={newTaskDue} onChange={(e) => setNewTaskDue(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <AdminBtn disabled={!newTaskTitle.trim()} onClick={() => {
                const newTask: TaskRow = {
                  id: `t${Date.now()}`,
                  state: "募集中",
                  tone: "info",
                  title: newTaskTitle.trim(),
                  owner: "運営事務局",
                  worker: "—",
                  amt: parseInt(newTaskAmt) || 0,
                  due: newTaskDue || "随時",
                  age: "今",
                };
                setTasks(prev => [newTask, ...prev]);
                setCreating(false);
                setNewTaskTitle("");
                setNewTaskAmt("");
                setNewTaskDue("");
              }}>作成する</AdminBtn>
              <AdminBtn variant="outline" onClick={() => { setCreating(false); setNewTaskTitle(""); setNewTaskAmt(""); setNewTaskDue(""); }}>キャンセル</AdminBtn>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa] p-3 md:p-5">
        <div className="flex flex-col gap-3">

          {/* Aging alert */}
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-lg border text-[11.5px] flex-wrap"
            style={{ background: "#f0f0ff", borderColor: "#6666ff", color: "#6666ff" }}
          >
            <span className="text-[14px] flex-none">&#x26A0;</span>
            <div className="flex-1 min-w-0">
              <strong>承認待ちが 2件、2日以上滞留しています。</strong>
              {" "}発注主にリマインドを送ることができます。
            </div>
            <AdminBtn variant="accent" onClick={() => setReminderSent(true)} disabled={reminderSent}>
              {reminderSent ? "✓ 送信済み" : "リマインド送信"}
            </AdminBtn>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
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
            <button
              className="text-[11px] text-[#9a9aa0] whitespace-nowrap hover:text-[#1a1a1a] cursor-pointer"
              onClick={() => setSortAsc((prev) => !prev)}
            >
              並び: 経過 ({sortAsc ? "古い順" : "新しい順"}) &#x25BE;
            </button>
          </div>

          {/* Task cancel confirmation */}
          {confirmCancelId && (() => {
            const target = tasks.find(t => t.id === confirmCancelId);
            return target ? (
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-[#fff5f5] border border-[#e5c0c0] flex-wrap">
                <span className="text-[11.5px] text-[#525261]">
                  「<strong>{target.title}</strong>」の募集を中止しますか？
                </span>
                <span className="flex-1" />
                <AdminBtn variant="danger" onClick={() => executeCancel(confirmCancelId)}>確認</AdminBtn>
                <AdminBtn variant="ghost" onClick={() => setConfirmCancelId(null)}>キャンセル</AdminBtn>
              </div>
            ) : null;
          })()}

          {/* Table */}
          <AdminTable cols={COLS} rows={rows} rowHeight={44} />
        </div>
      </div>

      {/* Guideline modal */}
      {showGuideline && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowGuideline(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-[480px] max-h-[80vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[15px] font-bold">タスクガイドライン</span>
              <button onClick={() => setShowGuideline(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="text-[12.5px] text-[#525261] leading-[1.7] space-y-3">
              <div><strong className="text-[#1a1a1a]">1. タスクの作成</strong><br/>運営者はタスクを作成し、報酬額とカテゴリを設定します。</div>
              <div><strong className="text-[#1a1a1a]">2. 募集と応募</strong><br/>メンバーがタスクに応募し、発注者が承認します。</div>
              <div><strong className="text-[#1a1a1a]">3. 完了と承認</strong><br/>タスク完了後、発注者が成果を確認し承認すると報酬が自動付与されます。</div>
              <div><strong className="text-[#1a1a1a]">4. 承認待ちの対応</strong><br/>2日以上放置された承認待ちはリマインド対象となります。</div>
              <div><strong className="text-[#1a1a1a]">5. 不適切なタスク</strong><br/>規約違反のタスクは管理者が募集を中止できます。</div>
            </div>
          </div>
        </div>
      )}

      {/* Task detail modal */}
      {detailTask && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailTask(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-[440px] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold">タスク詳細</span>
              <button onClick={() => setDetailTask(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="mb-3">
              <div className="text-[15px] font-bold mb-1">{detailTask.title}</div>
              <AdminPill tone={detailTask.tone}>{detailTask.state}</AdminPill>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div className="p-2.5 bg-[#f1f1f5] rounded-lg"><div className="text-[10px] text-[#9a9aa0] mb-0.5">発注主</div><div className="font-semibold">{detailTask.owner}</div></div>
              <div className="p-2.5 bg-[#f1f1f5] rounded-lg"><div className="text-[10px] text-[#9a9aa0] mb-0.5">受注者</div><div className="font-semibold">{detailTask.worker}</div></div>
              <div className="p-2.5 bg-[#f1f1f5] rounded-lg"><div className="text-[10px] text-[#9a9aa0] mb-0.5">報酬 (DAO)</div><div className="font-mono font-bold text-[#6666ff]">{detailTask.amt > 0 ? detailTask.amt.toLocaleString() : "—"}</div></div>
              <div className="p-2.5 bg-[#f1f1f5] rounded-lg"><div className="text-[10px] text-[#9a9aa0] mb-0.5">期限</div><div className="font-mono font-semibold">{detailTask.due}</div></div>
              <div className="p-2.5 bg-[#f1f1f5] rounded-lg"><div className="text-[10px] text-[#9a9aa0] mb-0.5">経過</div><div className="font-mono font-semibold">{detailTask.age}</div></div>
              <div className="p-2.5 bg-[#f1f1f5] rounded-lg"><div className="text-[10px] text-[#9a9aa0] mb-0.5">ID</div><div className="font-mono font-semibold">{detailTask.id}</div></div>
            </div>
          </div>
        </div>
      )}

      {/* Task edit modal */}
      {editingTask && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingTask(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-[440px] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold">タスクを編集</span>
              <button onClick={() => setEditingTask(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f1f1f5]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[11px] font-semibold text-[#525261] mb-1">タスク名</div>
                <input className="w-full px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <div>
                  <div className="text-[11px] font-semibold text-[#525261] mb-1">報酬 (DAO)</div>
                  <input className="w-[160px] px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] font-mono outline-none focus:border-[#6666ff]" placeholder="0" value={editAmt} onChange={(e) => setEditAmt(e.target.value)} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#525261] mb-1">期限</div>
                  <input className="w-[180px] px-3 py-2 border border-[#dedee5] rounded-md text-[12.5px] outline-none focus:border-[#6666ff]" value={editDue} onChange={(e) => setEditDue(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <AdminBtn disabled={!editTitle.trim()} onClick={() => {
                  setTasks(prev => prev.map(x => x.id === editingTask.id ? {
                    ...x,
                    title: editTitle.trim(),
                    amt: parseInt(editAmt) || 0,
                    due: editDue || x.due,
                  } : x));
                  setEditingTask(null);
                }}>保存する</AdminBtn>
                <AdminBtn variant="outline" onClick={() => setEditingTask(null)}>キャンセル</AdminBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
