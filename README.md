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

## 🚀 クイックスタート

> ⚠️ **開発を始める前に**: [重要な制約](#️-重要な制約)セクションを必ず確認してください。

> ⚠️ **前提条件**: Maestro実行前に、以下を**別々のターミナル**で起動しておく必要があります:
> 1. アプリのビルド: `bun run ios` または `bun run android`
> 2. Metro bundler: `bun run start`

```bash
# 依存関係インストール
bun install

cd apps/cool-app

# ターミナル1: Metro bundlerを起動（起動したまま）
bun run start

# ターミナル2: アプリをビルド・起動
bun run ios

# ターミナル3: Maestro E2Eテスト実行
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

### 0. Maestro実行前の前提条件

⚠️ **Maestroを実行する前に、以下2つを別々のターミナルで起動しておく必要があります:**

#### 必須の事前準備

**1. アプリのビルド・起動**
```bash
cd apps/cool-app
bun run ios      # expo run:ios (iOS)
# または
bun run android  # expo run:android (Android)
```

**2. Metro bundlerの起動**
```bash
cd apps/cool-app
bun run start    # expo start
```

**重要**: Metro bundlerは**別ターミナルで起動したまま**にしておく必要があります。

#### 実行順序の例

```bash
# ターミナル1: Metro bundler起動
cd apps/cool-app
bun run start
# → 起動したまま（終了しない）

# ターミナル2: アプリビルド・起動
cd apps/cool-app
bun run ios
# → シミュレータでアプリが起動

# ターミナル3: Maestro実行
cd apps/cool-app
bun run maestro:ios
```

---

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

**目的**: VRT比較時の誤検知を防ぐ

時刻やバッテリー残量は実行ごとに変わるため、ステータスバーを固定しないと毎回差分として検出されてしまいます。

| 固定なし | 固定あり |
|---------|---------|
| ❌ 時刻・バッテリー残量の差異で毎回差分検出 | ✅ UI変更のみを検出 |
| ❌ 実際のUI変更が埋もれる | ✅ 意図した変更を明確に把握 |

**自動実行**: `bun run maestro:ios` / `bun run maestro:android` で自動的に実行されます

**詳細**:
- iOS: `xcrun simctl status_bar` で9:41、バッテリー100%に固定
- Android: `adb Demo Mode` で9:41、バッテリー100%に固定

<details>
<summary>手動実行コマンド（参考）</summary>

**iOS**:
```bash
DEVICE_ID=$(xcrun simctl list devices booted | grep -o '[A-F0-9-]\{36\}' | head -1)
xcrun simctl status_bar $DEVICE_ID override \
  --time '9:41' \
  --batteryState charged \
  --batteryLevel 100 \
  --cellularMode active \
  --cellularBars 4 \
  --wifiBars 3
```

**Android**:
```bash
adb shell settings put global sysui_demo_allowed 1
adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0941
adb shell am broadcast -a com.android.systemui.demo -e command battery -e level 100 -e plugged false
adb shell am broadcast -a com.android.systemui.demo -e command network -e wifi show -e level 4
adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false
adb shell am broadcast -a com.android.systemui.demo -e command enter
```

**手動分割実行**:
```bash
bun run statusbar:ios
maestro test .maestro/app-flow.yaml
```

</details>

## 📸 VRT (Visual Regression Testing)

Maestroで取得したスクリーンショットを使用して、UIの視覚的な変更を検出するシステム。

### 🎯 設計思想

#### スナップショット命名規則

**構造**: `{branch}/{version}/{hash}`

| 要素 | 説明 | 例 |
|------|------|---|
| **branch** | ブランチ名（サニタイズ済み、`/` → `_`） | `main`, `feature_new-ui` |
| **version** | `package.json`のバージョン | `1.0.0` |
| **hash** | コミットハッシュ短縮7文字 | `041e30c` |

**具体例**:
```
main/1.0.0/041e30c
feature_new-ui/1.0.0/f6e97f4
```

**選択理由**（他パターンとの比較）:

| パターン | 例 | メリット | デメリット |
|---------|---|---------|----------|
| ハッシュのみ | `041e30c` | シンプル | 後で探しにくい |
| ブランチ+ハッシュ | `main/041e30c` | ブランチ判別可 | バージョン不明 |
| **フルパス** ⭐ | `main/1.0.0/041e30c` | 後で探しやすい、ローカル管理しやすい | パス長い |

**採用理由**:
- バージョン情報で後から探しやすい
- ローカルディレクトリ管理が容易
- パスの長さよりも可読性を優先

#### ハッシュベースの自動検索

スクリプトは`find`コマンドでハッシュから自動検索するため、**ブランチ名やバージョンを指定する必要なく、ハッシュだけで比較できます**。

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

### ⚙️ 環境設定

| 項目 | 設定値 |
|-----|-------|
| **ツール** | reg-suit + Google Cloud Storage |
| **バケット** | `vrt-sample` (asia-northeast1) |
| **認証** | `apps/cool-app/vrt-gcs-credentials.json` |
| **スナップショット保存先** | `.maestro/snapshots/` (Git管理外) |
| **差分閾値** | 0.1% (`thresholdRate: 0.001`) |
| **プラットフォーム** | iOS / Android |

**差分閾値 0.1% の選択理由**:
- アンチエイリアシング、サブピクセルレンダリングによる微小な差異を許容
- フォントレンダリングの環境差（macOS vs Linux等）を吸収
- 実際のUI変更は通常1%以上の差分になるため、0.1%で誤検知を防ぎつつ実変更を検出可能

#### 設定ファイル詳細

**regconfig.json** (`apps/cool-app/regconfig.json`)

reg-suitの設定ファイル。プロジェクトで共有される設定です。

```js
{
  "core": {
    "workingDir": ".reg",              // reg-suitの作業ディレクトリ
    "actualDir": ".maestro/screenshots", // 比較対象のスクリーンショットディレクトリ
    "thresholdRate": 0.001              // 差分閾値 0.1%
  },
  "plugins": {
    "reg-simple-keygen-plugin": {
      // スナップショットのキー管理（環境変数で指定）
      "expectedKey": "${EXPECTED_KEY}",  // ベースライン側のキー
      "actualKey": "${ACTUAL_KEY}"       // 比較対象側のキー
    },
    "reg-publish-gcs-plugin": {
      // Google Cloud Storageへのアップロード設定
      "bucketName": "vrt-sample"         // GCSバケット名
    },
    "reg-notify-github-plugin": {
      // GitHub連携（PRコメント、ステータスチェック）
      "prComment": true,                 // PRにコメント投稿
      "setCommitStatus": true            // コミットステータス設定
    }
  }
}
```

**主要設定項目**:

| 設定 | 値 | 説明 |
|------|---|------|
| `core.workingDir` | `.reg` | reg-suitの作業ディレクトリ（比較結果、レポートが保存される） |
| `core.actualDir` | `.maestro/screenshots` | 比較対象のスクリーンショット（Maestroが生成） |
| `core.thresholdRate` | `0.001` | 差分閾値 0.1%（微小な差異を許容） |
| [`plugins.reg-simple-keygen-plugin`](https://github.com/reg-viz/reg-suit/tree/master/packages/reg-simple-keygen-plugin) | - | スナップショットのキー管理（フルパス形式） |
| [`plugins.reg-publish-gcs-plugin`](https://github.com/reg-viz/reg-suit/tree/master/packages/reg-publish-gcs-plugin) | - | GCSへのアップロード設定 |
| [`plugins.reg-notify-github-plugin`](https://github.com/reg-viz/reg-suit/tree/master/packages/reg-notify-github-plugin) | - | GitHub連携（PRコメント、ステータスチェック） |

---

**vrt-gcs-credentials.json** (`apps/cool-app/vrt-gcs-credentials.json`)

⚠️ **運用上ほぼ不要なファイルです**

GCS（Google Cloud Storage）のサービスアカウント認証情報ですが、**実際の運用ではほとんど使用しません**。

**不要な理由**:
- ✅ **CI/CDではGitHub Actions Secretsで管理**
  - GitHub Actionsで`VRT_GCS_CREDENTIALS_JSON`として安全に管理
  - ローカルにクレデンシャルファイルを置く必要がない
- ✅ **ローカルからのマニュアルpublishは基本不要**
  - VRT運用はCI/CD中心（PR作成時、mainマージ時に自動実行）
  - ローカルでは`vrt:snapshot:local`と`vrt:compare:local:*`で完結

**唯一必要になるケース**:
- ローカルからGCSに手動でスナップショットをアップロードする場合
- ただし**基本的に非推奨**（CI/CD経由を推奨）

**実際の運用方針**:
```bash
# ✅ 推奨: ローカルはローカルで完結
bun run vrt:snapshot:local
bun run vrt:compare:local:current <expected-hash>

# ❌ 非推奨: ローカルからGCSにマニュアルpublish
# （vrt-gcs-credentials.jsonが必要）
bun run vrt:publish:manual
```

**CI/CDでの使用方法**:
```yaml
# .github/workflows/vrt-pr.yml
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v3
  with:
    credentials_json: '${{ secrets.VRT_GCS_CREDENTIALS_JSON }}'
```

GitHub Actions Secretsに`VRT_GCS_CREDENTIALS_JSON`を設定することで、ローカルファイルは不要になります。

---

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

### 📋 基本ワークフロー

**共通手順**:
```bash
# 1. Maestroテスト実行（スクリーンショット取得）
bun run maestro:ios

# 2. スナップショット作成
bun run vrt:snapshot:local
# → .maestro/snapshots/main/1.0.0/041e30c/ に保存
```

#### パターンA: 開発中の即座確認

**用途**: スナップショット作成不要で素早くUI確認

**コマンド**:
```bash
bun run vrt:compare:local:current <expected-hash>
# 例: bun run vrt:compare:local:current 041e30c
```

**ユースケース**:
- feature開発中に、mainブランチのスナップショットと比較
- コード変更後、すぐにMaestro実行して差分確認

#### パターンB: 過去スナップショット同士の比較

**用途**: 異なるブランチ/バージョン間の比較

**コマンド**:
```bash
bun run vrt:compare:local:archived <actual-hash> <expected-hash>
# 例: bun run vrt:compare:local:archived f6e97f4 041e30c
```

**ユースケース**:
- リリース前のmain vs 前回リリースの比較
- 異なるブランチのスナップショット同士の比較

### 💡 実践例

**基本パターン（過去同士の比較）**:
```bash
# 1. ベースラインブランチでスナップショット作成
git checkout <base-branch>
bun run maestro:ios
bun run vrt:snapshot:local

# 2. 比較対象ブランチでスナップショット作成
git checkout <target-branch>
bun run maestro:ios
bun run vrt:snapshot:local

# 3. 比較実行
bun run vrt:compare:local:archived <target-hash> <base-hash>
```

---

**開発中の即座確認（方法A）**:

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

### 🔧 詳細設定

#### --forceフラグの使い方

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

#### GCSへの手動パブリッシュ

ローカルで作成したスナップショットをチーム全体で共有する場合、GCSにアップロードできます。

```bash
bun run vrt:publish:manual
```

**出力例:**
```bash
# GCSにフルパス形式でパブリッシュ:
# main/1.0.0/041e30c

rm -rf .reg && ACTUAL_KEY=main/1.0.0/041e30c GOOGLE_APPLICATION_CREDENTIALS=./vrt-gcs-credentials.json bunx reg-suit run
```

**重要:**
- このコマンドは**reg-suit runコマンドを生成するだけ**で、実際のアップロードは行わない
- 出力されたコマンドを確認してから、コピー&ペーストして実行する
- このプロジェクトの命名規則については[スナップショット命名規則](#スナップショット命名規則)を参照

#### 検証済み項目

- ✅ **Changed items**: 絵文字変更（✨ → 🎉）を正しく検出
- ✅ **GCSからのベースラインダウンロード**: 正常動作
- ✅ **差分画像生成**: 正常動作

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

**Note**: `vrt:publish:manual`の詳細は[GCSへの手動パブリッシュ](#gcsへの手動パブリッシュ)を参照してください。

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
- パス名設計思想については[スナップショット命名規則](#スナップショット命名規則)を参照

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
