import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "記事一覧",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="article/[id]"
        options={{
          title: "記事詳細",
          presentation: "card",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
