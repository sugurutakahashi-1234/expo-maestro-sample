// spec: playwright/specs/home.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("初期表示とUI要素の確認", () => {
  test("1.4 クイックリンクセクションの表示確認", async ({ page }) => {
    // 前提条件: ホーム画面が表示されている
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 1. セクションタイトル「クイックリンク」の表示を確認
    await expect(page.getByText(/クイックリンク/)).toBeVisible();

    // 2. 各リンクボタンのテキストを確認（クイックリンクセクション内）
    await expect(
      page.getByRole("link", { name: "このアプリについて" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "プロフィール" })).toBeVisible();
    await expect(page.getByRole("link", { name: "サポートページ" })).toBeVisible();
    await expect(page.getByRole("link", { name: /ログインデモ/ })).toBeVisible();
  });

  test("1.5 タブバーの表示確認", async ({ page }) => {
    // 前提条件: ホーム画面が表示されている
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // タブの表示を確認（role="tab"）
    await expect(page.getByRole("tab", { name: "ホーム" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "遷移" })).toBeVisible();
  });
});
