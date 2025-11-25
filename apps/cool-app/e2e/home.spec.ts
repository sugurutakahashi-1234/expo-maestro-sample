import { test, expect } from "@playwright/test";

test.describe("ホーム画面", () => {
  test("タイトルが表示され、スクリーンショットを取得", async ({ page }) => {
    await page.goto("/");

    // ページの読み込みを待つ
    await page.waitForLoadState("networkidle");

    // ホーム画面のタイトル確認
    await expect(page.getByText("Expo モノレポ with Bun")).toBeVisible();

    // 記事リストセクションの確認
    await expect(page.getByText("記事リスト")).toBeVisible();

    // VRT用スクリーンショット
    await page.screenshot({
      path: "e2e/screenshots/web/home-tab.png",
    });
  });
});
