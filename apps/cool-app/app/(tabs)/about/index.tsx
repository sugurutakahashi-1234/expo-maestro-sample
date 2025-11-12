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
          これはExpo Routerのナビゲーションパターンを学習するためのデモアプリです。
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📱 タブ内プッシュ遷移デモ</Text>
          <Text style={styles.infoText}>
            このタブにも独自のスタックナビゲーターがあります。
            下記の技術スタックをタップすると、タブバーが表示されたまま詳細画面に遷移します。
          </Text>
        </View>

        <Text style={styles.sectionTitle}>使用技術</Text>
        <Text style={styles.subtitle}>タップして詳細を表示</Text>
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
            <Text style={styles.buttonText}>プロフィールを見る</Text>
          </Pressable>
        </Link>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/modal")}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            モーダルを開く
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#90caf9",
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565c0",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#1976d2",
  },
  navigation: {
    padding: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
});
