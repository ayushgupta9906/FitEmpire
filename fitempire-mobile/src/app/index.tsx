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
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

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
              <View style={styles.logoBadge}>
                <Dumbbell color="#4F46E5" size={40} />
              </View>
              <ThemedText style={styles.title}>FitEmpire</ThemedText>
              <ThemedText style={styles.subtitle}>
                The ultimate platform for fitness enthusiasts and gym owners.
              </ThemedText>
            </View>

            {/* Selection Buttons */}
            <View style={styles.buttonContainer}>
              <ThemedText style={styles.prompt}>How would you like to continue?</ThemedText>
              
              {/* User Button */}
              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                onPress={() => router.push({ pathname: '/login', params: { mode: 'USER' } })}
              >
                <View style={[styles.iconBox, { backgroundColor: '#4F46E5' }]}>
                  <User color="#FFF" size={24} />
                </View>
                <View style={styles.cardText}>
                  <ThemedText style={styles.cardTitle}>I am a Member</ThemedText>
                  <ThemedText style={styles.cardDesc}>Find gyms and book classes</ThemedText>
                </View>
                <ArrowRight color="#FFF" size={20} />
              </TouchableOpacity>

              {/* Partner Button */}
              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                onPress={() => router.push({ pathname: '/login', params: { mode: 'PARTNER' } })}
              >
                <View style={[styles.iconBox, { backgroundColor: '#10B981' }]}>
                  <Dumbbell color="#FFF" size={24} />
                </View>
                <View style={styles.cardText}>
                  <ThemedText style={styles.cardTitle}>I am a Gym Partner</ThemedText>
                  <ThemedText style={styles.cardDesc}>Manage your fitness business</ThemedText>
                </View>
                <ArrowRight color="#FFF" size={20} />
              </TouchableOpacity>
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
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
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
  prompt: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 16,
    marginLeft: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  }
});
