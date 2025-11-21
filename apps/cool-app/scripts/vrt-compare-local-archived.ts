import { $ } from "bun";

const SCREENSHOTS_ARCHIVE_DIR = ".maestro/screenshots-archive";
const DIFF_DIR = ".reg/local/diff";
const REPORT_HTML = ".reg/local/index.html";
const REPORT_JSON = ".reg/local/reg.json";
const THRESHOLD = 0.001;

// コマンドライン引数を取得
const args = process.argv.slice(2);

/**
 * findコマンドを使って指定されたハッシュのディレクトリを見つける
 * ブランチやバージョンが異なる場合でも検索可能
 */
async function findArchiveByHash(hash: string): Promise<string | null> {
  const result = await $`find ${SCREENSHOTS_ARCHIVE_DIR} -type d -name ${hash}`.text();
  const paths = result.trim().split("\n").filter(Boolean);
  return paths[0] || null;
}

(async () => {
  try {
    if (args.length !== 2) {
      console.error("Usage: bun run vrt:compare:local:archived <actual-hash> <expected-hash>");
      console.error("Example: bun run vrt:compare:local:archived f6e97f4 041e30c");
      console.error("");
      console.error("This compares two archived screenshot archives:");
      console.error("  - Actual: .maestro/screenshots-archive/<branch>/<version>/<actual-hash>");
      console.error("  - Expected: .maestro/screenshots-archive/<branch>/<version>/<expected-hash>");
      process.exit(1);
    }

    const [actualHash, expectedHash] = args;

    const expectedArchive = await findArchiveByHash(expectedHash);
    const actualArchive = await findArchiveByHash(actualHash);

    if (!expectedArchive) {
      console.error(`❌ Screenshot archive not found for hash: ${expectedHash}`);
      process.exit(1);
    }

    if (!actualArchive) {
      console.error(`❌ Screenshot archive not found for hash: ${actualHash}`);
      process.exit(1);
    }

    console.log("📊 Running VRT comparison...");
    console.log(`Actual: ${actualArchive}`);
    console.log(`Expected: ${expectedArchive}`);
    console.log("");

    // Ensure output directories exist
    await $`mkdir -p ${DIFF_DIR}`;
    await $`mkdir -p $(dirname ${REPORT_HTML})`;

    // Show the command that will be executed
    const command = `bunx reg-cli ${actualArchive} ${expectedArchive} ${DIFF_DIR} -R ${REPORT_HTML} -J ${REPORT_JSON} -T ${THRESHOLD}`;
    console.log("🔧 Executing command:");
    console.log(command);
    console.log("");

    // Run reg-cli
    try {
      await $`bunx reg-cli ${actualArchive} ${expectedArchive} ${DIFF_DIR} -R ${REPORT_HTML} -J ${REPORT_JSON} -T ${THRESHOLD}`;
      console.log("✅ No differences detected");
    } catch {
      // reg-cli exits with non-zero when differences are found
      console.log("⚠️  Differences detected");
    }

    // Open the report
    console.log(`\n🌐 Opening report: ${REPORT_HTML}`);
    await $`open ${REPORT_HTML}`;
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();
