/**
 * seed.spec.ts - Playwright Test Agents 用のシードファイル
 *
 * このファイルの役割:
 * - Generator/Planner エージェントが参照するエントリーポイント
 * - 環境のブートストラップ（認証が必要な場合はここでログイン）
 *
 * プロジェクト固有のベストプラクティスは README.md を参照
 */

import { test, expect } from "@playwright/test";

test("seed", async ({ page }) => {
  // アプリケーションにアクセス
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  // アプリケーションが正常に起動したことを確認
  await expect(page.getByText(/Expo モノレポ with Bun/)).toBeVisible();
});
