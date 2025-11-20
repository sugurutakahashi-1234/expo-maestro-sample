import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: "", // 戻るボタン長押し時の表示を空にする
        }}
      />
      <Stack.Screen
        name="(modals)/help"
        options={{
          presentation: "modal",
          title: "ヘルプ"
        }}
      />
      <Stack.Screen
        name="(screens)/license"
        options={{
          presentation: "card",
          title: "ライセンス情報"
        }}
      />
      <Stack.Screen
        name="(screens)/login"
        options={{
          presentation: "card",
          title: "ログイン"
        }}
      />
    </Stack>
  );
}
