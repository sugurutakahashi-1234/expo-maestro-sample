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

(async () => {
  try {
    if (args.length !== 2) {
      console.error("Usage: bun run vrt:find <hash1> <hash2>");
      console.error("Example: bun run vrt:find 041e30c f6e97f4");
      process.exit(1);
    }

    const [input1, input2] = args;
    const hash1 = extractHash(input1);
    const hash2 = extractHash(input2);

    const snapshot1 = await findSnapshotByHash(hash1);
    const snapshot2 = await findSnapshotByHash(hash2);

    if (!snapshot1) {
      console.error(`❌ Snapshot not found for hash: ${hash1}`);
      process.exit(1);
    }

    if (!snapshot2) {
      console.error(`❌ Snapshot not found for hash: ${hash2}`);
      process.exit(1);
    }

    console.log(`EXPECTED_DIR=${snapshot1} ACTUAL_DIR=${snapshot2} GOOGLE_APPLICATION_CREDENTIALS=${GCS_CREDENTIALS} bun run vrt:compare`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();
