# DAOX 開発進捗メモ
最終更新: 2026-06-03

---

## 完了済み

### Prisma + Supabase セットアップ
- `prisma/schema.prisma` — 全エンティティ定義済み（Prisma 7 形式）
- `prisma.config.ts` — DB接続設定（Prisma 7 では schema.prisma に url を書かない）
- `prisma/seed.ts` — 既存モックデータを全件投入するシードスクリプト
- `lib/prisma.ts` — Next.js Hot Reload 対応シングルトンクライアント
- `.env` — DATABASE_URL プレースホルダー（Supabase接続文字列を要記入）
- `package.json` — `prisma.seed` スクリプト追記、`ts-node` 追加

### Supabase 接続が完了したら実行するコマンド
```bash
npx prisma migrate dev --name init   # テーブル作成
npx prisma db seed                   # 初期データ投入
npx prisma studio                    # GUIで確認
```

---

## スキーマ設計方針（2026-06-03 確定）

### 基本方針
- **マスターデータ + CRUD を基盤**に据える
- 複雑な統合・リレーションは後回し。まずシンプルにサービスイン
- SP（スマートフォン）ファーストで UI 設計

### 確定した設計変更
| 変更内容 | 理由 |
|---|---|
| `CouponTemplate` → `ExchangeItem` | 「クーポン」ではなく「トークンの交換先」が本質 |
| `CouponInstance` → `ExchangeVoucher` | 交換して手元に持つ券 |
| `CouponStatus` → `VoucherStatus` | 名称統一 |
| `Shop` テーブル削除 | 初期スコープ外。`issuerName: String` で代替 |
| `CheckIn` テーブル削除 | 初期スコープ外（後回し） |
| `Announcement` テーブル削除 | `Notice.showInBanner` フラグで代替 |
| `BoardPost.tag` (BoardTag) 削除 | 初期UIではカテゴリー不要 |
| `TxKind.CHECKIN` 削除 | CheckIn削除に伴い |
| `TxKind.COUPON` → `EXCHANGE` | 名称統一 |
| `Transaction.relatedCouponId` → `relatedExchangeId` | 名称統一 |

---

## テーブル分類（現在）

### マスター（静的参照データ）
`User` / `Community` / `ExchangeItem` / `TaskTemplate` / `Notice` / `Vote` / `VoteOption`

### トランザクション（業務データ）
`TaskTicket` / `ExchangeVoucher` / `Transaction` / `BoardPost` / `VoteResponse` / `DmThread` / `DmMessage` / `Notification`

### 中間テーブル
`UserTag` / `UserCommunity` / `ThreadParticipant` / `TaskTag` / `TaskQA`

---

## 次のアクション（優先順）

### 1. Supabase 接続・マイグレーション
- [ ] Supabase プロジェクト作成 → `.env` に DATABASE_URL 記入
- [ ] `npx prisma migrate dev --name init`
- [ ] `npx prisma db seed`

### 2. UI・ナビゲーション
- [ ] SP 向けナビゲーション再設計（＋ボタン → 画面ごとに直接アクション）
- [ ] ホーム画面の優先配置確定（お知らせ・掲示板・投票を前面に）
- [ ] ウォレット・DM の導線確保

### 3. 将来対応（初期スコープ外）
- チェックイン機能（CheckIn / Shop テーブルの追加）
- タスク→掲示板の連携フロー
- 掲示板カテゴリー（BoardTag）の復活

---

## プロジェクトの場所
```
~/claude code/DAOX開発ファイル/daox/
```

## 現在のファイル構成
```
daox/
├── prisma/
│   ├── schema.prisma      ✅ 完成（最新）
│   └── seed.ts            ✅ 完成（最新）
├── prisma.config.ts       ✅ 完成
├── lib/
│   ├── prisma.ts          ✅ 完成
│   ├── api.ts             (モック使用中・後ほどDB差し替え)
│   └── tokens.ts
├── mocks/                 (現在も使用中)
├── .env                   ✅ 作成済み（Supabase URL 未記入）
└── PROGRESS.md            ← このファイル
```
