import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { bookingsApi } from '@/services/api';
import { QrCode, Calendar, Clock, Sparkles } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function QrCheckinScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    fetchBookingQr();
  }, [bookingId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchBookingQr = async () => {
    setLoading(true);
    try {
      if (bookingId) {
        const res = await bookingsApi.getQrCode(bookingId);
        setBooking(res.data.data);
      }
    } catch (e) {
      console.warn("Failed to fetch QR code:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>QR Check-In Pass</ThemedText>
      </View>

      <View style={styles.content}>
        {/* Gym Name & Branch */}
        <View style={styles.gymInfo}>
          <ThemedText style={styles.gymName}>{booking?.gymName}</ThemedText>
          <ThemedText style={styles.branchName} themeColor="textSecondary">
            📍 {booking?.branchName}
          </ThemedText>
        </View>

        {/* Dynamic QR Card */}
        <View style={[styles.qrCard, { backgroundColor: colors.backgroundElement }]}>
          {/* Animated Glow Border Placeholder */}
          <View style={styles.qrFrame}>
            <View style={styles.qrGrid}>
              {/* Draw a gorgeous mock QR graphic using vectors and blocks */}
              <View style={styles.qrRow}>
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={styles.qrPixel} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
              </View>
              <View style={styles.qrRow}>
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={styles.qrPixel} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={styles.qrPixel} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
              </View>
              <View style={styles.qrRow}>
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={styles.qrPixel} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
              </View>
              <View style={styles.qrRow}>
                <View style={styles.qrPixel} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={styles.qrPixel} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={styles.qrPixel} />
                <View style={styles.qrPixel} />
              </View>
              <View style={styles.qrRow}>
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={styles.qrPixel} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={styles.qrPixel} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
                <View style={[styles.qrPixel, styles.pixelActive]} />
              </View>
            </View>
          </View>

          <ThemedText style={styles.timerText} themeColor="textSecondary">
            QR code updates automatically in <ThemedText style={styles.timerHighlight}>{timeLeft}s</ThemedText>
          </ThemedText>
        </View>

        {/* Slot details */}
        <View style={[styles.detailsCard, { backgroundColor: colors.backgroundElement }]}>
          <View style={styles.detailItem}>
            <Calendar size={18} color="#6C63FF" />
            <View>
              <ThemedText style={styles.detailLabel} themeColor="textSecondary">BOOKING DATE</ThemedText>
              <ThemedText style={styles.detailValue}>{booking?.bookingDate}</ThemedText>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Clock size={18} color="#6C63FF" />
            <View>
              <ThemedText style={styles.detailLabel} themeColor="textSecondary">SESSION TIME</ThemedText>
              <ThemedText style={styles.detailValue}>
                {booking?.startTime?.substring(0, 5)} - {booking?.endTime?.substring(0, 5)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Support Banner */}
        <View style={styles.banner}>
          <Sparkles size={16} color="#6C63FF" />
          <ThemedText style={styles.bannerText}>
            Please hold this code close to the tablet/scanner at the reception.
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  backButton: { paddingRight: 16 },
  backText: { color: '#6C63FF', fontSize: 14, fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '800', flex: 1 },
  content: { padding: 24, alignItems: 'center', flex: 1, justifyContent: 'space-between' },
  gymInfo: { alignItems: 'center', marginVertical: 12 },
  gymName: { fontSize: 20, fontWeight: '900', textAlign: 'center' },
  branchName: { fontSize: 13, marginTop: 4 },
  qrCard: { width: '100%', borderRadius: 24, padding: 32, alignItems: 'center', marginVertical: 20 },
  qrFrame: { width: 180, height: 180, backgroundColor: '#ffffff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', padding: 16 },
  qrGrid: { width: 148, height: 148, justifyContent: 'space-between' },
  qrRow: { flexDirection: 'row', justifyContent: 'space-between' },
  qrPixel: { width: 22, height: 22, backgroundColor: '#F0F0F3', borderRadius: 4 },
  pixelActive: { backgroundColor: '#000000' },
  timerText: { fontSize: 12, marginTop: 24, fontWeight: '600' },
  timerHighlight: { color: '#6C63FF', fontWeight: '800' },
  detailsCard: { width: '100%', borderRadius: 20, padding: 20, gap: 16, marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  detailLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  bannerText: { fontSize: 11, color: '#888', flex: 1, lineHeight: 15 },
});
