import { useState, useEffect } from 'react';
import { StyleSheet, Pressable, View, Image, ScrollView, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Search, MapPin, Star, Heart, Navigation, Dumbbell } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

const CATEGORIES = ['All', 'GYM', 'MMA', 'BOXING', 'KICKBOXING', 'DANCE', 'SWIMMING', 'YOGA', 'SPORTS'];
const { width } = Dimensions.get('window');

interface Center {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  image: string;
  amenities: string[];
}

const DELHI_CENTERS: Center[] = [
  { id: '1', name: 'Gold\'s Gym Elite', category: 'GYM', description: 'Premium fitness club with high-end machinery.', rating: 4.8, reviews: 240, distance: '1.2 km', address: 'Connaught Place, New Delhi', amenities: ['Sauna', 'Personal Training', 'Cafe'], image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop' },
  { id: '2', name: 'Strike Force MMA', category: 'MMA', description: 'Train under expert coaches in Muay Thai, Boxing, and BJJ.', rating: 4.9, reviews: 110, distance: '2.5 km', address: 'Hauz Khas, New Delhi', amenities: ['Sparring Ring', 'Showers'], image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop' },
  { id: '3', name: 'Zen Yoga & Meditation', category: 'YOGA', description: 'Hatha and Vinyasa yoga inside a silent garden.', rating: 4.8, reviews: 72, distance: '0.9 km', address: 'GK-II, New Delhi', amenities: ['Mats provided', 'A/C Studio'], image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop' },
  { id: '4', name: 'Rhythm & Beats Studio', category: 'DANCE', description: 'A fun place for Zumba, Hip Hop, and salsa.', rating: 4.7, reviews: 154, distance: '3.0 km', address: 'Vasant Kunj, New Delhi', amenities: ['Lockers', 'Juice Bar'], image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop' },
];

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const initialCat = (params.category as string) || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [centers] = useState<Center[]>(DELHI_CENTERS);

  useEffect(() => {
    if (params.category) {
      setActiveCategory(params.category as string);
    }
  }, [params.category]);

  const filteredCenters = centers.filter((c) => {
    if (activeCategory === 'All') return true;
    return c.category.toUpperCase() === activeCategory.toUpperCase();
  });

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search & Header Section */}
      <LinearGradient
        colors={[colors.primary + '1A', 'transparent']}
        style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.greeting} themeColor="textSecondary">Location</ThemedText>
            <View style={styles.locationRow}>
              <MapPin size={18} color={colors.primary} />
              <ThemedText style={styles.locationText}>New Delhi, India</ThemedText>
            </View>
          </View>
          <Pressable style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Search size={22} color={colors.text} />
          </Pressable>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContent}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.categoryPill,
                  { backgroundColor: isActive ? colors.primary : colors.surface, borderColor: isActive ? colors.primary : colors.border }
                ]}
              >
                <ThemedText style={[styles.categoryText, { color: isActive ? '#FFF' : colors.text }]}>
                  {cat}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </LinearGradient>

      {/* Main List */}
      <ScrollView 
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>
          {activeCategory === 'All' ? 'Featured Gyms Near You' : `${activeCategory} Centers`}
        </ThemedText>
        
        {filteredCenters.map((center) => (
          <Pressable 
            key={center.id} 
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push(`/gym-detail?id=${center.id}`)}
          >
            <Image source={{ uri: center.image }} style={styles.cardImage} />
            
            <View style={styles.cardOverlay}>
              <BlurView intensity={30} tint="dark" style={styles.ratingBadge}>
                <Star size={12} color="#FBBF24" fill="#FBBF24" />
                <ThemedText style={styles.ratingText}>{center.rating}</ThemedText>
              </BlurView>
              <Pressable style={styles.heartButton}>
                <Heart size={20} color="#FFF" />
              </Pressable>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.cardTitle}>{center.name}</ThemedText>
                <ThemedText style={[styles.categoryTag, { color: colors.primary }]}>{center.category}</ThemedText>
              </View>
              
              <ThemedText style={styles.description} numberOfLines={1}>{center.description}</ThemedText>
              
              <View style={styles.cardFooter}>
                <View style={styles.footerInfo}>
                  <Navigation size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                  <ThemedText style={styles.footerText} themeColor="textSecondary">{center.distance}</ThemedText>
                </View>
                <View style={styles.footerInfo}>
                  <Dumbbell size={14} color={colors.textSecondary} style={{ marginRight: 4, marginLeft: 12 }} />
                  <ThemedText style={styles.footerText} themeColor="textSecondary">{center.amenities.length} amenities</ThemedText>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
        
        {filteredCenters.length === 0 && (
          <View style={styles.emptyState}>
            <Dumbbell size={48} color={colors.border} />
            <ThemedText style={styles.emptyTitle}>No centers found</ThemedText>
            <ThemedText style={styles.emptyText} themeColor="textSecondary">
              Try exploring a different category or changing your location.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 6,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  cardOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  heartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  }
});
