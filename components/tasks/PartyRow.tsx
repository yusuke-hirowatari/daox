import { Avatar } from "@/components/atoms/Avatar";

interface PartyCellProps {
  role: string;
  name?: string | null;
  tone?: number;
  isMe?: boolean;
  dm?: boolean;
  placeholder?: string;
}

function PartyCell({ role, name, tone = 0, isMe, dm, placeholder }: PartyCellProps) {
  const empty = !name;
  return (
    <div
      className={`flex-1 min-w-0 rounded-lg p-2.5 flex flex-col gap-1 border ${
        isMe ? "border-[#525261] bg-[#f1f1f5]" : "border-[#dedee5] bg-white"
      }`}
    >
      <div className="text-[9.5px] text-[#9a9aa0] font-semibold">{role}</div>
      <div className="flex items-center gap-1.5">
        {empty ? (
          <div className="w-5 h-5 rounded-full border border-dashed border-[#bbbbc0] flex-none" />
        ) : (
          <Avatar size={22} label={name![0]} tone={tone} />
        )}
        <span
          className={`text-[11.5px] font-semibold truncate ${
            empty ? "text-[#9a9aa0]" : "text-[#1a1a1a]"
          }`}
        >
          {empty
            ? (placeholder ?? "— 受注者未定")
            : `${name}${isMe ? "" : "さん"}`}
        </span>
        {isMe && (
          <span className="text-[8.5px] font-bold px-1.5 py-px rounded bg-[#1a1a1a] text-white flex-none">
            自分
          </span>
        )}
      </div>
      {dm && (
        <button className="self-start mt-0.5 text-[10px] font-semibold text-[#525261] px-2 py-[3px] rounded-full border border-[#dedee5] bg-white">
          ✉ DM
        </button>
      )}
    </div>
  );
}

interface TaskPartyRowProps {
  orderer: string;
  ordererTone: number;
  ordererIsMe?: boolean;
  acceptor?: string | null;
  acceptorTone?: number;
  acceptorIsMe?: boolean;
  placeholder?: string;
}

export function TaskPartyRow({
  orderer,
  ordererTone,
  ordererIsMe,
  acceptor,
  acceptorTone = 0,
  acceptorIsMe,
  placeholder,
}: TaskPartyRowProps) {
  return (
    <div className="px-4 py-2.5 flex items-stretch gap-1.5">
      <PartyCell
        role="発注主 / 承認者"
        name={orderer}
        tone={ordererTone}
        isMe={ordererIsMe}
        dm={!ordererIsMe}
      />
      <div className="flex items-center justify-center w-4 text-[13px] text-[#9a9aa0] font-mono shrink-0">
        →
      </div>
      <PartyCell
        role="受注者"
        name={acceptor}
        tone={acceptorTone}
        isMe={acceptorIsMe}
        dm={!!acceptor && !acceptorIsMe}
        placeholder={placeholder}
      />
    </div>
  );
}
