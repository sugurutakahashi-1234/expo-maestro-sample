import { Text, View, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function SampleContainedTransparentModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.badge}>containedTransparentModal</Text>
            <Text style={styles.title}>Contained Transparent Modal</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📱 このスタイルについて</Text>
            <Text style={styles.infoText}>
              Contained Transparent Modalとして表示されました。iOSでは UIModalPresentationOverCurrentContext、Androidでは透明モーダルになります。
            </Text>
          </View>

          <View style={styles.transparentNote}>
            <Text style={styles.transparentNoteText}>
              💡 この画面は半透明の背景を使用しています。前の画面が透けて見えることを確認してください。
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
              <Text style={styles.detailValue}>containedTransparentModal</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    fontSize: 20,
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
  transparentNote: {
    backgroundColor: "#fff3cd",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffc107",
  },
  transparentNoteText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#856404",
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
