import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { QrCode, MapPin, RefreshCw, Calendar, Clock, ShieldCheck, Dumbbell, Sparkles, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bookingsApi } from '@/services/api';

const { width } = Dimensions.get('window');

export default function TicketScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  
  const [booking, setBooking] = useState<any>(null);
  const [qrToken, setQrToken] = useState<string>('EMPIRE-PASS-880072520');
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPassData();
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          generateFreshToken();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const generateFreshToken = () => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    setQrToken(`EMPIRE-TOKEN-${randomSuffix}-${Date.now().toString().slice(-4)}`);
  };

  const fetchPassData = async () => {
    if (bookingId) {
      setLoading(true);
      try {
        const res = await bookingsApi.getQrCode(bookingId);
        if (res.data?.data) {
          setBooking(res.data.data);
          setQrToken(res.data.data.qrCodeData || `EMPIRE-${bookingId}`);
        }
      } catch (e) {
        console.warn('Could not fetch booking QR:', e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <ThemedText style={styles.headerTitle}>Digital Entry Ticket</ThemedText>
        <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
          Scan at reception for instant gym access
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Master Ticket Card */}
        <LinearGradient
          colors={['#1E1B4B', '#0F172A']}
          style={[styles.ticketCard, { borderColor: 'rgba(108, 99, 255, 0.3)' }]}
        >
          {/* Top Ticket Header */}
          <View style={styles.ticketTopRow}>
            <View style={styles.brandBadge}>
              <Dumbbell size={16} color="#6C63FF" />
              <ThemedText style={styles.brandBadgeText}>FITEMPIRE PASS</ThemedText>
            </View>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <ThemedText style={styles.liveText}>ACTIVE</ThemedText>
            </View>
          </View>

          {/* Gym Venue Info */}
          <View style={styles.venueSection}>
            <ThemedText style={styles.venueName}>
              {booking?.gymName || 'Iron Culture Gym & Fitness'}
            </ThemedText>
            <View style={styles.venueRow}>
              <MapPin size={14} color="#A78BFA" />
              <ThemedText style={styles.venueLocation}>
                {booking?.branchName || 'Sector 167, Main Express Highway, Noida'}
              </ThemedText>
            </View>
          </View>

          {/* Punch Holes Divider */}
          <View style={styles.dividerWrap}>
            <View style={[styles.punchHole, styles.punchLeft, { backgroundColor: colors.background }]} />
            <View style={styles.dashedLine} />
            <View style={[styles.punchHole, styles.punchRight, { backgroundColor: colors.background }]} />
          </View>

          {/* Dynamic QR Display Area */}
          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              {/* High Tech QR Visual Pattern */}
              <View style={styles.qrMatrix}>
                <View style={styles.qrCornerTL} />
                <View style={styles.qrCornerTR} />
                <View style={styles.qrCornerBL} />
                <View style={styles.qrCenterVisual}>
                  <QrCode size={160} color="#0F172A" />
                </View>
              </View>
            </View>

            {/* Token details */}
            <ThemedText style={styles.tokenText}>{qrToken}</ThemedText>

            {/* Refresh countdown */}
            <View style={styles.timerRow}>
              <Clock size={13} color="#F59E0B" />
              <ThemedText style={styles.timerText}>Refreshes in {timeLeft}s</ThemedText>
              <TouchableOpacity onPress={generateFreshToken} style={styles.refreshBtn}>
                <RefreshCw size={12} color="#6C63FF" />
                <ThemedText style={styles.refreshTxt}>Refresh</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ticket Footer Meta */}
          <View style={styles.ticketFooter}>
            <View style={styles.footerItem}>
              <ThemedText style={styles.footerLabel}>DATE</ThemedText>
              <ThemedText style={styles.footerVal}>Today</ThemedText>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerItem}>
              <ThemedText style={styles.footerLabel}>ENTRY TYPE</ThemedText>
              <ThemedText style={styles.footerVal}>All-Access</ThemedText>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerItem}>
              <ThemedText style={styles.footerLabel}>MEMBER ID</ThemedText>
              <ThemedText style={styles.footerVal}>#1988007</ThemedText>
            </View>
          </View>
        </LinearGradient>

        {/* Action Button: View Full Booking History */}
        <TouchableOpacity
          style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push('/my-bookings' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.historyLeft}>
            <Calendar size={20} color="#6C63FF" />
            <View style={{ marginLeft: 12 }}>
              <ThemedText style={styles.historyTitle}>Booking History & Schedules</ThemedText>
              <ThemedText style={styles.historySubtitle} themeColor="textSecondary">
                View 209 past & upcoming workout sessions
              </ThemedText>
            </View>
          </View>
          <ChevronRight size={18} color="#888" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  ticketCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 20,
  },
  ticketTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  brandBadgeText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  venueSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  venueName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venueLocation: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  dividerWrap: {
    position: 'relative',
    height: 30,
    justifyContent: 'center',
    marginVertical: 4,
  },
  punchHole: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 10,
  },
  punchLeft: {
    left: -12,
  },
  punchRight: {
    right: -12,
  },
  dashedLine: {
    borderBottomWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
    marginHorizontal: 20,
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 14,
  },
  qrMatrix: {
    position: 'relative',
    padding: 4,
  },
  qrCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#6C63FF',
  },
  qrCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#6C63FF',
  },
  qrCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#6C63FF',
  },
  qrCenterVisual: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenText: {
    color: '#A78BFA',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  timerText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    gap: 4,
  },
  refreshTxt: {
    color: '#6C63FF',
    fontSize: 12,
    fontWeight: '700',
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  footerVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  footerDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 12,
  },
});
