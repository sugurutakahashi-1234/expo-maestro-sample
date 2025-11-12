import { Stack } from "expo-router";

export default function TransitionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "default",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "画面遷移デモ",
        }}
      />
      <Stack.Screen
        name="sample-card"
        options={{
          presentation: "card",
          title: "Card",
        }}
      />
      <Stack.Screen
        name="sample-modal"
        options={{
          presentation: "modal",
          title: "Modal",
        }}
      />
      <Stack.Screen
        name="sample-transparent-modal"
        options={{
          presentation: "transparentModal",
          title: "Transparent Modal",
        }}
      />
      <Stack.Screen
        name="sample-contained-modal"
        options={{
          presentation: "containedModal",
          title: "Contained Modal",
        }}
      />
      <Stack.Screen
        name="sample-contained-transparent-modal"
        options={{
          presentation: "containedTransparentModal",
          title: "Contained Transparent Modal",
        }}
      />
      <Stack.Screen
        name="sample-fullscreen-modal"
        options={{
          presentation: "fullScreenModal",
          title: "Full Screen Modal",
        }}
      />
      <Stack.Screen
        name="sample-formsheet"
        options={{
          presentation: "formSheet",
          title: "Form Sheet",
        }}
      />
    </Stack>
  );
}
