import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Dumbbell, User, ArrowRight } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop' }}
        style={styles.background}
      >
        <LinearGradient
          colors={['rgba(11, 15, 25, 0.1)', 'rgba(11, 15, 25, 0.9)', 'rgba(11, 15, 25, 1)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            
            {/* Header / Logo */}
            <View style={styles.header}>
              <LinearGradient
                colors={['#6C63FF', '#4F46E5']}
                style={styles.logoBadge}
              >
                <Dumbbell color="#FFFFFF" size={40} style={{ transform: [{ scaleX: -1 }] }} />
              </LinearGradient>
              <ThemedText style={styles.title}>FitEmpire</ThemedText>
              <ThemedText style={styles.subtitle}>
                The ultimate platform for fitness enthusiasts and gym owners.
              </ThemedText>
            </View>

            {/* Get Started Button for Members */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.getStartedBtn}
                onPress={() => router.push('/login')}
              >
                <View style={styles.btnContent}>
                  <ThemedText style={styles.btnText}>Get Started with FitEmpire</ThemedText>
                  <ArrowRight color="#FFF" size={22} />
                </View>
              </TouchableOpacity>
              
              <ThemedText style={styles.memberTag}>
                All-Access Gym Passes • AI Workout Coach • Instant Entry
              </ThemedText>
            </View>

          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  },
  content: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  getStartedBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 18,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  memberTag: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  }
});
