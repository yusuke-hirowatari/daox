import type { TaskAmount, TaskStatus } from "@/mocks/types";
import type { StatusVariant } from "@/lib/tokens";

export function fmtAmount(amount: TaskAmount): string {
  return amount === "undecided" ? "金額未定" : `${amount} DAO`;
}

export function amountColor(amount: TaskAmount): string {
  return amount === "undecided" ? "#9a9aa0" : "#6666ff";
}

export function statusVariant(
  status: TaskStatus,
  confirmedAmount?: number
): StatusVariant {
  switch (status) {
    case "open":             return "open";
    case "accepted":         return "accepted";
    case "pending_approval": return "pending";
    case "done":             return confirmedAmount === 0 ? "unpaid" : "paid";
    default:                 return "default";
  }
}

export function statusLabel(
  status: TaskStatus,
  confirmedAmount?: number
): string {
  switch (status) {
    case "open":             return "募集中";
    case "accepted":         return "受注中";
    case "pending_approval": return "承認待ち";
    case "done":             return confirmedAmount === 0 ? "0で承認" : "入金済み";
    case "returned":         return "返却済み";
    default:                 return status;
  }
}
