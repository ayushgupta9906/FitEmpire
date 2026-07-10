import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PartnerSettlements() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Settlements</ThemedText>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.invoiceCard}>
          <View style={styles.row}>
            <ThemedText style={styles.date}>July 09, 2026</ThemedText>
            <View style={styles.badge}><ThemedText style={styles.badgeTxt}>COMPLETED</ThemedText></View>
          </View>
          <ThemedText style={styles.amount}>₹ 12,500.00</ThemedText>
          <ThemedText style={styles.desc}>Platform Fee Deducted: ₹ 1,875</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19', padding: 24, paddingTop: 60 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  list: { paddingBottom: 100 },
  invoiceCard: { backgroundColor: '#111827', padding: 20, borderRadius: 16, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  date: { color: '#9CA3AF', fontSize: 14 },
  badge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeTxt: { color: '#10B981', fontSize: 10, fontWeight: 'bold' },
  amount: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  desc: { color: '#6B7280', fontSize: 12, marginTop: 8 }
});
