import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { QrCode, Clock, ShieldCheck, CheckCircle2, RefreshCw, ArrowLeft, Zap, Sparkles, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { bookingsApi } from '@/services/api';

const { width } = Dimensions.get('window');

export default function QrCheckinScreen() {
  const { bookingId, gymName, branchName } = useLocalSearchParams<{ bookingId: string; gymName: string; branchName: string }>();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [activeTab, setActiveTab] = useState<'MY_PASS' | 'SCAN_VENUE'>('MY_PASS');
  const [timeLeft, setTimeLeft] = useState(60);
  const [qrToken, setQrToken] = useState(bookingId ? `EMPIRE-${bookingId.substring(0, 12).toUpperCase()}` : 'EMPIRE-PASS-MEMBER');
  const [unlockedGate, setUnlockedGate] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScanGymQr = async () => {
    setLoadingScan(true);
    try {
      if (bookingId) {
        // Use real API to verify QR with the booking
        const userId = 'current'; // Backend extracts from JWT
        await bookingsApi.getQrCode(bookingId, userId);
      }
      setUnlockedGate(true);
      Alert.alert('Turnstile Unlocked! 🟢', `Welcome to ${gymName || 'your gym'}! +50 FitPoints added to your wallet.`);
    } catch (e: any) {
      const errMsg = e?.response?.data?.message || 'Could not verify the QR code. Please try again.';
      console.warn('QR scan failed:', e);
      Alert.alert('Scan Failed', errMsg);
    } finally {
      setLoadingScan(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Fast Entry & QR Gate</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      {/* Mode Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'MY_PASS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('MY_PASS')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'MY_PASS' && styles.tabTextActive]}>
            My Entry QR Pass
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'SCAN_VENUE' && styles.tabBtnActive]}
          onPress={() => setActiveTab('SCAN_VENUE')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'SCAN_VENUE' && styles.tabTextActive]}>
            Scan Venue QR
          </ThemedText>
        </TouchableOpacity>
      </View>

      {activeTab === 'MY_PASS' ? (
        <View style={styles.content}>
          {/* Active Pass Card */}
          <LinearGradient colors={['#1E1B4B', '#0F172A']} style={styles.qrCard}>
            <View style={styles.passTopRow}>
              <View style={styles.badgeWrap}>
                <ShieldCheck size={14} color="#6C63FF" />
                <ThemedText style={styles.badgeText}>FITEMPIRE VERIFIED</ThemedText>
              </View>
              <View style={styles.liveTag}>
                <View style={styles.dot} />
                <ThemedText style={styles.liveText}>ACTIVE PASS</ThemedText>
              </View>
            </View>

            <ThemedText style={styles.venueTitle}>{gymName || 'FitEmpire Partner Gym'}</ThemedText>
            <View style={styles.locationRow}>
              <MapPin size={13} color="#A78BFA" />
              <ThemedText style={styles.locationText}>{branchName || 'Partner Location'}</ThemedText>
            </View>

            {/* QR Pattern Frame */}
            <View style={styles.qrContainer}>
              <QrCode size={180} color="#0F172A" />
            </View>

            <ThemedText style={styles.tokenText}>{qrToken}</ThemedText>

            <View style={styles.timerRow}>
              <Clock size={14} color="#F59E0B" />
              <ThemedText style={styles.timerText}>Refreshes in {timeLeft}s</ThemedText>
            </View>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Scan Venue QR */}
          <View style={[styles.scanVenueCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.laserBox}>
              <QrCode size={64} color="#38BDF8" style={{ opacity: 0.7 }} />
            </View>

            <ThemedText style={{ fontSize: 16, fontWeight: '800', textAlign: 'center', marginTop: 14 }}>
              Scan Reception / Turnstile QR
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 4 }}>
              Point at the reception QR code for automated turnstile gate unlock.
            </ThemedText>

            <TouchableOpacity
              style={styles.scanActionBtn}
              onPress={handleScanGymQr}
              disabled={loadingScan}
            >
              {loadingScan ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Zap size={16} color="#FFF" />
                  <ThemedText style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>
                    Simulate Reception Check-In
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>

            {unlockedGate && (
              <View style={styles.gateUnlockedPill}>
                <CheckCircle2 size={16} color="#10B981" />
                <ThemedText style={{ fontSize: 12, fontWeight: '800', color: '#10B981' }}>
                  🟢 Gate Unlocked • Access Granted
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#6C63FF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#FFF',
  },
  content: {
    paddingHorizontal: 20,
  },
  qrCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  passTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A5B4FC',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  venueTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#A78BFA',
  },
  qrContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 14,
  },
  tokenText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  timerText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '700',
  },
  scanVenueCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  laserBox: {
    width: 140,
    height: 140,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
  },
  scanActionBtn: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  gateUnlockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 14,
  },
});
