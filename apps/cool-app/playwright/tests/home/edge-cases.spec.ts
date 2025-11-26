// spec: playwright/specs/home.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("エッジケースとエラーハンドリング", () => {
  test("6.1 存在しない記事IDへの直接アクセス", async ({ page }) => {
    // 1. URLに存在しない記事IDを指定
    await page.goto("/home/article/999");

    // 2. ページの読み込みを待機
    await page.waitForLoadState("domcontentloaded");

    // 3. 表示内容を確認
    // - 記事詳細画面が表示される
    // - パラメータコードブロックに id: 999 が表示される
    await expect(page.getByText(/id:\s*999/)).toBeVisible();
  });

  test("6.2 ブラウザの戻るボタンでのナビゲーション", async ({ page }) => {
    // 前提条件: 記事詳細画面に遷移している
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.getByText("Expo Routerの始め方").click();
    await page.waitForLoadState("domcontentloaded");

    // 1. ブラウザの戻るボタンをクリック
    await page.goBack();

    // 2. 画面遷移を待機
    await page.waitForLoadState("domcontentloaded");

    // 期待される結果の確認
    // - ホーム画面に戻る
    await expect(page.getByText(/記事リスト/)).toBeVisible();

    // 3. 再度ブラウザの進むボタンをクリック
    await page.goForward();
    await page.waitForLoadState("domcontentloaded");

    // - 記事詳細画面に戻る
    expect(page.url()).toContain("/home/article/1");
  });
});
