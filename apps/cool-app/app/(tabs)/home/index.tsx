import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Greeting, formatMessage, getGreetingTime } from "cool-package";

const ARTICLES = [
  { id: "1", title: "Expo Routerの始め方", category: "チュートリアル" },
  { id: "2", title: "モノレポで始める快適開発", category: "ガイド" },
  { id: "3", title: "モダンなナビゲーション実装", category: "チュートリアル" },
  { id: "4", title: "型安全な開発のコツ", category: "ヒント" },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expo モノレポ with Bun 🎉</Text>
        <Text style={styles.subtitle}>{formatMessage(getGreetingTime())}</Text>
        <Greeting name="開発者" />
        <Text style={styles.info}>
          モノレポアーキテクチャで構築された(テスト)開発環境です 🚀
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 記事リスト</Text>

        {ARTICLES.map((article) => (
          <Pressable
            key={article.id}
            accessibilityLabel={article.title}
            style={styles.articleCard}
            onPress={() => router.push({
              pathname: "/home/article/[id]",
              params: { id: article.id, title: article.title, category: article.category }
            })}
          >
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleCategory}>{article.category}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔗 クイックリンク</Text>

        <Link href="/about" style={styles.link}>
          <Text style={styles.linkText}>このアプリについて</Text>
        </Link>

        <Link href="/profile" style={styles.link}>
          <Text style={styles.linkText}>プロフィール</Text>
        </Link>

        <Link href="/help" style={styles.link}>
          <Text style={styles.linkText}>サポートページ</Text>
        </Link>

        <Link href="/login" style={styles.link}>
          <Text style={styles.linkText}>ログインデモ (Maestroテスト用)</Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#faf8ff",
  },
  container: {
    padding: 20,
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
    elevation: 3,
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
  info: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  articleCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  articleContent: {
    flex: 1,
    gap: 4,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  articleCategory: {
    fontSize: 12,
    color: "#a855f7",
    fontWeight: "500",
  },
  chevron: {
    fontSize: 24,
    color: "#c084fc",
    fontWeight: "300",
    marginLeft: 12,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    boxShadow: "0px 2px 4px rgba(139, 92, 246, 0.3)",
    elevation: 4,
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
