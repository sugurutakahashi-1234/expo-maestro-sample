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
          <Text style={styles.subtitle}>ようこそ、{username}さん!</Text>
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
              <Text style={styles.value}>developer@coolapp.com</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>登録日:</Text>
              <Text style={styles.value}>2025年1月</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>このタブについて</Text>
          <View style={styles.cardContent}>
            <Text style={styles.infoText}>
              これはシンプルなプロフィールタブ画面です。以下を示しています:
            </Text>
            <Text style={styles.bullet}>• タブナビゲーション（3つのタブのうちの1つ）</Text>
            <Text style={styles.bullet}>• ルートパラメータの読み取り</Text>
            <Text style={styles.bullet}>• 基本的なユーザー情報の表示</Text>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>📱 ナビゲーションパターン</Text>
          <Text style={styles.highlightText}>
            この画面はTabsナビゲーターの一部です。タブバーに常に表示され、
            プロフィールタブをタップすることでいつでもアクセスできます。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリ情報</Text>
          <Pressable
            style={styles.licenseButton}
            onPress={() => router.push("/license")}
          >
            <Text style={styles.licenseButtonText}>ライセンス情報 📄</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>開発者向けデモ</Text>
          <Pressable
            style={styles.licenseButton}
            onPress={() => router.push("/presentation-demo")}
          >
            <Text style={styles.licenseButtonText}>Presentation スタイル 🎭</Text>
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
    backgroundColor: "#f5f5f5",
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
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
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
    backgroundColor: "#e8f5e9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a5d6a7",
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#388e3c",
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
    color: "#007AFF",
  },
  arrow: {
    fontSize: 24,
    color: "#999",
    fontWeight: "300",
  },
});
