import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const username = params.username || "開発者";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>プロフィール</Text>
          <Text style={styles.subtitle}>こんにちは、{username}さん 👋</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ユーザー情報</Text>
          <View style={styles.cardContent}>
            <View style={styles.row}>
              <Text style={styles.label}>ユーザー名:</Text>
              <Text style={styles.value}>{username}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>メール:</Text>
              <Text style={styles.value}>dev@awesome-app.com</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>登録日:</Text>
              <Text style={styles.value}>2025年11月</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>機能紹介</Text>
          <View style={styles.cardContent}>
            <Text style={styles.infoText}>
              このプロフィール画面では以下の機能を確認できます:
            </Text>
            <Text style={styles.bullet}>• スムーズなタブ間ナビゲーション</Text>
            <Text style={styles.bullet}>• 動的なパラメータ受け渡し</Text>
            <Text style={styles.bullet}>• レスポンシブなUI表示</Text>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>📱 アーキテクチャ</Text>
          <Text style={styles.highlightText}>
            Expo Routerのタブベースナビゲーションを採用。
            画面間の移動がスムーズで、常に快適な操作性を提供します。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>詳細情報</Text>
          <Pressable
            style={styles.licenseButton}
            onPress={() => router.push("/license")}
          >
            <Text style={styles.licenseButtonText}>ライセンス情報 📄</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf8ff",
  },
  content: {
    padding: 20,
    gap: 16,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6b21a8",
  },
  subtitle: {
    fontSize: 16,
    color: "#7c3aed",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  cardContent: {
    gap: 12,
  },
  row: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: "#666",
    marginLeft: 16,
  },
  highlightBox: {
    backgroundColor: "#f3e8ff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8b4fe",
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7c3aed",
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#8b5cf6",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  licenseButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  licenseButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8b5cf6",
  },
  arrow: {
    fontSize: 24,
    color: "#999",
    fontWeight: "300",
  },
});
