import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '@/services/auth-context';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Users, TrendingUp, LogOut, Activity, Dumbbell, Calendar, CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

export default function PartnerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Header section */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.greeting} themeColor="textSecondary">Partner Dashboard</ThemedText>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              {user?.gym?.name || 'My Gym Center'}
            </ThemedText>
          </View>
          <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <LogOut size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroHeader}>
            <ThemedText style={styles.heroTitle}>Today's Activity</ThemedText>
            <Activity size={24} color="#FFF" />
          </View>
          <View style={styles.heroStats}>
            <View>
              <ThemedText style={styles.heroStatValue}>142</ThemedText>
              <ThemedText style={styles.heroStatLabel}>Check-ins</ThemedText>
            </View>
            <View style={styles.heroDivider} />
            <View>
              <ThemedText style={styles.heroStatValue}>24</ThemedText>
              <ThemedText style={styles.heroStatLabel}>Active Classes</ThemedText>
            </View>
          </View>
        </LinearGradient>

        {/* Secondary Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <TrendingUp size={24} color="#10B981" />
            </View>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>₹ 12,500</ThemedText>
            <ThemedText style={styles.statLabel} themeColor="textSecondary">Revenue (This Week)</ThemedText>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Users size={24} color="#3B82F6" />
            </View>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>850</ThemedText>
            <ThemedText style={styles.statLabel} themeColor="textSecondary">Active Members</ThemedText>
          </View>
        </View>

        {/* Recent Activity List */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Recent Check-ins</ThemedText>
          
          {[
            { id: 1, name: 'Ayush Gupta', time: '10 mins ago', type: 'Gym Access' },
            { id: 2, name: 'Rahul Sharma', time: '25 mins ago', type: 'Yoga Class' },
            { id: 3, name: 'Priya Patel', time: '1 hour ago', type: 'Zumba' }
          ].map((item) => (
            <View key={item.id} style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.avatarBox, { backgroundColor: colors.primary + '20' }]}>
                <ThemedText style={{ color: colors.primary, fontWeight: 'bold' }}>{item.name.charAt(0)}</ThemedText>
              </View>
              <View style={styles.listContent}>
                <ThemedText style={[styles.listName, { color: colors.text }]}>{item.name}</ThemedText>
                <ThemedText style={styles.listDesc} themeColor="textSecondary">{item.type}</ThemedText>
              </View>
              <View style={styles.listRight}>
                <ThemedText style={styles.listTime} themeColor="textSecondary">{item.time}</ThemedText>
                <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 4 }} />
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scroll: { 
    padding: 24, 
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  greeting: { 
    fontSize: 14, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800',
    letterSpacing: -0.5
  },
  logoutBtn: { 
    width: 48,
    height: 48,
    borderRadius: 24, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroStatValue: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '800',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statsGrid: { 
    flexDirection: 'row', 
    gap: 16,
    marginBottom: 32,
  },
  statCard: { 
    flex: 1, 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: { 
    fontSize: 22, 
    fontWeight: '800', 
  },
  statLabel: { 
    fontSize: 13, 
    marginTop: 4, 
    fontWeight: '500'
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listContent: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  listDesc: {
    fontSize: 13,
  },
  listRight: {
    alignItems: 'flex-end',
  },
  listTime: {
    fontSize: 12,
  }
});
