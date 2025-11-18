#!/bin/bash

# VRT比較スクリプト
# 使い方:
#   ./scripts/vrt-compare.sh <expected> <actual>
#
# 例:
#   ./scripts/vrt-compare.sh HEAD~5 HEAD           # 5個前のコミットと現在を比較
#   ./scripts/vrt-compare.sh v1.0.0 main           # タグとブランチを比較
#   ./scripts/vrt-compare.sh abc123 def456         # 特定のコミットハッシュを比較
#   ./scripts/vrt-compare.sh HEAD~1                # 前のコミットと現在を比較（actualは省略可）

EXPECTED_REF=${1:-HEAD~1}
ACTUAL_REF=${2:-HEAD}

echo "🔍 VRT比較を実行します..."
echo "  Expected (比較元): $EXPECTED_REF"
echo "  Actual (比較先):   $ACTUAL_REF"
echo ""

EXPECTED_KEY=$(git rev-parse $EXPECTED_REF)
ACTUAL_KEY=$(git rev-parse $ACTUAL_REF)

echo "  Expected Key: $EXPECTED_KEY"
echo "  Actual Key:   $ACTUAL_KEY"
echo ""

EXPECTED_KEY=$EXPECTED_KEY \
ACTUAL_KEY=$ACTUAL_KEY \
GOOGLE_APPLICATION_CREDENTIALS=./vrt-sample-4dde33b657e4.json \
npx reg-suit run && open .reg/index.html
