import { Stack } from "expo-router";

export default function AboutLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "このアプリについての説明",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="tech-details/[name]"
        options={{
          title: "技術詳細",
          presentation: "card",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
