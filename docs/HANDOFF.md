# DAOX エンジニア向け仕様書・設計書

> **このドキュメントの使い方**: まず `npm install && npm run dev` でプロトタイプを動かして全画面を触ってください。その上でこのドキュメントを補足として読んでください。

---

## 1. プロジェクト概要

**DAOX**は、地域商店街向けのコミュニティDAO（分散型自治組織）アプリです。

**主な機能:**
- コミュニティ内のお知らせ・掲示板・投票
- タスク（仕事）の受発注とトークン報酬
- DAOトークンの送受信・ウォレット
- トークンとクーポンの交換
- 店舗QRチェックイン
- ダイレクトメッセージ
- 管理者向けダッシュボード

**現在の状態**: UIプロトタイプ（モックデータで全画面動作済み）。DB接続・認証・API未実装。

---

## 2. 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js (App Router) | 16.2.6 |
| 言語 | TypeScript | 5.x |
| UI | React | 19.2.4 |
| CSS | Tailwind CSS | v4 |
| ORM | Prisma | 7.8.0 |
| DB | Supabase (PostgreSQL) | — |
| QRスキャン | html5-qrcode | 2.3.8 |
| QR生成 | qrcode.react | 4.2.0 |
| ホスティング | Vercel | — |
| フォント | Hanken Grotesk + Noto Sans JP | Google Fonts |

---

## 3. ディレクトリ構成

```
daox/
├── app/
│   ├── (app)/              ← ユーザー向けページ（共通レイアウト）
│   │   ├── layout.tsx      ← SideNav + BottomNav + GlobalHeader
│   │   ├── home/           ← ホーム（お知らせ・掲示板・投票）
│   │   ├── tasks/          ← タスク管理
│   │   ├── wallet/         ← ウォレット
│   │   ├── coupons/        ← クーポン交換
│   │   ├── dm/             ← ダイレクトメッセージ
│   │   ├── checkin/        ← QRチェックイン
│   │   ├── mypage/         ← マイページ・設定
│   │   ├── members/        ← メンバー一覧
│   │   └── notifications/  ← 通知一覧
│   ├── (auth)/
│   │   └── login/          ← ログイン（未実装）
│   ├── admin/              ← 管理者ページ（別レイアウト）
│   │   ├── layout.tsx      ← AdminSideNav + AdminMobileHeader
│   │   └── (15ページ)
│   └── layout.tsx          ← ルートレイアウト
├── components/
│   ├── atoms/              ← 汎用UIパーツ（12個）
│   ├── layouts/            ← ナビゲーション・ヘッダー（4個）
│   ├── home/               ← ホーム関連（7個）
│   ├── tasks/              ← タスク関連（7個）
│   ├── admin/              ← 管理者関連（4個）
│   └── shared/             ← ページ横断共通（1個）
├── mocks/                  ← モックデータ（★ 本番実装で置き換え対象）
│   ├── types.ts            ← 全エンティティの型定義
│   ├── users.ts            ← ユーザーデータ
│   ├── tasks.ts            ← タスク・チケットデータ
│   ├── coupons.ts          ← クーポン・交換券データ
│   ├── wallet.ts           ← 取引履歴・残高
│   ├── dm.ts               ← DMスレッド・メッセージ
│   ├── notices.ts          ← お知らせ・掲示板・投票
│   ├── notifications.ts    ← 通知
│   ├── rank.ts             ← ランク定義
│   └── index.ts            ← 一括エクスポート
├── prisma/
│   ├── schema.prisma       ← DBスキーマ定義（★ 完成済み）
│   └── seed.ts             ← 初期データ投入スクリプト
├── lib/
│   ├── prisma.ts           ← Prismaクライアント（シングルトン）
│   ├── api.ts              ← API層（将来用）
│   └── tokens.ts           ← トークン関連ユーティリティ
└── .env                    ← 環境変数（DB接続情報）
```

---

## 4. データモデル（Prisma スキーマ）

スキーマは`prisma/schema.prisma`に完全定義済み（410行）。

### 4.1 エンティティ関連図

