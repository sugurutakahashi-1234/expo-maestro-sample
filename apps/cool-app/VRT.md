# VRT (Visual Regression Testing) ガイド

## 概要

Maestro E2Eテストで生成されたスクリーンショットを使用してVisual Regression Testingを行います。

- **実行環境**: 完全ローカル（CI/CD自動化なし）
- **管理方法**: 手動でスナップショットを作成し、任意のスナップショット同士を比較
- **保存先**: `.maestro/snapshots/` (GCS管理、Git管理外)

## 基本コマンド

```bash
# 1. Maestroテスト実行 → スクリーンショット取得
bun run maestro:ios

# 2. スナップショット作成
bun run vrt:snapshot
# → .maestro/snapshots/1.0.0_main_20251118-1430_abc123def456/

# 3. スナップショット一覧表示
bun run vrt:list

# 4. 2つのスナップショットを比較
bun run vrt:compare <期待値> <実際の値>
# 例: bun run vrt:compare 1.0.0_main_20251118-1430_abc123def456 1.1.0_main_20251120-0900_789012345678
```

## スナップショット命名規則

```
{version}_{branch}_{YYYYMMDD-HHmm}_{hash}
```

- **version**: package.jsonのバージョン (例: `1.0.0`)
- **branch**: Gitブランチ名 (例: `main`, `feature-xyz`)
- **YYYYMMDD-HHmm**: 作成日時 (例: `20251118-1430`)
- **hash**: コミットハッシュ短縮12文字 (例: `abc123def456`)

## 実践例

### リリース前のUI確認

前バージョンと比較して意図しないUI変更がないか確認：

```bash
# mainでベースライン作成
git checkout main && git pull
bun run maestro:ios && bun run vrt:snapshot

# リリースブランチでスナップショット作成
git checkout release/v1.1.0
bun run maestro:ios && bun run vrt:snapshot

# 比較
bun run vrt:list  # スナップショット名を確認
bun run vrt:compare 1.0.0_main_20251118-1430_abc123def456 1.1.0_release-v1.1.0_20251120-1000_789012345678
```

### 機能ブランチの影響範囲確認

feature branchでの変更がUIにどう影響するか確認：

```bash
# mainでベースライン作成
git checkout main
bun run maestro:ios && bun run vrt:snapshot

# 機能ブランチでスナップショット作成
git checkout feature/new-ui
bun run maestro:ios && bun run vrt:snapshot

# 比較
bun run vrt:compare 1.0.0_main_20251118-1430_abc123def456 1.0.0_feature-new-ui_20251120-1130_abc789def012
```

### 過去のコミットとの比較

過去の特定コミットでのUIを確認：

```bash
# 過去のコミットでスナップショット作成
git checkout abc123
bun run maestro:ios && bun run vrt:snapshot

# 現在に戻って比較
git checkout main
bun run vrt:compare 1.0.0_main_20251115-0900_abc123def456 1.0.0_main_20251118-1430_789012345678
```

## スナップショット管理

### 保管推奨

- **各バージョンの最新**: `1.0.0_main_*`, `1.1.0_main_*` など
- **リリース直前**: `1.1.0_release-v1.1.0_*`

### 削除可能

- **feature branch**: マージ後は不要
- **過去コミット**: 調査完了後は不要

### クリーンアップ例

```bash
# 特定のスナップショット削除
rm -rf .maestro/snapshots/1.0.0_feature-old_*

# 特定バージョン以外を削除
cd .maestro/snapshots && ls | grep -v "^1.0.0_" | xargs rm -rf
```

## トラブルシューティング

### スクリーンショットが見つからない

```bash
# Maestroテストを実行してスクリーンショットを生成
bun run maestro:ios
bun run vrt:snapshot
```

### ディレクトリが存在しません

```bash
# 正確なディレクトリ名を確認
bun run vrt:list
```

### GCS認証エラー

```bash
# 認証情報ファイルの確認
ls -la vrt-sample-4dde33b657e4.json
```

## 参考資料

- [reg-suit公式](https://github.com/reg-viz/reg-suit)
- [Maestro公式](https://docs.maestro.dev/)
