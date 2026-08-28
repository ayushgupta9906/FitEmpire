import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors, BottomTabInset } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useAuth } from '@/services/auth-context';
import {
  ArrowLeft,
  Edit3,
  ChevronRight,
  Plus,
  Calendar,
  Gift,
  DollarSign,
  Heart,
  Smartphone,
  ShoppingBag,
  Activity,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      try {
        await logout();
      } finally {
        router.replace('/login');
      }
    } else {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out of FitEmpire?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: async () => {
              await logout();
              router.replace('/login');
            },
          },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Bar with Edit Button */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.circleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Edit Profile', 'Profile details updated.')}
          style={[styles.circleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Edit3 size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + BottomTabInset + 40,
        }}
      >
        {/* User Identity & Avatar */}
        <View style={styles.userHeaderSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop',
              }}
              style={styles.avatarImage}
            />
            <View style={styles.verifiedCheckBadge}>
              <CheckCircle size={14} color="#EF4444" fill="#EF4444" />
            </View>
          </View>

          <ThemedText style={styles.userName}>Ayush Gupta</ThemedText>
          <ThemedText style={styles.userIdText}>🛡️ ID — 19880072520</ThemedText>

          {/* 3 Body Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <ThemedText style={styles.metricValue}>5'9"</ThemedText>
              <ThemedText style={styles.metricLabel}>Height (ft)</ThemedText>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCol}>
              <ThemedText style={styles.metricValue}>80.0</ThemedText>
              <ThemedText style={styles.metricLabel}>Weight (kg)</ThemedText>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCol}>
              <ThemedText style={styles.metricValue}>26.0</ThemedText>
              <ThemedText style={styles.metricLabel}>BMI</ThemedText>
            </View>
          </View>
        </View>

        {/* Member Since / Upgrade to Unlimited Card */}
        <TouchableOpacity
          style={[styles.memberGoldCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.85}
          onPress={() => router.push('/membership' as any)}
        >
          <View style={styles.memberSinceBadge}>
            <ThemedText style={styles.memberSinceText}>MEMBER SINCE </ThemedText>
            <ThemedText style={styles.memberSinceDate}>Jul 2025</ThemedText>
          </View>

          <ThemedText style={styles.upgradeGoldTitle}>UPGRADE TO UNLIMITED ✨</ThemedText>
          <ThemedText style={styles.membershipExpiryText}>⏱ Membership ends on 02 Apr, 2027</ThemedText>

          <View style={[styles.manageMembershipRow, { borderTopColor: colors.border }]}>
            <ThemedText style={styles.manageMembershipText}>Manage membership</ThemedText>
            <ChevronRight size={16} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {/* Two Quick Action Cards (Voucher & Invite Friends) */}
        <View style={styles.dualCardsRow}>
          {/* Card 1: Voucher Balance */}
          <View style={[styles.miniCard, styles.voucherCard]}>
            <View style={styles.voucherIconWrap}>
              <ThemedText style={{ fontSize: 18 }}>🎟</ThemedText>
            </View>
            <ThemedText style={styles.miniCardLabel}>VOUCHER BALANCE</ThemedText>
            <ThemedText style={styles.miniCardNumber}>₹ 0</ThemedText>

            <TouchableOpacity
              style={styles.cardActionButton}
              onPress={() => router.push('/wallet' as any)}
            >
              <ThemedText style={styles.cardActionText}>+ Add Balance</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Card 2: Invite Friends */}
          <View style={[styles.miniCard, styles.inviteCard]}>
            <View style={styles.inviteIconWrap}>
              <ThemedText style={{ fontSize: 18 }}>👥</ThemedText>
            </View>
            <ThemedText style={styles.miniCardLabel}>Invite Friends</ThemedText>
            <ThemedText style={styles.inviteSubText}>
              Get friends to join FitEmpire & get ₹500 rewards
            </ThemedText>

            <TouchableOpacity
              style={styles.cardActionButton}
              onPress={() => router.push('/refer' as any)}
            >
              <ThemedText style={styles.cardActionText}>+ Invite now</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options List */}
        <View style={styles.menuSection}>
          {/* My Bookings */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/my-bookings' as any)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Calendar size={18} color="#F59E0B" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>My Bookings</ThemedText>
              <ThemedText style={styles.menuSubtitle}>
                Check your past workout reservations & upcoming workouts
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Gift FitEmpire Pass */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/membership' as any)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Gift size={18} color="#EF4444" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>Gift FitEmpire Pass</ThemedText>
              <ThemedText style={styles.menuSubtitle}>
                Give the gift of fitness and help them start their fitness journey
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Empire Coins and Rewards */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/wallet' as any)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <DollarSign size={18} color="#10B981" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>Empire Coins & Rewards</ThemedText>
              <ThemedText style={[styles.menuSubtitle, { color: '#10B981', fontWeight: '700' }]}>
                Balance: 100 Coins
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Health Risk Assessment (HRA) */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/onboarding-hra' as any)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Heart size={18} color="#EF4444" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>Health Risk Assessment (HRA)</ThemedText>
              <ThemedText style={styles.menuSubtitle}>
                Your health, lifestyle, and diet preferences
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Corporate Wellness Subsidy */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/corporate' as any)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.1)' }]}>
              <ShieldCheck size={18} color="#38BDF8" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>Corporate Wellness Benefits</ThemedText>
              <ThemedText style={styles.menuSubtitle}>
                Unlock company employee discounts up to 60%
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* FitEmpire Store */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/store' as any)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <ShoppingBag size={18} color="#F59E0B" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>FitEmpire Store & Orders</ThemedText>
              <ThemedText style={styles.menuSubtitle}>
                Dumbbells, whey protein, mats & gear orders
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Health Tracker */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/challenges' as any)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Activity size={18} color="#10B981" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>Health Tracker</ThemedText>
              <ThemedText style={styles.menuSubtitle}>
                Track your heart rate, steps, water intake, and weight with ease.
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* My Addresses */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => Alert.alert('My Addresses', 'Default: Sector 168, Noida, Uttar Pradesh')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(20, 184, 166, 0.1)' }]}>
              <MapPin size={18} color="#14B8A6" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>My Addresses</ThemedText>
              <ThemedText style={styles.menuSubtitle}>
                Your delivery addresses for store orders
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Payment Methods */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/wallet' as any)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(108, 99, 255, 0.1)' }]}>
              <CreditCard size={18} color="#6C63FF" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>Payment Methods</ThemedText>
              <ThemedText style={styles.menuSubtitle}>
                Manage your saved cards, UPI and other payment options
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* App Settings & Notifications */}
          <TouchableOpacity
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/settings-notifications' as any)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Settings size={18} color="#EF4444" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText style={styles.menuTitle}>App Settings & Notifications</ThemedText>
              <ThemedText style={styles.menuSubtitle}>
                Manage workout reminders & nutritionist messages
              </ThemedText>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Log Out Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={18} color="#FFFFFF" />
            <ThemedText style={styles.logoutButtonText}>Log Out of Account</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  userHeaderSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  verifiedCheckBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  userIdText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: width - 32,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  metricCol: {
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  memberGoldCard: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  memberSinceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  memberSinceText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
  },
  memberSinceDate: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
  },
  upgradeGoldTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  membershipExpiryText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  manageMembershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    marginTop: 6,
    paddingTop: 10,
  },
  manageMembershipText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  dualCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 14,
  },
  miniCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    height: 140,
  },
  voucherCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  inviteCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  voucherIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  miniCardNumber: {
    fontSize: 20,
    fontWeight: '900',
  },
  inviteSubText: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 13,
  },
  cardActionButton: {
    paddingVertical: 4,
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 24,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
