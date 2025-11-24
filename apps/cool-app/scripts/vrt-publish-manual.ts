import { $ } from "bun";
import { existsSync } from "fs";

const SCREENSHOTS_DIR = ".maestro/screenshots";
const GCS_CREDENTIALS = "./vrt-gcs-credentials.json";

(async () => {
  try {
    // スクリーンショットディレクトリの存在確認
    if (!existsSync(SCREENSHOTS_DIR)) {
      console.error(`❌ Error: Screenshots directory not found: ${SCREENSHOTS_DIR}`);
      console.log("💡 Run 'bun run maestro:ios' or 'bun run maestro:android' first");
      process.exit(1);
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

    // 2つのGCSキーを生成
    const simpleKey = hash; // 比較用（CI/CDで使用）
    const fullKey = `${branch}/${version}/${hash}`; // 保存用（履歴参照用）

    console.log("# GCSに2つのキーでパブリッシュ:");
    console.log("# 1. ハッシュのみ（比較用）: " + simpleKey);
    console.log("# 2. フルパス（保存用）: " + fullKey);
    console.log();

    // EXPECTED_KEYを設定しないことで、ベースライン作成モードになる
    // reg-suit runの動作:
    // 1. sync-expected: スキップ（EXPECTED_KEYなし）
    // 2. compare: 実行（すべてが"new items"になる、out.json生成）
    // 3. publish: 実行（out.jsonが必要なため、runコマンドが必須）
    //
    // 注: .regディレクトリをクリーンアップしないと、残っているexpectedと比較されてしまう

    console.log("# コマンド1: ハッシュのみのキーでパブリッシュ");
    console.log(`rm -rf .reg && ACTUAL_KEY=${simpleKey} GOOGLE_APPLICATION_CREDENTIALS=${GCS_CREDENTIALS} bunx reg-suit run`);
    console.log();
    console.log("# コマンド2: フルパスのキーでパブリッシュ");
    console.log(`rm -rf .reg && ACTUAL_KEY=${fullKey} GOOGLE_APPLICATION_CREDENTIALS=${GCS_CREDENTIALS} bunx reg-suit run`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();
