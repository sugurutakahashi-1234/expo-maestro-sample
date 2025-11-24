import { $ } from "bun";
import { existsSync } from "fs";

const SCREENSHOTS_ARCHIVE_DIR = ".maestro/screenshots-archive";
const SCREENSHOTS_DIR = ".maestro/screenshots";

try {
  // コマンドライン引数をチェック
  const forceMode = process.argv.includes("--force");

  // 未コミット変更のチェック
  const status = (await $`git status --porcelain`.text()).trim();

  if (status && !forceMode) {
    console.error("❌ Uncommitted changes detected");
    console.log("💡 Commit first or use `--force` flag");
    process.exit(1);
  }

  if (status && forceMode) {
    console.warn("⚠️  Running with uncommitted changes (`--force`)");
  }

  // Expo configからバージョンを取得（app.jsonが評価される）
  const expoConfigText = await $`npx expo config --json`.text();
  const expoConfig = JSON.parse(expoConfigText);
  const version = expoConfig.expo.version;

  // Git情報を取得
  const branch = (await $`git rev-parse --abbrev-ref HEAD`.text())
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const hash = (await $`git rev-parse --short=7 HEAD`.text()).trim();

  // スクリーンショットアーカイブディレクトリ名を生成
  const archiveDir = `${SCREENSHOTS_ARCHIVE_DIR}/${branch}/${version}/${hash}`;
  // スクリーンショットディレクトリの存在確認
  if (!existsSync(SCREENSHOTS_DIR)) {
    console.error(`❌ Error: Screenshots directory not found: ${SCREENSHOTS_DIR}`);
    console.log("💡 Run 'bun run maestro:ios' or 'bun run maestro:android' first");
    process.exit(1);
  }

  // 既存のスクリーンショットアーカイブディレクトリがあれば削除
  if (existsSync(archiveDir)) {
    console.log(`🗑️  Removing existing screenshot archive: ${archiveDir}`);
    await $`rm -rf ${archiveDir}`;
  }

  // スクリーンショットアーカイブディレクトリを作成
  await $`mkdir -p ${archiveDir}`;

  // スクリーンショットをコピー
  await $`cp -r ${SCREENSHOTS_DIR}/. ${archiveDir}/`;

  console.log(`✅ Screenshot archive saved: ${archiveDir}`);
} catch (error) {
  console.error("❌ Error creating screenshot archive:", error);
  process.exit(1);
}
