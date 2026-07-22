import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { bookingsApi } from '@/services/api';
import { Calendar, Clock, QrCode, Trash2, Dumbbell } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function MyBookingsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsApi.getMyBookings();
      setBookings(res.data.data.content || []);
    } catch (e) {
      console.warn("Failed to load bookings:", e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      'Cancel Workout?',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingsApi.cancel(bookingId, "User requested cancellation");
              Alert.alert('Success', 'Booking cancelled.');
              fetchBookings();
            } catch (err) {
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '#38BFFF';
      case 'CHECKED_IN':
        return '#FFB038';
      case 'COMPLETED':
        return '#43D787';
      case 'CANCELLED':
        return '#FF5757';
      default:
        return '#888';
    }
  };

  if (loading && !refreshing) {
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
          <ThemedText style={styles.backText}>← Profile</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>My Bookings</ThemedText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBookings} tintColor="#6C63FF" />}
      >
        {bookings.length > 0 ? (
          bookings.map((b) => {
            const isToday = b.bookingDate === new Date().toISOString().split('T')[0];
            const canCancel = b.status === 'CONFIRMED';
            const canCheckIn = b.status === 'CONFIRMED' && isToday;

            return (
              <View key={b.id} style={[styles.bookingCard, { backgroundColor: colors.backgroundElement }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerMeta}>
                    <Dumbbell size={16} color="#6C63FF" />
                    <ThemedText style={styles.gymName}>{b.gymName}</ThemedText>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(b.status) + '15' }]}>
                    <ThemedText style={[styles.statusText, { color: getStatusColor(b.status) }]}>
                      {b.status}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.branchName} themeColor="textSecondary">
                  📍 {b.branchName}
                </ThemedText>

                <View style={styles.detailsRow}>
                  <View style={styles.metaItem}>
                    <Calendar size={14} color="#888" />
                    <ThemedText style={styles.metaText} themeColor="textSecondary">{b.bookingDate}</ThemedText>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#888" />
                    <ThemedText style={styles.metaText} themeColor="textSecondary">
                      {b.startTime.substring(0, 5)} - {b.endTime.substring(0, 5)}
                    </ThemedText>
                  </View>
                </View>

                {(canCheckIn || canCancel) && <View style={styles.divider} />}

                <View style={styles.actionsRow}>
                  {canCheckIn && (
                    <TouchableOpacity
                      style={styles.checkInBtn}
                      onPress={() => router.push({ pathname: '/qr-checkin', params: { bookingId: b.id } })}
                    >
                      <QrCode size={16} color="#ffffff" />
                      <ThemedText style={styles.checkInBtnText}>Check In QR</ThemedText>
                    </TouchableOpacity>
                  )}
                  {canCancel && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancelBooking(b.id)}>
                      <Trash2 size={16} color="#FF5757" />
                      <ThemedText style={styles.cancelBtnText}>Cancel Booking</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color="#888" style={{ marginBottom: 12 }} />
            <ThemedText style={styles.emptyText} themeColor="textSecondary">
              You do not have any workout bookings.
            </ThemedText>
          </View>
        )}
      </ScrollView>
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
  scroll: { padding: 16 },
  bookingCard: { borderRadius: 16, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  gymName: { fontSize: 14, fontWeight: '800' },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  branchName: { fontSize: 12, marginBottom: 12 },
  detailsRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 11 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 12 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  checkInBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#6C63FF', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, flex: 1, justifyContent: 'center' },
  checkInBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#FF5757', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, flex: 1, justifyContent: 'center' },
  cancelBtnText: { color: '#FF5757', fontSize: 12, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 13, textAlign: 'center' },
});
