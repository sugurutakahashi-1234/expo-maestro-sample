import { defineConfig, devices } from "@playwright/test";

// ========================================
// Playwright 設定ファイル
// ========================================
// Expo Web アプリ用の E2E テスト設定
// 公式ドキュメント: https://playwright.dev/docs/test-configuration

export default defineConfig({
  // ========================================
  // テストファイルの場所
  // ========================================
  // テストファイル（*.spec.ts）を探すディレクトリ
  testDir: "./playwright/tests",

  // テスト結果（スクリーンショット、動画など）の出力先
  outputDir: "./playwright/test-results",

  // ========================================
  // テスト実行オプション
  // ========================================
  // true: テストを並列実行（高速化）
  // false: 順次実行（デバッグ時に便利）
  fullyParallel: true,

  // 失敗時のリトライ回数
  // 0: リトライなし（ローカル開発向け）
  // CI環境では 1-2 を推奨
  retries: 0,

  // ========================================
  // レポーター設定
  // ========================================
  // 複数のレポーターを同時に使用可能
  // 参考: https://playwright.dev/docs/test-reporters
  reporter: [
    // コンソール出力（実行中の進捗表示）
    ["list"],
    // HTMLレポート（ブラウザで詳細確認）
    ["html"],
    // JSONレポート（CI用、daun/playwright-report-summaryで使用）
    ["json", { outputFile: "playwright-report.json" }],
    // GitHub Actions Job Summary（CI環境のみ）
    // https://github.com/estruyf/playwright-github-actions-reporter
    ...(process.env.CI
      ? [
          [
            "@estruyf/github-actions-reporter",
            {
              title: "Playwright Test Results",
              useDetails: true,
              showError: true,
            },
          ] as const,
        ]
      : []),
  ],

  // ========================================
  // 全テスト共通の設定
  // ========================================
  use: {
    // テスト対象のベースURL
    // page.goto("/") は http://localhost:8081/ にアクセス
    baseURL: "http://localhost:8081",

    // トレース（操作履歴）の記録設定
    // "on": 常に記録
    // "off": 記録しない
    // "retain-on-failure": 失敗時のみ保持（推奨）
    trace: "retain-on-failure",

    // 動画記録: 環境変数で制御（デフォルト off）
    // PLAYWRIGHT_VIDEO=on で有効化
    // 保存先: playwright/test-results/{テスト名}/video.webm
    video: process.env.PLAYWRIGHT_VIDEO === "on" ? "on" : "off",
  },

  // ========================================
  // テストプロジェクト（ブラウザ・デバイス設定）
  // ========================================
  // 参考: https://playwright.dev/docs/emulation#devices
  // デバイス定義: https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json
  projects: [
    // ========================================
    // デスクトップブラウザ
    // ========================================
    // Chromium（Chrome/Edge系）- 世界シェア約65%
    // プリセット設定: viewport 1280×720, isMobile: false, hasTouch: false
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    // WebKit（Safari）- macOS/iOS標準ブラウザ
    // プリセット設定: viewport 1280×720, isMobile: false, hasTouch: false
    {
      name: "desktop-safari",
      use: { ...devices["Desktop Safari"] },
    },

    // ========================================
    // モバイルデバイス
    // ========================================
    // iPhone 15 - Playwrightで利用可能な最新iPhone（2025年時点）
    // プリセット設定: viewport 393×659, deviceScaleFactor: 3, iOS 17.5
    // isMobile: true（メタビューポートタグ適用）, hasTouch: true
    // defaultBrowserType: "webkit"（Safari Mobile エンジン）
    {
      name: "iphone-safari",
      use: { ...devices["iPhone 15"] },
    },
    // Pixel 7 - Playwrightで利用可能な最新Pixel（2025年時点）
    // プリセット設定: viewport 412×839, deviceScaleFactor: 2.625, Android 14
    // isMobile: true, hasTouch: true
    // defaultBrowserType: "chromium"（Chrome Mobile エンジン）
    {
      name: "pixel-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],

  // ========================================
  // 開発サーバー設定
  // ========================================
  // テスト実行前に自動でサーバーを起動
  webServer: {
    // サーバー起動コマンド（Expo Web - production モード）
    // --no-dev オプションにより:
    // - Expo DevMenu ボタン（雷アイコン）が非表示
    // - 開発時の警告（pointerEvents deprecated など）が非表示
    // - より本番環境に近い状態でテスト実行
    command: "bun run web:test",

    // サーバーの準備完了を確認するURL
    url: "http://localhost:8081",

    // 既存サーバーの再利用設定
    // ローカル開発: true（既に起動中のサーバーを使用、高速）
    // CI環境: false（毎回新規起動、クリーンな状態）
    reuseExistingServer: !process.env.CI,
  },
});
