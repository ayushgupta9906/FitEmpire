import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Compass } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

export default function ExploreWebScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.webFallback}>
        <Compass size={48} color="#6C63FF" style={{ marginBottom: 16 }} />
        <ThemedText style={{ textAlign: 'center', fontWeight: '700', fontSize: 18 }}>
          Interactive Map is not supported on Web preview.
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', marginTop: 8 }} themeColor="textSecondary">
          Please use the Expo Go app on your phone to view the live Google Maps integration.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webFallback: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }
});
