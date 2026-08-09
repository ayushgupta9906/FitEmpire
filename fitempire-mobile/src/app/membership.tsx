import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  ArrowLeft,
  History,
  Clock,
  Check,
  Zap,
  Dumbbell,
  Apple,
  Sparkles,
  ShoppingBag,
  Ticket,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function MembershipScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [isUpgraded, setIsUpgraded] = useState(false);

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to FitEmpire Pro Unlimited',
      'Unlock all-access daily entry to 12,000+ partner centers, unlimited classes, and personal AI coaching starting at ₹1,001/month.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed to Pay',
          onPress: () => {
            setIsUpgraded(true);
            Alert.alert('Success 🎉', 'Your FitEmpire Pro Unlimited Pass is now active!');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.circleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>

        {/* 3 Floating 3D Fitness Badges */}
        <View style={styles.floatingBadgesRow}>
          <View style={[styles.badgeCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Zap size={18} color="#F59E0B" />
          </View>
          <View style={[styles.badgeCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <Dumbbell size={18} color="#EF4444" />
          </View>
          <View style={[styles.badgeCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Apple size={18} color="#10B981" />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/my-bookings' as any)}
          style={[styles.circleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <History size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Membership Header Status */}
        <View style={styles.memberStatusSection}>
          <View style={styles.memberSincePill}>
            <ThemedText style={styles.memberSinceText}>MEMBER SINCE </ThemedText>
            <ThemedText style={styles.memberSinceDate}>Jul 2025</ThemedText>
          </View>

          <ThemedText style={styles.fitPassBrandTitle}>
            FITEMPIRE <ThemedText style={{ color: '#EF4444' }}>PRO</ThemedText>
          </ThemedText>

          <View style={styles.expiryRow}>
            <Clock size={13} color="#94A3B8" />
            <ThemedText style={styles.expiryText}>
              Membership ends on <ThemedText style={{ fontWeight: '800', color: colors.text }}>02 Apr, 2027</ThemedText>
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.extendMembershipBtn, { borderColor: colors.border }]}
            activeOpacity={0.8}
            onPress={handleUpgrade}
          >
            <ThemedText style={styles.extendMembershipText}>Extend Membership</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Section: Plan Benefits */}
        <View style={styles.sectionBlock}>
          <ThemedText style={styles.sectionHeaderLabel}>PLAN BENEFITS</ThemedText>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.bulletDot} />
              <ThemedText style={styles.benefitText}>
                Access to 12k+ premium gyms & fitness centres across 150+ cities
              </ThemedText>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.bulletDot} />
              <ThemedText style={styles.benefitText}>
                Expert nutritionist consults, personalised diet plans & meal logs
              </ThemedText>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.bulletDot} />
              <ThemedText style={styles.benefitText}>
                A.I. enabled personal fitness coaching
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Section: Store Benefits */}
        <View style={styles.sectionBlock}>
          <ThemedText style={styles.sectionHeaderLabel}>STORE BENEFITS</ThemedText>

          <View style={styles.storeCardsGrid}>
            {/* Card 1: Blue Smart Shopping */}
            <View style={[styles.storeCard, styles.storeCardBlue]}>
              <View style={{ flex: 1, paddingRight: 6 }}>
                <ThemedText style={styles.storeCardTitle}>Stay fit, shop smart</ThemedText>
              </View>
              <View style={styles.storeCardIconWrap}>
                <Award size={32} color="#93C5FD" />
              </View>
            </View>

            {/* Card 2: Crimson Free Delivery */}
            <View style={[styles.storeCard, styles.storeCardRed]}>
              <View style={{ flex: 1, paddingRight: 6 }}>
                <ThemedText style={styles.storeCardTitle}>Free delivery on all store purchases</ThemedText>
              </View>
              <View style={styles.storeCardIconWrap}>
                <ShoppingBag size={32} color="#FCA5A5" />
              </View>
            </View>
          </View>
        </View>

        {/* Section: Upgrade Plan */}
        <View style={styles.sectionBlock}>
          <ThemedText style={styles.sectionHeaderLabel}>UPGRADE PLAN</ThemedText>

          <ThemedText style={styles.goldUpgradeLabel}>UPGRADE TO UNLIMITED ✨</ThemedText>
          <ThemedText style={styles.upgradeSubtitle}>
            Unlimited workouts, zero limits! Upgrade now & level up your fitness!
          </ThemedText>

          {/* Comparative Matrix Card */}
          <View style={[styles.upgradeMatrixCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.upgradeComparisonHeader}>
              <ThemedText style={styles.upgradeComparisonTitle}>
                Unlimited workouts, zero limits! Upgrade now & level up your fitness!
              </ThemedText>
              <ThemedText style={styles.pricingTag}>Starting at ₹1,001/m</ThemedText>
            </View>

            {/* Comparison Visual Diagram */}
            <View style={styles.comparisonVisualRow}>
              {/* Left Box: 3 workouts */}
              <View style={styles.comparisonBox}>
                <View style={styles.activityPillsMiniRow}>
                  <View style={[styles.miniPill, { backgroundColor: '#10B981' }]}>
                    <ThemedText style={styles.miniPillText}>YOGA</ThemedText>
                  </View>
                  <View style={[styles.miniPill, { backgroundColor: '#F59E0B' }]}>
                    <ThemedText style={styles.miniPillText}>CARDIO</ThemedText>
                  </View>
                  <View style={[styles.miniPill, { backgroundColor: '#3B82F6' }]}>
                    <ThemedText style={styles.miniPillText}>DANCE</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.comparisonBoxTitle}>
                  <ThemedText style={{ color: '#EF4444', fontWeight: '900' }}>03 </ThemedText>
                  workout per week
                </ThemedText>
              </View>

              {/* Swap Arrows */}
              <View style={styles.swapArrowsContainer}>
                <ThemedText style={{ fontSize: 20 }}>🔁</ThemedText>
              </View>

              {/* Right Box: Unlimited matrix */}
              <View style={[styles.comparisonBox, styles.comparisonBoxUnlimited]}>
                <ThemedText style={styles.unlimitedHeaderLabel}>Unlimited workout</ThemedText>
                <ThemedText style={styles.unlimitedSubLabel}>per week</ThemedText>
                <View style={styles.miniMatrixGrid}>
                  {['ZUMBA', 'DANCE', 'YOGA', 'AEROBIC', 'MMA', 'BOXING', 'SPORTS', 'SWIM'].map((item) => (
                    <View key={item} style={styles.matrixTile}>
                      <ThemedText style={styles.matrixTileText}>{item}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Gold CTA Button */}
            <TouchableOpacity
              style={styles.goldUpgradeButton}
              activeOpacity={0.85}
              onPress={handleUpgrade}
            >
              <ThemedText style={styles.goldUpgradeButtonText}>Upgrade To Premium</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Payment Details */}
        <View style={styles.sectionBlock}>
          <ThemedText style={styles.sectionHeaderLabel}>PAYMENT DETAILS</ThemedText>

          {/* Corporate Coupons */}
          <TouchableOpacity style={[styles.couponCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.couponIconBox}>
              <Ticket size={22} color="#EF4444" />
            </View>
            <ThemedText style={styles.couponCodeText}>CORPORATE-COUPONS</ThemedText>
          </TouchableOpacity>

          {/* View Payment History Link */}
          <TouchableOpacity
            style={[styles.historyRow, { borderColor: colors.border }]}
            onPress={() => router.push('/wallet' as any)}
          >
            <ThemedText style={styles.historyRowText}>View payment history</ThemedText>
            <ChevronRight size={18} color="#94A3B8" />
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
    paddingBottom: 8,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  floatingBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberStatusSection: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 8,
  },
  memberSincePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberSinceText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  memberSinceDate: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10B981',
  },
  fitPassBrandTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expiryText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  extendMembershipBtn: {
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  extendMembershipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionBlock: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 12,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#94A3B8',
    marginTop: 6,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  storeCardsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  storeCard: {
    flex: 1,
    height: 90,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeCardBlue: {
    backgroundColor: '#1E3A8A',
  },
  storeCardRed: {
    backgroundColor: '#881337',
  },
  storeCardTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  storeCardIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldUpgradeLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  upgradeSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
    marginBottom: 12,
  },
  upgradeMatrixCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  upgradeComparisonHeader: {
    gap: 4,
  },
  upgradeComparisonTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  pricingTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C63FF',
  },
  comparisonVisualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  comparisonBox: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    gap: 8,
  },
  comparisonBoxUnlimited: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  activityPillsMiniRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniPill: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniPillText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFF',
  },
  comparisonBoxTitle: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  swapArrowsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlimitedHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  unlimitedSubLabel: {
    fontSize: 9,
    color: '#94A3B8',
  },
  miniMatrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'center',
  },
  matrixTile: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  matrixTileText: {
    fontSize: 7,
    fontWeight: '800',
  },
  goldUpgradeButton: {
    backgroundColor: '#CA8A04',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldUpgradeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  couponIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponCodeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  historyRowText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
