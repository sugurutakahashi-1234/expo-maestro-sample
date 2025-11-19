import { $ } from "bun";
import { existsSync } from "fs";

const SNAPSHOTS_BASE_DIR = ".maestro/snapshots";
const GCS_CREDENTIALS = "./vrt-gcs-credentials.json";

// コマンドライン引数を取得
const args = process.argv.slice(2);

(async () => {
  try {
    if (args.length !== 1) {
      console.error("Usage: bun run vrt:publish:remote <hash>");
      console.error("Example: bun run vrt:publish:remote 041e30c");
      process.exit(1);
    }

    const hash = args[0];

    // package.jsonからバージョンを取得
    const pkg = await Bun.file("./package.json").json();
    const version = pkg.version;

    // 現在のブランチを取得してサニタイズ
    const branch = (await $`git rev-parse --abbrev-ref HEAD`.text())
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    // スナップショットパスとGCSキーを直接構築
    const snapshot = `${SNAPSHOTS_BASE_DIR}/${branch}/${version}/${hash}`;
    const key = `${branch}/${version}/${hash}`;

    // 存在確認
    if (!existsSync(snapshot)) {
      console.error(`❌ Snapshot not found: ${snapshot}`);
      process.exit(1);
    }

    // EXPECTED_KEYを設定しないことで、ベースライン作成モードになる
    // reg-suit runの動作:
    // 1. sync-expected: スキップ（EXPECTED_KEYなし）
    // 2. compare: 実行（すべてが"new items"になる、out.json生成）
    // 3. publish: 実行（out.jsonが必要なため、runコマンドが必須）
    //
    // 注1: `reg-suit publish`単独ではout.jsonがないため失敗する
    // 注2: .regディレクトリをクリーンアップしないと、残っているexpectedと比較されてしまう
    console.log(`rm -rf .reg; ACTUAL_DIR=${snapshot} ACTUAL_KEY=${key} GOOGLE_APPLICATION_CREDENTIALS=${GCS_CREDENTIALS} bunx reg-suit run`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();
