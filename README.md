# Expo Maestro + VRT 検証リポジトリ

Maestro E2EテストとVisual Regression Testing (VRT) の検証用リポジトリ。

---

## 1. はじめに

### 必須ツール

```bash
brew install maestro          # Maestro CLI
brew install oven-sh/bun/bun  # Bun
```

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

## 2. Maestro（E2Eテスト）

### 2.1 クイックスタート

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

### 2.2 開発コマンド

| コマンド | 説明 |
|---------|------|
| `bun run maestro:setup` | ディレクトリセットアップ（初回のみ） |
| `bun run maestro:ios` | iOS E2Eテスト |
| `bun run maestro:android` | Android E2Eテスト |
| `bun run maestro:all` | iOS → Android 順次実行 |

### 2.3 注意点（要点のみ）

| 項目 | 要点 | 対策 |
|------|------|------|
| **Studio vs CLI** | 同時使用不可（ポート7001競合） | Studioを終了してからCLI実行 |
| **CLI並列実行** | 不可（ポート7001競合） | `&&`で順次実行 |
| **iOS物理デバイス** | 非対応 | シミュレータのみ使用 |
| **accessibilityLabel** | iOS必須 | React Nativeの属性を設定 |
| **パス指定** | プロジェクトルートからの相対パス | 拡張子なしで`.png`自動付加 |
| **when条件** | `runFlow`/`runScript`内でのみ使用可 | 直接コマンドには使えない |
| **録画** | `maestro record`は保存先指定不可 | Flow内で`startRecording`/`stopRecording`推奨 |
| **初回セットアップ** | ディレクトリが存在しないとエラー | `bun run maestro:setup`で事前作成 |

<details>
<summary>詳細: プラットフォーム別スクリーンショット</summary>

```yaml
# maestro.platformで動的パス生成
- evalScript: ${output.platform = maestro.platform}
- takeScreenshot: .maestro/screenshots/${output.platform}/home-tab
# iOS → .maestro/screenshots/ios/home-tab.png
# Android → .maestro/screenshots/android/home-tab.png
```

</details>

<details>
<summary>詳細: VRT向けステータスバー固定</summary>

`bun run maestro:ios` / `bun run maestro:android` で自動実行。
時刻9:41、バッテリー100%に固定し、VRT比較時の誤検知を防止。

</details>

---

## 3. VRT（Visual Regression Testing）

### 3.1 VRTの3つの課題

VRTを導入する際に解決すべき課題:

| 課題 | 問題 | 本リポジトリの解決策 |
|------|------|---------------------|
| **1. ローカル or リモート** | どこで比較を実行？ | 両方対応（ローカル: reg-cli、リモート: reg-suit） |
| **2. 期待値の管理** | ベースラインをどう保存？ | Git管理（リモートブランチから取得）またはローカルアーカイブ |
| **3. レポートのホスティング** | 差分レポートをどこで見る？ | ローカル: ブラウザ / リモート: GitHub Pages |

---

### 3.2 リモートVRT（REG Suite + CI/CD）

CI/CDで自動実行し、PRでレポートを確認する方式。

#### 概要

| 項目 | 設定値 |
|------|--------|
| ツール | reg-suit + Google Cloud Storage |
| 実行タイミング | PR作成時、mainマージ時 |
| レポート | GitHub Pages（本リポジトリ） |

#### CI/CDワークフロー

| ワークフロー | トリガー | 説明 |
|-------------|---------|------|
| `vrt-pr.yml` | PR作成・更新時 | ベースブランチと比較、PRコメント投稿 |
| `vrt-baseline.yml` | mainマージ時 | 新ベースラインをGCSに保存 |
| `cleanup-vrt-reports.yml` | 毎週日曜 | 30日以上前のレポートを削除 |

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

### 3.3 ローカルVRT（REG CLI）

ローカルで即座にUI変更を確認する方式。クラウドストレージ不要。

#### 3つの比較方法

| コマンド | 比較対象 | アーカイブ管理 | 推奨度 |
|---------|---------|--------------|--------|
| **vrt:compare:remote-branch** | 現在 vs Gitリモートブランチ | **不要** | ★★★ |
| vrt:compare:local:current | 現在 vs ローカルアーカイブ | 必要 | ★★☆ |
| vrt:compare:local:archived | アーカイブ vs アーカイブ | 必要 | ★☆☆ |

