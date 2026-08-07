import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { authApi, walletApi } from '@/services/api';
import { Dumbbell, CreditCard, Award, ChevronRight, Activity, Calendar, Compass, Star, Sparkles } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

const CATEGORIES = [
  { name: 'GYM', icon: 'dumbbell', desc: 'Fitness & weights' },
  { name: 'MMA', icon: 'swords', desc: 'Martial arts' },
  { name: 'BOXING', icon: 'boxing-glove', desc: 'Ring training' },
  { name: 'DANCE', icon: 'music', desc: 'Zumba & cardio' },
  { name: 'YOGA', icon: 'flower', desc: 'Mind & body' },
  { name: 'SWIMMING', icon: 'waves', desc: 'Pool sessions' },
  { name: 'SPORTS', icon: 'trophy', desc: 'Turf games' },
];

const POPULAR_CENTERS = [
  { id: '1', name: 'Gold\'s Gym Elite', category: 'GYM', rating: 4.8, distance: '1.2 km', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop' },
  { id: '2', name: 'Strike Force MMA', category: 'MMA', rating: 4.9, distance: '2.5 km', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500&auto=format&fit=crop' },
  { id: '3', name: 'Rhythm & Beats Studio', category: 'DANCE', rating: 4.7, distance: '3.0 km', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop' },
];

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const profRes = await authApi.getProfile();
      // API returns { success, data: { ...userFields } } or { success, data: { user: {...} } }
      const profileData = profRes.data?.data;
      setUser(profileData?.user ?? profileData ?? null);

      const walletRes = await walletApi.getWalletInfo();
      const walletData = walletRes.data?.data;
      const balanceNum = walletData?.balance ?? walletData?.walletBalance ?? 0;
      setBalance(typeof balanceNum === 'number' ? balanceNum.toFixed(2) : '0.00');
    } catch (e) {
      console.warn('Home Screen Load Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHomeData} tintColor="#6C63FF" />}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.greeting} themeColor="textSecondary">Welcome Back,</ThemedText>
              <ThemedText style={styles.name}>{user?.firstName || 'User'} 👋</ThemedText>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.avatar}>
              <ThemedText style={styles.avatarText}>{user?.firstName?.[0] || 'U'}</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Quick Wallet Card */}
          <View style={[styles.walletCard, { backgroundColor: '#6C63FF' }]}>
            <View style={styles.walletMeta}>
              <View>
                <ThemedText style={styles.walletLabel}>FITPASS WALLET BALANCE</ThemedText>
                <ThemedText style={styles.walletValue}>₹{balance}</ThemedText>
              </View>
              <CreditCard size={32} color="#ffffff" opacity={0.8} />
            </View>
            <TouchableOpacity style={styles.rechargeBtn} onPress={() => router.push('/(tabs)/wallet')}>
              <ThemedText style={styles.rechargeBtnText}>Recharge & Top Up</ThemedText>
              <ChevronRight size={16} color="#6C63FF" />
            </TouchableOpacity>
          </View>

          {/* Active Membership Banner */}
          <View style={[styles.membershipBanner, { backgroundColor: colors.backgroundElement }]}>
            <Award size={20} color="#FFB038" fill="#FFB038" />
            <ThemedText style={styles.membershipText}>
              Active Plan: <ThemedText style={{ fontWeight: '700' }}>Silver Access Pass</ThemedText>
            </ThemedText>
          </View>

          {/* AI Coach Banner */}
          <TouchableOpacity
            style={styles.aiCoachCard}
            onPress={() => router.push('/ai-workout')}
            activeOpacity={0.85}
          >
            <View style={styles.aiCoachIconWrap}>
              <Sparkles size={22} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.aiCoachTitle}>AI Workout & Diet Coach</ThemedText>
              <ThemedText style={styles.aiCoachSub}>Generate customized workouts & diet recommendations</ThemedText>
            </View>
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>

          {/* Activity Category Chips */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Explore Categories</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <ThemedText style={styles.seeAll} themeColor="textSecondary">See All</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[styles.categoryCard, { backgroundColor: colors.backgroundElement }]}
                onPress={() => router.push({ pathname: '/explore', params: { category: cat.name } })}
              >
                <Activity size={24} color="#6C63FF" style={{ marginBottom: Spacing.one }} />
                <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
                <ThemedText style={styles.categoryDesc}>{cat.desc}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Popular Centers */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Popular Near You</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <ThemedText style={styles.seeAll} themeColor="textSecondary">Explore Map</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.centersList}>
            {POPULAR_CENTERS.map((center) => (
              <TouchableOpacity
                key={center.id}
                style={[styles.centerRow, { backgroundColor: colors.backgroundElement }]}
                onPress={() => router.push('/(tabs)/explore')}
              >
                <Image source={{ uri: center.image }} style={styles.centerImage} />
                <View style={styles.centerInfo}>
                  <View style={styles.centerCategoryRow}>
                    <ThemedText style={styles.centerCategory}>{center.category}</ThemedText>
                    <View style={styles.ratingRow}>
                      <Star size={12} color="#FFB038" fill="#FFB038" />
                      <ThemedText style={styles.ratingText}>{center.rating}</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.centerName}>{center.name}</ThemedText>
                  <ThemedText style={styles.centerDistance} themeColor="textSecondary">📍 {center.distance}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 13, fontWeight: '600' },
  name: { fontSize: 20, fontWeight: '800', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(108,99,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700', color: '#6C63FF', fontSize: 16 },
  walletCard: { borderRadius: 16, padding: 16, marginBottom: 16 },
  walletMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  walletLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  walletValue: { color: '#ffffff', fontSize: 28, fontWeight: '800', marginTop: 4 },
  rechargeBtn: { flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between' },
  rechargeBtnText: { color: '#6C63FF', fontWeight: '700', fontSize: 13 },
  membershipBanner: { flexDirection: 'row', padding: 12, borderRadius: 12, alignItems: 'center', gap: 10, marginBottom: 16 },
  membershipText: { fontSize: 13, fontWeight: '500' },
  aiCoachCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  aiCoachIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCoachTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  aiCoachSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  seeAll: { fontSize: 12, fontWeight: '600' },
  categoriesScroll: { gap: 12, paddingRight: 16, marginBottom: 20 },
  categoryCard: { padding: 12, borderRadius: 12, width: 120, alignItems: 'center', justifyContent: 'center' },
  categoryName: { fontWeight: '700', fontSize: 12, marginTop: 4 },
  categoryDesc: { fontSize: 9, color: '#888', marginTop: 2 },
  centersList: { gap: 12 },
  centerRow: { flexDirection: 'row', borderRadius: 12, overflow: 'hidden' },
  centerImage: { width: 80, height: 80 },
  centerInfo: { flex: 1, padding: 10, justifyContent: 'space-between' },
  centerCategoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  centerCategory: { fontSize: 9, fontWeight: '800', color: '#6C63FF', letterSpacing: 0.5 },
  ratingRow: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  ratingText: { fontSize: 10, fontWeight: '700' },
  centerName: { fontSize: 13, fontWeight: '700' },
  centerDistance: { fontSize: 10 },
});
