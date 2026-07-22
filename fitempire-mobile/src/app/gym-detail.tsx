import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { gymsApi, membershipsApi } from '@/services/api';
import { Star, MapPin, Phone, Globe, Shield, Activity, Calendar, Trophy, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function GymDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [gym, setGym] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGymDetails();
  }, [id]);

  const fetchGymDetails = async () => {
    setLoading(true);
    try {
      if (id) {
        const gymRes = await gymsApi.getGymDetails(id);
        setGym(gymRes.data.data);
        
        const branchesRes = await gymsApi.getBranches(id);
        setBranches(branchesRes.data.data || []);
      }

      const plansRes = await membershipsApi.getPlans();
      const activePlans = plansRes.data.data || [];
      setPlans(activePlans.filter((p: any) => p.gymId === id || !id));

    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Failed to load gym details');
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Cover Photo */}
        <Image source={{ uri: gym?.coverImageUrl }} style={styles.coverImage} />
        
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ThemedText style={styles.backBtnText}>← Back</ThemedText>
        </TouchableOpacity>

        {/* Header Block */}
        <View style={styles.headerBlock}>
          <View style={styles.titleRow}>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>{gym?.category}</ThemedText>
            </View>
            <View style={styles.ratingRow}>
              <Star size={16} color="#FFB038" fill="#FFB038" />
              <ThemedText style={styles.ratingText}>{gym?.avgRating}</ThemedText>
              <ThemedText style={styles.reviewsText}>({gym?.totalReviews} reviews)</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.gymName}>{gym?.name}</ThemedText>
        </View>

        {/* Quick Details */}
        <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <ThemedText style={styles.description} themeColor="textSecondary">
            {gym?.description}
          </ThemedText>

          <View style={styles.divider} />

          <View style={styles.contactRow}>
            <Phone size={18} color="#6C63FF" />
            <ThemedText style={styles.contactText} themeColor="textSecondary">{gym?.phone}</ThemedText>
          </View>
          <View style={styles.contactRow}>
            <Globe size={18} color="#6C63FF" />
            <ThemedText style={styles.contactText} themeColor="textSecondary">{gym?.websiteUrl}</ThemedText>
          </View>
        </View>

        {/* Branches */}
        <ThemedText style={styles.groupTitle}>Locations & Branches</ThemedText>
        {branches.map((b) => (
          <View key={b.id} style={[styles.branchCard, { backgroundColor: colors.backgroundElement }]}>
            <View style={styles.branchHeader}>
              <View>
                <ThemedText style={styles.branchName}>{b.name}</ThemedText>
                <ThemedText style={styles.branchAddress} themeColor="textSecondary">
                  📍 {b.addressLine1}, {b.city}
                </ThemedText>
              </View>
              <TouchableOpacity
                style={styles.bookClassBtn}
                onPress={() => router.push({ pathname: '/booking', params: { gymId: gym.id, branchId: b.id, bookingType: 'CLASS' } })}
              >
                <Calendar size={16} color="#ffffff" />
                <ThemedText style={styles.bookClassText}>Book Class</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Membership Plans */}
        <ThemedText style={styles.groupTitle}>Available Membership Plans</ThemedText>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.planCard, { backgroundColor: colors.backgroundElement }]}
            onPress={() => router.push({ pathname: '/membership', params: { planId: plan.id } })}
          >
            <View style={styles.planHeader}>
              <View>
                <ThemedText style={styles.planTitle}>{plan.name}</ThemedText>
                <ThemedText style={styles.planDuration} themeColor="textSecondary">
                  Validity: {plan.durationDays} Days • {plan.type}
                </ThemedText>
              </View>
              <View style={styles.priceContainer}>
                <ThemedText style={styles.priceSymbol}>₹</ThemedText>
                <ThemedText style={styles.priceValue}>{plan.price}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.planDesc} themeColor="textSecondary">
              {plan.description}
            </ThemedText>
            <View style={styles.purchaseBar}>
              <ThemedText style={styles.purchaseText}>Subscribe & Activate</ThemedText>
              <ChevronRight size={16} color="#6C63FF" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  coverImage: { width: '100%', height: 240 },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  backBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  headerBlock: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { backgroundColor: '#6C63FF', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8 },
  badgeText: { color: '#ffffff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '800', color: '#FFB038' },
  reviewsText: { fontSize: 11, color: '#888' },
  gymName: { fontSize: 24, fontWeight: '900', marginTop: 4 },
  card: { marginHorizontal: 16, borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  description: { fontSize: 13, lineHeight: 18 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  contactText: { fontSize: 13 },
  groupTitle: { fontSize: 16, fontWeight: '800', marginHorizontal: 20, marginBottom: 12, marginTop: 12 },
  branchCard: { marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 12 },
  branchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  branchName: { fontSize: 14, fontWeight: '700' },
  branchAddress: { fontSize: 11, marginTop: 2 },
  bookClassBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#6C63FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  bookClassText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  planCard: { marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 12 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  planTitle: { fontSize: 15, fontWeight: '700' },
  planDuration: { fontSize: 11, marginTop: 2 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  priceSymbol: { fontSize: 12, fontWeight: '700', color: '#6C63FF' },
  priceValue: { fontSize: 18, fontWeight: '800', color: '#6C63FF' },
  planDesc: { fontSize: 11, lineHeight: 15 },
  purchaseBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  purchaseText: { fontSize: 12, fontWeight: '700', color: '#6C63FF' },
});
