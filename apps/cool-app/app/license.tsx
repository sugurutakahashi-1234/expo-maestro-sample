import { Text, View, StyleSheet, ScrollView } from "react-native";

const LICENSES = [
  {
    name: "React Native",
    license: "MIT License",
    url: "https://github.com/facebook/react-native",
    description: "モバイルアプリケーション開発のためのフレームワーク",
  },
  {
    name: "Expo",
    license: "MIT License",
    url: "https://github.com/expo/expo",
    description: "React Nativeアプリケーションを構築するためのフレームワーク",
  },
  {
    name: "Expo Router",
    license: "MIT License",
    url: "https://github.com/expo/expo",
    description: "ファイルベースのルーティングシステム",
  },
  {
    name: "React",
    license: "MIT License",
    url: "https://github.com/facebook/react",
    description: "ユーザーインターフェースを構築するためのJavaScriptライブラリ",
  },
  {
    name: "TypeScript",
    license: "Apache License 2.0",
    url: "https://github.com/microsoft/TypeScript",
    description: "JavaScriptに型システムを追加した言語",
  },
];

export default function LicenseScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ライセンス情報</Text>
          <Text style={styles.subtitle}>
            このアプリで使用されているオープンソースライブラリ
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>🔳 ルートレベルプッシュ遷移</Text>
          <Text style={styles.highlightText}>
            この画面はルートスタックの一部です。タブバーが非表示になり、全画面で表示されています。
            戻るボタンで前の画面に戻ることができます。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>オープンソースライセンス</Text>
          {LICENSES.map((lib, index) => (
            <View key={index} style={styles.licenseCard}>
              <Text style={styles.libName}>{lib.name}</Text>
              <Text style={styles.libLicense}>{lib.license}</Text>
              <Text style={styles.libDescription}>{lib.description}</Text>
              <Text style={styles.libUrl}>{lib.url}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            これらのライブラリの開発者とコントリビューターの皆様に感謝します。
          </Text>
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
  },
  highlightBox: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#90caf9",
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565c0",
    marginBottom: 8,
  },
  highlightText: {
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
  licenseCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  libName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  libLicense: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
  },
  libDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  libUrl: {
    fontSize: 12,
    color: "#999",
    fontFamily: "monospace",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
