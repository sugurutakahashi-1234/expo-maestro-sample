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
    if (args.length !== 2) {
      console.error("Usage: bun run vrt:find:remote <expected-hash> <actual-hash>");
      console.error("Example: bun run vrt:find:remote 041e30c f6e97f4");
      process.exit(1);
    }

    const [expectedInput, actualInput] = args;
    const expectedHash = extractHash(expectedInput);
    const actualHash = extractHash(actualInput);

    const expectedSnapshot = await findSnapshotByHash(expectedHash);
    const actualSnapshot = await findSnapshotByHash(actualHash);

    if (!expectedSnapshot) {
      console.error(`❌ Snapshot not found for hash: ${expectedHash}`);
      process.exit(1);
    }

    if (!actualSnapshot) {
      console.error(`❌ Snapshot not found for hash: ${actualHash}`);
      process.exit(1);
    }

    const expectedKey = extractKeyFromPath(expectedSnapshot);
    const actualKey = extractKeyFromPath(actualSnapshot);

    console.log(`ACTUAL_DIR=${actualSnapshot} EXPECTED_KEY=${expectedKey} ACTUAL_KEY=${actualKey} GOOGLE_APPLICATION_CREDENTIALS=${GCS_CREDENTIALS} bunx reg-suit run; open .reg/index.html`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();
