import { $ } from "bun";
import { existsSync } from "fs";

const SNAPSHOTS_BASE_DIR = ".maestro/snapshots";
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

  // package.jsonからバージョンを取得
  const pkg = await Bun.file("./package.json").json();
  const version = pkg.version;

  // Git情報を取得
  const branch = (await $`git rev-parse --abbrev-ref HEAD`.text())
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const hash = (await $`git rev-parse --short=7 HEAD`.text()).trim();

  // スナップショットディレクトリ名を生成
  const snapshotDir = `${SNAPSHOTS_BASE_DIR}/${branch}/${version}/${hash}`;
  // スクリーンショットディレクトリの存在確認
  if (!existsSync(SCREENSHOTS_DIR)) {
    console.error(`❌ Error: Screenshots directory not found: ${SCREENSHOTS_DIR}`);
    console.log("💡 Run 'bun run maestro:ios' or 'bun run maestro:android' first");
    process.exit(1);
  }

  // 既存のスナップショットディレクトリがあれば削除
  if (existsSync(snapshotDir)) {
    console.log(`🗑️  Removing existing snapshot: ${snapshotDir}`);
    await $`rm -rf ${snapshotDir}`;
  }

  // スナップショットディレクトリを作成
  await $`mkdir -p ${snapshotDir}`;

  // スクリーンショットをコピー
  await $`cp -r ${SCREENSHOTS_DIR}/. ${snapshotDir}/`;

  console.log(`✅ Snapshot saved: ${snapshotDir}`);
} catch (error) {
  console.error("❌ Error creating snapshot:", error);
  process.exit(1);
}
