import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
      <Stack.Screen
        name="presentation-demo"
        options={{
          presentation: "card",
          title: "Presentation デモ"
        }}
      />
      <Stack.Screen
        name="sample-card"
        options={{
          presentation: "card",
          title: "Card"
        }}
      />
      <Stack.Screen
        name="sample-modal"
        options={{
          presentation: "modal",
          title: "Modal"
        }}
      />
      <Stack.Screen
        name="sample-transparent-modal"
        options={{
          presentation: "transparentModal",
          title: "Transparent Modal"
        }}
      />
      <Stack.Screen
        name="sample-contained-modal"
        options={{
          presentation: "containedModal",
          title: "Contained Modal"
        }}
      />
      <Stack.Screen
        name="sample-contained-transparent-modal"
        options={{
          presentation: "containedTransparentModal",
          title: "Contained Transparent Modal"
        }}
      />
      <Stack.Screen
        name="sample-fullscreen-modal"
        options={{
          presentation: "fullScreenModal",
          title: "Full Screen Modal"
        }}
      />
      <Stack.Screen
        name="sample-formsheet"
        options={{
          presentation: "formSheet",
          title: "Form Sheet"
        }}
      />
    </Stack>
  );
}
