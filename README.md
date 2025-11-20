# Expo Maestro + VRT 検証リポジトリ

Maestro E2Eテストとreg-suitを使ったVisual Regression Testing (VRT) の検証用リポジトリ。

## 📖 用語定義

このドキュメントでは、以下の用語を使い分けています:

| 用語 | 意味 | 保存場所 | 説明 |
|------|------|----------|------|
| **スクリーンショット** | Maestroが生成する画像 | `.maestro/screenshots/` | E2Eテスト実行時に毎回生成される一時的な画像 |
| **スナップショット** | 版管理された基準画像 | `.maestro/snapshots/` | VRT比較の基準として保存される画像（Git管理外） |

**ワークフロー**:
1. Maestroテスト実行 → **スクリーンショット**生成（`.maestro/screenshots/`）
2. スナップショット作成 → **スナップショット**保存（`.maestro/snapshots/{branch}/{version}/{hash}/`）
3. VRT比較 → スクリーンショット vs スナップショット、またはスナップショット同士

## 🚀 クイックスタート

```bash
# 依存関係インストール
bun install

# アプリ起動
cd apps/cool-app
bun run ios

# Maestro E2Eテスト実行
bun run maestro:ios
```

**必須ツール**: Bun, Maestro CLI
- Maestro: `brew install maestro`
- Bun: `brew install oven-sh/bun/bun`

## 📦 構成

```
expo-maestro-sample/
├── apps/
│   └── cool-app/          # メインアプリ（Expo + Maestro + VRT）
└── packages/
    └── cool-package/      # 共有パッケージ
```

Monorepo構成（Bun workspaces）

## ⚠️ 重要な制約

開発を始める前に、以下の制約を理解しておく必要があります:

### 🔴 Maestro StudioとCLIの同時使用不可

- Maestro Studioが起動していると、**CLIでlaunchAppが機能しない**
- 両者が同じポート7001を使用するため競合する
- **対策**: Maestro Studioを完全に終了してからCLIテストを実行