**推奨**: `vrt:compare:remote-branch` が最もシンプル

```bash
# 最もシンプルなパターン
bun run maestro:ios
bun run vrt:compare:remote-branch
# → mainブランチのスクリーンショットと自動比較（GCS/S3不要）
```

**重要**:
- `vrt:compare:remote-branch`は**Gitリポジトリのリモートブランチ**から直接スクリーンショットを取得
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

**結論**: 基本的には `vrt:compare:remote-branch` を使う

---

### 3.4 VRTのベストプラクティス

#### ステータスバー固定

`bun run maestro:ios` / `bun run maestro:android` で自動実行。
時刻・バッテリー残量の差異による誤検知を防止。

#### スクロールバーフェード待機

```yaml
- waitForAnimationToEnd
- extendedWaitUntil:
    visible: "SCROLLBAR_FADE_WAIT_DUMMY"
    timeout: 3000
    optional: true
- takeScreenshot: path/to/screenshot
```

※ Maestro非推奨パターンだが、スクロールバーは直接検出できないため使用

#### カーソル対策

```yaml
- tapOn: "ページタイトル"  # フォーカス解除
- waitForAnimationToEnd
- extendedWaitUntil:
    visible: "CURSOR_BLINK_WAIT_DUMMY"
    timeout: 3000
    optional: true
- takeScreenshot: path/to/screenshot
```

#### 差分閾値

- `thresholdRate: 0.001`（0.1%）
- アンチエイリアシング、サブピクセルレンダリングの微小差異を許容

---

## 4. 補足資料

### 用語定義

| 用語 | 意味 | 保存場所 |
|------|------|----------|
| **スクリーンショット** | Maestroが生成する画像 | `.maestro/screenshots/` |
| **スクリーンショットアーカイブ** | 版管理された基準画像 | `.maestro/screenshots-archive/` |

### スクリーンショットアーカイブ命名規則

**構造**: `{branch}/{version}/{hash}`

**例**: `main/1.0.0/041e30c`, `feature_new-ui/1.0.0/f6e97f4`

**選択理由**:
- バージョン情報で後から探しやすい
- ローカルディレクトリ管理が容易
- ハッシュだけで自動検索可能（findコマンド）

### reg-suit運用の注意点

**reg-notify-github-pluginの注意点**:
- GitHub ActionsのPRイベントではdetached HEAD状態
- 対策: `git checkout ${{ github.head_ref }}`で明示的にチェックアウト

**プラグイン選択**:
- 推奨: `reg-simple-keygen-plugin`（命名を自由に制御可能）

### 設定ファイル

**regconfig.json** (`apps/cool-app/regconfig.json`)

```js
{
  "core": {
    "workingDir": ".reg",
    "actualDir": ".maestro/screenshots",
    "thresholdRate": 0.001  // 差分閾値 0.1%
  },
  "plugins": {
    "reg-simple-keygen-plugin": { ... },
    "reg-publish-gcs-plugin": { "bucketName": "vrt-sample" },
    "reg-notify-github-plugin": { "prComment": true, "setCommitStatus": true }
  }
}
```

---

## コマンドリファレンス

### Maestro

| コマンド | 説明 |
|---------|------|
| `bun run maestro:setup` | ディレクトリセットアップ |
| `bun run maestro:ios` | iOS E2Eテスト |
| `bun run maestro:android` | Android E2Eテスト |
| `bun run maestro:all` | iOS → Android 順次実行 |

### VRT

| コマンド | 説明 |
|---------|------|
| `bun run vrt:compare:remote-branch` | リモートブランチと比較（推奨） |
| `bun run vrt:compare:remote-branch [branch]` | 指定ブランチと比較 |
| `bun run vrt:archive:local` | アーカイブ作成 |
| `bun run vrt:archive:local:force` | 強制アーカイブ作成（未コミット変更時） |
| `bun run vrt:compare:local:current <hash>` | 現在 vs アーカイブ |
| `bun run vrt:compare:local:archived <h1> <h2>` | アーカイブ vs アーカイブ |
| `bun run vrt:publish:manual` | GCSパブリッシュコマンド生成 |

### 共通

| コマンド | 説明 |
|---------|------|
| `bun run test` | 全パッケージのテスト実行 |
| `bun run lint` | 全パッケージのLint実行 |
| `bun run typecheck` | 全パッケージの型チェック |
