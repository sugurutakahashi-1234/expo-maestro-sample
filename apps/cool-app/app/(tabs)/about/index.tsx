import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";

const TECHNOLOGIES = [
  { name: "expo", label: "Expo" },
  { name: "react-native", label: "React Native" },
  { name: "bun", label: "Bun" },
  { name: "typescript", label: "TypeScript" },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>このアプリについて</Text>

      <View style={styles.content}>
        <Text style={styles.text}>
          モダンなナビゲーションパターンを体験できるデモアプリケーションです。
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📱 タブ内プッシュ遷移デモ</Text>
          <Text style={styles.infoText}>
            各タブに独立したスタックナビゲーションを実装。
            技術スタックをタップすると、タブバーを維持したまま詳細画面へ遷移できます。
          </Text>
        </View>

        <Text style={styles.sectionTitle}>テクノロジースタック</Text>
        <Text style={styles.subtitle}>各技術の詳細をチェック ✨</Text>
        {TECHNOLOGIES.map((tech) => (
          <Pressable
            key={tech.name}
            style={styles.techCard}
            onPress={() => router.push(`/about/tech-details/${tech.name}`)}
          >
            <Text style={styles.techLabel}>{tech.label}</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.navigation}>
        <Link href="/profile" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>プロフィールページへ</Text>
          </Pressable>
        </Link>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/help")}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            サポートセンター
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf8ff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6b21a8",
    padding: 20,
    paddingBottom: 0,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  techCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  techLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  arrow: {
    fontSize: 24,
    color: "#ccc",
  },
  infoBox: {
    backgroundColor: "#f3e8ff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8b4fe",
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7c3aed",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#8b5cf6",
  },
  navigation: {
    padding: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    alignItems: "center",
    boxShadow: "0px 2px 4px rgba(139, 92, 246, 0.3)",
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#a855f7",
  },
  secondaryButtonText: {
    color: "#8b5cf6",
  },
});
