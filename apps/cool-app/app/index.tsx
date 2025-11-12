import { Text, View, StyleSheet } from "react-native";
import { Greeting, formatMessage, getGreetingTime } from "cool-package";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Monorepo with Bun</Text>
      <Text style={styles.subtitle}>{formatMessage(getGreetingTime())}</Text>
      <Greeting name="Developer" />
      <Text style={styles.info}>
        This component is imported from cool-package workspace
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  info: {
    fontSize: 12,
    color: "#999",
    marginTop: 20,
  },
});
