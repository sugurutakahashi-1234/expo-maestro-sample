import { $ } from "bun";

const SNAPSHOTS_BASE_DIR = ".maestro/snapshots";

// コマンドライン引数を取得
const args = process.argv.slice(2);

/**
 * findコマンドを使って指定されたハッシュのディレクトリを見つける
 * ブランチやバージョンが異なる場合でも検索可能
 */
async function findSnapshotByHash(hash: string): Promise<string | null> {
  const result = await $`find ${SNAPSHOTS_BASE_DIR} -type d -name ${hash}`.text();
  const paths = result.trim().split("\n").filter(Boolean);
  return paths[0] || null;
}

(async () => {
  try {
    if (args.length !== 2) {
      console.error("Usage: bun run vrt:find:local <actual-hash> <expected-hash>");
      console.error("Example: bun run vrt:find:local f6e97f4 041e30c");
      process.exit(1);
    }

    const [actualHash, expectedHash] = args;

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

    console.log(`bunx reg-cli ${actualSnapshot} ${expectedSnapshot} .reg/local/diff -R .reg/local/index.html -J .reg/local/reg.json -T 0.001; open .reg/local/index.html`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();