```
User ─────────┬──── TaskTemplate（タスク募集）
  │           │         └── TaskTicket（応募枠）
  │           │              └── TaskQA（質問）
  │           │
  │           ├──── ExchangeItem（交換カタログ）
  │           │         └── ExchangeVoucher（交換券）
  │           │
  │           ├──── Transaction（取引履歴）
  │           │
  │           ├──── Notice / BoardPost（掲示板）
  │           │
  │           ├──── Vote ── VoteOption
  │           │              └── VoteResponse
  │           │
  │           ├──── DmThread ── DmMessage
  │           │         └── ThreadParticipant
  │           │
  │           ├──── Notification
  │           │
  │           └──── UserCommunity ── Community
  │
  └── UserTag（タグ）
```

### 4.2 主要モデル詳細

#### User（ユーザー）
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | String | 主キー (cuid) |
| name | String | 表示名 |
| initial | String | アバター頭文字（1〜2文字） |
| tone | Int | アバター色トーン（0〜4） |
| role | Role | MEMBER / MODERATOR / SUPERADMIN |
| rank | Rank | BASIC / PREMIUM |
| xp | Int | 経験値 |
| daoBalance | Int | DAOトークン残高 |
| bio | String? | 自己紹介 |
| isOnline | Boolean | オンライン状態 |

#### TaskTemplate（タスク募集）— 2層構造の「テンプレート」
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | String | 主キー |
| title | String | タスク名 |
| desc | String | 説明 |
| ordererId | String | 発注者のUser.id |
| totalSlots | Int | 募集人数 |
| defaultAmount | Int? | 報酬額（null=金額未定） |
| deadline | String | 募集期限 |
| type | TaskType | ONCE（単発）/ CONTINUE（継続） |

#### TaskTicket（チケット）— 2層構造の「1人分の応募枠」
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | String | 主キー（tkt-001-001形式） |
| templateId | String | TaskTemplate.id |
| status | TaskStatus | OPEN→ACCEPTED→PENDING_APPROVAL→DONE / RETURNED |
| acceptedById | String? | 受注者のUser.id |
| amount | Int? | 個別金額（テンプレートからコピー、上書き可） |
| confirmedAmount | Int? | 承認時の確定金額 |

#### Transaction（取引）
| フィールド | 型 | 説明 |
|-----------|-----|------|
| direction | TxDirection | IN（受取）/ OUT（送付） |
| kind | TxKind | TASK / TRANSFER / EXCHANGE / REWARD / VOTE_REWARD |
| amount | Int | 金額 |
| counterparty | String | 相手名 |
| balanceAfter | Int | 取引後残高 |

#### ExchangeItem / ExchangeVoucher（クーポン交換 — 2層構造）
- **ExchangeItem**: カタログ（名前・コスト・在庫・有効期間）
- **ExchangeVoucher**: ユーザーが取得した1枚（固有redeemCode、QR表示用）

---

## 5. ページ一覧と機能

### 5.1 ユーザー向けページ

| パス | 機能 | 主なデータ |
|------|------|-----------|
| `/home` | お知らせ・掲示板・投票の閲覧と新規作成（FABから3種のComposeModal） | Notice, BoardPost, Vote |
| `/tasks` | タスク一覧（募集中/マイタスク/発注）、作成・応募・報告・承認 | TaskTemplate, TaskTicket |
| `/wallet` | 残高表示・送金・受取QR・取引履歴 | Transaction, User |
| `/coupons` | トークン交換カタログ・保有クーポン・QR提示 | ExchangeItem, ExchangeVoucher |
| `/dm` | スレッド一覧・メッセージ送受信・グループチャット | DmThread, DmMessage |
| `/checkin` | QRスキャンでチェックイン・XP獲得 | — |
| `/mypage` | プロフィール・ランク・設定・ログアウト | User |
| `/members` | コミュニティメンバー一覧・プロフィール閲覧 | User |
| `/notifications` | 通知一覧 | Notification |

### 5.2 管理者ページ

