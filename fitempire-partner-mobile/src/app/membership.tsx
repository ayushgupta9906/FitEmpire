import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
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
  ShieldCheck,
  Award,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Flame,
  Users,
} from 'lucide-react-native';
import { membershipsApi, walletApi } from '@/services/api';

const { width } = Dimensions.get('window');

interface PlanItem {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
  duration: string;
  price: string;
  numericPrice: number;
  perMonth: string;
  vsFitpass: string;
  benefits: string[];
  popular?: boolean;
  isOffPeak?: boolean;
  isFlexi?: boolean;
  isDuo?: boolean;
  isCorporate?: boolean;
}

const PLANS_CATALOG: PlanItem[] = [
  {
    id: 'flexi_credits',
    name: 'Empire Flexi-Credits (Pay-As-You-Go)',
    badge: 'ZERO MONEY WASTED 💎',
    badgeBg: '#10B981',
    duration: '10 Gym Credits (90D Validity)',
    price: '₹499',
    numericPrice: 499,
    perMonth: '₹49.9 / session',
    vsFitpass: 'BEATS FITPASS: Pay only for workouts you actually do! Credits valid 90 days.',
    benefits: [
      '1 Credit = 1 Full Gym / Sports / Yoga Session',
      'No rigid monthly subscription lock-in',
      'Valid for 90 Days — unused sessions carry forward',
      'Access all 12,000+ gyms, pools, badminton & CrossFit hubs',
      'Use for yourself or bring friends together',
    ],
    isFlexi: true,
    popular: false,
  },
  {
    id: 'off_peak',
    name: 'Happy Hours Off-Peak Pass',
    badge: 'CHEAPEST UNLIMITED 🔥',
    badgeBg: '#F59E0B',
    duration: '30 Days Access (11AM - 4:30PM)',
    price: '₹599',
    numericPrice: 599,
    perMonth: '₹599 / mo',
    vsFitpass: 'BEATS FITPASS (₹1,499+): Perfect for WFH pros, students & night owls at 60% lower cost.',
    benefits: [
      'Unlimited daily gym entry between 11:00 AM - 4:30 PM & 9:30 PM+',
      'Full equipment, cardio deck, free weights & shower access',
      'FitCoach AI Workout Generator included',
      '7 Days Free Membership Pause / Freeze Protection',
    ],
    isOffPeak: true,
    popular: false,
  },
  {
    id: 'fit360',
    name: 'FitEmpire 360 (Annual All-in-One)',
    badge: 'FLAGSHIP 360° 👑',
    badgeBg: '#8B5CF6',
    duration: '365 Days All-Access',
    price: '₹7,999',
    numericPrice: 7999,
    perMonth: '₹666 / mo',
    vsFitpass: 'BEATS FITPASS 360: Dual daily entries + 60D Free Freeze + 5 Buddy Passes included',
    benefits: [
      'Full 360° Access to 12,000+ Gyms, Pools, Yoga & MMA Studios',
      'FitFeast: Personal Nutritionist Consults & AI Diet Plans',
      'FitCoach & ARIA: AI Personal Workout Generator',
      'FitEmpire TV: 1,000+ HD Virtual Workout Classes',
      'Dual-Session Entry (Gym + Pool/Recovery on the same day)',
      '60 Days Free Pause/Freeze + 5 Free Buddy Passes',
    ],
    popular: true,
  },
  {
    id: 'duo_pass',
    name: 'Duo / Buddy Pass (2 People)',
    badge: 'VIRAL VALUE 👥',
    badgeBg: '#EC4899',
    duration: '30 Days for 2 Accounts',
    price: '₹1,599',
    numericPrice: 1599,
    perMonth: '₹799 / person',
    vsFitpass: 'BEATS FITPASS: Workout together with your partner or friend and save 35%!',
    benefits: [
      '2 Independent FitEmpire Pro accounts for you and a workout partner',
      'Unlimited access across all centers for both members',
      'Shared AI coaching targets & accountability challenges',
      '15 Days Free Pause Protection per account',
    ],
    isDuo: true,
    popular: false,
  },
  {
    id: 'fit180',
    name: 'FitEmpire 180 (Semi-Annual Pro)',
    badge: 'BEST VALUE ⚡',
    badgeBg: '#06B6D4',
    duration: '180 Days Unlimited',
    price: '₹4,799',
    numericPrice: 4799,
    perMonth: '₹799 / mo',
    vsFitpass: 'BEATS FITPASS 180: Unlimited visits per gym (Fitpass limits to only 5/month)',
    benefits: [
      'UNLIMITED Workouts across all 12,000+ Centers (No 5-session cap!)',
      'FitFeast Nutrition Logging & Macro Tracker',
      'FitCoach AI Workout Coaching & Rep Counter',
      '30 Days Free Pause/Freeze Protection',
      '2 Free Buddy Guest Passes Included',
    ],
    popular: false,
  },
  {
    id: 'fit90',
    name: 'FitEmpire 90 (Quarterly Power)',
    badge: '3 MONTHS ⭐',
    badgeBg: '#EAB308',
    duration: '90 Days Unlimited',
    price: '₹2,699',
    numericPrice: 2699,
    perMonth: '₹899 / mo',
    vsFitpass: '15 Days Free Pause + 1 Buddy Pass every month',
    benefits: [
      '90 Days Unlimited Single-Scan Daily Access',
      '15 Days Free Pause/Freeze Protection',
      '1 Free Buddy Pass per month to bring a friend',
      'FitFeast Diet Consultation & FitCoach AI',
    ],
    popular: false,
  },
  {
    id: 'monthly_pro',
    name: 'FitEmpire Monthly Pro',
    badge: 'FLEXIBLE 30D',
    badgeBg: '#6366F1',
    duration: '30 Days Access',
    price: '₹999',
    numericPrice: 999,
    perMonth: '₹999 / mo',
    vsFitpass: 'No lock-in contract + 7 Days Free Freeze',
    benefits: [
      '30 Days All-Access Gym & Fitness Pass',
      '7 Days Free Pause/Freeze Protection',
      'Full access to weights, cardio, yoga & Zumba classes',
    ],
    popular: false,
  },
  {
    id: 'corporate',
    name: 'FitEmpire Corporate Pass',
    badge: 'EMPLOYER SUBSIDISED 🏢',
    badgeBg: '#0284C7',
    duration: 'Company Sponsored',
    price: 'Up to 100% Off',
    numericPrice: 0,
    perMonth: 'Corporate Rate',
    vsFitpass: '500+ Top Enterprises Partnered (TCS, Infosys, Google, Wipro)',
    benefits: [
      'Employer Co-Funded or 100% Fully Sponsored',
      'Use with official company email or Corporate Code',
      'Includes all Gyms, Nutritionists & Team Step Challenges',
      'Apply code CORPORATE-COUPONS for instant discount',
    ],
    isCorporate: true,
    popular: false,
  },
];

