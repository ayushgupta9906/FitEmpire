import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, Platform, useWindowDimensions, View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/services/auth-context';

SplashScreen.preventAutoHideAsync();

function AuthGuard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (isLoading) return;
    
    const isLoginScreen = segments[0] === 'login';
    const isRootScreen = segments.length === 0 || (segments.length === 1 && segments[0] === '');

    if (!isAuthenticated && !isLoginScreen && !isRootScreen) {
      router.replace('/');
    } else if (isAuthenticated && (isLoginScreen || isRootScreen)) {
      if (user?.role === 'PARTNER') {
        router.replace('/(partner-tabs)');
      } else {
        router.replace('/(tabs)');
      }
    }
    
  }, [isAuthenticated, isLoading, segments]);

  const isDesktopWeb = Platform.OS === 'web' && width > 480;

  if (isDesktopWeb) {
    return (
      <View style={styles.webContainer}>
        <View style={[styles.phoneFrame, { height: Math.min(height - 40, 840) }]}>
          <Slot />
          {isLoading && <AnimatedSplashOverlay />}
        </View>
      </View>
    );
  }

  return (
    <>
      <Slot />
      {isLoading && <AnimatedSplashOverlay />}
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard />
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#0d0e12',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      } as any
    })
  },
  phoneFrame: {
    width: 390,
    backgroundColor: '#000',
    borderRadius: 40,
    borderWidth: 12,
    borderColor: '#1f2026',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      } as any
    })
  }
});