| パス | 機能 |
|------|------|
| `/admin` | ダッシュボード（KPI・アクションアイテム） |
| `/admin/members` | メンバー管理（ロール変更・停止・一括操作） |
| `/admin/tasks` | タスク監視（承認待ち・フィルター・リマインド） |
| `/admin/posts` | お知らせ投稿管理（作成・編集・アーカイブ） |
| `/admin/board` | 掲示板モデレーション（通報対応・非公開） |
| `/admin/votes` | 投票管理（作成・締切・削除） |
| `/admin/tokens` | トークンエコノミー管理（発行・報酬設定） |
| `/admin/shops` | 店舗登録（チェックイン設定・QR発行） |
| `/admin/rank` | ランク条件設定（プレミアム昇格要件） |
| `/admin/settings` | コミュニティ設定（プロフィール・ブランド・招待・通知） |
| `/admin/operators` | 運営者管理（権限マトリクス） |
| `/admin/mod` | モデレーションキュー（通報処理） |
| `/admin/analytics` | アナリティクス（DAU・エンゲージメント） |
| `/admin/audit` | 操作ログ |
| `/admin/announce` | お知らせ一覧管理 |

---

## 6. 主要ユーザーフロー

### 6.1 タスクライフサイクル

```
[発注者] タスク作成
    ↓
  TaskTemplate 作成 + TaskTicket N枚自動生成（status=OPEN）
    ↓
[受注者] 「応募する」
    ↓
  Ticket.status = ACCEPTED, acceptedById = userId
    ↓
[受注者] 作業完了 →「実施報告」
    ↓
  Ticket.status = PENDING_APPROVAL + reportText
    ↓
[発注者] 報告確認 →「承認」（金額未定の場合は金額確定）
    ↓
  Ticket.status = DONE
  Transaction作成（受注者に報酬IN、発注者からOUT）
  XP加算
```

### 6.2 クーポン交換フロー

```
[ユーザー] カタログ閲覧 → ExchangeItem選択
    ↓
  残高チェック（daoBalance >= cost）
    ↓
  ExchangeVoucher 作成（redeemCode生成）
  Transaction作成（OUT, kind=EXCHANGE）
  ExchangeItem.stock -= 1
    ↓
[ユーザー] 店舗でQR提示（redeemCode）
    ↓
[店舗] QRスキャン → Voucher.status = USED
```

### 6.3 チェックインフロー

```
[ユーザー] /checkin → QRスキャン
    ↓
  店舗QR読み取り → shopId取得
    ↓
  チェックイン記録作成
  XP加算（SHOP.reward分）
  Transaction作成（IN, kind=REWARD）
    ↓
  プレミアム昇格条件カウントに加算
```

### 6.4 送金フロー

```
[送信者] /wallet →「送る」→ 相手選択 → 金額入力
    ↓
  確認画面 → 送金実行
    ↓
  送信者: daoBalance -= amount, Transaction(OUT)
  受信者: daoBalance += amount, Transaction(IN)
  Notification作成（受信者向け）
```

---

## 7. 本番実装のロードマップ

### Phase 1: インフラ構築
- [ ] Supabaseプロジェクト作成
- [ ] `.env`に接続情報設定（DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY）
- [ ] `prisma db push` でテーブル作成
- [ ] `prisma db seed` で初期データ投入

### Phase 2: 認証
- [ ] Supabase Auth 導入（メール+パスワード or OAuth）
- [ ] ログインページ実装（`/login`）
- [ ] ミドルウェアで未認証リダイレクト
- [ ] セッション管理（`@supabase/ssr`）
- [ ] ユーザー登録フロー

### Phase 3: データ層の置き換え
- [ ] Server Actions or API Routes 作成
- [ ] `/mocks/` のデータを Prisma クエリに置き換え
- [ ] 各ページのデータ取得をServer Component化

**置き換え順序（依存関係順）:**
1. User（全ページが依存）
2. Notice / BoardPost / Vote（ホーム）
3. TaskTemplate / TaskTicket（タスク）
4. Transaction（ウォレット）
5. ExchangeItem / ExchangeVoucher（クーポン）
6. DmThread / DmMessage（DM）
7. Notification（通知）

