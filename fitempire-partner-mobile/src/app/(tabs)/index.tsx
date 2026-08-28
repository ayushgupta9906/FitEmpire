import React, { useState, useEffect } from 'react';
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
import { Colors, BottomTabInset } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  MapPin,
  ChevronDown,
  Coins,
  Mic,
  Sparkles,
  ChevronRight,
  Play,
  Star,
  Plus,
  Heart,
  Flame,
  Award,
} from 'lucide-react-native';
import { gymsApi, walletApi, ecosystemApi } from '@/services/api';


const { width } = Dimensions.get('window');

// 1. Ecosystem 3D Badges
const ECOSYSTEM_SERVICES = [
  { id: 'pass', name: 'EMPIRE PASS', icon: '🏋️', route: '/membership' },
  { id: 'sports', name: 'SPORTS', icon: '🏸', route: '/explore' },
  { id: 'feast', name: 'EMPIRE FEAST', icon: '🥗', route: '/ai-workout' },
  { id: 'coach', name: 'AI COACH', icon: '⚡', route: '/ai-workout' },
  { id: 'store', name: 'STORE', icon: '🛍️', badge: 'SALE', route: '/store' },
  { id: 'tv', name: 'EMPIRE TV', icon: '📺', route: '/tv' },
  { id: 'care', name: 'EMPIRE CARE', icon: '🩺', route: '/care' },
];

