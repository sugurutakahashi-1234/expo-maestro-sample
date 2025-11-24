import { $ } from "bun";

// ========================================
// 定数定義
// ========================================
const SCREENSHOTS_ARCHIVE_DIR = ".maestro/screenshots-archive"; // アーカイブされたスクリーンショットの保存先
const DIFF_DIR = ".reg/local/diff"; // 差分画像の出力先
const REPORT_HTML = ".reg/local/index.html"; // HTMLレポートの出力先
const REPORT_JSON = ".reg/local/reg.json"; // JSONレポートの出力先
const THRESHOLD = 0.001; // 画像比較の閾値（0.1%）

// コマンドライン引数を取得
const args = process.argv.slice(2);

// ========================================
// ヘルパー関数
// ========================================

/**
 * コミットハッシュからアーカイブディレクトリを検索
 * ブランチやバージョンに関係なくハッシュのみで検索するため、
 * どのブランチでアーカイブされたものでも見つけることができる
 */
async function findArchiveByHash(hash: string): Promise<string | null> {
  const result = await $`find ${SCREENSHOTS_ARCHIVE_DIR} -type d -name ${hash}`.text();
  const paths = result.trim().split("\n").filter(Boolean);
  return paths[0] || null;
}

// ========================================
// メイン処理
// ========================================
(async () => {
  try {
    // ========================================
    // ステップ1: コマンドライン引数のチェック
    // ========================================
    // 比較する2つのコミットハッシュを引数として受け取る
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

    // ========================================
    // ステップ2: 2つのコミットハッシュに対応するアーカイブを検索
    // ========================================
    // .maestro/screenshots-archive 配下から各ハッシュに対応するディレクトリを探す
    const expectedArchive = await findArchiveByHash(expectedHash);
    const actualArchive = await findArchiveByHash(actualHash);

    // 期待値のアーカイブが存在しない場合はエラー
    if (!expectedArchive) {
      console.error(`❌ Screenshot archive not found for hash: ${expectedHash}`);
      process.exit(1);
    }

    // 実際の値のアーカイブが存在しない場合はエラー
    if (!actualArchive) {
      console.error(`❌ Screenshot archive not found for hash: ${actualHash}`);
      process.exit(1);
    }

    // ========================================
    // ステップ3: VRT（Visual Regression Testing）比較を実行
    // ========================================
    // reg-cli を使用してスクリーンショットを比較し、差分を検出
    console.log("📊 Running VRT comparison...");
    console.log(`Actual: ${actualArchive}`);
    console.log(`Expected: ${expectedArchive}`);
    console.log("");

    // 出力ディレクトリを作成
    await $`mkdir -p ${DIFF_DIR}`;
    await $`mkdir -p $(dirname ${REPORT_HTML})`;

    // 実行するコマンドを表示
    const command = `bunx reg-cli ${actualArchive} ${expectedArchive} ${DIFF_DIR} -R ${REPORT_HTML} -J ${REPORT_JSON} -T ${THRESHOLD}`;
    console.log("🔧 Executing command:");
    console.log(command);
    console.log("");

    // reg-cli を実行
    // 注: reg-cli は差分が見つかった場合に非0で終了するため、try-catchで処理
    try {
      await $`bunx reg-cli ${actualArchive} ${expectedArchive} ${DIFF_DIR} -R ${REPORT_HTML} -J ${REPORT_JSON} -T ${THRESHOLD}`;
      console.log("✅ No differences detected");
    } catch {
      console.log("⚠️  Differences detected");
    }

    // ========================================
    // ステップ4: レポート表示
    // ========================================
    // HTMLレポートを開いて視覚的に差分を確認
    console.log(`\n🌐 Opening report: ${REPORT_HTML}`);
    await $`open ${REPORT_HTML}`;
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();
