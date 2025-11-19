import { $ } from "bun";

const SNAPSHOTS_BASE_DIR = ".maestro/snapshots";
const GCS_CREDENTIALS = "./vrt-sample-4dde33b657e4.json";

// コマンドライン引数を取得
const args = process.argv.slice(2);

/**
 * 入力から末尾のハッシュを抽出
 * "1.0.0_2025-11-19_1142_041e30c" → "041e30c"
 * "041e30c" → "041e30c"
 */
function extractHash(input: string): string {
  const parts = input.split("_");
  return parts[parts.length - 1];
}

/**
 * findコマンドを使って指定されたハッシュで終わるディレクトリを見つける
 */
async function findSnapshotByHash(hash: string): Promise<string | null> {
  const result = await $`find ${SNAPSHOTS_BASE_DIR} -type d -name "*_${hash}"`.text();
  const paths = result.trim().split("\n").filter(Boolean);
  return paths[0] || null;
}

/**
 * ディレクトリパスから完全なGCSキーを抽出
 * ".maestro/snapshots/main/1.0.0_2025-11-19_1142_041e30c" → "main/1.0.0_2025-11-19_1142_041e30c"
 */
function extractKeyFromPath(path: string): string {
  return path.replace(`${SNAPSHOTS_BASE_DIR}/`, "");
}

(async () => {
  try {
    if (args.length !== 1) {
      console.error("Usage: bun run vrt:publish:remote <hash>");
      console.error("Example: bun run vrt:publish:remote 041e30c");
      process.exit(1);
    }

    const input = args[0];
    const hash = extractHash(input);

    const snapshot = await findSnapshotByHash(hash);

    if (!snapshot) {
      console.error(`❌ Snapshot not found for hash: ${hash}`);
      process.exit(1);
    }

    const key = extractKeyFromPath(snapshot);

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
