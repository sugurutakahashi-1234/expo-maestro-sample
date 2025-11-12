import { Text, View, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function SampleFormSheetScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.badge}>formSheet</Text>
            <Text style={styles.title}>Form Sheet</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📱 このスタイルについて</Text>
            <Text style={styles.infoText}>
              Form Sheetとして表示されました。iOSでは UIModalPresentationFormSheet（iPadでシート表示）、Androidでは通常のモーダルになります。
            </Text>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              💡 iPadでは中央にシート形式で表示され、背景が見えます。iPhoneでは通常のモーダルと同じになります。
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
              <Text style={styles.detailValue}>formSheet</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
  noteBox: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#90caf9",
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#1565c0",
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
