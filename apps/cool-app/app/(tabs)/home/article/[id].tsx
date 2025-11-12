import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function TabScopedArticleDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const id = String(params.id || "");
  const title = String(params.title || "");
  const category = String(params.category || "");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{category || "記事"}</Text>
        <Text style={styles.title}>{title || "記事タイトル"}</Text>
        <Text style={styles.meta}>記事ID: {id}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>📱 タブ内プッシュ遷移</Text>
          <Text style={styles.highlightText}>
            この画面はHomeタブ内のスタックナビゲーションです。
          </Text>
          <Text style={styles.highlightText}>
            画面下部のタブバーが表示されたままになっています。
          </Text>
        </View>

        <Text style={styles.sectionTitle}>この記事について</Text>
        <Text style={styles.paragraph}>
          これは記事の詳細ビューです。実際のアプリでは、IDパラメータに基づいて
          記事の完全なコンテンツを取得します。
        </Text>

        <Text style={styles.paragraph}>
          この記事はrouter.push()を使用して以下のパラメータで遷移しました:
        </Text>

        <View style={styles.codeBlock}>
          <Text style={styles.codeTitle}>パラメータ:</Text>
          <Text style={styles.code}>id: {id}</Text>
          <Text style={styles.code}>title: {title}</Text>
          <Text style={styles.code}>category: {category}</Text>
        </View>

        <Text style={styles.sectionTitle}>タブ内スタックナビゲーション</Text>
        <Text style={styles.paragraph}>
          このスクリーンはHomeタブ内のネストされたStackナビゲーターの一部です。
          ファイルの場所: app/(tabs)/home/article/[id].tsx
        </Text>

        <Text style={styles.paragraph}>
          タブ内スタックの特徴:
        </Text>
        <Text style={styles.bullet}>• タブバーが表示されたまま</Text>
        <Text style={styles.bullet}>• Homeタブのコンテキスト内での遷移</Text>
        <Text style={styles.bullet}>• 他のタブに切り替えても戻ってこれる</Text>
        <Text style={styles.bullet}>• 各タブが独立したナビゲーション履歴を持つ</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>← 記事一覧に戻る</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#34C759",
    paddingTop: 20,
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.9,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  bullet: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
    marginLeft: 16,
  },
  codeBlock: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  highlightBox: {
    backgroundColor: "#e8f5e9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#81c784",
    gap: 8,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
  },
  highlightText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#388e3c",
  },
  actions: {
    padding: 20,
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#34C759",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
