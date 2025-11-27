import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';

export interface GreetingProps {
  name: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * A simple greeting component from the cool-package
 */
export function Greeting({ name, style, textStyle }: GreetingProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>
        Hello, {name}! 👋
      </Text>
      <Text style={styles.subtext}>
        This component is from cool-package
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
  },
});

/**
 * A simple utility function
 */
export function formatMessage(message: string): string {
  return `📦 cool-package says: ${message}`;
}

/**
 * Get a greeting message
 */
export function getGreetingTime(): string {
  return 'Welcome';
}
