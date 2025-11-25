# Expo Maestro + VRT 検証リポジトリ

Maestro E2EテストとVisual Regression Testing (VRT) の検証用リポジトリ。

---

## 1. はじめに

### 必須ツール

[mise](https://mise.jdx.dev/)でツールを管理しています。

```bash
# miseがインストールされていない場合
brew install mise

# ツールをインストール（mise.tomlに基づく）
mise install
```

**mise.tomlで管理されるツール**:
- Node.js
- Bun
- Maestro CLI
- Java (temurin-21) ※Maestro実行に必要

### プロジェクト構成

```
expo-maestro-sample/
├── apps/
│   └── cool-app/          # メインアプリ（Expo + Maestro + VRT）
└── packages/
    └── cool-package/      # 共有パッケージ
```

Monorepo構成（Bun workspaces）

---

## 2. VRTとE2Eテストに関する考察

本リポジトリでMaestro + VRTを検証した結果、いくつかの重要な知見を得ました。

### 2.1 結論

#### Maestroの価値

Maestroはモバイルアプリ開発において価値のあるツール：

- **E2Eテストの敷居を下げた**: ネイティブのXCTest/Espressoと比べ、導入・学習コストが低い
- **YAMLベースで直感的**: プログラミング言語を書かずにテストを記述できる
- **クロスプラットフォーム対応**: 同じFlowでiOS/Android両方をテスト可能
- **Studioによる視覚的開発**: テストの作成・デバッグがしやすい

#### VRTとの組み合わせ

ただし、VRTとの組み合わせには注意が必要。

VRTに最適なのは**UIカタログツール（Storybook等）** であり、E2Eテスト（Maestro）でVRTを行う場合は**ローカル実行 + リモートブランチ比較**が現実的な落としどころです。

### 2.2 VRTとE2Eの相性問題

#### UIカタログ（Storybook等）とVRT: ✅ 相性が良い

- 状態を固定してコンポーネントを表示できる
- 画面遷移なしで直接コンポーネントを表示
- レンダリングが安定している
- テストの独立性が高い

#### E2Eテスト（Maestro）とVRT: 注意が必要

- **目的の画面まで操作が必要**: 複数ステップの遷移が必要な場合、テストが複雑化
- **実行速度が遅い**: Maestroの実行はそこまで高速ではない
- **メンテナンスコスト**: 仕様変更でフローが変わると、大きな修正が必要
- **環境差異の影響**: スクロールバー、端末差異、デバイスの違いで結果が不安定
- **状態管理の困難さ**: 状態を持つアプリではテストの独立性確保が非常に難しい

### 2.3 CI/CDに組み込む難しさ

E2E + VRTをCI/CDに組み込んでも安定しない理由：

- スクロールバーの表示/非表示タイミング
- 端末・デバイスの影響（シミュレータのバージョン差異など）
- 実行環境の差異（ローカル vs CI環境）
- レスポンスタイミングの揺らぎ

**結論**: E2E + VRTはCI/CDでの自動実行よりも、**ローカル実行 + リモートブランチ比較**が現実的。レコーディング（動画）の確認用途の方がユースケースとして適している。

### 2.4 Maestroで担保すべき範囲

テストツールごとの役割分担を意識することが重要：

| ツール | 担保すべき範囲 | VRT適性 |
|--------|--------------|---------|
| **Storybook等** | UIコンポーネントの見た目 | ✅ 最適 |
| **Playwright（Web）** | Webアプリの画面・操作 | ○ 比較的安定 |
| **Maestro（モバイル）** | 基本的な画面遷移・操作の確認 | △ 限定的 |

Maestroは**スモークテスト的な用途**（アプリが起動する、基本操作ができる）に留め、詳細なUIテストはUIカタログツールに任せるのが現実的。

### 2.5 E2Eテストの2つのアプローチ

E2Eテストには大きく2つのアプローチがあり、それぞれ適したテスト範囲が異なる：

| アプローチ | テスト範囲 | 安定性 | 用途 |
|-----------|-----------|--------|------|
| **Mock使用E2E** | 複雑な遷移もOK | 高（レスポンス安定） | 詳細なフローテスト |
| **本番環境E2E** | 基本操作のみ | 低（環境依存） | スモークテスト |

**Mock使用E2E**:
- APIレスポンスをモック化し、決定論的なテストが可能
- 複雑な画面遷移や状態遷移もテスト可能
- ただし、モックのメンテナンスコストが発生

**本番環境E2E**:
- 実際のAPIを使用するため、環境依存性が高い
- 基本的な操作（起動、ログイン、主要画面表示）程度に留める
- 詳細なテストは担保できないと割り切る

### 2.6 アーキテクチャの重要性

E2Eテストで独立性を保つには、アプリケーションのアーキテクチャが重要：

**推奨アーキテクチャ**:
- オニオンアーキテクチャ
- レイヤードアーキテクチャ
- クリーンアーキテクチャ

**ポイント**:
- 機能別ではなく**レイヤー別**にディレクトリを切る
- APIクライアントの**差し替え可能性**を確保
- テスト時にモックを注入できる構造

これにより、E2Eテスト時にAPIモックを差し込み、安定したテストが実現できる。

### 2.7 MaestroとCI/CD

CI/CDで運用する場合は考慮すべき点がある。

#### Maestro Cloudの料金問題

MaestroをCI/CDで安定して動かすには[Maestro Cloud](https://cloud.mobile.dev/)が必要だが、**月額$250〜**と高額で、気軽に採用できる価格ではない。

#### ローカル実行が前提

結果として、Maestroは**ローカルで動かすことが前提**となる：

- QAのサポートツールとしては有用
- ただし、CI/CDでのメイン運用には向かない
- 遷移が完了しない、テストがうまく終わらないなどの不安定さがある

#### Maestroの適切な用途

**向いている用途**:
- ✅ ローカルでの動作確認
- ✅ レコーディング（動画）による動作検証
- ✅ QAチームへのデモ・確認用

**注意が必要な用途**:
- CI/CDでの自動テスト（Maestro Cloudなしでは不安定になりやすい）
- 本番デプロイのゲート（安定性の観点から慎重に検討）

### 2.8 Maestroの速度について

**Maestroの実行速度には特性がある。**

#### ネイティブテストとの比較

ネイティブのテストフレームワーク（XCTest、Espresso）と比較すると、Maestroには速度差がある：

- XCTestはSwiftでネイティブに実行されるため高速
- Maestroは外部からアプリを操作するため、オーバーヘッドがある
- 複数のテストケースを実行すると、時間差が顕著になる

#### 開発体験の差

**XCTestのレコーディング機能**:
- Xcode上でUIを操作しながらテストコードが自動生成される
- 非常に直感的で高速な開発体験

**Maestro Studio**:
- FlowのYAMLを視覚的に確認しながら開発できる
- 便利ではあるが、XCTestのレコーディング体験には遠く及ばない
- 動作速度も速くない

#### 結論

ネイティブテストと比較すると速度差があるが、これは**E2Eテストの手軽さとのトレードオフ**。

### 2.9 本リポジトリの選択

以上の考察を踏まえ、本リポジトリでは以下のアプローチを採用：

- **VRT実行**: ローカルで`vrt:compare:remote-branch:maestro`（または`:playwright`）を使用
- **CI/CD**: VRTはCI/CDに組み込まず、必要に応じてローカルで確認
- **Maestroの用途**: 基本的な画面遷移の確認、レコーディングによる動作確認

---

## 3. Maestro（E2Eテスト）

### 3.1 クイックスタート

```bash
bun install
cd apps/cool-app

# ターミナル1: Metro bundler起動（起動したまま）
bun run start

# ターミナル2: アプリビルド・起動
bun run ios

# ターミナル3: Maestroセットアップ（初回のみ）& テスト実行
bun run maestro:setup  # 初回のみ
bun run maestro:ios
```

### 3.2 Maestro 重要な注意点

開発を始める前に、以下の制約を理解しておく必要があります。

#### 3.2.1 Maestro実行前の前提条件

Maestroを実行する前に、以下2つを**別々のターミナル**で起動しておく必要があります。

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

---

#### 3.2.2 初回セットアップ: ディレクトリ構造の準備

Maestro実行前に、スクリーンショット・録画用のディレクトリを作成しておくことを推奨します。

```bash
cd apps/cool-app
bun run maestro:setup
```

**なぜ必要？**

**理由1: Maestro CLIがディレクトリの自動作成をしない**

`maestro test`でスクリーンショットや録画を保存しようとすると、**保存先ディレクトリが存在しない場合にエラーで失敗する**。

**エラー例**:
```yaml
# .maestro/app-flow.yaml
- takeScreenshot: .maestro/screenshots/ios/home.png
```

上記を実行すると、`.maestro/screenshots/ios/`ディレクトリが存在しない場合：
```
Error: Directory not found: .maestro/screenshots/ios/
```

**理由2: Maestro Studioのパス問題**

Maestro StudioからFlowを実行すると、スクリーンショット・録画が誤ったパスに保存される。
- 正しいパス: `.maestro/screenshots/ios/xxx.png`
- 誤ったパス: `.maestro/screenshots/.maestro/screenshots/ios/xxx.png`（二重パス）

事前に誤ったパスのディレクトリも作成しておくことで、Studio実行時のエラーを防ぐ（誤ったパスは`.gitignore`で除外済み）。

**作成されるディレクトリ**:
```
.maestro/
├── screenshots/
│   ├── android/
│   ├── ios/
│   └── .maestro/          # Studioの誤ったパス用（.gitignore済み）
│       └── screenshots/
│           ├── android/
│           └── ios/
└── records/
    ├── android/
    └── ios/
```

**運用方針**:
- **CLI**: 正式なテスト実行環境（スクリーンショットはgit管理）
- **Studio**: テスト作成・デバッグの補助ツール（スクリーンショットは無視）

---

#### 3.2.3 Maestro StudioとCLIの同時使用不可

**Maestro Studioは非常に便利なツールです**:
- ✅ テストシナリオ（Flow YAML）の作成に最適
- ✅ シナリオの動作確認・デバッグに便利
- ✅ 視覚的にFlowを確認しながら開発できる

**ただし、重要な制約があります**:
- ⚠️ **Maestro Studioを起動したまま、iOS/AndroidのCLIテストを実行できない**
- Maestro Studioが起動していると、**CLIで`launchApp`が機能しない**
- 両者が同じポート7001を使用するため競合する

**対策**:
1. Maestro Studioを**完全に終了**する
2. その後、CLIテストを実行する

```bash
# ❌ NG: Studioを起動したままCLI実行
# （Studioが起動している状態で）
bun run maestro:ios    # → launchAppが失敗

# ✅ OK: Studioを完全に終了してからCLI実行
# 1. Maestro Studioを終了
# 2. その後実行
bun run maestro:ios    # → 正常に動作
```

**推奨ワークフロー**:
1. **Maestro Studio**: Flow YAMLの作成・編集・動作確認
2. **Studio終了**: 完全に終了
3. **Maestro CLI**: 正式なテスト実行（VRT用スクリーンショット取得など）

**参考**: [GitHub Issue #1927](https://github.com/mobile-dev-inc/maestro/issues/1927)

---

#### 3.2.4 Maestro CLIの並列実行不可

複数のMaestro CLIインスタンスを同時実行できません。すべてのインスタンスがポート7001を使用するため競合します。

**対策**: `&&` で順次実行
```bash
bun run maestro:ios && bun run maestro:android
```

---

#### 3.2.5 iOS物理デバイス非対応

Maestroは現時点でiOSの物理デバイスをサポートしていません。
- iOSテストはシミュレータのみで実行可能
- Androidは物理デバイスでも実行可能

**参考**: [Maestro: Connecting to your device](https://docs.maestro.dev/getting-started/installing-maestro#connecting-to-your-device)

---

#### 3.2.6 iOS: accessibilityLabel必須

**問題**: iOSではaccessibilityLabelを設定しないとMaestroが要素を認識できない。

**対象要素**:
- タブナビゲーション
- ボタン
- その他インタラクティブな要素

**対策**: React NativeのaccessibilityLabel属性を使用

```tsx
<TouchableOpacity accessibilityLabel="ホーム">
  <Text>ホーム</Text>
</TouchableOpacity>
```

**参考**:
- [React Native: Accessibility](https://reactnative.dev/docs/accessibility#accessibilitylabel)
- [Maestro: iOS UIKit Support](https://docs.maestro.dev/platform-support/ios-uikit)

---

#### 3.2.7 スクリーンショットパスの指定方法

**パス解釈ルール**:
- パスはプロジェクトルートからの相対パスとして解釈される
- 拡張子なしで指定すると自動的に`.png`が付加される

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

#### 3.2.8 maestro.platformを使った動的パス生成

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

#### 3.2.9 when条件はrunFlowとrunScriptでのみ使用可能

**制約**: プラットフォーム分岐（`when: platform: android/ios`）を使いたい場合、必ず`runFlow`または`runScript`で囲む必要がある。`takeScreenshot`、`tapOn`、`assertVisible`などの通常コマンドに直接`when`は使えない。

```yaml
# ❌ 間違った例（これはエラーになる）
- takeScreenshot: xxx
  when:
    platform: ios

# ✅ 正しい例
- runFlow:
    when:
      platform: ios
    commands:
      - takeScreenshot: xxx
```

**参考**: [Maestro: Conditions](https://docs.maestro.dev/advanced/conditions)

---

#### 3.2.10 録画機能

Maestroには2つの録画方法がありますが、それぞれ制約があります。

**方法1: `maestro record` CLI（非推奨）**

```bash
maestro record --local YourFlow.yaml
```

**制約**:
- `--local` でローカル保存がデフォルト
- ❌ **保存先を指定できない**
- 保存先: `~/.maestro/tests/2025-11-24_095829/maestro-recording.mp4` のような固定パス
- ❌ **動画の書き出しが非常に遅い**（2分の録画に10分かかることも）

**参考**: [Maestro: Recording your Flow](https://docs.maestro.dev/cli/recording-your-flow)

---

**方法2: Flow内で `startRecording` / `stopRecording`（推奨）⭐**

通常の `maestro test` で実行。

**Flow YAMLの例**:
```yaml
appId: com.example.app
---
# 録画開始
- startRecording: .maestro/records/${output.platform}/demo-flow

# テスト実行
- tapOn: "ボタン"
- assertVisible: "成功メッセージ"

# 録画停止
- stopRecording
```

**メリット**:
- ✅ **保存先を指定できる**（`.maestro/records/ios/demo-flow.mp4` など）
- ✅ プラットフォーム別に動的パス生成可能（`${output.platform}`）
- ✅ 通常のテスト実行と同時に録画
- ✅ 書き出し速度が実用的

**参考**:
- [startRecording](https://docs.maestro.dev/api-reference/commands/startrecording)
- [stopRecording](https://docs.maestro.dev/api-reference/commands/stoprecording)

---

#### 3.2.11 VRT向けステータスバー固定

**目的**: VRT比較時の誤検知を防ぐ

時刻やバッテリー残量は実行ごとに変わるため、ステータスバーを固定しないと毎回差分として検出されてしまいます。

**自動実行**: `bun run maestro:ios` / `bun run maestro:android` で自動的に実行されます。
時刻9:41、バッテリー100%に固定。

<details>
<summary>手動実行コマンド（参考）</summary>

**iOS**:
```bash
DEVICE_ID=$(xcrun simctl list devices booted | grep -o '[A-F0-9-]\{36\}' | head -1)
xcrun simctl status_bar $DEVICE_ID override \
  --time '9:41' \
  --dataNetwork wifi \
  --wifiMode active \
  --wifiBars 3 \
  --operatorName "" \
  --batteryState charged \
  --batteryLevel 100 \
  --cellularMode active \
  --cellularBars 4
```

**Android**:
```bash
adb shell settings put global sysui_demo_allowed 1
adb shell am broadcast -a com.android.systemui.demo -e command enter
adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0941
adb shell am broadcast -a com.android.systemui.demo -e command battery -e level 100 -e plugged false
adb shell am broadcast -a com.android.systemui.demo -e command network -e wifi show -e level 4
adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e datatype none -e level 4
adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false
```

</details>

---

## 3.3 Playwright（Web E2E）

Expo WebアプリのE2Eテスト用にPlaywrightを使用しています。

### クイックスタート

```bash
cd apps/cool-app

# 初回セットアップ
bun run playwright:setup   # ディレクトリ作成
bun run playwright:install # Chromiumインストール

# テスト実行（Webサーバー自動起動）
bun run playwright:web
```

### コマンド一覧

| コマンド | 説明 | 用途 |
|---------|------|------|
| `playwright:setup` | スクリーンショット用ディレクトリ作成 | 初回のみ |
| `playwright:install` | Chromiumブラウザをインストール | 初回・CI環境 |
| `playwright:web` | テスト実行（ヘッドレス） | 通常のテスト実行 |
| `playwright:web:headed` | テスト実行（ブラウザ表示） | 動作確認・デバッグ |
| `playwright:web:ui` | UIモードでテスト実行 | テスト開発・デバッグ |

### Maestroとの比較

| 項目 | Maestro | Playwright |
|------|---------|------------|
| 対象 | iOS/Android（モバイル） | Web（ブラウザ） |
| 設定形式 | YAML | TypeScript |
| テストファイル | `.maestro/app-flow.yaml` | `e2e/*.spec.ts` |
| スクリーンショット | `.maestro/screenshots/{ios,android}/` | `e2e/screenshots/web/` |
| VRTコマンド | `vrt:compare:remote-branch:maestro` | `vrt:compare:remote-branch:playwright` |
| CI/CD実行 | シミュレータ/エミュレータ必要 | ヘッドレスブラウザで簡単 |
| 実行速度 | 遅め | 高速 |

### ディレクトリ構成

```
apps/cool-app/
├── .maestro/                    # Maestro（モバイル）
│   ├── app-flow.yaml
│   └── screenshots/{ios,android}/
├── e2e/                         # Playwright（Web）
│   ├── home.spec.ts            # テストファイル
│   └── screenshots/web/         # VRT用スクリーンショット
└── playwright.config.ts         # Playwright設定
```

### playwright.config.ts の主要設定

```typescript
export default defineConfig({
  testDir: "./e2e",              // テストファイルの場所
  outputDir: "./e2e/test-results", // テスト結果出力先

  webServer: {
    command: "bun run web",      // Expo Web起動
    url: "http://localhost:8081",
    reuseExistingServer: !process.env.CI, // ローカル: 既存サーバー再利用
    timeout: 120 * 1000,         // Expo起動待ち（2分）
  },

  projects: [{
    name: "web",
    use: {
      viewport: { width: 1280, height: 720 }, // VRT用固定サイズ
    },
  }],
});
```

### VRT実行

```bash
# テスト実行（スクリーンショット取得）
bun run playwright:web

# mainブランチと比較
bun run vrt:compare:remote-branch:playwright
```

**注意**: リモートブランチに`e2e/screenshots/`がコミットされている必要があります。

### GitHub Actions（CI/CD）

PlaywrightもCI/CDで自動実行されます。

| ワークフロー | 説明 |
|-------------|------|
| `vrt-pr.yml` | PR作成時にPlaywrightテストを実行し、mainブランチと比較 |
| `vrt-baseline.yml` | mainマージ時に新ベースラインをGCSに保存 |

**特徴**:
- CI環境でPlaywrightテストを実行し、スクリーンショットを自動生成
- Maestro（モバイル）と並列で実行されるため、CI時間への影響は最小限
- ヘッドレスブラウザで安定した結果を得やすい

詳細は「4.2 リモートVRT」を参照。

---

## 4. VRT（Visual Regression Testing）

### 4.1 VRTの3つの課題

VRTを導入する際に解決すべき課題:

| 課題 | 問題 | 本リポジトリの解決策 |
|------|------|---------------------|
| **1. ローカル or リモート** | どこで比較を実行？ | 両方対応（ローカル: reg-cli、リモート: reg-suit） |
| **2. 期待値の管理** | ベースラインをどう保存？ | Git管理（リモートブランチから取得）またはローカルアーカイブ |
| **3. レポートのホスティング** | 差分レポートをどこで見る？ | ローカル: ブラウザ / リモート: GitHub Pages |

---

### 4.2 リモートVRT（REG Suite + CI/CD）

> **参考情報**: 本リポジトリでは4.3のローカルVRTを推奨しています。CI/CDでの自動化を検討する場合の参考として記載。

CI/CDで自動実行し、PRでレポートを確認する方式。

#### 概要

| 項目 | 設定値 |
|------|--------|
| ツール | reg-suit + Google Cloud Storage |
| 対象 | Maestro（モバイル）+ Playwright（Web）の両方 |
| 実行タイミング | PR作成時、mainマージ時 |
| レポート | GitHub Pages（本リポジトリ） |

#### CI/CDワークフロー

| ワークフロー | トリガー | Maestro | Playwright |
|-------------|---------|---------|------------|
| `vrt-pr.yml` | PR作成・更新時 | mainと比較、PRコメント | mainと比較、PRコメント |
| `vrt-baseline.yml` | mainマージ時 | GCSに保存 | GCSに保存 |
| `cleanup-vrt-reports.yml` | 毎週日曜 | レポート削除 | レポート削除 |

**ジョブ構成**:
- `maestro-vrt` / `maestro-baseline`: モバイルスクリーンショット（`.maestro/screenshots/`）
- `playwright-vrt` / `playwright-baseline`: Webスクリーンショット（`e2e/screenshots/`）
- 両ジョブは**並列実行**されるため、CI時間は増加しない

#### GCSパス構造

```
gs://vrt-sample/
└── {branch}/{version}/{hash}/
    ├── maestro/      # Maestro（モバイル）
    └── playwright/   # Playwright（Web）
```

**例**: `main/1.0.0/abc1234/maestro`, `main/1.0.0/abc1234/playwright`

#### ホスティング選択肢と課題

| サービス | セキュリティ | 推奨度 | 備考 |
|---------|------------|--------|------|
| **S3** | 非公開可能 | ★★★ | 署名付きURLで提供可能。[参考](https://blog.mmmcorp.co.jp/2023/06/05/reg-suit-s3/) |
| **GCS** | 非公開困難 | ★☆☆ | customUriでは画像表示不可、公開だとDDoSリスク |
| **GitHub Pages** | 公開必須 | ★★☆ | 本リポジトリで採用。無料だが1GB制限 |

**GCSの課題**:
- `customUri`で署名付きURLを指定すると、`index.html`が相対パスで画像を解決するため表示できない
- `allUsers`公開にするとDDoS攻撃リスク・コスト爆発の可能性

**本リポジトリの選択**: GitHub Pages
- 理由: 無料、セットアップ簡単、GitHub統合
- 対策: 30日後に古いレポートを自動削除

---

### 4.3 ローカルVRT（REG CLI）

ローカルで即座にUI変更を確認する方式。クラウドストレージ不要。

#### 3つの比較方法

| コマンド | 比較対象 | アーカイブ管理 | 推奨度 |
|---------|---------|--------------|--------|
| **vrt:compare:remote-branch:maestro** | 現在 vs Gitリモートブランチ（モバイル） | **不要** | ★★★ |
| **vrt:compare:remote-branch:playwright** | 現在 vs Gitリモートブランチ（Web） | **不要** | ★★★ |
| vrt:compare:local:current | 現在 vs ローカルアーカイブ | 必要 | ★★☆ |
| vrt:compare:local:archived | アーカイブ vs アーカイブ | 必要 | ★☆☆ |

**推奨**: `vrt:compare:remote-branch:*` が最もシンプル

```bash
# Maestro（モバイル）
bun run maestro:ios
bun run vrt:compare:remote-branch:maestro
# → デフォルトブランチ（main）と自動比較

# Playwright（Web）
bun run playwright:web
bun run vrt:compare:remote-branch:playwright
# → デフォルトブランチ（main）と自動比較

# ブランチを指定する場合
bun run vrt:compare:remote-branch:maestro -- --branch feature/xxx
bun run vrt:compare:remote-branch:playwright -- --branch develop
```

**直接実行**（より柔軟）:
```bash
bun run scripts/vrt-compare-remote-branch.ts --mode maestro
bun run scripts/vrt-compare-remote-branch.ts --mode maestro --branch feature/xxx
bun run scripts/vrt-compare-remote-branch.ts --mode playwright --branch main
```

**重要**:
- `vrt:compare:remote-branch:*`は**Gitリポジトリのリモートブランチ**から直接スクリーンショットを取得
- **GCS/S3などのクラウドストレージは一切使用しない**
- 追加コスト、セキュリティリスク、インフラ管理の複雑性を完全に回避

---

#### 試行錯誤の経緯

ローカルVRTで最適な方法を模索した経緯:

##### Phase 1: アーカイブ同士の比較

```bash
# 1. mainでアーカイブ作成
git checkout main
bun run maestro:ios
bun run vrt:archive:local  # → main/1.0.0/abc1234

# 2. featureでアーカイブ作成
git checkout feature/xxx
bun run maestro:ios
bun run vrt:archive:local  # → feature_xxx/1.0.0/def5678

# 3. 比較
bun run vrt:compare:local:archived def5678 abc1234
```

**結果**: ❌ 面倒
- 両方のブランチでアーカイブ作成が必要
- ハッシュの管理が煩雑

##### Phase 2: スクリーンショット vs アーカイブ

```bash
# 1. mainでアーカイブ作成（1回だけ）
git checkout main
bun run maestro:ios
bun run vrt:archive:local  # → main/1.0.0/abc1234

# 2. featureで開発
git checkout feature/xxx
bun run maestro:ios

# 3. 現在のスクリーンショットとアーカイブを比較
bun run vrt:compare:local:current abc1234
```

**結果**: △ まだ面倒
- mainのアーカイブを事前に作成・管理する必要
- ハッシュを覚えておく必要がある

##### Phase 3: リモートブランチ比較 ★推奨

```bash
# featureブランチで開発
git checkout feature/xxx

# Maestroテスト実行
bun run maestro:ios

# mainブランチと比較（アーカイブ管理不要！）
bun run vrt:compare:remote-branch
# → git fetchでmainの最新スクリーンショットを取得して比較
```

**結果**: ✅ これが楽！
- ローカルアーカイブの管理が不要
- ハッシュを覚える必要なし
- mainブランチにスクリーンショットがpushされていれば即比較可能
- キャッシュ機能で2回目以降は高速

**結論**: 基本的には `vrt:compare:remote-branch:maestro` / `vrt:compare:remote-branch:playwright` を使う

---

### 4.4 VRTのベストプラクティス

VRTで誤検知を防ぐため、以下の対策を実施しています。

#### ステータスバー固定

`bun run maestro:ios` / `bun run maestro:android` で自動実行。
時刻・バッテリー残量の差異による誤検知を防止。

#### スクロールバーフェード待機

**問題**: スクロールバーの表示/非表示状態がランダムに変わり、VRT差分として誤検知される。

**対策**: `extendedWaitUntil` + `optional: true` のダミー要素トリック

```yaml
# スクロールバーフェード待機パターン（スクリーンショット取得直前）
- waitForAnimationToEnd
# スクロールバーフェード待機（3秒固定）
- extendedWaitUntil:
    visible: "SCROLLBAR_FADE_WAIT_DUMMY"
    timeout: 3000
    optional: true
- takeScreenshot: path/to/screenshot
```

**注意**: このパターンは**Maestro非推奨**です。

Maestroは"artificial wait blocks"を設計思想として避けていますが、スクロールバーはシステムレベルのUI要素で直接検出できないため、この方法を採用しています。

**Maestroの設計思想**:
> "By design, Maestro highly discourages a pattern of introducing artificial wait blocks as we believe that Maestro is already handling that reasonably well."

しかし、VRT用途では以下の理由から固定wait（ダミー要素トリック）が必要:
- スクロールバーにはtext、id、accessibilityLabelがない
- `waitForAnimationToEnd`ではスクロールバーフェードを検出できない
- iOS/Androidのスクロールバー自動フェード（300ms〜3秒）を確実に待つ必要がある

**参考**:
- [Maestro Issue #1542: Feature Request - Wait/Sleep command](https://github.com/mobile-dev-inc/maestro/issues/1542)
- [Maestro Issue #1592: Add delay between steps](https://github.com/mobile-dev-inc/maestro/issues/1592)
- [Maestro Documentation: extendedWaitUntil](https://docs.maestro.dev/api-reference/commands/extendedwaituntil)

#### カーソル対策

**問題**: カーソルの点滅がVRT差分として検出される。

**対策**: 入力フィールド以外をタップしてフォーカスを解除 + ダミー要素トリックで完全停止を待つ

```yaml
# テキスト入力後の推奨パターン
- tapOn:
    id: "input-field"
- inputText: "テキスト"
- hideKeyboard
- tapOn: "ページタイトル"  # フォーカス解除
- waitForAnimationToEnd
# カーソルブリンク完全停止待機（3秒固定）
- extendedWaitUntil:
    visible: "CURSOR_BLINK_WAIT_DUMMY"
    timeout: 3000
    optional: true
- takeScreenshot: path/to/screenshot
```

**注意**: tapOnだけではカーソルブリンクが即座に停止しないため、3秒待機が必要です。ダミー要素トリックはMaestro非推奨パターンですが、カーソルブリンクは直接検出できないため使用しています。

#### 差分閾値

- `thresholdRate: 0.001`（0.1%）
- アンチエイリアシング、サブピクセルレンダリングなどの微小差異を許容
- フォントレンダリングの環境差（macOS vs Linux等）を吸収
- 実際のUI変更を確実に検出しつつ、ノイズレベルの差異は無視

---

## 5. 補足資料

### 用語定義

| 用語 | 意味 | 保存場所 |
|------|------|----------|
| **スクリーンショット** | Maestroが生成する画像 | `.maestro/screenshots/` |
| **スクリーンショットアーカイブ** | 版管理された基準画像 | `.maestro/screenshots-archive/` |

**ワークフロー**:
1. Maestroテスト実行 → **スクリーンショット**生成（`.maestro/screenshots/`）
2. スクリーンショットアーカイブ作成 → **スクリーンショットアーカイブ**保存（`.maestro/screenshots-archive/{branch}/{version}/{hash}/`）
3. VRT比較 → スクリーンショット vs スクリーンショットアーカイブ、またはスクリーンショットアーカイブ同士

### スクリーンショットアーカイブ命名規則

**構造**: `{branch}/{version}/{hash}`

| 要素 | 説明 | 例 |
|------|------|---|
| **branch** | ブランチ名（サニタイズ済み、`/` → `_`） | `main`, `feature_new-ui` |
| **version** | `package.json`のバージョン | `1.0.0` |
| **hash** | コミットハッシュ短縮7文字 | `041e30c` |

**具体例**: `main/1.0.0/041e30c`, `feature_new-ui/1.0.0/f6e97f4`

**他パターンとの比較**:

| パターン | 例 | メリット | デメリット |
|---------|---|---------|----------|
| ハッシュのみ | `041e30c` | シンプル | 後で探しにくい |
| ブランチ+ハッシュ | `main/041e30c` | ブランチ判別可 | バージョン不明 |
| **フルパス** ⭐ | `main/1.0.0/041e30c` | 後で探しやすい、ローカル管理しやすい | パス長い |

**採用理由**:
- バージョン情報で後から探しやすい
- ローカルディレクトリ管理が容易
- パスの長さよりも可読性を優先

**ハッシュベースの自動検索**:
スクリプトは`find`コマンドでハッシュから自動検索するため、**ブランチ名やバージョンを指定する必要なく、ハッシュだけで比較できます**。

```bash
# コミットハッシュを確認
git log --oneline -5

# スクリーンショットアーカイブ一覧を表示
find .maestro/screenshots-archive -type d -maxdepth 3
```

### reg-suit運用の注意点

#### ローカル差分ならreg-cliで十分

わざわざreg-suitを運用しなくても、reg-cliだけで差分検出は可能です。シンプルなローカル比較ならreg-cliの方が軽量です。

#### reg-notify-github-pluginの注意点

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

#### プラグイン選択: reg-keygen-git-hash vs reg-simple-keygen

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

### 設定ファイル

**regconfig.json** (`apps/cool-app/regconfig.json`)

```js
{
  "core": {
    "workingDir": ".reg",
    "actualDir": "${ACTUAL_DIR}",  // 環境変数で切り替え
    "thresholdRate": 0.001  // 差分閾値 0.1%
  },
  "plugins": {
    "reg-simple-keygen-plugin": {
      "expectedKey": "${EXPECTED_KEY}",
      "actualKey": "${ACTUAL_KEY}"
    },
    "reg-publish-gcs-plugin": { "bucketName": "vrt-sample" },
    "reg-notify-github-plugin": { "prComment": false, "setCommitStatus": true }
  }
}
```

**`prComment: false` について**:
reg-notify-github-plugin のPRコメント機能は無効化しています。理由は以下の通りです：
- Maestro と Playwright で同じ regconfig.json を共有しているため、1つのコメントしか出力されない
- 代わりに GitHub Actions の `marocchino/sticky-pull-request-comment` で独自のPRコメントを出力
- これにより Maestro / Playwright それぞれ別のコメントでVRT結果を表示可能

**環境変数の使い方**:

```bash
# Maestro（モバイル）
ACTUAL_DIR=.maestro/screenshots \
EXPECTED_KEY=main/1.0.0/abc1234/maestro \
ACTUAL_KEY=feature/1.0.0/def5678/maestro \
bunx reg-suit run

# Playwright（Web）
ACTUAL_DIR=e2e/screenshots \
EXPECTED_KEY=main/1.0.0/abc1234/playwright \
ACTUAL_KEY=feature/1.0.0/def5678/playwright \
bunx reg-suit run
```
