/**
 * prisma/seed.ts
 * 既存モックデータを Supabase (PostgreSQL) に初期投入するシードスクリプト。
 * 実行: npx prisma db seed
 */

import {
  PrismaClient,
  Role, Rank, TaskType, TaskStatus, VoucherStatus,
  TxDirection, TxKind, NoticeTag, MessageKind, NotifKind, VoteStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const TODAY     = new Date("2026-05-29T00:00:00Z");
const YESTERDAY = new Date("2026-05-28T00:00:00Z");

function d(iso: string): Date { return new Date(iso); }

async function main() {
  console.log("🌱 Seeding database...");

  // ── クリア (依存順の逆順) ────────────────────────────────────────────────
  await prisma.notification.deleteMany();
  await prisma.dmMessage.deleteMany();
  await prisma.threadParticipant.deleteMany();
  await prisma.dmThread.deleteMany();
  await prisma.voteResponse.deleteMany();
  await prisma.voteOption.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.boardPost.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.exchangeVoucher.deleteMany();
  await prisma.exchangeItem.deleteMany();
  await prisma.taskQA.deleteMany();
  await prisma.taskTicket.deleteMany();
  await prisma.taskTag.deleteMany();
  await prisma.taskTemplate.deleteMany();
  await prisma.userCommunity.deleteMany();
  await prisma.userTag.deleteMany();
  await prisma.user.deleteMany();
  await prisma.community.deleteMany();

  // ── Community ────────────────────────────────────────────────────────────
  const community = await prisma.community.create({
    data: { id: "comm-shintomi", name: "新富町商店街", description: "新富町商店街コミュニティ" },
  });
  console.log("✅ Community:", community.name);

  // ── Users ────────────────────────────────────────────────────────────────
  const usersData = [
    { id: "u1",      name: "田中 太郎",     initial: "田", tone: 0, role: Role.MEMBER,     rank: Rank.BASIC,   xp: 1240, daoBalance:  420, bio: "新富商店街のメンバーです。地域のお役に立てることがあればお気軽に。",                  joinedAt: d("2024-01-15T00:00:00Z"), isOnline: true,  tags: ["商店街", "イベント", "掃除"] },
    { id: "u2",      name: "伊藤 さくら",   initial: "伊", tone: 1, role: Role.MEMBER,     rank: Rank.PREMIUM, xp: 4820, daoBalance:  680, bio: "商店街の中心でカフェを営んでいます。日々のお仕事や物々交換、お気軽にどうぞ。",        joinedAt: d("2023-02-01T00:00:00Z"), isOnline: true,  tags: ["飲食", "カフェ", "イベント運営"] },
    { id: "u3",      name: "佐藤 一郎",     initial: "佐", tone: 2, role: Role.MEMBER,     rank: Rank.BASIC,   xp:  980, daoBalance:  210,                                                                                                joinedAt: d("2024-03-10T00:00:00Z"), isOnline: false, tags: ["農家"] },
    { id: "u4",      name: "木村 弘",       initial: "木", tone: 3, role: Role.MEMBER,     rank: Rank.BASIC,   xp:  620, daoBalance:  150,                                                                                                joinedAt: d("2024-05-01T00:00:00Z"), isOnline: false, tags: ["デザイン"] },
    { id: "u5",      name: "高橋 美咲",     initial: "高", tone: 4, role: Role.MEMBER,     rank: Rank.BASIC,   xp: 3200, daoBalance:  320,                                                                                                joinedAt: d("2023-08-20T00:00:00Z"), isOnline: true,  tags: ["写真", "子育て"] },
    { id: "u6",      name: "中島 健",       initial: "中", tone: 0, role: Role.MEMBER,     rank: Rank.PREMIUM, xp: 2800, daoBalance:  540,                                                                                                joinedAt: d("2023-06-12T00:00:00Z"), isOnline: false, tags: ["物販"] },
    { id: "u7",      name: "小林 真理",     initial: "小", tone: 1, role: Role.MEMBER,     rank: Rank.BASIC,   xp:  510, daoBalance:   90,                                                                                                joinedAt: d("2024-04-01T00:00:00Z"), isOnline: false, tags: ["子育て"] },
    { id: "u_admin", name: "廣渡 (管理者)", initial: "廣", tone: 4, role: Role.SUPERADMIN, rank: Rank.PREMIUM, xp: 9999, daoBalance: 5000,                                                                                                joinedAt: d("2023-01-01T00:00:00Z"), isOnline: true,  tags: ["運営", "DAO"] },
  ];

  for (const { tags, bio, ...data } of usersData) {
    await prisma.user.create({
      data: {
        ...data,
        ...(bio ? { bio } : {}),
        tags:        { create: tags.map((tag) => ({ tag })) },
        communities: { create: [{ communityId: community.id }] },
      },
    });
  }
  console.log(`✅ Users: ${usersData.length}`);

  // ── ExchangeItem (交換先カタログ) ─────────────────────────────────────────
  await prisma.exchangeItem.createMany({
    data: [
      { id: "ei1", title: "コーヒー1杯無料",    issuerName: "カフェ ことり",    icon: "☕", cost:  50, validDays: 30, stock: 12, description: "1回1枚まで。他クーポンとの併用不可。", isHot: true },
      { id: "ei2", title: "パン10%OFF",         issuerName: "ベーカリー麦の穂", icon: "🥐", cost:  30, validDays: 30, stock: 28, description: "1,000円以上のお買い物で利用可。" },
      { id: "ei3", title: "商店街お買物券",      issuerName: "商店街本部",        icon: "🎟", cost: 100, validDays: 60, stock: 50, description: "加盟店舗 38店で利用可。" },
      { id: "ei4", title: "理容カット 500円OFF", issuerName: "理容 たかはし",    icon: "✂️", cost:  80, validDays: 90, stock:  5, description: "土曜は対象外。", isLow: true },
      { id: "ei5", title: "夏祭り 1ドリンク券", issuerName: "商店街本部",        icon: "🍻", cost:  60, validDays: 14, stock:  0, description: "6/15 夏祭り会場のみ。", isSoldout: true, isLimited: true },
    ],
  });
  console.log("✅ ExchangeItems: 5");

  // ── TaskTemplate ──────────────────────────────────────────────────────────
  const taskTemplates = [
    { id: "tmpl-001", title: "商店街の朝清掃",        desc: "メイン通りのゴミ拾い。終わったら集会所に集合。道具は現地に用意しています。", ordererId: "u_admin", totalSlots: 5, defaultAmount: 100,  defaultAmountUndecided: false, defaultTime: "毎朝 7:00–7:30",         deadline: d("2026-12-31T00:00:00Z"), type: TaskType.CONTINUE, createdAt: d("2026-01-01T06:00:00Z"), tags: ["清掃", "継続"] },
    { id: "tmpl-002", title: "看板リペイント手伝い",  desc: "経験不問、道具はこちらで準備します。元気な方大歓迎！",                       ordererId: "u1",      totalSlots: 2, defaultAmount: 500,  defaultAmountUndecided: false, defaultTime: "5/24(土) 10:00–13:00", deadline: d("2026-05-23T00:00:00Z"), type: TaskType.ONCE,     createdAt: d("2026-05-19T10:00:00Z"), tags: ["作業", "塗装"] },
    { id: "tmpl-003", title: "チラシ配布スタッフ",    desc: "商店街周辺、エリア応相談。雨天中止。",                                         ordererId: "u4",      totalSlots: 5, defaultAmount: 120,  defaultAmountUndecided: false, defaultTime: "5/28(水) 13:00–15:00", deadline: d("2026-05-27T00:00:00Z"), type: TaskType.ONCE,     createdAt: d("2026-05-19T12:00:00Z"), tags: ["配布", "屋外"] },
    { id: "tmpl-004", title: "新メニュー試食モニター", desc: "カフェ「ことり」新メニュー5品、感想記入あり。所要 30分程度。",               ordererId: "u2",      totalSlots: 5, defaultAmount: null, defaultAmountUndecided: true,  defaultTime: "6/5までいつでも",       deadline: d("2026-06-05T00:00:00Z"), type: TaskType.ONCE,     createdAt: d("2026-05-20T09:00:00Z"), tags: ["飲食", "モニター"] },
    { id: "tmpl-005", title: "夏祭りポスター制作",    desc: "掲示用A2サイズ。初稿1週間、修正2回まで含む。",                                 ordererId: "u_admin", totalSlots: 1, defaultAmount: 1000, defaultAmountUndecided: false, defaultTime: "6/15まで",              deadline: d("2026-06-10T00:00:00Z"), type: TaskType.ONCE,     createdAt: d("2026-05-18T11:00:00Z"), tags: ["デザイン", "印刷"] },
  ];
  for (const { tags, ...data } of taskTemplates) {
    await prisma.taskTemplate.create({ data: { ...data, tags: { create: tags.map((tag) => ({ tag })) } } });
  }
  console.log(`✅ TaskTemplates: ${taskTemplates.length}`);

  // ── TaskQA ────────────────────────────────────────────────────────────────
  await prisma.taskQA.createMany({
    data: [
      { id: "qa-t2-1", templateId: "tmpl-002", userId: "u3", question: "道具の種類を教えてください", answer: "ローラーと刷毛を用意しています。汚れてもいい服でお越しください。", createdAt: d("2026-05-20T09:00:00Z") },
      { id: "qa-t2-2", templateId: "tmpl-002", userId: "u5", question: "駐車場はありますか？",        createdAt: d("2026-05-21T14:30:00Z") },
    ],
  });
  console.log("✅ TaskQAs: 2");

  // ── TaskTicket ────────────────────────────────────────────────────────────
  await prisma.taskTicket.createMany({
    data: [
      { id: "tkt-001-001", templateId: "tmpl-001", amount: 100,  amountUndecided: false, time: "5/29(木) 7:00–7:30",   status: TaskStatus.OPEN,             createdAt: d("2026-05-29T00:00:00Z"), updatedAt: d("2026-05-29T00:00:00Z") },
      { id: "tkt-001-002", templateId: "tmpl-001", amount: 100,  amountUndecided: false, time: "5/19(日) 7:00–7:30",   status: TaskStatus.DONE,             acceptedById: "u1",  confirmedAmount: 100, createdAt: d("2026-05-19T00:00:00Z"), updatedAt: d("2026-05-20T08:00:00Z") },
      { id: "tkt-002-001", templateId: "tmpl-002", amount: 500,  amountUndecided: false, time: "5/24(土) 10:00–13:00", status: TaskStatus.PENDING_APPROVAL, acceptedById: "u3",  reportText: "リペイント完了しました。思ったより広かったですが無事きれいになりました！", createdAt: d("2026-05-20T10:00:00Z"), updatedAt: d("2026-05-24T14:20:00Z") },
      { id: "tkt-002-002", templateId: "tmpl-002", amount: 500,  amountUndecided: false, time: "5/24(土) 10:00–13:00", status: TaskStatus.ACCEPTED,         acceptedById: "u4",  createdAt: d("2026-05-20T10:00:00Z"), updatedAt: d("2026-05-22T09:00:00Z") },
      { id: "tkt-002-003", templateId: "tmpl-002", amount: 500,  amountUndecided: false, time: "5/24(土) 10:00–13:00", status: TaskStatus.RETURNED,         acceptedById: "u1",  deletedFlag: true, createdAt: d("2026-05-20T10:00:00Z"), updatedAt: d("2026-05-23T10:00:00Z") },
      { id: "tkt-003-001", templateId: "tmpl-003", amount: 120,  amountUndecided: false, time: "5/28(水) 13:00–15:00", status: TaskStatus.ACCEPTED,         acceptedById: "u3",  createdAt: d("2026-05-20T12:00:00Z"), updatedAt: d("2026-05-21T09:00:00Z") },
      { id: "tkt-003-002", templateId: "tmpl-003", amount: 120,  amountUndecided: false, time: "5/28(水) 13:00–15:00", status: TaskStatus.ACCEPTED,         acceptedById: "u1",  createdAt: d("2026-05-20T12:00:00Z"), updatedAt: d("2026-05-22T10:00:00Z") },
      { id: "tkt-003-003", templateId: "tmpl-003", amount: 120,  amountUndecided: false, time: "5/28(水) 13:00–15:00", status: TaskStatus.OPEN,             createdAt: d("2026-05-20T12:00:00Z"), updatedAt: d("2026-05-20T12:00:00Z") },
      { id: "tkt-003-004", templateId: "tmpl-003", amount: 120,  amountUndecided: false, time: "5/28(水) 13:00–15:00", status: TaskStatus.OPEN,             createdAt: d("2026-05-20T12:00:00Z"), updatedAt: d("2026-05-20T12:00:00Z") },
      { id: "tkt-003-005", templateId: "tmpl-003", amount: 120,  amountUndecided: false, time: "5/28(水) 13:00–15:00", status: TaskStatus.OPEN,             createdAt: d("2026-05-20T12:00:00Z"), updatedAt: d("2026-05-20T12:00:00Z") },
      { id: "tkt-004-001", templateId: "tmpl-004", amount: null, amountUndecided: true,  time: "6/5までいつでも",       status: TaskStatus.ACCEPTED,         acceptedById: "u1",  createdAt: d("2026-05-21T11:00:00Z"), updatedAt: d("2026-05-22T09:00:00Z") },
      { id: "tkt-004-002", templateId: "tmpl-004", amount: null, amountUndecided: true,  time: "6/5までいつでも",       status: TaskStatus.ACCEPTED,         acceptedById: "u5",  createdAt: d("2026-05-21T11:00:00Z"), updatedAt: d("2026-05-22T12:00:00Z") },
      { id: "tkt-004-003", templateId: "tmpl-004", amount: null, amountUndecided: true,  time: "6/5までいつでも",       status: TaskStatus.OPEN,             createdAt: d("2026-05-21T11:00:00Z"), updatedAt: d("2026-05-21T11:00:00Z") },
      { id: "tkt-004-004", templateId: "tmpl-004", amount: null, amountUndecided: true,  time: "6/5までいつでも",       status: TaskStatus.OPEN,             createdAt: d("2026-05-21T11:00:00Z"), updatedAt: d("2026-05-21T11:00:00Z") },
      { id: "tkt-004-005", templateId: "tmpl-004", amount: null, amountUndecided: true,  time: "6/5までいつでも",       status: TaskStatus.OPEN,             createdAt: d("2026-05-21T11:00:00Z"), updatedAt: d("2026-05-21T11:00:00Z") },
      { id: "tkt-005-001", templateId: "tmpl-005", amount: 1000, amountUndecided: false, time: "6/15まで",              status: TaskStatus.OPEN,             createdAt: d("2026-05-18T11:00:00Z"), updatedAt: d("2026-05-18T11:00:00Z") },
    ],
  });
  console.log("✅ TaskTickets: 16");

  // ── ExchangeVoucher ───────────────────────────────────────────────────────
  await prisma.exchangeVoucher.createMany({
    data: [
      { id: "ev1", itemId: "ei1", userId: "u1", issuedAt: d("2026-05-22T00:00:00Z"), expiresAt: d("2026-06-21T00:00:00Z"), status: VoucherStatus.ACTIVE,   redeemCode: "CT-9X4K-22" },
      { id: "ev2", itemId: "ei3", userId: "u1", issuedAt: d("2026-05-10T00:00:00Z"), expiresAt: d("2026-07-09T00:00:00Z"), status: VoucherStatus.ACTIVE,   redeemCode: "SK-7Y8M-10" },
      { id: "ev3", itemId: "ei2", userId: "u1", issuedAt: d("2026-05-24T00:00:00Z"), expiresAt: d("2026-06-23T00:00:00Z"), status: VoucherStatus.ACTIVE,   redeemCode: "PN-3Q1P-24" },
      { id: "ev4", itemId: "ei2", userId: "u1", issuedAt: d("2026-05-20T00:00:00Z"), expiresAt: d("2026-06-19T00:00:00Z"), status: VoucherStatus.ACTIVE,   redeemCode: "PN-8R7W-20" },
      { id: "ev5", itemId: "ei1", userId: "u1", issuedAt: d("2026-04-01T00:00:00Z"),                                        status: VoucherStatus.USED,     redeemCode: "CT-4A1B-01", usedAt: d("2026-04-12T00:00:00Z") },
      { id: "ev6", itemId: "ei4", userId: "u1", issuedAt: d("2026-02-15T00:00:00Z"), expiresAt: d("2026-05-15T00:00:00Z"), status: VoucherStatus.EXPIRED,  redeemCode: "HR-2F5D-15" },
    ],
  });
  console.log("✅ ExchangeVouchers: 6");

  // ── Transaction ───────────────────────────────────────────────────────────
  await prisma.transaction.createMany({
    data: [
      { id: "tx_8a4f5c2d92e1b7", userId: "u1", direction: TxDirection.IN,  kind: TxKind.TRANSFER,    counterparty: "伊藤 さくら", desc: "チラシ配布のお礼",        amount: 120, time: new Date(TODAY.getTime() + 14*3600000 + 20*60000),     balanceAfter: 420, relatedTaskId: "tmpl-003" },
      { id: "tx_transfer_01",     userId: "u1", direction: TxDirection.OUT, kind: TxKind.TRANSFER,    counterparty: "佐藤 一郎",   desc: "トマト購入",              amount:  20, time: new Date(YESTERDAY.getTime() + 18*3600000 + 2*60000),  balanceAfter: 290 },
      { id: "tx_vote_01",         userId: "u1", direction: TxDirection.IN,  kind: TxKind.VOTE_REWARD, counterparty: "投票報酬",    desc: "ロゴ案投票",              amount:   5, time: new Date(YESTERDAY.getTime() + 9*3600000 + 15*60000),  balanceAfter: 310 },
      { id: "tx_exchange_01",     userId: "u1", direction: TxDirection.OUT, kind: TxKind.EXCHANGE,    counterparty: "商店街本部",  desc: "クリーン作戦景品",        amount:  50, time: d("2026-05-18T00:00:00Z"),                              balanceAfter: 305, relatedExchangeId: "ei3" },
      { id: "tx_task_01",         userId: "u1", direction: TxDirection.IN,  kind: TxKind.TASK,        counterparty: "タスク報酬",  desc: "商店街の朝清掃 (5/19分)", amount: 100, time: d("2026-05-20T00:00:00Z"),                              balanceAfter: 355, relatedTaskId: "tkt-001-002" },
      { id: "tx_transfer_02",     userId: "u1", direction: TxDirection.OUT, kind: TxKind.TRANSFER,    counterparty: "中島 健",     desc: "物品購入",                amount:  30, time: d("2026-05-18T00:00:00Z"),                              balanceAfter: 255 },
    ],
  });
  console.log("✅ Transactions: 6");

  // ── Notice (showInBanner で アナウンスバーを兼ねる) ────────────────────────
  await prisma.notice.createMany({
    data: [
      { id: "n1", tag: NoticeTag.IMPORTANT, date: d("2026-05-20T00:00:00Z"), title: "今週の市役所窓口の臨時休業について",  body: "5月23日(金)は終日休業となります。ご注意ください。",               isPinned: true,  showInBanner: true,  authorId: "u_admin", communityId: community.id },
      { id: "n2", tag: NoticeTag.NOTICE,    date: d("2026-05-19T00:00:00Z"), title: "夏祭り 出店者募集のお知らせ",         body: "8/15開催。締切6/30まで。詳細は事務局まで。",                       isPinned: false, showInBanner: true,  authorId: "u_admin", communityId: community.id },
      { id: "n3", tag: NoticeTag.EVENT,     date: d("2026-05-17T00:00:00Z"), title: "商店街クリーン作戦のご案内",          body: "6/1朝7時集合、ポイント付与あり。参加者はグループチャットへ。",       isPinned: false, showInBanner: true,  authorId: "u_admin", communityId: community.id },
      { id: "n4", tag: NoticeTag.NOTICE,    date: d("2026-05-15T00:00:00Z"), title: "新メンバー歓迎会 5月末開催予定です",  body: "場所・時間は決まり次第お知らせします。",                           isPinned: false, showInBanner: false, authorId: "u_admin", communityId: community.id },
    ],
  });
  console.log("✅ Notices: 4");

  // ── BoardPost ─────────────────────────────────────────────────────────────
  await prisma.boardPost.createMany({
    data: [
      { id: "bp1", authorId: "u1", time: new Date(TODAY.getTime() - 12*60000),   tokens:  50, title: "看板のリペイント手伝ってくれる人", body: "土曜の朝3時間程度。経験不問、道具はこちらで。", isUnread: true  },
      { id: "bp2", authorId: "u2", time: new Date(TODAY.getTime() - 60*60000),   tokens: null, title: "新メニュー試食モニター募集",        body: "カフェ「ことり」より、5名様限定。",             isUnread: false },
      { id: "bp3", authorId: "u3", time: new Date(TODAY.getTime() - 3*3600000),  tokens:  20, title: "家庭菜園のトマト譲ります",          body: "たくさん採れたので。容器持参希望。",            isUnread: false },
      { id: "bp4", authorId: "u4", time: YESTERDAY,                               tokens: 120, title: "チラシ配布スタッフ募集",            body: "配布エリア応相談、約2時間。",                  isUnread: false },
    ],
  });
  console.log("✅ BoardPosts: 4");

  // ── Vote + VoteOption ─────────────────────────────────────────────────────
  await prisma.vote.create({ data: { id: "v1", title: "盆踊り会場の候補について", deadline: d("2026-05-25T00:00:00Z"), total: 120, status: VoteStatus.OPEN, communityId: community.id, options: { create: [{ label: "中央公園", voteCount: 22 }, { label: "河川敷", voteCount: 15 }, { label: "体育館", voteCount: 10 }] } } });
  await prisma.vote.create({ data: { id: "v2", title: "新ロゴデザイン案の選択",    deadline: d("2026-05-30T00:00:00Z"), total: 120, status: VoteStatus.OPEN, communityId: community.id, options: { create: [{ label: "A案",   voteCount: 40 }, { label: "B案",   voteCount: 28 }, { label: "C案",   voteCount: 14 }] } } });
  console.log("✅ Votes: 2");

  // ── DmThread + ThreadParticipant ──────────────────────────────────────────
  const threadDefs = [
    { id: "th1", isGroup: false, participants: [{ uid: "u1", unread: 2 }, { uid: "u2", unread: 0 }] },
    { id: "th2", isGroup: true, groupName: "商店街グループ", participants: [{ uid: "u1", unread: 5 }, { uid: "u2", unread: 0 }, { uid: "u3", unread: 0 }, { uid: "u4", unread: 0 }, { uid: "u5", unread: 0 }] },
    { id: "th3", isGroup: false, participants: [{ uid: "u1", unread: 0 }, { uid: "u3", unread: 0 }] },
    { id: "th4", isGroup: false, participants: [{ uid: "u1", unread: 0 }, { uid: "u4", unread: 0 }] },
    { id: "th5", isGroup: false, participants: [{ uid: "u1", unread: 0 }, { uid: "u_admin", unread: 0 }] },
    { id: "th6", isGroup: false, participants: [{ uid: "u1", unread: 0 }, { uid: "u5", unread: 0 }] },
  ];
  for (const { participants, ...td } of threadDefs) {
    await prisma.dmThread.create({ data: { ...td, participants: { create: participants.map(({ uid, unread }) => ({ userId: uid, unreadCount: unread })) } } });
  }
  console.log(`✅ DmThreads: ${threadDefs.length}`);

  // ── DmMessage ─────────────────────────────────────────────────────────────
  await prisma.dmMessage.createMany({
    data: [
      { id: "msg-th1-1", threadId: "th1", senderId: "u2", kind: MessageKind.TEXT,   text: "チラシ配布お疲れさまでした!",                      time: new Date(TODAY.getTime() + 14*3600000 + 15*60000) },
      { id: "msg-th1-2", threadId: "th1", senderId: "u1", kind: MessageKind.TEXT,   text: "こちらこそありがとうございます。",                  time: new Date(TODAY.getTime() + 14*3600000 + 17*60000) },
      { id: "msg-th1-3", threadId: "th1", senderId: "u2", kind: MessageKind.TEXT,   text: "少しですが、お礼にお送りします。",                  time: new Date(TODAY.getTime() + 14*3600000 + 19*60000) },
      { id: "msg-th1-4", threadId: "th1", senderId: "u2", kind: MessageKind.TOKEN,  tokenAmount: 120,                                          time: new Date(TODAY.getTime() + 14*3600000 + 20*60000) },
      { id: "msg-th1-5", threadId: "th1", senderId: "u2", kind: MessageKind.TEXT,   text: "ありがとうございました!",                           time: new Date(TODAY.getTime() + 14*3600000 + 20*60000 + 30000) },
      { id: "msg-th2-1", threadId: "th2", senderId: "u1", kind: MessageKind.TEXT,   text: "土曜の集合場所、商店街入口でOKですか？",            time: new Date(TODAY.getTime() + 11*3600000 + 42*60000) },
      { id: "msg-th2-2", threadId: "th2", senderId: "u2", kind: MessageKind.TEXT,   text: "はい、入口で大丈夫です。",                          time: new Date(TODAY.getTime() + 11*3600000 + 50*60000) },
      { id: "msg-th2-3", threadId: "th2", senderId: "u1", kind: MessageKind.TEXT,   text: "了解です！",                                        time: new Date(TODAY.getTime() + 11*3600000 + 55*60000) },
      { id: "msg-th2-4", threadId: "th2", senderId: "u1", kind: MessageKind.SYSTEM, text: "田中 太郎 が「夏祭り 出店サポート」を共有しました", time: new Date(TODAY.getTime() + 12*3600000) },
      { id: "msg-th2-5", threadId: "th2", senderId: "u1", kind: MessageKind.TEXT,   text: "土曜の件、了解です。よろしくお願いします。",        time: new Date(TODAY.getTime() + 12*3600000 + 60000) },
    ],
  });
  console.log("✅ DmMessages: 10");

  // ── Notification ──────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { id: "notif-1", userId: "u1", kind: NotifKind.TOKEN,  fromUserId: "u2", fromUserName: "伊藤 さくら", fromUserTone: 1, text: "からトークンを受け取りました",    meta: "+120 DAO",              time: new Date(TODAY.getTime() + 14*3600000 + 20*60000), isRead: false },
      { id: "notif-2", userId: "u1", kind: NotifKind.TASK,   fromUserId: "u1", fromUserName: "田中 太郎",   fromUserTone: 0, text: "があなたの実施報告を承認しました", meta: "看板リペイント",          time: new Date(TODAY.getTime() + 13*3600000 + 5*60000),  isRead: false },
      { id: "notif-3", userId: "u1", kind: NotifKind.DM,     fromUserId: "u2", fromUserName: "伊藤 さくら", fromUserTone: 1, text: "からメッセージ",                   meta: "ありがとうございました!", time: new Date(TODAY.getTime() + 14*3600000 + 20*60000), isRead: false },
      { id: "notif-4", userId: "u1", kind: NotifKind.VOTE,   fromUserName: "運営事務局",                    fromUserTone: 0, text: "新しい投票が始まりました",         meta: "盆踊り会場の候補について", time: new Date(TODAY.getTime() + 11*3600000 + 30*60000), isRead: true  },
      { id: "notif-5", userId: "u1", kind: NotifKind.RANK,                                                                   text: "プレミアム達成まであと1条件です",  meta: "担い手活動 1回で達成",    time: YESTERDAY,                                          isRead: true  },
      { id: "notif-6", userId: "u1", kind: NotifKind.TASK,   fromUserId: "u3", fromUserName: "佐藤 一郎",   fromUserTone: 2, text: "からタスクの応募がありました",     meta: "チラシ配布スタッフ",      time: YESTERDAY,                                          isRead: true  },
      { id: "notif-7", userId: "u1", kind: NotifKind.SYSTEM,                                                                 text: "お知らせ: 夏祭り 出店者募集",      meta: "締切 6/30",               time: d("2026-05-19T00:00:00Z"),                          isRead: true  },
      { id: "notif-8", userId: "u1", kind: NotifKind.TOKEN,  fromUserId: "u6", fromUserName: "中島 健",     fromUserTone: 0, text: "からトークンを受け取りました",    meta: "+30 DAO",               time: d("2026-05-18T00:00:00Z"),                          isRead: true  },
    ],
  });
  console.log("✅ Notifications: 8");

  console.log("\n🎉 Seed completed!");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