// 2. What's On Your Mind (10-Card Colorful Matrix)
const WHATS_ON_YOUR_MIND = [
  { id: 'hiit', name: 'HIIT', color: '#0D9488', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop' },
  { id: 'yoga', name: 'YOGA', color: '#7C3AED', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop' },
  { id: 'gym', name: 'GYM\nWORKOUTS', color: '#78350F', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop' },
  { id: 'swimming', name: 'SWIMMING', color: '#4F46E5', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop' },
  { id: 'spin', name: 'SPIN N\nRPM', color: '#581C87', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&auto=format&fit=crop' },
  { id: 'cardio', name: 'CARDIO', color: '#D97706', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&auto=format&fit=crop' },
  { id: 'mma', name: 'MMA', color: '#65A30D', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop' },
  { id: 'zumba', name: 'ZUMBA', color: '#F59E0B', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop' },
  { id: 'dance', name: 'DANCE', color: '#DB2777', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop' },
  { id: 'toning', name: 'BODY TONING', color: '#DC2626', image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=400&auto=format&fit=crop' },
];

// 3. Workouts from around the world
const VIDEO_WORKOUTS = [
  { id: 'vw1', title: 'Kids Bootcamp #2', duration: '18 min', level: 'Beginner', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop' },
  { id: 'vw2', title: '30-Minute Body Blast FightCamp', duration: '30 min', level: 'Non-Stop', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500&auto=format&fit=crop' },
  { id: 'vw3', title: '25 Minute HIIT Cardio', duration: '25 min', level: 'Cardio', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop' },
  { id: 'vw4', title: '30 Minute Ride #18', duration: '30 min', level: 'Cycling', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500&auto=format&fit=crop' },
];

// 4. Fitness Centers Near You
const NEARBY_CENTERS = [
  { id: 'c1', name: 'Aries Fitness', rating: 4.8, location: 'Sector 168', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop' },
  { id: 'c2', name: 'Fitmate Fitness Centre', rating: 4.9, location: 'Sector 142', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop' },
  { id: 'c3', name: 'Muscle World Gym', rating: 4.7, location: 'Gaur City', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop' },
];

// 5. Store Products
const PRODUCTS_RECOMMENDED = [
  { id: 'p1', name: 'Origami Foldable Yoga Mat', price: '₹2,299', oldPrice: '₹3,499', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&auto=format&fit=crop' },
  { id: 'p2', name: 'Premium Stem Yoga Mat', price: '₹2,199', oldPrice: '₹3,499', image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&auto=format&fit=crop' },
  { id: 'p3', name: 'QuickShift Adjustable Dumbbell', price: '₹8,999', oldPrice: '₹12,999', image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=400&auto=format&fit=crop' },
];

const PRODUCTS_NUTRITION = [
  { id: 'pn1', name: 'Gutsy Immunity Defense - 7 Days Pack', price: '₹249', oldPrice: '₹499', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop' },
  { id: 'pn2', name: 'Gutsy Immunity Defense - 30 Days Pack', price: '₹1,099', oldPrice: '₹1,499', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop' },
  { id: 'pn3', name: 'Gutsy Metabolic Boost - 7 days Pack', price: '₹299', oldPrice: '₹599', image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&auto=format&fit=crop' },
];

const PRODUCTS_COMPACT = [
  { id: 'pc1', name: 'QuickShift Pro - 3-in-1 Dumbbell', price: '₹17,499', oldPrice: '₹34,999', image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=400&auto=format&fit=crop' },
  { id: 'pc2', name: 'PowerBrick - Heavyweight Performance', price: '₹9,999', oldPrice: '₹19,999', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&auto=format&fit=crop' },
  { id: 'pc3', name: 'Lever Gym Belt - Built for Heavy Lifters', price: '₹6,999', oldPrice: '₹13,999', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop' },
];

const HEALTH_TOPICS = [
  'Dance', 'Diet', 'Exercise', 'Flexibility', 'Gym',
  'Health', 'Meditation', 'Nutrition', 'Pilates', 'Protein',
  'Swimming', 'Workout', 'Yoga',
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [location, setLocation] = useState('Sector 167');
  const [nearbyGyms, setNearbyGyms] = useState<any[]>(NEARBY_CENTERS);
  const [walletBalance, setWalletBalance] = useState('100');
  const [videoList, setVideoList] = useState<any[]>(VIDEO_WORKOUTS);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    // 1. Fetch live nearby gyms
    try {
      const gymRes = await gymsApi.getActive(0, 10);
      const gymItems = gymRes.data?.data?.content || [];
      if (gymItems.length > 0) {
        setNearbyGyms(
          gymItems.map((g: any) => ({
            id: g.id,
            name: g.name,
            rating: g.avgRating ? Number(g.avgRating).toFixed(1) : '4.8',
            location: g.branches?.[0]?.city || 'Bengaluru',
            image: g.coverImageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop',
          }))
        );
      }
    } catch (e) {
      console.warn('Home gyms fetch fallback:', e);
    }

    // 2. Fetch live wallet balance
    try {
      const wRes = await walletApi.getWalletInfo();
      if (wRes.data?.data?.balance !== undefined) {
        setWalletBalance(Number(wRes.data.data.balance).toFixed(0));
      }
    } catch (e) {
      console.warn('Home wallet fetch fallback:', e);
    }

    // 3. Fetch ecosystem videos
    try {
      const tvRes = await ecosystemApi.getVideoClasses();
      const vids = tvRes.data?.data || [];
      if (vids.length > 0) {
        setVideoList(vids);
      }
    } catch (e) {
      console.warn('Home TV fetch fallback:', e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Location & Coins Bar */}
      <View style={[styles.topHeaderBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.locationWrap}
          onPress={() => {
            const locs = ['Sector 167', 'Sector 168', 'Indiranagar Bangalore', 'Cyber City Gurgaon'];
            const next = locs[(locs.indexOf(location) + 1) % locs.length];
            setLocation(next);
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={15} color="#EF4444" fill="#EF4444" />
            <ThemedText style={styles.locationTitle}>{location}</ThemedText>
            <ChevronDown size={14} color={colors.textSecondary} />
          </View>
          <ThemedText style={styles.weatherSub}>35.6° • Thundery outbreaks in nearby</ThemedText>
        </TouchableOpacity>

        {/* Coins Pill & Avatar */}
        <View style={styles.topRightWrap}>
          <TouchableOpacity
            style={[styles.coinsPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push('/wallet' as any)}
          >
            <Coins size={14} color="#F59E0B" />
            <ThemedText style={styles.coinsText}>₹{walletBalance}</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.avatarButton}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
              }}
              style={styles.avatarImg}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + BottomTabInset + 40,
        }}
      >
        {/* Dual Action Cards (Log Your Meal & Get Exercise Plan) */}
        <View style={styles.dualActionRow}>
          {/* Card 1: Log Meal */}
          <View style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <ThemedText style={styles.actionCardMiniLabel}>Log Your Meal</ThemedText>
              <ThemedText style={{ fontSize: 16 }}>🍲</ThemedText>
            </View>
            <ThemedText style={styles.actionCardTitle}>A Fresh Diet Plan is Co...</ThemedText>
            <ThemedText style={styles.actionCardSub}>
              Our nutritionists are crafting a plan to match your goals.
            </ThemedText>
            <TouchableOpacity
              style={styles.logVoiceBtn}
              onPress={() => router.push('/ai-workout')}
            >
              <Mic size={14} color="#EF4444" />
              <ThemedText style={styles.logVoiceText}>Log</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Card 2: Exercise Plan */}
          <View style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.exercisePlanThumbsRow}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&auto=format&fit=crop' }} style={styles.miniThumb} />
              <Image source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop' }} style={styles.miniThumb} />
              <Image source={{ uri: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=100&auto=format&fit=crop' }} style={styles.miniThumb} />
            </View>
            <ThemedText style={styles.actionCardTitle}>Get your own Exercise plan</ThemedText>
            <TouchableOpacity
              style={styles.setupNowBtn}
              onPress={() => router.push('/ai-workout')}
            >
              <ThemedText style={styles.setupNowText}>Setup now</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ecosystem 3D Services Icons Grid */}
        <View style={styles.ecosystemGrid}>
          {ECOSYSTEM_SERVICES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.ecosystemItem}
              activeOpacity={0.8}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.ecosystemIconCircle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ThemedText style={{ fontSize: 26 }}>{item.icon}</ThemedText>
                {item.badge && (
                  <View style={styles.saleBadge}>
                    <ThemedText style={styles.saleBadgeText}>{item.badge}</ThemedText>
                  </View>
                )}
              </View>
              <ThemedText style={styles.ecosystemLabel}>{item.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* "What's on your mind" 10-Card Colorful Matrix */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeaderTitle}>What's on your mind</ThemedText>

          <View style={styles.whatsOnMindGrid}>
            {WHATS_ON_YOUR_MIND.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.mindCard, { backgroundColor: cat.color }]}
                activeOpacity={0.85}
                onPress={() => router.push('/explore' as any)}
              >
                <Image source={{ uri: cat.image }} style={styles.mindCardImage} />
                <View style={styles.mindCardOverlay} />
                <ThemedText style={styles.mindCardText}>{cat.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upgrade Plan Card (Gold Gradient) */}
        <TouchableOpacity
          style={styles.goldUpgradeBanner}
          activeOpacity={0.9}
          onPress={() => router.push('/membership')}
        >
          <ThemedText style={styles.goldBannerHeader}>
            Unlimited workouts, zero limits! Upgrade now & level up your fitness!
          </ThemedText>
          <ThemedText style={styles.goldBannerPrice}>Starting at ₹1,001/month</ThemedText>

          <View style={styles.goldComparisonBox}>
            <View style={styles.goldLeftBox}>
              <ThemedText style={styles.goldBoxLabel}>
                <ThemedText style={{ color: '#EF4444', fontWeight: '900' }}>03 </ThemedText>
                workout per week
              </ThemedText>
            </View>

            <ThemedText style={{ fontSize: 16 }}>🔁</ThemedText>

            <View style={styles.goldRightBox}>
              <ThemedText style={styles.goldUnlimitedLabel}>Unlimited workout per week</ThemedText>
            </View>
          </View>

          <View style={styles.goldCtaButton}>
            <ThemedText style={styles.goldCtaText}>Upgrade to Membership</ThemedText>
          </View>
        </TouchableOpacity>

        {/* "Workouts from around the world at your fingertips" Carousel */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <ThemedText style={styles.sectionHeaderTitle}>
              Workouts from around the world at your fingertips
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/classes')}>
              <ThemedText style={styles.seeAllText}>View all</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollGap}
          >
            {VIDEO_WORKOUTS.map((vid) => (
              <TouchableOpacity
                key={vid.id}
                style={[styles.videoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                activeOpacity={0.9}
                onPress={() => router.push('/classes')}
              >
                <Image source={{ uri: vid.image }} style={styles.videoThumb} />
                <View style={styles.videoDurationPill}>
                  <ThemedText style={styles.videoDurationText}>⏱ {vid.duration}</ThemedText>
                </View>
                <View style={styles.videoInfo}>
                  <ThemedText style={styles.videoTitle} numberOfLines={1}>
                    {vid.title}
                  </ThemedText>
                  <ThemedText style={styles.videoLevel}>{vid.level}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* "Fitness Centres Near You" Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <ThemedText style={styles.sectionHeaderTitle}>Fitness Centres Near You</ThemedText>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <ThemedText style={styles.seeAllText}>View all</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollGap}
          >
            {nearbyGyms.map((gym) => (
              <TouchableOpacity
                key={gym.id}
                style={[styles.gymNearbyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: '/gym-detail', params: { id: gym.id } } as any)}
              >
                <Image source={{ uri: gym.image }} style={styles.gymNearbyImage} />
                <View style={styles.gymNearbyInfo}>
                  <ThemedText style={styles.gymNearbyName}>{gym.name}</ThemedText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <ThemedText style={styles.gymNearbyRating}>{gym.rating}</ThemedText>
                    <ThemedText style={styles.gymNearbyLoc}>• {gym.location}</ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* "Recommended Products" Store Section */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeaderTitle}>Recommended product</ThemedText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollGap}
          >
            {PRODUCTS_RECOMMENDED.map((p) => (
              <View
                key={p.id}
                style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Image source={{ uri: p.image }} style={styles.productImage} />
                <ThemedText style={styles.productName} numberOfLines={2}>{p.name}</ThemedText>
                <View style={styles.productPriceRow}>
                  <View>
                    <ThemedText style={styles.productPrice}>{p.price}</ThemedText>
                    <ThemedText style={styles.productOldPrice}>{p.oldPrice}</ThemedText>
                  </View>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => Alert.alert('Added to Bag', `${p.name} added to cart.`)}
                  >
                    <ThemedText style={styles.addBtnText}>Add</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* "Stronger gut, Stronger you" Section */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeaderTitle}>Stronger gut, Stronger you</ThemedText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollGap}
          >
            {PRODUCTS_NUTRITION.map((p) => (
              <View
                key={p.id}
                style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Image source={{ uri: p.image }} style={styles.productImage} />
                <ThemedText style={styles.productName} numberOfLines={2}>{p.name}</ThemedText>
                <View style={styles.productPriceRow}>
                  <View>
                    <ThemedText style={styles.productPrice}>{p.price}</ThemedText>
                    <ThemedText style={styles.productOldPrice}>{p.oldPrice}</ThemedText>
                  </View>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => Alert.alert('Added to Bag', `${p.name} added to cart.`)}
                  >
                    <ThemedText style={styles.addBtnText}>Add</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* "Compact fitness finds" Section */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeaderTitle}>Compact fitness finds</ThemedText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollGap}
          >
            {PRODUCTS_COMPACT.map((p) => (
              <View
                key={p.id}
                style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Image source={{ uri: p.image }} style={styles.productImage} />
                <ThemedText style={styles.productName} numberOfLines={2}>{p.name}</ThemedText>
                <View style={styles.productPriceRow}>
                  <View>
                    <ThemedText style={styles.productPrice}>{p.price}</ThemedText>
                    <ThemedText style={styles.productOldPrice}>{p.oldPrice}</ThemedText>
                  </View>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => Alert.alert('Added to Bag', `${p.name} added to cart.`)}
                  >
                    <ThemedText style={styles.addBtnText}>Add</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Health & Wellness Topics Pills Grid */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeaderTitle}>Health & Wellness Topics</ThemedText>
          <View style={styles.healthTopicsGrid}>
            {HEALTH_TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic}
                style={[styles.healthTopicPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push('/explore')}
              >
                <ThemedText style={styles.healthTopicText}>{topic}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rate Your Workout Banner */}
        <TouchableOpacity
          style={[styles.rateWorkoutCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => Alert.alert('Rate Workout', 'Thank you for your rating!')}
        >
          <ThemedText style={{ fontSize: 24 }}>🏋️</ThemedText>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <ThemedText style={styles.rateWorkoutTitle}>Rate Your Workout</ThemedText>
            <ThemedText style={styles.rateWorkoutSub}>Take a moment to share your experience</ThemedText>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  locationWrap: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  weatherSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  topRightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coinsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  coinsText: {
    fontSize: 12,
    fontWeight: '800',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  dualActionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 10,
  },
  actionCard: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  actionCardMiniLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  actionCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  actionCardSub: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 12,
  },
  logVoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  logVoiceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  exercisePlanThumbsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniThumb: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  setupNowBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  setupNowText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  ecosystemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 18,
    gap: 12,
    justifyContent: 'space-between',
  },
  ecosystemItem: {
    width: (width - 32 - 36) / 4,
    alignItems: 'center',
  },
  ecosystemIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  saleBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  saleBadgeText: {
    color: '#FFF',
    fontSize: 7,
    fontWeight: '900',
  },
  ecosystemLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  whatsOnMindGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mindCard: {
    width: (width - 32 - 32) / 5,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  mindCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  mindCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mindCardText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
  },
  goldUpgradeBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    borderWidth: 1,
    borderColor: '#D97706',
    padding: 16,
    gap: 8,
  },
  goldBannerHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  goldBannerPrice: {
    fontSize: 11,
    color: '#94A3B8',
  },
  goldComparisonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  goldLeftBox: {
    flex: 1,
  },
  goldRightBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  goldBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  goldUnlimitedLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  goldCtaButton: {
    backgroundColor: '#D97706',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  goldCtaText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  horizontalScrollGap: {
    gap: 12,
  },
  videoCard: {
    width: 170,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  videoThumb: {
    width: '100%',
    height: 100,
  },
  videoDurationPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  videoDurationText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  videoInfo: {
    padding: 8,
  },
  videoTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  videoLevel: {
    fontSize: 9,
    color: '#EF4444',
    fontWeight: '700',
    marginTop: 2,
  },
  gymNearbyCard: {
    width: 200,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  gymNearbyImage: {
    width: '100%',
    height: 110,
  },
  gymNearbyInfo: {
    padding: 10,
  },
  gymNearbyName: {
    fontSize: 12,
    fontWeight: '800',
  },
  gymNearbyRating: {
    fontSize: 10,
    fontWeight: '800',
  },
  gymNearbyLoc: {
    fontSize: 10,
    color: '#94A3B8',
  },
  productCard: {
    width: 140,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 8,
    gap: 6,
  },
  productImage: {
    width: '100%',
    height: 90,
    borderRadius: 8,
  },
  productName: {
    fontSize: 10,
    fontWeight: '700',
    height: 28,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 11,
    fontWeight: '900',
  },
  productOldPrice: {
    fontSize: 9,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
  },
  healthTopicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  healthTopicPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  healthTopicText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rateWorkoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  rateWorkoutTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  rateWorkoutSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
});
