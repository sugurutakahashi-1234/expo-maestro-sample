// spec: playwright/specs/home.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("記事詳細画面への遷移", () => {
  test("2.1 記事カードのクリックによる遷移", async ({ page }) => {
    // 前提条件: ホーム画面が表示されている
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 1. 記事リストから「Expo Routerの始め方」のカードをクリック
    await page.getByText("Expo Routerの始め方").click();

    // 2. 画面遷移を待機
    await page.waitForLoadState("domcontentloaded");

    // 期待される結果の確認
    // - URLが /home/article/1 に変更される
    expect(page.url()).toContain("/home/article/1");

    // - 記事詳細ページの見出しが表示される
    await expect(page.getByRole("heading", { name: "記事詳細" })).toBeVisible();

    // - 記事ID「記事ID: 1」が表示される
    await expect(page.getByText(/記事ID:\s*1/)).toBeVisible();
  });

  test("2.2 記事詳細画面の内容確認", async ({ page }) => {
    // 前提条件: 記事詳細画面に遷移している
    await page.goto("/home/article/1");
    await page.waitForLoadState("domcontentloaded");

    // 1. ハイライトボックスの内容を確認
    await expect(page.getByText(/タブ内プッシュ遷移/)).toBeVisible();

    // 2. パラメータ情報を確認
    await expect(page.getByText(/id:\s*1/)).toBeVisible();

    // 3. 戻るボタンの存在を確認
    await expect(page.getByText(/記事一覧に戻る/)).toBeVisible();
  });
});
