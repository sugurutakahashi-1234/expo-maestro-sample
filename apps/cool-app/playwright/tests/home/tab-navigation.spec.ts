// spec: playwright/specs/home.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("タブナビゲーション", () => {
  test("4.1 タブの切り替え動作", async ({ page }) => {
    // 前提条件: ホーム画面が表示されている
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 1. 「このアプリについて」タブをクリック
    await page.getByRole("tab", { name: "このアプリについて" }).click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/about");

    // 2. 「プロフィール」タブをクリック
    await page.getByRole("tab", { name: "プロフィール" }).click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/profile");

    // 3. 「遷移」タブをクリック
    await page.getByRole("tab", { name: "遷移" }).click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/transition");

    // 4. 「ホーム」タブをクリック
    await page.getByRole("tab", { name: "ホーム" }).click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toMatch(/\/(home)?$/);
  });

  test("4.2 タブ内ナビゲーション履歴の保持", async ({ page }) => {
    // 前提条件: ホーム画面が表示されている
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 1. 記事「Expo Routerの始め方」をクリックして詳細画面へ遷移
    await page.getByText("Expo Routerの始め方").click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/home/article/1");

    // 2. 「このアプリについて」タブをクリック
    await page.getByRole("tab", { name: "このアプリについて" }).click();
    await page.waitForLoadState("domcontentloaded");

    // 3. 「ホーム」タブに戻る
    await page.getByRole("tab", { name: "ホーム" }).click();
    await page.waitForLoadState("domcontentloaded");

    // 期待される結果の確認
    // - 記事詳細画面が表示される（ナビゲーション履歴が保持される）
    expect(page.url()).toContain("/home/article/1");

    // - 「記事一覧に戻る」ボタンでホーム画面に戻れる
    await expect(page.getByText(/記事一覧に戻る/)).toBeVisible();
  });
});
