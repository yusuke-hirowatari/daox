# DAOX — 地域コミュニティDAO アプリ

地域商店街向けコミュニティ + トークン + タスク + クーポン交換アプリ。

## セットアップ手順

### 必要環境

- Node.js 18 以上
- npm 9 以上

### インストール

```bash
cd daox
npm install
```

### 環境変数

```bash
cp .env.local.example .env.local
# .env.local を編集して各サービスのキーを設定
```

> STEP 1 時点では `.env.local` は不要です。

## 開発サーバー起動コマンド

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと `/home` にリダイレクトされます。

## その他のコマンド

```bash
npm run build      # 本番ビルド
npm run start      # 本番サーバー起動
npm run lint       # ESLint
npx tsc --noEmit   # TypeScript 型チェック
```

## 技術スタック

| 役割 | ライブラリ |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| スタイル | Tailwind CSS v4 |
| フォント | Hanken Grotesk + Noto Sans JP (Google Fonts) |
| DB / Auth / Realtime | Supabase (STEP 後半で追加) |
| QR スキャン | html5-qrcode (STEP 6 で追加) |
| QR 生成 | qrcode.react (STEP 8 で追加) |

## ディレクトリ構成

```
daox/
├── app/
│   ├── (app)/              # ログイン後レイアウト (底ナビ + サイドナビ)
│   │   ├── home/
│   │   ├── checkin/
│   │   ├── tasks/
│   │   ├── wallet/
│   │   ├── dm/
│   │   └── mypage/
│   ├── (auth)/             # 認証フロー
│   │   └── login/
│   └── admin/              # ADMINポータル
├── components/
│   ├── atoms/              # Button, Avatar, StatusPill, Chip...
│   ├── layouts/            # BottomNav, SideNav...
│   └── _demo/             # アトム確認ページ
├── mocks/                  # モックデータ (STEP 4)
└── lib/                    # api.ts, tokens.ts
```

## 実装ステップ

| STEP | 内容 | 状態 |
|---|---|---|
| 0 | プロジェクト技術選定 | ✅ 完了 |
| 1 | 環境セットアップ | ✅ 完了 |
| 2 | デザイントークン + 共通コンポーネント | 🔜 次 |
| 3 | ルーティング & ナビ骨格 | 🔜 |
| 4 | モックデータ層 | 🔜 |
| 5 | HOME / お知らせ / 掲示板 / 投票 | 🔜 |
| 6 | チェックイン | 🔜 |
| 7 | タスク | 🔜 |
| 8 | ウォレット | 🔜 |
| 9 | クーポン | 🔜 |
| 10 | DM | 🔜 |
| 11 | マイページ・ランク | 🔜 |
| 12 | 通知 | 🔜 |
| 13 | ADMIN ポータル | 🔜 |
