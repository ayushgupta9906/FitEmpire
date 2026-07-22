import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { membershipsApi, paymentsApi } from '@/services/api';
import { Check, Shield, Award, Sparkles, CreditCard, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function MembershipScreen() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await membershipsApi.getPlans();
      const planList = res.data.data || [];
      setPlans(planList);

      // Select requested plan or default first
      if (planId && planList.length > 0) {
        const found = planList.find((p: any) => p.id === planId);
        setSelectedPlan(found || planList[0]);
      } else if (planList.length > 0) {
        setSelectedPlan(planList[0]);
      }
    } catch (e) {
      console.warn("Failed to load plans:", e);
      Alert.alert('Error', 'Failed to load membership plans.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    setPurchasing(true);
    try {
      // Step 1: Initiate order
      const orderRes = await paymentsApi.createOrder(selectedPlan.id);
      const { paymentId, razorpayOrderId } = orderRes.data.data;

      // Simulate real razorpay UI interaction by using Alert (since we don't have the Razorpay SDK installed in this MVP)
      Alert.alert(
        'Razorpay Checkout (Test Mode)',
        `Pay ₹${selectedPlan.price} for ${selectedPlan.name}?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setPurchasing(false) },
          {
            text: 'Pay Now',
            onPress: async () => {
              try {
                // Step 2: verify signature
                await paymentsApi.verifyPayment({
                  paymentId,
                  razorpayOrderId: razorpayOrderId,
                  razorpayPaymentId: 'pay_test_' + Math.random().toString(36).substring(7),
                  razorpaySignature: 'sig_test_dummy',
                });
                Alert.alert('Payment Successful!', 'Your FitPass membership is now active.', [
                  { text: 'Great!', onPress: () => router.replace('/(tabs)') }
                ]);
              } catch (verifyErr) {
                Alert.alert('Payment Failed', 'Payment verification failed.');
              } finally {
                setPurchasing(false);
              }
            }
          }
        ]
      );
    } catch (e) {
      console.warn("Payment error", e);
      Alert.alert('Error', 'Failed to initiate payment checkout.');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </ThemedView>
    );
  }

  const features = [
    'Access to 400+ gyms and fitness centers',
    'Unlimited class bookings (Yoga, HIIT, Zumba)',
    'Easy QR-code scanner entry',
    'Free nutrition and trainer consultations',
    'Dynamic workout generation via AI',
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Membership Plans</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Intro */}
        <View style={styles.introBlock}>
          <Award size={36} color="#6C63FF" />
          <ThemedText style={styles.introTitle}>Unlock the Empire Pass</ThemedText>
          <ThemedText style={styles.introSubtitle} themeColor="textSecondary">
            Purchase a single membership and work out at any gym, studio, or center near you.
          </ThemedText>
        </View>

        {/* Plans Carousel/List */}
        {plans.map((p) => {
          const isSelected = selectedPlan?.id === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.planCard,
                {
                  backgroundColor: colors.backgroundElement,
                  borderColor: isSelected ? '#6C63FF' : 'transparent',
                  borderWidth: 1.5
                }
              ]}
              onPress={() => setSelectedPlan(p)}
            >
              <View style={styles.planHeader}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.planName}>{p.name}</ThemedText>
                  <ThemedText style={styles.planMeta} themeColor="textSecondary">
                    Duration: {p.durationDays} Days • {p.type}
                  </ThemedText>
                </View>
                <View style={styles.priceBlock}>
                  <ThemedText style={styles.priceSymbol}>₹</ThemedText>
                  <ThemedText style={styles.priceValue}>{p.price}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.planDesc} themeColor="textSecondary">
                {p.description}
              </ThemedText>
            </TouchableOpacity>
          );
        })}

        {/* Features Card */}
        <View style={[styles.featuresCard, { backgroundColor: colors.backgroundElement }]}>
          <View style={styles.featuresHeader}>
            <Sparkles size={18} color="#FFB038" />
            <ThemedText style={styles.featuresTitle}>What's Included</ThemedText>
          </View>
          {features.map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <Check size={16} color="#43D787" />
              <ThemedText style={styles.featureText} themeColor="textSecondary">{f}</ThemedText>
            </View>
          ))}
        </View>

        {/* Security Info */}
        <View style={styles.securityRow}>
          <Shield size={16} color="#888" />
          <ThemedText style={styles.securityText}>
            Secured checkout via Razorpay/Stripe. Cancel subscription at any time.
          </ThemedText>
        </View>
      </ScrollView>

      {/* Purchase floating footer */}
      {selectedPlan && (
        <View style={[styles.footer, { backgroundColor: colors.backgroundElement, borderTopColor: 'rgba(255,255,255,0.05)' }]}>
          <TouchableOpacity style={styles.payBtn} onPress={handlePurchase} disabled={purchasing}>
            <CreditCard size={18} color="#ffffff" />
            <ThemedText style={styles.payBtnText}>
              {purchasing ? 'Processing...' : `Purchase Pass • ₹${selectedPlan.price}`}
            </ThemedText>
            <ChevronRight size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}
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
  scroll: { padding: 16, paddingBottom: 100 },
  introBlock: { alignItems: 'center', marginVertical: 16, paddingHorizontal: 20 },
  introTitle: { fontSize: 20, fontWeight: '900', marginTop: 12, textAlign: 'center' },
  introSubtitle: { fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 16 },
  planCard: { borderRadius: 18, padding: 20, marginBottom: 16 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  planName: { fontSize: 15, fontWeight: '800' },
  planMeta: { fontSize: 11, marginTop: 2 },
  priceBlock: { flexDirection: 'row', alignItems: 'baseline' },
  priceSymbol: { fontSize: 12, fontWeight: '700', color: '#6C63FF' },
  priceValue: { fontSize: 20, fontWeight: '800', color: '#6C63FF' },
  planDesc: { fontSize: 11, lineHeight: 16 },
  featuresCard: { borderRadius: 18, padding: 20, marginVertical: 12 },
  featuresHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  featuresTitle: { fontSize: 14, fontWeight: '800' },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  featureText: { fontSize: 12 },
  securityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, justifyContent: 'center', marginVertical: 16 },
  securityText: { fontSize: 10, color: '#888', textAlign: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1 },
  payBtn: { flexDirection: 'row', backgroundColor: '#6C63FF', height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', gap: 8 },
  payBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
});