**参考**: [GitHub Issue #1927](https://github.com/mobile-dev-inc/maestro/issues/1927)

### 🔴 Maestro CLIの並列実行不可

- 複数のMaestro CLIインスタンスを同時実行できない
- すべてのインスタンスがポート7001を使用するため競合する
- **対策**: `&&` で順次実行（例: `bun run maestro:ios && bun run maestro:android`）

### 🔴 iOS: 物理デバイスは非対応

- Maestroは現時点でiOSの物理デバイスをサポートしていない
- iOSテストはシミュレータのみで実行可能
- Androidは物理デバイスでも実行可能

**参考**: [Maestro: Connecting to your device](https://docs.maestro.dev/getting-started/installing-maestro#connecting-to-your-device)

## 🛠️ 開発コマンド

```bash
# ルートディレクトリ
bun run test        # 全パッケージのテスト実行
bun run lint        # 全パッケージのLint実行
bun run typecheck   # 全パッケージの型チェック

# apps/cool-app
cd apps/cool-app
bun run maestro:ios                      # Maestro iOS E2Eテスト
bun run maestro:android                  # Maestro Android E2Eテスト
bun run maestro:all                      # iOS → Android 順次実行
bun run vrt:snapshot:local               # スナップショット作成
bun run vrt:snapshot:local:force         # 未コミット変更時も強制作成
bun run vrt:compare:local:current <hash> # 現在のスクリーンショット vs 過去のスナップショット
bun run vrt:compare:local:archived <h1> <h2> # 過去のスナップショット vs 過去のスナップショット
bun run vrt:publish:manual               # GCSパブリッシュコマンド生成
```

## ⚠️ Maestro 重要な注意点

**実際にハマりやすいポイントを厳選（詳細解説）:**

### 1. iOS: accessibilityLabel必須

**問題**:
- iOSではaccessibilityLabelを設定しないとMaestroが要素を認識できない

**対象要素**:
- タブナビゲーション
- ボタン
- その他インタラクティブな要素

**対策**:
React NativeのaccessibilityLabel属性を使用:

```tsx
<TouchableOpacity accessibilityLabel="ホーム">
  <Text>ホーム</Text>
</TouchableOpacity>
```

**参考**:
- [React Native: Accessibility](https://reactnative.dev/docs/accessibility#accessibilitylabel)
- [Maestro: iOS UIKit Support](https://docs.maestro.dev/platform-support/ios-uikit)

---

### 2. スクリーンショットパスの指定方法

**パス解釈ルール**:
- パスはプロジェクトルートからの相対パスとして解釈される
- 拡張子なしで指定すると自動的に`.png`が付加される

**例**:
```yaml
# 指定: .maestro/screenshots/ios/home-tab
# 保存: .maestro/screenshots/ios/home-tab.png

- takeScreenshot: .maestro/screenshots/ios/home-tab
```

**runFlow内でも同様**:
```yaml
- runFlow:
    commands:
      - takeScreenshot: .maestro/screenshots/ios/login-form
```

---

### 3. maestro.platformを使った動的パス生成

**利点**:
- プラットフォーム別にスクリーンショットを保存できる
- `runFlow` + `when` 条件を使わずにシンプルに実装可能

**実装方法**:
```yaml
# 1. 最初に1回だけプラットフォームを取得
- evalScript: ${output.platform = maestro.platform}

# 2. 以降、変数展開でパスを動的生成
- takeScreenshot: .maestro/screenshots/${output.platform}/home-tab
# iOS → .maestro/screenshots/ios/home-tab.png
# Android → .maestro/screenshots/android/home-tab.png
```

**従来の方法（冗長）**:
```yaml
- runFlow:
    when:
      platform: ios
    commands:
      - takeScreenshot: .maestro/screenshots/ios/home-tab

- runFlow:
    when:
      platform: android
    commands:
      - takeScreenshot: .maestro/screenshots/android/home-tab
```

---

### 4. when条件はrunFlowとrunScriptでのみ使用可能

**制約**:
- プラットフォーム分岐（`when: platform: android/ios`）を使いたい場合、必ず`runFlow`または`runScript`で囲む必要がある
- `takeScreenshot`、`tapOn`、`assertVisible`などの通常コマンドに直接`when`は使えない

**❌ 間違った例**:
```yaml
# これはエラーになる
- takeScreenshot: xxx
  when:
    platform: ios
```

**✅ 正しい例**:
```yaml
- runFlow:
    when:
      platform: ios
    commands:
      - takeScreenshot: xxx
```

**参考**: [Maestro: Conditions](https://docs.maestro.dev/advanced/conditions)

---

### 5. VRT: ステータスバー固定

**目的**:
- スクリーンショット比較時に時刻やバッテリー残量の差異を防ぐ

**iOS: xcrun simctl status_barで固定**:
```bash
# 9:41、バッテリー100%、Wi-Fi/セルラー接続状態に固定
DEVICE_ID=$(xcrun simctl list devices booted | grep -o '[A-F0-9-]\{36\}' | head -1)
xcrun simctl status_bar $DEVICE_ID override \
  --time '9:41' \
  --batteryState charged \
  --batteryLevel 100 \
  --cellularMode active \
  --cellularBars 4 \
  --wifiBars 3
```

**Android: adb Demo Modeで固定**:
```bash
# Demo Modeを有効化
adb shell settings put global sysui_demo_allowed 1

# 時刻を9:41に設定
adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0941

# バッテリーを100%に設定
adb shell am broadcast -a com.android.systemui.demo -e command battery -e level 100 -e plugged false

# Wi-Fiを4本に設定
adb shell am broadcast -a com.android.systemui.demo -e command network -e wifi show -e level 4

# 通知を非表示
adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false

# Demo Modeを適用
adb shell am broadcast -a com.android.systemui.demo -e command enter
```

**実装方法**:
`package.json`の`maestro:ios`/`maestro:android`スクリプトで、ステータスバー固定後にMaestroテストを実行します。

```bash
# ステータスバー固定 → Maestroテスト実行（自動）
bun run maestro:ios

# 手動で実行する場合は以下のように分けることも可能
bun run statusbar:ios
maestro test .maestro/app-flow.yaml
```

## 📸 VRT (Visual Regression Testing)

Maestroで取得したスクリーンショットを使用して、UIの視覚的な変更を検出するシステム。

### 環境

| 項目 | 設定値 |
|-----|-------|
| **ツール** | reg-suit + Google Cloud Storage |
| **バケット** | `vrt-sample` (asia-northeast1) |
| **認証** | `apps/cool-app/vrt-gcs-credentials.json` |
| **スナップショット保存先** | `.maestro/snapshots/` (Git管理外) |
| **差分閾値** | 0.1% (`thresholdRate: 0.001`) |
| **プラットフォーム** | iOS / Android |

### 運用方針

**2つのワークフロー**:

| ワークフロー | ツール | 用途 | 実行環境 |
|------------|--------|------|---------|
| **ローカル** | reg-cli | 開発中のUI確認 | ローカル環境 |
| **リモート** | reg-suit + GCS | CI/CD、チーム共有 | GitHub Actions |

**運用の特徴**:
- ✅ 必要なタイミングで手動でスナップショット作成
- ✅ 任意のスナップショット同士を比較可能
- ✅ CI/CDで自動実行（PR作成時、mainマージ時）
- ✅ PRコメント自動投稿

### スナップショット命名規則

```
{branch}/{version}/{hash}
```

- **branch**: ブランチ名（サニタイズ済み、`/` → `_`）
  - 例: `main`, `feature_new-ui`
- **version**: `package.json`のバージョン
  - 例: `1.0.0`
- **hash**: コミットハッシュ短縮7文字
  - 例: `041e30c`

**具体例**:
```
main/1.0.0/041e30c
feature_new-ui/1.0.0/f6e97f4
```

### 基本的な使い方

```bash
# 1. Maestroテスト実行（スクリーンショット取得）
bun run maestro:ios

# 2. スナップショット作成
bun run vrt:snapshot:local
# → .maestro/snapshots/main/1.0.0/041e30c/ に保存

# 3. スナップショット比較（2つの方法）

## 方法A: 現在のスクリーンショット vs 過去のスナップショット
bun run vrt:compare:local:current <expected-hash>
# 例: bun run vrt:compare:local:current 041e30c
# → 現在の .maestro/screenshots/ と過去のスナップショットを比較
# → HTMLレポートが自動で開く

## 方法B: 過去のスナップショット vs 過去のスナップショット
bun run vrt:compare:local:archived <actual-hash> <expected-hash>
# 例: bun run vrt:compare:local:archived f6e97f4 041e30c
# → 2つの過去のスナップショット同士を比較
# → HTMLレポートが自動で開く

# 4. GCSへのパブリッシュ（オプション、チーム共有用）
bun run vrt:publish:manual
# → reg-suit runコマンドが出力される
# → 出力されたコマンドを確認してコピー&実行
```

### 2つの比較方法の使い分け

| 方法 | 用途 | actual | expected |
|------|------|--------|----------|
| **方法A: current** | 開発中のUI確認 | 現在のスクリーンショット | 過去のスナップショット |
| **方法B: archived** | 過去同士の比較 | 過去のスナップショット | 過去のスナップショット |

**方法Aの使用例**:
- feature開発中に、mainブランチのスナップショットと比較
- コードを変更後、すぐにMaestro実行して差分確認

**方法Bの使用例**:
- リリース前のmain vs 前回リリースの比較
- 異なるブランチのスナップショット同士の比較

### ハッシュベースの自動検索

スナップショットは以下の構造で保存されます:

```
.maestro/snapshots/{branch}/{version}/{hash}/
```

スクリプトは`find`コマンドを使ってハッシュから自動検索するため、**ブランチ名やバージョンを指定する必要はなく、ハッシュだけで比較できます**。

**利点**:
- ブランチを切り替えても、過去のスナップショットと比較可能
- ディレクトリ構造の詳細を意識する必要がない

**ハッシュの確認方法**:
```bash
# コミットハッシュを確認
git log --oneline -5

# スナップショット一覧を表示
find .maestro/snapshots -type d -maxdepth 3
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

# 3. 比較（release が actual, main が expected）
bun run vrt:compare:local:archived <release-hash> <main-hash>
```

#### 例2: feature branchの影響範囲確認

```bash
# 1. mainでベースライン作成
git checkout main
bun run maestro:ios
bun run vrt:snapshot:local

# 2. 機能ブランチでスナップショット作成
git checkout feature/new-ui
bun run maestro:ios
bun run vrt:snapshot:local

# 3. 比較（feature が actual, main が expected）
bun run vrt:compare:local:archived <feature-hash> <main-hash>
```

#### 例3: 過去のコミットとの比較

```bash
# 1. 過去のコミットをcheckout
git checkout abc123
bun run maestro:ios
bun run vrt:snapshot:local

# 2. 現在のコミットに戻る
git checkout -
bun run maestro:ios
bun run vrt:snapshot:local

# 3. 比較
bun run vrt:compare:local:archived <current-hash> <past-hash>
```

#### 例4: 開発中の即座のUI確認（方法A）

```bash
# 1. mainのスナップショットを作成（1回だけ）
git checkout main
bun run maestro:ios
bun run vrt:snapshot:local
# main-hash を記録: 例 041e30c

# 2. featureブランチで開発
git checkout feature/new-ui

# 3. コードを変更後、Maestro実行
bun run maestro:ios

# 4. mainと比較（スナップショット作成不要）
bun run vrt:compare:local:current 041e30c

# 5. コードを修正 → 再度Maestro実行 → 比較
# スナップショット作成なしで素早く確認できる
bun run maestro:ios
bun run vrt:compare:local:current 041e30c
```

### --forceフラグの使い方

デフォルトでは、`vrt:snapshot:local` は**未コミット変更がある状態では実行できません**（再現性を保つため）。

未コミット変更がある状態でスナップショットを作成する場合:

```bash
bun run vrt:snapshot:local:force
```

**用途:**
- ローカル開発中の即座のUI確認が必要な場合
- WIP状態でもスナップショットを作成したい場合

**注意:**
- CI/CDではこのフラグを使わない（必ずコミットしてから実行）
- 再現性が失われるため、チーム共有用のベースラインには使用しない

---

### GCSへの手動パブリッシュ

ローカルで作成したスナップショットをチーム全体で共有する場合、GCSにアップロードできます。

```bash
bun run vrt:publish:manual
```

**出力例:**
```bash
# GCSに2つのキーでパブリッシュ:
# 1. ハッシュのみ（比較用）: 041e30c
# 2. フルパス（保存用）: main/1.0.0/041e30c

# コマンド1: ハッシュのみのキーでパブリッシュ
rm -rf .reg && ACTUAL_KEY=041e30c GOOGLE_APPLICATION_CREDENTIALS=./vrt-gcs-credentials.json bunx reg-suit run

# コマンド2: フルパスのキーでパブリッシュ
rm -rf .reg && ACTUAL_KEY=main/1.0.0/041e30c GOOGLE_APPLICATION_CREDENTIALS=./vrt-gcs-credentials.json bunx reg-suit run
```

**重要:**
- このコマンドは**reg-suit runコマンドを生成するだけ**で、実際のアップロードは行わない
- 出力されたコマンドを確認してから、コピー&ペーストして実行する
- 2つのキーが生成される理由は「reg-suit運用の注意点」セクションを参照

**2つのキーの使い分け:**
1. **ハッシュのみ (`041e30c`)**: CI/CDでの比較用（シンプル、検索が速い）
2. **フルパス (`main/1.0.0/041e30c`)**: 履歴管理用（後で探しやすい）

---

### 検証済み項目

- ✅ **Changed items**: 絵文字変更（✨ → 🎉）を正しく検出
- ✅ **GCSからのベースラインダウンロード**: 正常動作
- ✅ **差分画像生成**: 正常動作

---

## 🔧 reg-suit 運用の注意点

実際に運用して分かった、reg-suitを使う上での重要なポイントと設計判断。

### 1. reg-suitはまりどころ

**ローカル差分ならreg-cliで十分**:
- わざわざreg-suitを運用しなくても、reg-cliだけで差分検出は可能
- シンプルなローカル比較ならreg-cliの方が軽量

**reg-notify-github-pluginの注意点**:

GitHub ActionsのPRイベントでは**detached HEAD状態**でチェックアウトされるため、reg-notify-github-pluginがブランチ名を検出できず、PRコメントを投稿できない問題があります。

**対策**: ブランチに明示的にチェックアウトする

```yaml
# .github/workflows/vrt-pr.yml より抜粋
- name: Workaround for detached HEAD
  if: steps.check.outputs.should_run == 'true'
  run: |
    git checkout ${{ github.head_ref }}
```

このステップでブランチにチェックアウトすることで、プラグインが正常に動作します。

**参考**: [reg-notify-github-plugin README](https://github.com/reg-viz/reg-suit/blob/master/packages/reg-notify-github-plugin/README.md)

---

### 2. ローカル vs リモート運用

**現実的な運用方針**:
- **MaestroをCI/CDで組み込むのは難しい**と考えています
- Maestroをローカルで実行し、その画像をreg-suit/reg-cliで差分検出していくのが現実的
- **ローカルのマニュアル実行をしながらメンテナンスしていく**のが推奨

### 比較方法の選択肢

#### 方法1: 完全ローカル運用

**概要**:
- 各バージョンのスクリーンショット出力をローカルにコピーしながら実施
- `.maestro/snapshots/` にバージョン管理

**メリット**:
- ✅ 完全にローカルで閉じられる
- ✅ 外部サービス不要（GCS/S3不要）
- ✅ セキュリティリスクなし

**デメリット**:
- ❌ テスト対象ファイルがどんどん溜まる
- ❌ ディスク容量を消費

**推奨ケース**:
- リリースごとに任意のタイミングだけ実施する場合（そこまで膨れ上がらない）

**使用コマンド**:
```bash
# スナップショット作成
bun run vrt:snapshot:local

# 比較（2パターン用意）
bun run vrt:compare:local:current <expected-hash>
bun run vrt:compare:local:archived <actual-hash> <expected-hash>
```

---

#### 方法2: ローカル実行 + CI管理

**概要**:
- GCSやS3などを用いて、リモート環境にローカルで実施したテスト結果をアップロード
- 事前にローカルでMaestroを動かし、その結果をpush
- PR対象のブランチのスナップショットファイルと比較

**メリット**:
- ✅ CI上で確認できる
- ✅ チーム全体で共有できる
- ✅ GitHubで1つのディレクトリでスナップショットを保持

**デメリット**:
- ❌ マージ後にスナップショットを撮り直してアップロードできない（mainブランチで再実行が必要）
- ❌ アップロード先の問題（後述）が発生

**フロー**:
1. ローカルでMaestro実行
2. スナップショットを作成
3. `vrt:publish:manual`でGCS/S3にアップロード
4. PRでベースブランチと比較
5. マージ後、mainでスナップショット再作成・アップロード

**使用コマンド**:
```bash
# 1. Maestroテスト実行
bun run maestro:ios

# 2. スナップショット作成
bun run vrt:snapshot:local

# 3. GCSへのパブリッシュコマンド生成
bun run vrt:publish:manual
# → 出力されたコマンドを実行
```

**vrt:publish:manualの動作**:
- このコマンドは**reg-suit runコマンドを生成するだけ**
- 実際のアップロードは行わない（安全のため）
- 2つのGCSキー（ハッシュのみ + フルパス）を提案
- 出力されたコマンドを確認してから実行する

---

### 3. プラグイン選択: reg-keygen-git-hash vs reg-simple-keygen

**推奨**: `reg-simple-keygen-plugin` を使用

**理由**:
- ✅ 挙動が明確で制御しやすい
- ✅ 命名を自由につけられる（日付、ブランチ名、バージョン等）
- ✅ S3/GCSにアップロードする際も好きな命名が可能

**参考**:
- [reg-simple-keygen-plugin](https://github.com/reg-viz/reg-suit/blob/master/packages/reg-simple-keygen-plugin/README.md)
- [reg-keygen-git-hash-plugin](https://github.com/reg-viz/reg-suit/blob/master/packages/reg-keygen-git-hash-plugin/README.md)

**注意点**:
- 事前に期待値（baseline）をアップロードする必要がある
- mainブランチのpushをトリガーにベースラインを上げる仕組みが必要

---

### パス名設計思想

比較する際に期待値のkey名を指定する必要があるため、逆引きしやすいシンプルなkey名が望ましい。

**選択肢**:

| パターン | 例 | メリット | デメリット |
|---------|---|---------|----------|
| **ハッシュ値のみ** | `041e30c/` | シンプル、検索が速い | 後で探すときに意味が分からない |
| **ブランチ + ハッシュ** | `main/041e30c/` | ブランチが分かる | バージョンが不明 |
| **ブランチ + バージョン + ハッシュ** ⭐ | `main/1.0.0/041e30c/` | 後で探しやすい、ローカル管理しやすい | パスが長い |

**本リポジトリの選択**: `{branch}/{version}/{hash}/` ⭐

**採用理由**:
- バージョン名をつけた方が後で探すときに楽
- ローカルにコピーするときも意味のある情報でパスを切った方が管理しやすい
- パスが長くなるデメリットよりも、可読性のメリットが大きい

---

### 4. アップロード先の選択肢と問題

**選択肢の比較**:

| サービス | セキュリティ | 容量制限 | 画像表示 | 推奨度 |
|---------|------------|---------|---------|--------|
| **GCS (公開)** | ❌ DDoS攻撃リスク | なし | ✅ | △ |
| **GCS (customUri)** | △ | なし | ❌ 不可 | ❌ |
| **S3** | ✅ 非公開提供可能 | なし | ✅ | ⭐ |
| **GitHub Pages** | △ 公開必須 | 1000MB | ✅ | ○ |

---

#### GCS (Google Cloud Storage)

**問題点1: customUriでは画像表示できない**
- customUriで署名付きURLを指定すると、`index.html`が相対パスで画像を解決しているため表示できない
- セキュリティ上の問題（公開が必要）

**問題点2: allUsers公開はDDoS攻撃リスク**
- 一般公開（allUsers）にするとDDoS攻撃されるリスクがある
- コスト爆発の可能性

**参考**: [reg-publish-gcs-plugin](https://github.com/reg-viz/reg-suit/blob/master/packages/reg-publish-gcs-plugin/README.md)

---

#### S3 (Amazon S3) ⭐ 推奨

**推奨理由**:
- ✅ **一般公開せずに提供する方法がある**
- ✅ セキュリティとコストのバランスが良い

**参考**: [reg-suitとS3の非公開運用](https://blog.mmmcorp.co.jp/2023/06/05/reg-suit-s3/)

**設定方法**:
- S3バケットのパブリックアクセス設定を適切に行う
- CloudFrontと組み合わせて署名付きURLで提供

**参考**: [reg-publish-s3-plugin](https://github.com/reg-viz/reg-suit/blob/master/packages/reg-publish-s3-plugin/README.md)

---

#### GitHub Pages

**本リポジトリで採用している方法**:

**メリット**:
- ✅ 無料
- ✅ セットアップが簡単
- ✅ GitHub統合

**デメリット**:
- ❌ **1000MB制限**
- ❌ 公開必須（プライベートリポジトリでも公開される）

**対策**:
- 古いファイルを定期的に削除する運用（本リポジトリで実装済み）
- PRコメントにgcloudコマンドでのダウンロード方法を記載

```bash
# PRコメントに記載されるダウンロードコマンド例
cd apps/cool-app
rm -rf .reg
mkdir -p .reg
gsutil -m cp -r "gs://vrt-sample/main/1.0.0/041e30c" .reg
open .reg/041e30c/index.html
```

**制約**:
- 永続保存ではない（30日後に削除）
- GCSから手動でダウンロード可能（上記コマンド）

---

### 本番運用の推奨

**推奨順位**:
1. ⭐ **S3** - 非公開提供が可能、制限なし
2. ○ **GitHub Pages以外のホスティング** - Vercel, Netlify, Cloudflare Pages等
3. △ **GitHub Pages** - 無料だが1000MB制限

**ポイント**:
- `.reg`ディレクトリごとホストすれば動作する（シンプル）
- 静的ファイルホスティングなら基本的にどこでもOK
