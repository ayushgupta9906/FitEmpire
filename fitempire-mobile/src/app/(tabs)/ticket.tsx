import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import QRCode from 'react-native-qrcode-svg';
import { RefreshCw, MapPin } from 'lucide-react-native';
import { bookingsApi } from '@/services/api';

export default function TicketScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  
  const [booking, setBooking] = useState<any>(null);
  const [qrToken, setQrToken] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
      fetchDynamicQr();
      const interval = setInterval(() => {
        fetchDynamicQr();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [bookingId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const fetchBookingDetails = async () => {
    try {
      // In a real app we would have getBookingDetails API.
      // But we can just fetch all user bookings and filter
      const res = await bookingsApi.getUserBookings();
      const found = res.data.data?.find((b: any) => b.id === bookingId);
      if (found) {
        setBooking(found);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchDynamicQr = async () => {
    try {
      const res = await bookingsApi.getQrCode(bookingId);
      setQrToken(res.data.data.qrCodeData || `QR-${bookingId}-${Date.now()}`);
      setTimeLeft(60);
    } catch (e) {
      setQrToken(`QR-${bookingId}-${Date.now()}`);
      setTimeLeft(60);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Your Ticket</ThemedText>
        <ThemedText style={styles.subtitle}>Present this at the front desk</ThemedText>
      </View>

      <View style={styles.ticketCard}>
        <View style={styles.gymInfo}>
          <ThemedText style={styles.gymName}>{booking?.gym?.name || 'Gold\'s Gym Elite'}</ThemedText>
          <View style={styles.row}>
            <MapPin size={14} color="#6B7280" />
            <ThemedText style={styles.gymBranch}> {booking?.gym?.city || 'Andheri West'}</ThemedText>
          </View>
        </View>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={qrToken || 'MOCK'}
            size={200}
            color="black"
            backgroundColor="white"
          />
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.timer}>Refreshes in {timeLeft}s</ThemedText>
          <TouchableOpacity onPress={fetchDynamicQr} style={styles.refreshBtn}>
            <RefreshCw size={16} color="#6C63FF" />
            <ThemedText style={styles.refreshTxt}> Refresh Now</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 24, paddingTop: 60, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  ticketCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 32, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  gymInfo: { alignItems: 'center', marginBottom: 32 },
  gymName: { fontSize: 20, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  gymBranch: { color: '#6B7280' },
  qrContainer: { padding: 16, backgroundColor: '#FFF', borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  footer: { marginTop: 32, alignItems: 'center', width: '100%' },
  timer: { fontSize: 14, color: '#EF4444', fontWeight: 'bold', marginBottom: 12 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(108, 99, 255, 0.1)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  refreshTxt: { color: '#6C63FF', fontWeight: 'bold' }
});
