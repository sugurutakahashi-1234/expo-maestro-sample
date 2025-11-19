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

- **ローカル**: `.maestro/snapshots/{branch}/{version}_{datetime}_{hash}/`
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
# → .maestro/snapshots/{branch}/{version}_{datetime}_{hash}/

# 3. スナップショット一覧確認
bun run vrt:list

# 4. ハッシュから比較コマンド生成
bun run vrt:find:local abc123 def456

# 5. 出力されたコマンドをコピー&実行
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

# 3. 比較
bun run vrt:find:local <main-hash> <release-hash>
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

# 3. 比較
bun run vrt:find:local <main-hash> <feature-hash>
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

GitHub Actionsでの自動VRT実行とチーム共有用。

### 基本コマンド

```bash
# リモート比較実行 (GCSから取得して比較)
bun run vrt:compare:remote
```

### GCS設定

- **バケット名**: `vrt-sample`
- **リージョン**: `asia-northeast1`
- **認証ファイル**: `vrt-sample-4dde33b657e4.json`
- **差分閾値**: 0.1% (thresholdRate: 0.001)

---

## スナップショット管理

### 命名規則

```
{version}_{datetime}_{hash}
```

- **version**: package.jsonのバージョン (例: `1.0.0`)
- **datetime**: 作成日時 (例: `2025-11-19_1430`)
- **hash**: コミットハッシュ短縮7文字 (例: `abc123d`)

### ディレクトリ構造

```
.maestro/snapshots/
├── main/
│   ├── 1.0.0_2025-11-18_1430_abc123d/
│   │   └── ios/
│   │       ├── home-tab.png
│   │       ├── about-tab.png
│   │       └── ...
│   └── 1.0.0_2025-11-19_0900_def456a/
│       └── ...
└── feature_change-ui/
    └── 1.0.0_2025-11-19_1221_f6e97f4/
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

# 正しいハッシュを使用
bun run vrt:find:local 041e30c f6e97f4
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
