import { $ } from "bun";
import { existsSync } from "fs";

// ========================================
// 定数定義
// ========================================
const SCREENSHOTS_DIR = ".maestro/screenshots"; // 現在のスクリーンショットディレクトリ
const REMOTE_SCREENSHOTS_BASE_DIR = ".reg/remote"; // リモートブランチのスクリーンショット保存先
const THRESHOLD = 0.001; // 画像比較の閾値（0.1%）

// コマンドライン引数を取得
const args = process.argv.slice(2);

// ========================================
// ヘルパー関数
// ========================================

/**
 * リポジトリのデフォルトブランチを取得
 * git symbolic-ref で origin/HEAD が指すブランチを取得する
 * 例: "refs/remotes/origin/main" -> "main"
 */
async function getDefaultBranch(): Promise<string> {
  try {
    const result = await $`git symbolic-ref refs/remotes/origin/HEAD`.text();
    return result.trim().replace("refs/remotes/origin/", "");
  } catch {
    console.error("❌ Failed to get default branch from origin/HEAD");
    console.error("💡 Run 'git remote set-head origin --auto' to configure it");
    process.exit(1);
  }
}

/**
 * リモートブランチのスクリーンショット保存ディレクトリパスを生成
 * アーカイブと同じ構造: .reg/remote/<branch>/<version>/<hash>
 */
