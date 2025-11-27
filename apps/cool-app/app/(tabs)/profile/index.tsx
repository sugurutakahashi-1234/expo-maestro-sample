import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ProfileScreen() {
  const params = useLocalSearchParams();
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
          <Text style={styles.label}>ユーザー名:</Text>
          <Text style={styles.value}>{username}</Text>
          <Text style={styles.label}>メール:</Text>
          <Text style={styles.value}>developer@coolapp.com</Text>
          <Text style={styles.label}>登録日:</Text>
          <Text style={styles.value}>2025年1月</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>このタブについて</Text>
          <Text style={styles.infoText}>
            これはシンプルなプロフィールタブ画面です。以下を示しています:
          </Text>
          <Text style={styles.bullet}>- タブナビゲーション（3つのタブのうちの1つ）</Text>
          <Text style={styles.bullet}>- ルートパラメータの読み取り</Text>
          <Text style={styles.bullet}>- 基本的なユーザー情報の表示</Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>📱 ナビゲーションパターン</Text>
          <Text style={styles.highlightText}>
            この画面はTabsナビゲーターの一部です。タブバーに常に表示され、プロフィールタブをタップすることでいつでもアクセスできます。
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 18,
  },
  header: {
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
  bullet: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
    marginBottom: 6,
  },
  highlightBox: {
    backgroundColor: "#e8f3ea",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cfe8d5",
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#1f2937",
  },
});
