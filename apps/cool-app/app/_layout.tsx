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
        name="modal"
        options={{
          presentation: "modal",
          title: "モーダル例"
        }}
      />
      <Stack.Screen
        name="license"
        options={{
          presentation: "card",
          title: "ライセンス情報"
        }}
      />
    </Stack>
  );
}
