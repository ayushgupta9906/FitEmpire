const fs = require('fs');
const path = require('path');

const tabsDir = path.join(__dirname, 'fitempire-mobile', 'src', 'app', '(tabs)');
const bookingFile = path.join(tabsDir, 'booking.tsx'); // or index/etc if it's already there

// Let's create a dedicated Ticket screen where the user can view the QR code
const ticketContent = `import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import QRCode from 'react-native-qrcode-svg';
import { RefreshCw, MapPin } from 'lucide-react-native';

export default function TicketScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  
  const [qrToken, setQrToken] = useState<string>('MOCK-QR-TOKEN-FOR-NOW');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    fetchDynamicQr();
    const interval = setInterval(() => {
      fetchDynamicQr();
    }, 60000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const fetchDynamicQr = async () => {
    try {
      // In a real app: await fetch(\`/api/v1/bookings/\${bookingId}/qr\`)
      setQrToken(\`QR-\${bookingId}-\${Date.now()}\`);
      setTimeLeft(60);
    } catch (e) {
      Alert.alert("Error", "Could not refresh QR code");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Your Ticket</ThemedText>
        <ThemedText style={styles.subtitle}>Present this at the front desk</ThemedText>
      </View>

      <View style={styles.ticketCard}>
        <View style={styles.gymInfo}>
          <ThemedText style={styles.gymName}>Gold's Gym Elite</ThemedText>
          <View style={styles.row}>
            <MapPin size={14} color="#6B7280" />
            <ThemedText style={styles.gymBranch}> Andheri West</ThemedText>
          </View>
        </View>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={qrToken}
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
`;

fs.writeFileSync(path.join(tabsDir, 'ticket.tsx'), ticketContent);
console.log("Created (tabs)/ticket.tsx");
