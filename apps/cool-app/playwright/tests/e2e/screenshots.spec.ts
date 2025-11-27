// spec: playwright/specs/e2e.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("E2E スクリーンショットテスト", () => {
  test("すべての画面のスクリーンショットを撮影", async ({ page }, testInfo) => {
    // ========================================
    // タイムアウト設定
    // ========================================
    // このテストは7つの画面のスクリーンショットを撮影するため、時間がかかる
    // 実測値: 52〜57秒（プロジェクトにより変動）
    // - desktop-chrome: 約52秒
    // - desktop-safari: 約56秒
    // - iphone-safari: 約57秒
    // - pixel-chrome: 約52秒
    //
    // 時間がかかる主な処理:
    // 1. 初回 page.goto("/") - Expo Webアプリの初期ロード
    // 2. アラート待機ループ（最大3秒のポーリング）
    // 3. ログイン後の page.goto("/") - ページの再ロード
    // 4. 7回のスクリーンショット撮影（PNG生成）
    test.setTimeout(90000); // 90秒に延長（実測の約1.6倍のバッファ）

    // ========================================
    // 1. ホーム画面のスクリーンショット撮影
    // ========================================

    // 1. ブラウザで `/` にアクセス
    await page.goto("/");

    // 2. ページの読み込みを待機（`domcontentloaded`）
    await page.waitForLoadState("domcontentloaded");

    // 3. タイトル「Expo モノレポ with Bun 🎉」の表示を確認
    await expect(page.getByText(/Expo モノレポ with Bun/)).toBeVisible();

    // 4. 記事リストセクション「📚 記事リスト」の表示を確認
    await expect(page.getByText(/記事リスト/)).toBeVisible();

    // 5. スクリーンショットを撮影
    await page.screenshot({
      path: `playwright/screenshots/${testInfo.project.name}/home-tab.png`,
    });
    // Playwright snapshot（ローカルVRT用、CI上ではreg-cliで比較するためスキップ）
    if (!process.env.CI) {
      await expect(page).toHaveScreenshot(`${testInfo.project.name}-home-tab.png`, {
        maxDiffPixelRatio: 0.001, // reg-cliと同等の閾値（0.1%）
      });
    }

    // ========================================
    // 2. 記事詳細画面のスクリーンショット撮影
    // ========================================

    // 1. 記事リストから「Expo Routerの始め方」をクリック
    await page.getByText("Expo Routerの始め方").first().click();

    // 2. 記事詳細画面への遷移を待機
    await page.waitForLoadState("domcontentloaded");

    // 3. 見出し「記事詳細」の表示を確認
    await expect(
      page.getByRole("heading", { name: /記事詳細/ })
    ).toBeVisible();

    // 4. スクリーンショットを撮影
    await page.screenshot({
      path: `playwright/screenshots/${testInfo.project.name}/article-detail.png`,
    });
    // Playwright snapshot（ローカルVRT用、CI上ではreg-cliで比較するためスキップ）
    if (!process.env.CI) {
      await expect(page).toHaveScreenshot(`${testInfo.project.name}-article-detail.png`, {
        maxDiffPixelRatio: 0.001, // reg-cliと同等の閾値（0.1%）
      });
    }

    // ========================================
    // 2.2 ホーム画面に戻る
    // ========================================

    // 1. 「← 記事一覧に戻る」ボタンをクリック
    await page.getByText(/記事一覧に戻る/).click();

    // 2. ホーム画面への遷移を待機
    await page.waitForLoadState("domcontentloaded");

    // ========================================
    // 3. 遷移タブのスクリーンショット撮影
    // ========================================

    // 1. タブバーから「遷移」タブをクリック
    await page.getByRole("tab", { name: "遷移" }).click();

    // 2. 画面遷移を待機（`domcontentloaded`）
    await page.waitForLoadState("domcontentloaded");

    // 3. タイトル「Presentation スタイルデモ」の表示を確認
    await expect(page.getByText(/Presentation スタイルデモ/)).toBeVisible();

    // 4. セクション「利用可能なスタイル」の表示を確認
    await expect(page.getByText(/利用可能なスタイル/)).toBeVisible();

    // 5. スクリーンショットを撮影
    await page.screenshot({
      path: `playwright/screenshots/${testInfo.project.name}/transition-tab.png`,
    });
    // Playwright snapshot（ローカルVRT用、CI上ではreg-cliで比較するためスキップ）
    if (!process.env.CI) {
      await expect(page).toHaveScreenshot(`${testInfo.project.name}-transition-tab.png`, {
        maxDiffPixelRatio: 0.001, // reg-cliと同等の閾値（0.1%）
      });
    }

    // ========================================
    // 4. このアプリについてタブのスクリーンショット撮影
    // ========================================

    // 1. タブバーから「このアプリについて」タブをクリック
    await page.getByRole("tab", { name: "このアプリについて" }).click();

    // 2. 画面遷移を待機（`domcontentloaded`）
    await page.waitForLoadState("domcontentloaded");

    // 3. セクション「テクノロジースタック」の表示を確認
    await expect(page.getByText(/テクノロジースタック/)).toBeVisible();

    // 4. スクリーンショットを撮影
    await page.screenshot({
      path: `playwright/screenshots/${testInfo.project.name}/about-tab.png`,
    });
    // Playwright snapshot（ローカルVRT用、CI上ではreg-cliで比較するためスキップ）
    if (!process.env.CI) {
      await expect(page).toHaveScreenshot(`${testInfo.project.name}-about-tab.png`, {
        maxDiffPixelRatio: 0.001, // reg-cliと同等の閾値（0.1%）
      });
    }

    // ========================================
    // 5. プロフィールタブのスクリーンショット撮影
    // ========================================

    // 1. タブバーから「プロフィール」タブをクリック
    await page.getByRole("tab", { name: "プロフィール" }).click();

    // 2. 画面遷移を待機（`domcontentloaded`）
    await page.waitForLoadState("domcontentloaded");

    // 3. サブタイトル「ようこそ」の表示を確認
    await expect(page.getByText(/ようこそ/)).toBeVisible();

    // 4. スクリーンショットを撮影
    await page.screenshot({
      path: `playwright/screenshots/${testInfo.project.name}/profile-tab.png`,
    });
    // Playwright snapshot（ローカルVRT用、CI上ではreg-cliで比較するためスキップ）
    if (!process.env.CI) {
      await expect(page).toHaveScreenshot(`${testInfo.project.name}-profile-tab.png`, {
        maxDiffPixelRatio: 0.001, // reg-cliと同等の閾値（0.1%）
      });
    }

    // ========================================
    // 6. ログイン画面のスクリーンショット撮影
    // ========================================

    // 1. ホームタブに移動（タブバーから「ホーム」をクリック）
    await page.getByRole("tab", { name: "ホーム" }).click();
    await page.waitForLoadState("domcontentloaded");

    // 2. 下にスクロールして「ログインデモ (Maestroテスト用)」ボタンを表示
    await page
      .getByRole("link", { name: /ログインデモ/ })
      .scrollIntoViewIfNeeded();

    // 3. 「ログインデモ」ボタンをクリック
    await page.getByRole("link", { name: /ログインデモ/ }).click();

    // 4. ログイン画面への遷移を待機
    await page.waitForLoadState("domcontentloaded");

    // 5. タイトル「ログイン」の表示を確認
    await expect(
      page.getByRole("heading", { name: "ログイン" })
    ).toBeVisible();

    // ========================================
    // 6.2 ログインフォームへのテキスト入力
    // ========================================

    // 1. メールアドレス入力欄に入力
    await page.getByTestId("email-input").fill("test@example.com");

    // 2. パスワード入力欄に入力
    await page.getByTestId("password-input").fill("password123");

    // 3. 入力値の確認
    await expect(page.getByTestId("email-display")).toContainText(
      "test@example.com"
    );

    // 4. フォームのフォーカスを外す
    await page.getByText("Maestroテキスト入力デモ").click();

    // 5. 待機（アニメーション完了）
    await page.waitForTimeout(300);

    // 6. スクリーンショットを撮影
    await page.screenshot({
      path: `playwright/screenshots/${testInfo.project.name}/login-form-filled.png`,
    });
    // Playwright snapshot（ローカルVRT用、CI上ではreg-cliで比較するためスキップ）
    if (!process.env.CI) {
      await expect(page).toHaveScreenshot(`${testInfo.project.name}-login-form-filled.png`, {
        maxDiffPixelRatio: 0.001, // reg-cliと同等の閾値（0.1%）
      });
    }

    // ========================================
    // 6.3 ログインボタンのクリックとアラート表示
    // ========================================

    // アラートハンドラを設定
    let dialogHandled = false;
    page.once("dialog", async (dialog) => {
      // アラートの内容を確認
      expect(dialog.message()).toContain("ログイン成功");

      // スクリーンショットを撮影（アラート表示中）
      await page.screenshot({
        path: `playwright/screenshots/${testInfo.project.name}/login-success.png`,
      });

      // アラートを閉じる
      await dialog.accept();
      dialogHandled = true;
    });

    // ログインボタンをクリック
    await page.getByTestId("login-button").click();

    // アラート処理が完了するまで待機（最大3秒）
    const startTime = Date.now();
    while (!dialogHandled && Date.now() - startTime < 3000) {
      await page.waitForTimeout(100);
    }

    // ========================================
    // 7. ヘルプモーダルのスクリーンショット撮影
    // ========================================

    // 1. ホーム画面に戻る（ログイン画面にはタブがないので直接ナビゲート）
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 2. 最上部までスクロール
    await page.evaluate(() => window.scrollTo(0, 0));

    // 3. クイックリンクセクションの「サポートページ」ボタンをクリック
    await page.getByRole("link", { name: "サポートページ" }).click();

    // 4. モーダルの表示を待機
    await page.waitForLoadState("domcontentloaded");

    // 5. タイトル「ヘルプ」の表示を確認
    await expect(page.getByRole("heading", { name: "ヘルプ" })).toBeVisible();

    // 6. スクリーンショットを撮影
    await page.screenshot({
      path: `playwright/screenshots/${testInfo.project.name}/help-modal.png`,
    });
    // Playwright snapshot（ローカルVRT用、CI上ではreg-cliで比較するためスキップ）
    if (!process.env.CI) {
      await expect(page).toHaveScreenshot(`${testInfo.project.name}-help-modal.png`, {
        maxDiffPixelRatio: 0.001, // reg-cliと同等の閾値（0.1%）
      });
    }

    // ========================================
    // 7.2 ヘルプモーダルを閉じる
    // ========================================

    // 「閉じる」ボタンをクリック
    await page.getByText("閉じる").click();

    // モーダルが閉じるのを待機
    await page.waitForLoadState("domcontentloaded");

    // ホーム画面に戻ることを確認
    await expect(page.getByText(/Expo モノレポ with Bun/)).toBeVisible();
  });
});
