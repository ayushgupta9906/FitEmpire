import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NetworkStatusBannerProps {
  isConnected: boolean;
}

export const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({ isConnected }) => {
  if (isConnected) return null;

  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.bannerText}>
        ⚠️ No internet connection. Offline passes remain active.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
