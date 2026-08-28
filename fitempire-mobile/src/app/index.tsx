import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Platform } from 'react-native';
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
                <View style={{ transform: [{ scaleX: -1 }], ...(Platform.OS === 'web' ? { transform: 'scaleX(-1)' } : {}) }}>
                  <Dumbbell color="#FFFFFF" size={42} strokeWidth={2.3} />
                </View>
              </LinearGradient>
              <ThemedText style={styles.title}>FitEmpire</ThemedText>
              <ThemedText style={styles.subtitle}>
                The ultimate platform for fitness enthusiasts and gym owners.
              </ThemedText>
            </View>

            {/* Dual Apps Selection Section */}
            <View style={styles.buttonContainer}>
              <ThemedText style={styles.selectAppTitle}>SELECT APPLICATION TO LAUNCH:</ThemedText>

              {/* APP 1: Member App Card */}
              <TouchableOpacity
                style={styles.appCard}
                activeOpacity={0.88}
                onPress={() => router.push('/(tabs)')}
              >
                <LinearGradient
                  colors={['#4F46E5', '#4338CA']}
                  style={styles.appCardGradient}
                >
                  <View style={styles.appCardTop}>
                    <View style={styles.appIconBadge}>
                      <ThemedText style={{ fontSize: 22 }}>📱</ThemedText>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <ThemedText style={styles.appCardTitle}>FitEmpire Member App</ThemedText>
                      <ThemedText style={styles.appCardSub}>
                        12,000+ Gyms • 60s Dynamic QR Ticket • AI Workout • 1-Tap Freeze
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.launchRow}>
                    <ThemedText style={styles.launchText}>Open Member App</ThemedText>
                    <ArrowRight color="#FFF" size={16} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* APP 2: Partner Scanner App Card */}
              <TouchableOpacity
                style={styles.appCard}
                activeOpacity={0.88}
                onPress={() => router.push('/(partner-tabs)' as any)}
              >
                <LinearGradient
                  colors={['#0F172A', '#1E293B']}
                  style={[styles.appCardGradient, { borderColor: '#38BDF8', borderWidth: 1.5 }]}
                >
                  <View style={styles.appCardTop}>
                    <View style={[styles.appIconBadge, { backgroundColor: 'rgba(56, 189, 248, 0.2)' }]}>
                      <ThemedText style={{ fontSize: 22 }}>🏢</ThemedText>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <ThemedText style={[styles.appCardTitle, { color: '#38BDF8' }]}>
                        FitEmpire Partner App
                      </ThemedText>
                      <ThemedText style={styles.appCardSub}>
                        Camera QR Scanner • Live Attendance Log • Turnstiles • Payouts
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.launchRow}>
                    <ThemedText style={[styles.launchText, { color: '#38BDF8' }]}>
                      Open Partner Scanner App
                    </ThemedText>
                    <ArrowRight color="#38BDF8" size={16} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <ThemedText style={styles.memberTag}>
                ⚡ Real-time synchronization between Member Pass & Partner Scanner
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
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  selectAppTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  appCard: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  appCardGradient: {
    padding: 16,
    borderRadius: 20,
  },
  appCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  appCardSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
    lineHeight: 15,
  },
  launchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  launchText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  memberTag: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
});