function getRemoteScreenshotsDir(
  branch: string,
  version: string,
  hash: string
): string {
  // ブランチ名を正規化（特殊文字をアンダースコアに変換）
  const normalizedBranch = branch.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${REMOTE_SCREENSHOTS_BASE_DIR}/${normalizedBranch}/${version}/${hash}`;
}

// ========================================
// メイン処理
// ========================================
(async () => {
  try {
    // ========================================
    // ステップ1: 比較対象のブランチを決定
    // ========================================
    // - 引数なし: リポジトリのデフォルトブランチを使用
    // - 引数あり: 指定されたブランチを使用
    let targetBranch: string;

    if (args.length === 0) {
      targetBranch = await getDefaultBranch();
      console.log(`📌 Using repository's default branch: ${targetBranch}`);
    } else if (args.length === 1) {
      targetBranch = args[0];
      console.log(`📌 Using specified branch: ${targetBranch}`);
    } else {
      console.error("Usage: bun run vrt:compare:remote [branch]");
      console.error("Example: bun run vrt:compare:remote");
      console.error("Example: bun run vrt:compare:remote feature/some-branch");
      console.error("");
      console.error("This compares:");
      console.error("  - Actual: .maestro/screenshots (current development)");
      console.error("  - Expected: Remote branch's .maestro/screenshots");
      process.exit(1);
    }

    // ========================================
    // ステップ2: 現在のスクリーンショットディレクトリの存在確認
    // ========================================
    // Maestroで取得したスクリーンショットが存在しない場合はエラー
    if (!existsSync(SCREENSHOTS_DIR)) {
      console.error(`❌ Screenshots directory not found: ${SCREENSHOTS_DIR}`);
      console.error("💡 Run 'bun run maestro:ios' or 'bun run maestro:android' first");
      process.exit(1);
    }

    // ========================================
    // ステップ3: リモートブランチの最新情報を取得
    // ========================================
    // git fetch でリモートブランチの最新状態をローカルに同期
    console.log(`\n🔄 Fetching remote branch: origin/${targetBranch}`);
    try {
      await $`git fetch origin ${targetBranch}`;
    } catch {
      console.error(`❌ Failed to fetch branch: origin/${targetBranch}`);
      console.error("💡 Make sure the branch exists on remote");
      process.exit(1);
    }

    // ========================================
    // ステップ4: バージョンとコミットハッシュを取得
    // ========================================
    // Expo configからバージョンを取得（app.jsonが評価される）
    const expoConfig = await $`npx expo config --json`.json();
    const version = expoConfig.version;

    // リモートブランチの最新コミットハッシュを取得（7桁）
    let remoteHash: string;
    try {
      remoteHash = (
        await $`git rev-parse --short=7 origin/${targetBranch}`.text()
      ).trim();
      console.log(
        `📍 Remote branch info: ${targetBranch} @ ${remoteHash} (v${version})`
      );
    } catch {
      console.error(`❌ Failed to get commit hash for: origin/${targetBranch}`);
      process.exit(1);
    }

    // ========================================
    // ステップ5: リモートスクリーンショット保存先を決定
    // ========================================
    // .reg/remote/<branch>/<version>/<hash> の形式でディレクトリパスを生成
    const remoteScreenshotsDir = getRemoteScreenshotsDir(
      targetBranch,
      version,
      remoteHash
    );
    const extractedPath = `${remoteScreenshotsDir}/${SCREENSHOTS_DIR}`;

    // 既に抽出済みの場合はスキップ
    if (existsSync(extractedPath)) {
      console.log(
        `\n♻️  Using cached screenshots: ${remoteScreenshotsDir}`
      );
      console.log(
        "💡 Delete this directory to re-extract from remote branch"
      );
    } else {
      // ========================================
      // ステップ6: リモートブランチからスクリーンショットを抽出
      // ========================================
      // git archive でリモートブランチの .maestro/screenshots を展開
      console.log(`\n📦 Extracting screenshots from origin/${targetBranch}`);
      console.log(`Save to: ${remoteScreenshotsDir}`);

      try {
        // ディレクトリを作成
        await $`mkdir -p ${remoteScreenshotsDir}`;

        // git archive でリモートブランチの .maestro/screenshots を抽出
        // パイプを使ってアーカイブを直接展開
        await $`git archive origin/${targetBranch} ${SCREENSHOTS_DIR} | tar -x -C ${remoteScreenshotsDir}`;

        // 抽出されたスクリーンショットの存在確認
        if (!existsSync(extractedPath)) {
          console.error(
            `❌ Screenshots not found in remote branch: ${targetBranch}`
          );
          console.error(
            `💡 Make sure ${SCREENSHOTS_DIR} exists in the remote branch`
          );
          process.exit(1);
        }

        console.log(`✅ Successfully extracted screenshots from remote branch`);
      } catch (error) {
        console.error(`❌ Failed to extract screenshots from remote branch`);
        console.error(error);
        process.exit(1);
      }
    }

    // ========================================
    // ステップ7: VRT（Visual Regression Testing）比較を実行
    // ========================================
    // reg-cli を使用してスクリーンショットを比較し、差分を検出

    // リモートブランチ用の比較結果保存先を生成
    const diffDir = `${remoteScreenshotsDir}/diff`;
    const reportHtml = `${remoteScreenshotsDir}/index.html`;
    const reportJson = `${remoteScreenshotsDir}/reg.json`;

    console.log("\n📊 Running VRT comparison...");
    console.log(`Actual (current): ${SCREENSHOTS_DIR}`);
    console.log(`Expected (${targetBranch}@${remoteHash}): ${extractedPath}`);
    console.log(`Results: ${remoteScreenshotsDir}`);
    console.log("");

    // 出力ディレクトリを作成
    await $`mkdir -p ${diffDir}`;

    // 実行するコマンドを表示
    const command = `bunx reg-cli ${SCREENSHOTS_DIR} ${extractedPath} ${diffDir} -R ${reportHtml} -J ${reportJson} -T ${THRESHOLD}`;
    console.log("🔧 Executing command:");
    console.log(command);
    console.log("");

    // reg-cli を実行
    // 注: reg-cli は差分が見つかった場合に非0で終了するため、try-catchで処理
    try {
      await $`bunx reg-cli ${SCREENSHOTS_DIR} ${extractedPath} ${diffDir} -R ${reportHtml} -J ${reportJson} -T ${THRESHOLD}`;
      console.log("✅ No differences detected");
    } catch {
      console.log("⚠️  Differences detected");
    }

    // ========================================
    // ステップ8: レポート表示
    // ========================================
    // HTMLレポートを開いて視覚的に差分を確認
    console.log(`\n🌐 Opening report: ${reportHtml}`);
    await $`open ${reportHtml}`;

    console.log(`\n💾 Comparison results saved at: ${remoteScreenshotsDir}`);
    console.log(
      "💡 Screenshots and results are cached and will be reused on next comparison"
    );
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();
