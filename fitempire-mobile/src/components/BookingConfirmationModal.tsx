import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface BookingConfirmationModalProps {
  visible: boolean;
  bookingDetails: {
    gymName: string;
    date: string;
    slot: string;
  } | null;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  visible,
  bookingDetails,
  onClose,
}) => {
  if (!bookingDetails) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>🎉</Text>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.gymName}>{bookingDetails.gymName}</Text>
          <Text style={styles.info}>{bookingDetails.date} • {bookingDetails.slot}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>View Digital Pass</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  icon: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  gymName: { fontSize: 16, fontWeight: '600', color: '#38BDF8', marginBottom: 4 },
  info: { fontSize: 14, color: '#94A3B8', marginBottom: 20 },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
