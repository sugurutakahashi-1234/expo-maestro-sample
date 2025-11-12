import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const TECH_INFO: Record<string, { description: string; features: string[]; version: string }> = {
  "expo": {
    description: "Expoは、React Nativeアプリケーションを構築するためのフレームワークとプラットフォームです。開発者体験を向上させ、ネイティブ機能への簡単なアクセスを提供します。",
    features: [
      "ファイルベースのルーティング",
      "ユニバーサルアプリ対応（iOS、Android、Web）",
      "OTAアップデート",
      "豊富なネイティブAPIライブラリ"
    ],
    version: "SDK 54"
  },
  "react-native": {
    description: "React Nativeは、JavaScriptとReactを使用してネイティブモバイルアプリケーションを構築するためのフレームワークです。",
    features: [
      "クロスプラットフォーム開発",
      "ホットリロード",
      "ネイティブパフォーマンス",
      "豊富なエコシステム"
    ],
    version: "0.81.5"
  },
  "bun": {
    description: "Bunは、高速なJavaScriptランタイム、パッケージマネージャー、バンドラー、テストランナーです。Node.jsとnpmの代替として設計されています。",
    features: [
      "超高速なパッケージインストール",
      "ワークスペース対応",
      "TypeScriptネイティブサポート",
      "ビルトインバンドラー"
    ],
    version: "1.3.2"
  },
  "typescript": {
    description: "TypeScriptは、JavaScriptに静的型付けを追加したプログラミング言語です。大規模なアプリケーション開発において、バグを減らし、保守性を向上させます。",
    features: [
      "静的型チェック",
      "優れたIDE補完",
      "最新のECMAScript機能",
      "段階的な導入が可能"
    ],
    version: "5.9.2"
  },
};

export default function TechDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const techName = String(params.name || "").toLowerCase();
  const techInfo = TECH_INFO[techName];

  if (!techInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>技術情報が見つかりません</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{techName.toUpperCase()}</Text>
        <Text style={styles.version}>バージョン: {techInfo.version}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>📱 タブ内プッシュ遷移</Text>
          <Text style={styles.highlightText}>
            この画面もAboutタブ内のスタックナビゲーションです。
          </Text>
          <Text style={styles.highlightText}>
            タブバーが表示されたままで、Aboutタブのコンテキストが維持されています。
          </Text>
        </View>

        <Text style={styles.sectionTitle}>説明</Text>
        <Text style={styles.paragraph}>{techInfo.description}</Text>

        <Text style={styles.sectionTitle}>主な機能</Text>
        {techInfo.features.map((feature, index) => (
          <Text key={index} style={styles.bullet}>
            • {feature}
          </Text>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 ナビゲーションパターン</Text>
          <Text style={styles.infoText}>
            この画面は app/(tabs)/about/tech-details/[name].tsx に配置されています。
          </Text>
          <Text style={styles.infoText}>
            Aboutタブ内の独立したスタックナビゲーターで管理されています。
          </Text>
        </View>

        <View style={styles.navInfoBox}>
          <Text style={styles.navInfoTitle}>🔄 ナビゲーション状態の特徴</Text>
          <Text style={styles.bullet}>• Aboutタブのスタック履歴に追加される</Text>
          <Text style={styles.bullet}>• 他のタブに切り替えても状態が保持される</Text>
          <Text style={styles.bullet}>• Aboutタブに戻ると、この画面の状態が復元される</Text>
          <Text style={styles.bullet}>• 各タブが独立したナビゲーション履歴を持つ</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>← Aboutに戻る</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#007AFF",
    paddingTop: 20,
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  version: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  bullet: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
    marginLeft: 16,
  },
  highlightBox: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#90caf9",
    gap: 8,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565c0",
  },
  highlightText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#1976d2",
  },
  infoBox: {
    backgroundColor: "#fff3e0",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffb74d",
    gap: 8,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e65100",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#f57c00",
  },
  navInfoBox: {
    backgroundColor: "#f3e5f5",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ce93d8",
    gap: 8,
    marginTop: 16,
  },
  navInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6a1b9a",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
  actions: {
    padding: 20,
    gap: 12,
    marginTop: 20,
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
