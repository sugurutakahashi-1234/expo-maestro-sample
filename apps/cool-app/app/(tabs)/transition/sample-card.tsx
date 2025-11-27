import { Text, View, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function SampleCardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.badge}>card</Text>
            <Text style={styles.title}>Card</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📱 このスタイルについて</Text>
            <Text style={styles.infoText}>
              スタックにプッシュされました。iOSでは横からスライドイン、Androidではテーマに応じた動きをします。
            </Text>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailTitle}>プラットフォーム情報</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>現在:</Text>
              <Text style={styles.detailValue}>{Platform.OS === "ios" ? "iOS" : "Android"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>OS バージョン:</Text>
              <Text style={styles.detailValue}>{Platform.Version}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Presentation:</Text>
              <Text style={styles.detailValue}>card</Text>
            </View>
          </View>

          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>← 戻る</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    gap: 20,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
    elevation: 5,
  },
  header: {
    alignItems: "center",
    gap: 12,
  },
  badge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  detailBox: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
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
});
