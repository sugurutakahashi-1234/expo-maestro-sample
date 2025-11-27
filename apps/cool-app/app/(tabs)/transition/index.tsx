import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const PRESENTATION_STYLES = [
  {
    route: "sample-card",
    name: "Card",
    description: "スタックにプッシュ。iOSでは横スライド、Androidではテーマに応じた動き。",
    platform: "iOS / Android",
  },
  {
    route: "sample-modal",
    name: "Modal",
    description: "モーダル表示。下から上にスライドアップ。ネストされたスタックも可能。",
    platform: "iOS / Android",
  },
  {
    route: "sample-transparent-modal",
    name: "Transparent Modal",
    description: "透明なモーダル。前の画面が背景として見える。",
    platform: "iOS / Android",
  },
  {
    route: "sample-contained-modal",
    name: "Contained Modal",
    description: "UIModalPresentationCurrentContext（iOS）。Androidではmodalにフォールバック。",
    platform: "iOS / Android",
  },
  {
    route: "sample-contained-transparent-modal",
    name: "Contained Transparent Modal",
    description: "UIModalPresentationOverCurrentContext（iOS）。Androidではtransparent modalにフォールバック。",
    platform: "iOS / Android",
  },
  {
    route: "sample-fullscreen-modal",
    name: "Full Screen Modal",
    description: "UIModalPresentationFullScreen（iOS）。Androidではmodalにフォールバック。",
    platform: "iOS / Android",
  },
  {
    route: "sample-formsheet",
    name: "Form Sheet",
    description: "UIModalPresentationFormSheet（iOS）。iPadではシート表示。Androidではmodalにフォールバック。",
    platform: "iOS / Android",
  },
];

export default function TransitionDemoScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Presentation スタイルデモ</Text>
          <Text style={styles.subtitle}>
            React Navigationの様々な画面表示スタイルを試すことができます
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📱 使い方</Text>
          <Text style={styles.infoText}>
            各ボタンをタップすると、対応する presentation スタイルでサンプル画面が表示されます。
          </Text>
          <Text style={styles.infoText}>
            iOS と Android で動作が異なる場合があります。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>利用可能なスタイル</Text>
          {PRESENTATION_STYLES.map((style) => (
            <Pressable
              key={style.route}
              style={styles.styleCard}
              onPress={() => router.push(`/transition/${style.route}` as any)}
            >
              <View style={styles.styleContent}>
                <View style={styles.styleHeader}>
                  <Text style={styles.styleName}>{style.name}</Text>
                  <Text style={styles.stylePlatform}>{style.platform}</Text>
                </View>
                <Text style={styles.styleDescription}>{style.description}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          ))}
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
    gap: 20,
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
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  styleCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  styleContent: {
    flex: 1,
    gap: 8,
  },
  styleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  styleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  stylePlatform: {
    fontSize: 11,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  styleDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  arrow: {
    fontSize: 24,
    color: "#999",
    fontWeight: "300",
    marginLeft: 12,
  },
});
