import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/services/auth-context';
import { Users, TrendingUp, LogOut } from 'lucide-react-native';

export default function PartnerDashboard() {
  const { user, logout } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.greeting}>Partner Dashboard</ThemedText>
            <ThemedText style={styles.title}>{user?.gym?.name || 'Your Gym'}</ThemedText>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users size={24} color="#3B82F6" />
            <ThemedText style={styles.statValue}>142</ThemedText>
            <ThemedText style={styles.statLabel}>Today's Check-ins</ThemedText>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#10B981" />
            <ThemedText style={styles.statValue}>₹ 12,500</ThemedText>
            <ThemedText style={styles.statLabel}>This Week Revenue</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  scroll: { padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  greeting: { fontSize: 16, color: '#9CA3AF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  logoutBtn: { padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12 },
  statsGrid: { flexDirection: 'row', gap: 16 },
  statCard: { flex: 1, backgroundColor: '#111827', padding: 20, borderRadius: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 12 },
  statLabel: { fontSize: 14, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },
});
