import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    // デモのため、どんな値でもログイン成功とする
    Alert.alert("ログイン成功", `${email} でログインしました`, [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ログイン</Text>
          <Text style={styles.subtitle}>
            Maestroテキスト入力デモ
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>🧪 テスト用画面</Text>
          <Text style={styles.highlightText}>
            この画面はMaestroでのテキスト入力テストのために作成されました。
            メールアドレスとパスワードを入力してログインボタンをタップしてください。
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="test@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            accessibilityLabel="メールアドレス入力欄"
            testID="email-input"
          />

          <Text style={[styles.label, styles.labelSpacing]}>パスワード</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="パスワードを入力"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            accessibilityLabel="パスワード入力欄"
            testID="password-input"
          />

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
            onPress={handleLogin}
            accessibilityLabel="ログインボタン"
            testID="login-button"
          >
            <Text style={styles.loginButtonText}>ログイン</Text>
          </Pressable>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>入力された情報:</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>メール:</Text>
            <Text style={styles.infoValue} testID="email-display">
              {email || "(未入力)"}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>パスワード:</Text>
            <Text style={styles.infoValue} testID="password-display">
              {password ? "●".repeat(password.length) : "(未入力)"}
            </Text>
          </View>
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
    gap: 24,
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
  formSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  labelSpacing: {
    marginTop: 20,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  loginButtonPressed: {
    backgroundColor: "#0051D5",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  infoSection: {
    gap: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
  },
});
