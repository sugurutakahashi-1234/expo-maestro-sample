import { $ } from "bun";
import { existsSync } from "fs";

const SNAPSHOTS_BASE_DIR = ".maestro/snapshots";
const GCS_CREDENTIALS = "./vrt-gcs-credentials.json";

// コマンドライン引数を取得
const args = process.argv.slice(2);

(async () => {
  try {
    if (args.length !== 2) {
      console.error("Usage: bun run vrt:find:remote <expected-hash> <actual-hash>");
      console.error("Example: bun run vrt:find:remote 041e30c f6e97f4");
      process.exit(1);
    }

    const [expectedHash, actualHash] = args;

    // package.jsonからバージョンを取得
    const pkg = await Bun.file("./package.json").json();
    const version = pkg.version;

    // 現在のブランチを取得してサニタイズ
    const branch = (await $`git rev-parse --abbrev-ref HEAD`.text())
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    // スナップショットパスとGCSキーを直接構築
    const expectedSnapshot = `${SNAPSHOTS_BASE_DIR}/${branch}/${version}/${expectedHash}`;
    const actualSnapshot = `${SNAPSHOTS_BASE_DIR}/${branch}/${version}/${actualHash}`;
    const expectedKey = `${branch}/${version}/${expectedHash}`;
    const actualKey = `${branch}/${version}/${actualHash}`;

    // 存在確認
    if (!existsSync(expectedSnapshot)) {
      console.error(`❌ Snapshot not found: ${expectedSnapshot}`);
      process.exit(1);
    }

    if (!existsSync(actualSnapshot)) {
      console.error(`❌ Snapshot not found: ${actualSnapshot}`);
      process.exit(1);
    }

    console.log(`ACTUAL_DIR=${actualSnapshot} EXPECTED_KEY=${expectedKey} ACTUAL_KEY=${actualKey} GOOGLE_APPLICATION_CREDENTIALS=${GCS_CREDENTIALS} bunx reg-suit run; open .reg/index.html`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();