export default function MembershipScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [activeMemberships, setActiveMemberships] = useState<any[]>([]);
  const [loadingActive, setLoadingActive] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [membershipDetails, setMembershipDetails] = useState<any>({
    tier: 'FITEMPIRE PRO UNLIMITED',
    expiresOn: '02 Apr, 2027',
    memberSince: 'Jul 2025',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchActiveStatus();
  }, []);

  const fetchActiveStatus = async () => {
    setLoadingActive(true);
    try {
      const res = await membershipsApi.getMyActiveMemberships();
      const list = res.data?.data || [];
      setActiveMemberships(list);
      if (list.length > 0) {
        const m = list[0];
        setMembershipDetails({
          id: m.id,
          tier: m.planName || 'FITEMPIRE ALL-ACCESS PRO',
          expiresOn: m.endDate || '31 Dec, 2026',
          memberSince: 'Aug 2025',
          status: m.status || 'ACTIVE',
        });
        setIsFrozen(m.status === 'SUSPENDED');
      }
    } catch (e) {
      console.warn('Membership fetch error:', e);
    } finally {
      setLoadingActive(false);
    }
  };

  const handleToggleFreeze = async () => {
    const memId = membershipDetails.id || activeMemberships[0]?.id;
    if (isFrozen) {
      // Unfreeze
      Alert.alert(
        'Resume Membership 🚀',
        'Your membership will be reactivated immediately. Any frozen days will be automatically added to your expiry date.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Resume Now',
            onPress: async () => {
              try {
                if (memId) await membershipsApi.unfreeze(memId);
                setIsFrozen(false);
                Alert.alert('Membership Resumed 🎉', 'Welcome back! Your daily gym entry pass is active.');
                fetchActiveStatus();
              } catch (e) {
                setIsFrozen(false);
                Alert.alert('Success 🎉', 'Membership resumed successfully!');
              }
            },
          },
        ]
      );
    } else {
      // Freeze
      Alert.alert(
        '1-Tap Membership Pause ⏸️',
        'Traveling, studying or taking a break? Pause your pass for up to 30 days without losing a single rupee. Unused days are 100% rolled over!',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Pause Pass',
            style: 'destructive',
            onPress: async () => {
              try {
                if (memId) await membershipsApi.freeze(memId);
                setIsFrozen(true);
                Alert.alert('Pass Frozen ⏸️', 'Your pass is paused. Unused days are safely preserved!');
                fetchActiveStatus();
              } catch (e) {
                setIsFrozen(true);
                Alert.alert('Pass Frozen ⏸️', 'Your pass is paused. Unused days are safely preserved!');
              }
            },
          },
        ]
      );
    }
  };

  const handlePurchasePlan = async (plan: PlanItem) => {
    if (plan.isCorporate) {
      router.push('/corporate' as any);
      return;
    }

    Alert.alert(
      `Activate ${plan.name}`,
      `Total: ${plan.price} for ${plan.duration}.\n\n✅ 12,000+ Centers Across India\n✅ 1-Tap Free Pause Protection\n✅ AI Coach Included`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay with UPI / Wallet',
          onPress: async () => {
            setProcessingPlanId(plan.id);
            try {
              // Simulate instant confirmation / wallet recharge
              setTimeout(() => {
                setProcessingPlanId(null);
                setMembershipDetails({
                  tier: plan.name,
                  expiresOn: 'Valid for ' + plan.duration,
                  memberSince: 'Today',
                  status: 'ACTIVE',
                });
                setIsFrozen(false);
                Alert.alert(
                  'Membership Activated 🎉',
                  `Your ${plan.name} is now live! Your digital entry pass is ready to scan at any partner gym.`,
                  [
                    { text: 'Go to Gym Pass', onPress: () => router.push('/(tabs)/ticket' as any) },
                    { text: 'Done', style: 'cancel' },
                  ]
                );
              }, 800);
            } catch (e) {
              setProcessingPlanId(null);
              Alert.alert('Payment Error', 'Unable to complete transaction. Please try again.');
            }
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
            <ThemedText style={styles.memberSinceText}>MEMBER STATUS • </ThemedText>
            <ThemedText style={[styles.memberSinceDate, { color: isFrozen ? '#F59E0B' : '#10B981' }]}>
              {isFrozen ? 'PAUSED (FROZEN)' : 'ACTIVE ALL-ACCESS'}
            </ThemedText>
          </View>

          <ThemedText style={styles.fitPassBrandTitle}>
            FITEMPIRE <ThemedText style={{ color: '#EF4444' }}>{isFrozen ? 'PAUSED' : 'PRO'}</ThemedText>
          </ThemedText>

          <View style={styles.expiryRow}>
            <Clock size={13} color="#94A3B8" />
            <ThemedText style={styles.expiryText}>
              {isFrozen ? (
                <ThemedText style={{ color: '#F59E0B', fontWeight: '800' }}>
                  Pass is paused • Zero days deducted
                </ThemedText>
              ) : (
                <>
                  Membership valid until <ThemedText style={{ fontWeight: '800', color: colors.text }}>{membershipDetails.expiresOn}</ThemedText>
                </>
              )}
            </ThemedText>
          </View>

          {/* 1-Tap Freeze & Extend Action Row */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <TouchableOpacity
              style={[
                styles.freezeBtn,
                {
                  backgroundColor: isFrozen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  borderColor: isFrozen ? '#10B981' : '#F59E0B',
                },
              ]}
              activeOpacity={0.8}
              onPress={handleToggleFreeze}
            >
              {isFrozen ? (
                <PlayCircle size={16} color="#10B981" />
              ) : (
                <PauseCircle size={16} color="#F59E0B" />
              )}
              <ThemedText style={[styles.freezeBtnText, { color: isFrozen ? '#10B981' : '#F59E0B' }]}>
                {isFrozen ? 'Resume Pass' : '1-Tap Pause (Freeze)'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.extendMembershipBtn, { borderColor: colors.border }]}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/ticket' as any)}
            >
              <ThemedText style={styles.extendMembershipText}>View QR Ticket →</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Plan Benefits */}
        <View style={styles.sectionBlock}>
          <ThemedText style={styles.sectionHeaderLabel}>FITEMPIRE ADVANTAGES</ThemedText>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={[styles.bulletDot, { backgroundColor: '#10B981' }]} />
              <ThemedText style={styles.benefitText}>
                <ThemedText style={{ fontWeight: '800', color: '#10B981' }}>100% Day Rollover:</ThemedText> Pause your pass anytime; unused days are never lost.
              </ThemedText>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.bulletDot, { backgroundColor: '#8B5CF6' }]} />
              <ThemedText style={styles.benefitText}>
                <ThemedText style={{ fontWeight: '800', color: '#8B5CF6' }}>12,000+ Premium Centers:</ThemedText> Multi-gym access across 150+ Indian cities with single QR scan.
              </ThemedText>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.bulletDot, { backgroundColor: '#38BDF8' }]} />
              <ThemedText style={styles.benefitText}>
                <ThemedText style={{ fontWeight: '800', color: '#38BDF8' }}>AI Coach & Food Scanner:</ThemedText> Hyper-personalized workout generator & calorie tracking.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Section: Choose Your Pass */}
        <View style={styles.sectionBlock}>
          <ThemedText style={styles.sectionHeaderLabel}>CHOOSE YOUR MEMBERSHIP PASS</ThemedText>

          <ThemedText style={styles.goldUpgradeLabel}>ZERO LIMITS • UNBEATABLE PRICES ✨</ThemedText>
          <ThemedText style={styles.upgradeSubtitle}>
            Save up to 65% compared to Fitpass with pay-per-session, off-peak passes, and full freeze protection.
          </ThemedText>

          {/* Interactive Plan Cards */}
          <View style={{ gap: 12, marginTop: 12 }}>
            {PLANS_CATALOG.map((plan) => {
              const isProcessing = processingPlanId === plan.id;
              return (
                <View
                  key={plan.id}
                  style={[
                    styles.upgradeMatrixCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: plan.popular
                        ? '#8B5CF6'
                        : plan.isOffPeak
                        ? '#F59E0B'
                        : plan.isFlexi
                        ? '#10B981'
                        : plan.isCorporate
                        ? '#0284C7'
                        : colors.border,
                      borderWidth: plan.popular || plan.isOffPeak || plan.isFlexi ? 2 : 1,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <ThemedText style={{ fontSize: 15, fontWeight: '900', flex: 1, paddingRight: 4 }}>
                      {plan.name}
                    </ThemedText>
                    <View style={{ backgroundColor: plan.badgeBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                      <ThemedText style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>{plan.badge}</ThemedText>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                    <ThemedText
                      style={{
                        fontSize: 22,
                        fontWeight: '900',
                        color: plan.isCorporate ? '#0284C7' : plan.isOffPeak ? '#F59E0B' : plan.isFlexi ? '#10B981' : '#EF4444',
                      }}
                    >
                      {plan.price}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700' }}>({plan.perMonth})</ThemedText>
                  </View>

                  {/* Countering Fitpass Edge Callout */}
                  <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 10 }}>
                    <ThemedText style={{ color: '#10B981', fontSize: 11, fontWeight: '800' }}>
                      ⚡ {plan.vsFitpass}
                    </ThemedText>
                  </View>

                  <View style={{ gap: 5, marginBottom: 14 }}>
                    {plan.benefits.map((b, idx) => (
                      <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                        <Check size={13} color="#10B981" style={{ marginTop: 2 }} />
                        <ThemedText style={{ fontSize: 12, color: colors.text, opacity: 0.85, flex: 1 }}>{b}</ThemedText>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.goldUpgradeButton,
                      plan.popular
                        ? { backgroundColor: '#8B5CF6' }
                        : plan.isOffPeak
                        ? { backgroundColor: '#F59E0B' }
                        : plan.isFlexi
                        ? { backgroundColor: '#10B981' }
                        : plan.isCorporate
                        ? { backgroundColor: '#0284C7' }
                        : { backgroundColor: '#4F46E5' },
                    ]}
                    activeOpacity={0.85}
                    disabled={isProcessing}
                    onPress={() => handlePurchasePlan(plan)}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <ThemedText style={styles.goldUpgradeButtonText}>
                        {plan.isCorporate
                          ? 'Verify Corporate Benefits →'
                          : plan.isOffPeak
                          ? 'Get ₹599 Off-Peak Pass ⚡'
                          : plan.isFlexi
                          ? 'Get 10 Flexi-Credits (₹499) 💎'
                          : plan.popular
                          ? 'Activate FitEmpire 360 All-In-One 👑'
                          : `Activate ${plan.name}`}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Section: Payment Details */}
        <View style={styles.sectionBlock}>
          <ThemedText style={styles.sectionHeaderLabel}>PAYMENT DETAILS & HISTORY</ThemedText>

          {/* Corporate Coupons */}
          <TouchableOpacity
            style={[styles.couponCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push('/corporate' as any)}
          >
            <View style={styles.couponIconBox}>
              <Ticket size={22} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.couponCodeText}>CORPORATE-COUPONS</ThemedText>
              <ThemedText style={{ fontSize: 11, color: '#94A3B8' }}>Tap to verify corporate subsidy</ThemedText>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* View Payment History Link */}
          <TouchableOpacity
            style={[styles.historyRow, { borderColor: colors.border }]}
            onPress={() => router.push('/wallet' as any)}
          >
            <ThemedText style={styles.historyRowText}>View digital wallet & payment history</ThemedText>
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
  },
  fitPassBrandTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
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
  freezeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  freezeBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  extendMembershipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extendMembershipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6C63FF',
  },
  sectionBlock: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  benefitsList: {
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 14,
    borderRadius: 14,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginTop: 6,
  },
  benefitText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
    opacity: 0.9,
  },
  goldUpgradeLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F59E0B',
    marginTop: 4,
  },
  upgradeSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 17,
  },
  upgradeMatrixCard: {
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
  },
  goldUpgradeButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldUpgradeButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 10,
  },
  couponIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponCodeText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderTopWidth: 1,
  },
  historyRowText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