### Phase 4: ファイルアップロード
- [ ] Supabase Storage 設定
- [ ] プロフィール画像アップロード
- [ ] 掲示板画像添付

### Phase 5: リアルタイム機能
- [ ] Supabase Realtime でDMリアルタイム受信
- [ ] 通知のリアルタイムプッシュ
- [ ] オンライン状態の自動更新

### Phase 6: 本番準備
- [ ] エラーハンドリング（Error Boundary）
- [ ] ローディング状態（Suspense + loading.tsx）
- [ ] SEO / メタデータ
- [ ] レート制限
- [ ] テスト（Jest + React Testing Library）

---

## 8. 環境変数一覧

```env
# ── Supabase ──
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# ── アプリ ──
NEXTAUTH_SECRET="(ランダム文字列)"
NEXT_PUBLIC_APP_URL="https://daox-zeta.vercel.app"
```

---

## 9. コンポーネント設計パターン

### レスポンシブの実装方法
```tsx
{/* SP（モバイル）*/}
<div className="md:hidden">...</div>

{/* PC（デスクトップ）*/}
<div className="hidden md:flex">...</div>
```

### モーダルパターン
```tsx
<div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
  <div className="absolute inset-0 bg-black/40" onClick={onClose} />
  <div className="relative w-full md:max-w-[520px] bg-white rounded-t-2xl md:rounded-2xl">
    {/* SP: 下からスライドアップ / PC: 中央表示 */}
  </div>
</div>
```

### アバターの色トーン
```
tone 0: bg-[#c4c4f8] text-[#3a3ac0]  （紫）
tone 1: bg-[#f8d4c4] text-[#c05a3a]  （オレンジ）
tone 2: bg-[#c4f8d4] text-[#3ac05a]  （緑）
tone 3: bg-[#f8f4c4] text-[#c0a83a]  （黄）
tone 4: bg-[#c4e8f8] text-[#3a8ac0]  （青）
```

### ブランドカラー
| 用途 | カラー |
|------|--------|
| メインテキスト | `#1a1a1a` |
| アクセント（紫） | `#6666ff` |
| サブテキスト | `#525261` |
| ミューテッド | `#9a9aa0` |
| ボーダー | `#dedee5` |
| 背景（薄灰） | `#f1f1f5` |
| 成功（緑） | `#2d7a4a` |

---

## 10. モックデータのユーザー一覧

| ID | 名前 | ロール | ランク | 残高 | 用途 |
|----|------|--------|--------|------|------|
| u1 | 田中 太郎 | MEMBER | BASIC | 420 | **カレントユーザー**（テスト用） |
| u2 | 伊藤 さくら | MEMBER | PREMIUM | 680 | カフェ店主（タスク発注者） |
| u3 | 佐藤 一郎 | MEMBER | BASIC | 210 | 農家（タスク受注者） |
| u4 | 木村 弘 | MEMBER | BASIC | 150 | デザイナー |
| u5 | 高橋 美咲 | MEMBER | BASIC | 320 | カメラマン |
| u6 | 中島 健 | MEMBER | PREMIUM | 540 | 商店主 |
| u7 | 小林 真理 | MEMBER | BASIC | 90 | 保育士 |
| u_admin | 廣渡（管理者） | SUPERADMIN | PREMIUM | 5000 | **管理者** |

---

## 11. 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド（TypeScriptチェック含む）
npm run build

# Prismaスキーマをデータベースに反映
npx prisma db push

# Prismaクライアント再生成
npx prisma generate

# Prisma Studio（DBブラウザ）
npx prisma studio

# 初期データ投入
npx prisma db seed

# Vercelデプロイ
npx vercel --prod
```

---

## 12. デプロイ情報

| 項目 | 値 |
|------|-----|
| Vercelプロジェクト | daox |
| 本番URL（ユーザー） | https://daox-zeta.vercel.app/home |
| 本番URL（管理者） | https://daox-zeta.vercel.app/admin |
| GitHubリポジトリ | https://github.com/yusuke-hirowatari/daox |
| メインブランチ | main |
