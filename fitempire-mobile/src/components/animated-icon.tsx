import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export function AnimatedSplashOverlay() {
  return null;
}

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Image style={styles.image} source={require('@/assets/images/icon.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  image: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
});
