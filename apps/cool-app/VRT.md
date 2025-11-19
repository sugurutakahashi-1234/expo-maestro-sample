# VRT (Visual Regression Testing) ガイド

## 目次
1. [概要](#概要)
2. [ローカル開発ワークフロー (推奨)](#ローカル開発ワークフロー-推奨)
3. [リモートワークフロー (CI/CD用)](#リモートワークフロー-cicd用)
4. [スナップショット管理](#スナップショット管理)
5. [トラブルシューティング](#トラブルシューティング)
6. [技術詳細](#技術詳細)

---

## 概要

### VRTとは

Maestro E2Eテストで生成されたスクリーンショットを使用して、UIの視覚的な変更を検出するテストシステム。

### 2つのワークフロー

| ワークフロー | ツール | 用途 | 実行環境 |
|------------|--------|------|---------|
| **ローカル** | reg-cli | 開発中のUI確認 | ローカル環境 |
| **リモート** | reg-suit + GCS | CI/CD、チーム共有 | GitHub Actions |

### スナップショット保存先

- **ローカル**: `.maestro/snapshots/{branch}/{version}/{hash}/`
- **リモート**: GCS bucket `vrt-sample` (asia-northeast1)

---

## ローカル開発ワークフロー (推奨)

日常的な開発で使用する主要なワークフロー。

### 基本コマンド

```bash
# 1. Maestroテスト実行 → スクリーンショット取得
bun run maestro:ios

# 2. スナップショット作成
bun run vrt:snapshot:local
# → .maestro/snapshots/{branch}/{version}/{hash}/

# 3. スナップショット一覧確認
bun run vrt:list

# 4. ハッシュから比較コマンド生成
bun run vrt:find:local def456 abc123

# 5. 出力されたコマンドをコピー&実行
# actual (newer: def456) vs expected (older: abc123)
npx reg-cli .maestro/snapshots/feature/... .maestro/snapshots/main/... .reg/local/diff -R .reg/local/index.html -J .reg/local/reg.json -T 0.001; open .reg/local/index.html
```

### 実践例

#### 例1: リリース前のUI確認

```bash
# 1. mainでベースライン作成
git checkout main && git pull
bun run maestro:ios
bun run vrt:snapshot:local

# 2. リリースブランチでスナップショット作成
git checkout release/v1.1.0
bun run maestro:ios
bun run vrt:snapshot:local

# 3. 比較 (release が actual, main が expected)
bun run vrt:find:local <release-hash> <main-hash>
# → 出力されたコマンドを実行
```

#### 例2: 機能ブランチの影響範囲確認

```bash
# 1. mainでベースライン作成
git checkout main
bun run maestro:ios
bun run vrt:snapshot:local

# 2. 機能ブランチでスナップショット作成
git checkout feature/new-ui
bun run maestro:ios
bun run vrt:snapshot:local

# 3. 比較 (feature が actual, main が expected)
bun run vrt:find:local <feature-hash> <main-hash>
```

#### 例3: 強制スナップショット作成

WIP状態でもスナップショットを作成したい場合：

```bash
# --forceフラグで未コミット変更があっても作成
bun run vrt:snapshot:local:force
```

### reg-cliの出力の見方

比較結果は自動的にHTMLレポートとして開きます：

- **Changed items**: 差分が検出された画像
- **New items**: 新規追加された画像
- **Deleted items**: 削除された画像
- **Passed items**: 完全に一致した画像

---

## リモートワークフロー (CI/CD用)

GitHub Actionsでの自動VRT実行とチーム共有用。ローカルと同じ命名規則でGCSに保存。

### 初回セットアップ

リモートワークフローを使用する前に、GCS認証情報を設定する必要があります。

```bash
# 1. exampleファイルをコピー
cp vrt-gcs-credentials.json.example vrt-gcs-credentials.json

# 2. GCPコンソールでサービスアカウントキーを取得
# https://console.cloud.google.com/iam-admin/serviceaccounts

# 3. 取得したJSONの内容でvrt-gcs-credentials.jsonを上書き
# （project_id, private_key, client_emailなどを実際の値に置き換え）
```

**重要**: `vrt-gcs-credentials.json` は `.gitignore` で除外されています。絶対にコミットしないでください。

### 基本コマンド

```bash
# 1. Maestroテスト実行 → スクリーンショット取得
bun run maestro:ios

# 2. ローカルスナップショット作成
bun run vrt:snapshot:local
# → .maestro/snapshots/{branch}/{version}/{hash}/

# 3. GCSにベースライン公開（初回のみ）
bun run vrt:publish:remote <hash>
# → EXPECTED_KEYなしでreg-suit runを実行
# → すべての画像が"new items"としてGCSに保存

# 4. 出力されたコマンドをコピー&実行
ACTUAL_DIR=... ACTUAL_KEY=... GOOGLE_APPLICATION_CREDENTIALS=./vrt-sample-4dde33b657e4.json npx reg-suit run

# 5. ハッシュから比較コマンド生成
bun run vrt:find:remote <actual-hash> <expected-hash>
# → EXPECTED_KEYとACTUAL_KEYを指定してreg-suit run

# 6. 出力されたコマンドをコピー&実行
ACTUAL_DIR=.maestro/snapshots/feature/... EXPECTED_KEY=main/... ACTUAL_KEY=feature/... GOOGLE_APPLICATION_CREDENTIALS=./vrt-sample-4dde33b657e4.json npx reg-suit run; open .reg/index.html
```

### 実践例

#### 例1: mainブランチでベースライン作成

```bash
git checkout main && git pull
bun run maestro:ios
bun run vrt:snapshot:local
# → .maestro/snapshots/main/1.0.0/041e30c/

bun run vrt:publish:remote 041e30c
# → ACTUAL_DIR=... ACTUAL_KEY=... npx reg-suit run

# コマンドを実行してGCSに公開（EXPECTED_KEYなしなので"new items"として保存）
```

#### 例2: featureブランチで比較

```bash
git checkout feature/new-ui
bun run maestro:ios
bun run vrt:snapshot:local
# → .maestro/snapshots/feature_new-ui/1.0.0/f6e97f4/

bun run vrt:publish:remote f6e97f4
# → ACTUAL_DIR=... ACTUAL_KEY=... npx reg-suit run
# → コマンド実行してGCSに公開（EXPECTED_KEYなし）

# mainとの比較 (f6e97f4 が actual, 041e30c が expected)
bun run vrt:find:remote f6e97f4 041e30c
# → コマンド出力 → 実行
```

### GCS設定

- **バケット名**: `vrt-sample`
- **リージョン**: `asia-northeast1`
- **認証ファイル**: `vrt-gcs-credentials.json` (gitignore済み)
- **差分閾値**: 0.1% (thresholdRate: 0.001)
- **命名規則**: `{branch}/{version}/{hash}` (ローカルと同じ)

---

## スナップショット管理

### 命名規則

```
{branch}/{version}/{hash}
```

- **branch**: ブランチ名（サニタイズ済み、`/` → `_`）(例: `main`, `feature_new-ui`)
- **version**: package.jsonのバージョン (例: `1.0.0`)
- **hash**: コミットハッシュ短縮7文字 (例: `abc123d`)

### ディレクトリ構造

```
.maestro/snapshots/
├── main/
│   └── 1.0.0/
│       ├── abc123d/
│       │   └── ios/
│       │       ├── home-tab.png
│       │       ├── about-tab.png
│       │       └── ...
│       └── def456a/
│           └── ...
└── feature_change-ui/
    └── 1.0.0/
        └── f6e97f4/
            └── ...
```

### クリーンアップ

```bash
# 特定ブランチのスナップショット削除
rm -rf .maestro/snapshots/feature_old/

# 古いスナップショット一括削除 (30日以前)
find .maestro/snapshots -type d -mtime +30 -exec rm -rf {} +
```

---

## トラブルシューティング

### エラー: スクリーンショットが見つからない

```bash
❌ Error: Screenshots directory not found
💡 Run 'bun run maestro:ios' first
```

**解決方法:**
```bash
bun run maestro:ios
bun run vrt:snapshot:local
```

### エラー: 未コミット変更がある

```bash
❌ Uncommitted changes detected
💡 Commit first or use `--force` flag
```

**解決方法:**
```bash
# 方法1: コミットしてから実行
git add . && git commit -m "WIP"
bun run vrt:snapshot:local

# 方法2: --forceフラグ使用
bun run vrt:snapshot:local:force
```

### エラー: スナップショットが見つからない

```bash
❌ Snapshot not found for hash: abc123
```

**解決方法:**
```bash
# スナップショット一覧を確認
bun run vrt:list

# 正しいハッシュを使用 (f6e97f4 が actual, 041e30c が expected)
bun run vrt:find:local f6e97f4 041e30c
```

---

## CI/CD運用

GitHub Actionsを使用した自動VRT実行の運用方法。

### 概要

**パターン1: マージ後ベースライン更新**を採用しています：

1. **mainブランチ** (merge後): ベースラインを自動更新
2. **PRブランチ**: mainのベースラインと比較

### ワークフロー

#### 1. ベースライン更新 (`.github/workflows/vrt-baseline.yml`)

mainブランチにマージされたときに自動実行：

```yaml
on:
  push:
    branches: [main]

jobs:
  update-baseline:
    steps:
      - スナップショット作成 (--force)
      - GCS公開
```

#### 2. PR比較 (`.github/workflows/vrt-pr.yml`)

PRが作成・更新されたときに自動実行：

```yaml
on:
  pull_request:

jobs:
  vrt-compare:
    steps:
      - PRスナップショット作成 (--force)
      - GCS公開
      - mainベースラインと比較
```

### 制約事項

1. **Maestro実行不可**: CI環境ではMaestroを実行できないため、`.maestro/screenshots` を事前にコミット必要
2. **スナップショット作成**: CI環境では `--force` フラグで強制作成

### TODO項目

以下の機能は未実装です：

- [ ] **GCS認証情報の環境変数対応**
  - 現在は `vrt-gcs-credentials.json` がローカルにある前提
  - CI環境では `GCS_SERVICE_ACCOUNT_JSON` からJSONを読み込む必要がある
  - GitHub Secretsの設定手順が必要

### GitHub Secrets設定 (TODO)

CI/CD運用には以下のSecretが必要です（未実装）：

```bash
# GitHub リポジトリの Settings > Secrets and variables > Actions

GCS_SERVICE_ACCOUNT_JSON='{
  "type": "service_account",
  "project_id": "...",
  ...
}'
```

---

## 技術詳細

### 使用ツール

| ツール | 用途 | ドキュメント |
|--------|------|------------|
| **reg-cli** | ローカル画像比較 | https://github.com/reg-viz/reg-cli |
| **reg-suit** | リモート比較・GCS連携 | https://github.com/reg-viz/reg-suit |
| **Maestro** | E2Eテスト・スクリーンショット取得 | https://docs.maestro.dev/ |

### 設定ファイル

**regconfig.json** (reg-suit用):
```json
{
  "core": {
    "workingDir": ".reg",
    "actualDir": "${ACTUAL_DIR:-.maestro/screenshots}",
    "thresholdRate": 0.001
  },
  "plugins": {
    "reg-simple-keygen-plugin": {
      "expectedKey": "${EXPECTED_KEY}",
      "actualKey": "${ACTUAL_KEY}"
    },
    "reg-publish-gcs-plugin": {
      "bucketName": "vrt-sample"
    }
  }
}
```

### スクリプト

**vrt-snapshot.ts**: ローカルスナップショット作成
- Git未コミット変更チェック
- package.jsonからバージョン取得
- Git情報取得 (ブランチ、ハッシュ)
- スナップショット名生成
- スクリーンショットコピー

**vrt-find-snapshots.ts**: ハッシュから比較コマンド生成
- `find`コマンドで`.maestro/snapshots`配下を検索
- reg-cli実行コマンドを生成・出力
