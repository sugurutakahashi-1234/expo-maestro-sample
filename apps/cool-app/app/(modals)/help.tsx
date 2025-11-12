import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function HelpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>ヘルプ</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 このアプリについて</Text>
          <Text style={styles.text}>
            このアプリは Expo Router を使った React Native のナビゲーションパターンを学習するためのデモアプリです。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗂️ タブの説明</Text>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>ホーム</Text>
            <Text style={styles.itemText}>
              記事一覧と詳細画面。ネストされたスタックナビゲーションの例。
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>遷移</Text>
            <Text style={styles.itemText}>
              様々な presentation スタイル（card、modal、transparentModal など）を試せます。
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>このアプリについて</Text>
            <Text style={styles.itemText}>
              使用技術の詳細と、動的ルート [name].tsx の例を確認できます。
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>プロフィール</Text>
            <Text style={styles.itemText}>
              シンプルなプロフィール画面。ライセンス情報へのアクセスも可能です。
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ よくある質問</Text>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>Q. 画面間の遷移はどう実装されていますか？</Text>
            <Text style={styles.itemText}>
              A. Expo Router の router.push() や Link コンポーネントを使用しています。
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>Q. ファイル構造がそのままルートになりますか？</Text>
            <Text style={styles.itemText}>
              A. はい。app ディレクトリ内のファイル構造がそのまま URL ルートになります。
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>Q. モーダルはどう実装しますか？</Text>
            <Text style={styles.itemText}>
              A. _layout.tsx で presentation オプションに modal を指定します。このヘルプ画面もモーダルです。
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 学習リソース</Text>
          <Text style={styles.text}>
            • Expo Router 公式ドキュメント{"\n"}
            • React Navigation ドキュメント{"\n"}
            • Expo 公式サイト
          </Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>閉じる</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#ccc",
  },
  item: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  itemText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#ccc",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
