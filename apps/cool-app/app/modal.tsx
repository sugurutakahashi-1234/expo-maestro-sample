import { Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.title}>これはモーダルです！</Text>

        <Text style={styles.text}>
          この画面はタブナビゲーターの上にモーダルとして表示されています。
        </Text>

        <Text style={styles.text}>
          モーダルは以下のような場合に便利です:
        </Text>
        <Text style={styles.bullet}>• ユーザー入力の取得</Text>
        <Text style={styles.bullet}>• アラートや確認の表示</Text>
        <Text style={styles.bullet}>• 詳細ビューの表示</Text>
        <Text style={styles.bullet}>• メインナビゲーションとは別のフローの作成</Text>

        <View style={styles.codeBlock}>
          <Text style={styles.codeTitle}>設定:</Text>
          <Text style={styles.code}>
{`<Stack.Screen
  name="modal"
  options={{
    presentation: "modal"
  }}
/>`}
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>モーダルを閉じる</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#ccc",
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
    color: "#ccc",
    marginLeft: 20,
  },
  codeBlock: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 8,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#8be9fd",
    lineHeight: 18,
  },
  button: {
    paddingVertical: 16,
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
