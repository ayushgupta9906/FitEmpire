import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors, BottomTabInset } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  MapPin,
  Search,
  ChevronDown,
  ArrowUpDown,
  SlidersHorizontal,
  Star,
  Clock,
  Heart,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface SportCategory {
  id: string;
  name: string;
  heroTitle: string;
  duration: string;
  iconImage: string;
  heroImage: string;
}

const SPORT_CATEGORIES: SportCategory[] = [
  {
    id: 'badminton',
    name: 'Badminton',
    heroTitle: 'BADMINTON',
    duration: '⏱ ~15-120 min',
    iconImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop',
  },
  {
    id: 'all',
    name: 'All Sports',
    heroTitle: 'MULTI SPORTS',
    duration: '⏱ ~30-180 min',
    iconImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop',
  },
  {
    id: 'football',
    name: 'Football',
    heroTitle: 'FOOTBALL TURF',
    duration: '⏱ ~60-90 min',
    iconImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop',
  },
  {
    id: 'basketball',
    name: 'Basketball',
    heroTitle: 'BASKETBALL',
    duration: '⏱ ~45-90 min',
    iconImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop',
  },
  {
    id: 'pickleball',
    name: 'Pickleball',
    heroTitle: 'PICKLEBALL',
    duration: '⏱ ~30-60 min',
    iconImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop',
  },
  {
    id: 'tabletennis',
    name: 'Table tennis',
    heroTitle: 'TABLE TENNIS',
    duration: '⏱ ~30-60 min',
    iconImage: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&auto=format&fit=crop',
  },
  {
    id: 'snooker',
    name: 'Snooker',
    heroTitle: 'SNOOKER & POOL',
    duration: '⏱ ~60-120 min',
    iconImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop',
  },
  {
    id: 'cricket',
    name: 'Cricket',
    heroTitle: 'BOX CRICKET',
    duration: '⏱ ~60-180 min',
    iconImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
  },
  {
    id: 'archery',
    name: 'Archery',
    heroTitle: 'ARCHERY RANGE',
    duration: '⏱ ~45-60 min',
    iconImage: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    heroTitle: 'AQUATICS POOL',
    duration: '⏱ ~45-90 min',
    iconImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop',
  },
];

interface VenueItem {
  id: string;
  name: string;
  sportId: string;
  location: string;
  distance: string;
  image: string;
  avatarLogo: string;
  verified: boolean;
  rating: number;
  openStatus: string;
}

const VENUES: VenueItem[] = [
  {
    id: 'v1',
    name: 'Kirney Bharat Badminton Academy',
    sportId: 'badminton',
    location: 'Gaur City 1',
    distance: '14.02 km',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop',
    avatarLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop',
    verified: true,
    rating: 4.8,
    openStatus: 'Open Now',
  },
  {
    id: 'v2',
    name: 'Smash Point Wooden Badminton Court',
    sportId: 'badminton',
    location: 'Sector 168, Noida',
    distance: '1.40 km',
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&auto=format&fit=crop',
    avatarLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop',
    verified: true,
    rating: 4.9,
    openStatus: 'Open Now',
  },
  {
    id: 'v3',
    name: 'Huddle Arena Box Cricket & Turf',
    sportId: 'cricket',
    location: 'Whitefield, Bangalore',
    distance: '3.20 km',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
    avatarLogo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=100&auto=format&fit=crop',
    verified: true,
    rating: 4.7,
    openStatus: 'Open Now',
  },
  {
    id: 'v4',
    name: 'Pro Kickers Football Arena',
    sportId: 'football',
    location: 'Koramangala 4th Block',
    distance: '2.10 km',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop',
    avatarLogo: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=100&auto=format&fit=crop',
    verified: true,
    rating: 4.8,
    openStatus: 'Open Now',
  },
  {
    id: 'v5',
    name: 'Blue Wave Olympic Swimming Academy',
    sportId: 'swimming',
    location: 'Indiranagar 100ft Rd',
    distance: '4.50 km',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop',
    avatarLogo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&auto=format&fit=crop',
    verified: true,
    rating: 4.9,
    openStatus: 'Open Now',
  },
];

import { gymsApi } from '@/services/api';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [selectedSport, setSelectedSport] = useState<SportCategory>(SPORT_CATEGORIES[0]);
  const [selectedLocation, setSelectedLocation] = useState('Sector 168');
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [filterRating4Plus, setFilterRating4Plus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [venuesList, setVenuesList] = useState<VenueItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGyms();
  }, [selectedLocation]);

  const fetchGyms = async () => {
    setLoading(true);
    try {
      const res = await gymsApi.getActive(0, 30);
      const gymData = res.data?.data?.content || [];
      if (gymData.length > 0) {
        const sportKeys = SPORT_CATEGORIES.map(s => s.id);
        const mapped: VenueItem[] = gymData.map((g: any, index: number) => {
          // Map gym category/type to sport categories, or default to 'all'
          const gymCategory = (g.category || g.type || '').toLowerCase();
          const matchedSport = sportKeys.find(s => gymCategory.includes(s)) || 'all';
          const branch = g.branches?.[0];
          const locationStr = branch 
            ? [branch.addressLine1, branch.city].filter(Boolean).join(', ')
            : g.city || 'Partner Location';
          return {
            id: g.id,
            name: g.name,
            sportId: matchedSport,
            location: locationStr,
            distance: branch?.distanceKm ? `${Number(branch.distanceKm).toFixed(1)} km` : '',
            image: g.coverImageUrl || VENUES[index % VENUES.length].image,
            avatarLogo: g.logoUrl || VENUES[index % VENUES.length].avatarLogo,
            verified: g.verified !== false,
            rating: g.avgRating ? Number(g.avgRating) : 0,
            openStatus: g.isOpen === false ? 'Closed' : 'Open Now',
          };
        });
        setVenuesList(mapped);
      } else {
        setVenuesList(VENUES);
      }
    } catch (e) {
      console.warn('Explore gyms fetch error:', e);
      setVenuesList(VENUES);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVenues = venuesList.filter((v) => {
    const matchSport = selectedSport.id === 'all' || v.sportId === selectedSport.id;
    const matchRating = !filterRating4Plus || v.rating >= 4.0;
    const matchSearch =
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSport && matchRating && matchSearch;
  });


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.circleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>

        {/* Location Dropdown Pill */}
        <TouchableOpacity
          style={[styles.locationPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => {
            const locs = ['Sector 168', 'Gurgaon Cyber City', 'Indiranagar Bangalore', 'Connaught Place Delhi'];
            const next = locs[(locs.indexOf(selectedLocation) + 1) % locs.length];
            setSelectedLocation(next);
          }}
        >
          <MapPin size={15} color="#EF4444" />
          <ThemedText style={styles.locationPillText}>{selectedLocation}</ThemedText>
          <ChevronDown size={14} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Search Icon / Toggle */}
        <TouchableOpacity
          onPress={() => setSearchActive(!searchActive)}
          style={[styles.circleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Search size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Optional Search Bar */}
      {searchActive && (
        <View style={[styles.searchBarWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={16} color={colors.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search academies, turfs, courts..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + BottomTabInset + 24 }}
      >
        {/* Athletic Hero Visual Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: selectedSport.heroImage }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlayGradient} />
          </View>

          <View style={styles.heroContent}>
            <ThemedText style={styles.heroTitle}>{selectedSport.heroTitle}</ThemedText>
            <View style={styles.durationBadge}>
              <ThemedText style={styles.durationText}>{selectedSport.duration}</ThemedText>
            </View>
          </View>
        </View>

        {/* Horizontal Filter Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ArrowUpDown size={13} color={colors.text} />
            <ThemedText style={styles.filterChipText}>Sort</ThemedText>
            <ChevronDown size={12} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.filterChip, styles.filterChipActive, { borderColor: '#EF4444' }]}>
            <SlidersHorizontal size={13} color="#EF4444" />
            <ThemedText style={[styles.filterChipText, { color: '#EF4444' }]}>Filter</ThemedText>
            <View style={styles.filterBadge}>
              <ThemedText style={styles.filterBadgeText}>1</ThemedText>
            </View>
            <ChevronDown size={12} color="#EF4444" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterRating4Plus(!filterRating4Plus)}
            style={[
              styles.filterChip,
              filterRating4Plus ? styles.filterChipSelected : { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Star size={13} color={filterRating4Plus ? '#FFF' : '#F59E0B'} fill={filterRating4Plus ? '#FFF' : '#F59E0B'} />
            <ThemedText style={[styles.filterChipText, filterRating4Plus && { color: '#FFF' }]}>Rating 4.0+</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText style={styles.filterChipText}>Open</ThemedText>
            <ChevronDown size={12} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Heart size={13} color="#EF4444" />
            <ThemedText style={styles.filterChipText}>Favourite</ThemedText>
          </TouchableOpacity>
        </ScrollView>

        {/* Horizontal Sport / Activity Icon Slider */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activityScroll}
          contentContainerStyle={styles.activityContent}
        >
          {SPORT_CATEGORIES.map((sport) => {
            const isSelected = selectedSport.id === sport.id;
            return (
              <TouchableOpacity
                key={sport.id}
                onPress={() => setSelectedSport(sport)}
                style={styles.activityItem}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.activityIconBox,
                    isSelected && styles.activityIconBoxActive,
                  ]}
                >
                  <Image source={{ uri: sport.iconImage }} style={styles.activityIconImage} />
                </View>
                <ThemedText
                  style={[
                    styles.activityName,
                    { color: isSelected ? '#EF4444' : colors.textSecondary },
                    isSelected && styles.activityNameActive,
                  ]}
                >
                  {sport.name}
                </ThemedText>
                {isSelected && <View style={styles.activeUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Venue / Academy Card Feed */}
        <View style={styles.venuesContainer}>
          {filteredVenues.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Sparkles size={32} color="#6C63FF" />
              <ThemedText style={styles.emptyTitle}>No venues found</ThemedText>
              <ThemedText style={styles.emptySubtitle}>Try changing your sport or location filter.</ThemedText>
            </View>
          ) : (
            filteredVenues.map((venue) => {
              const isFav = !!favorites[venue.id];
              return (
                <TouchableOpacity
                  key={venue.id}
                  style={[styles.venueCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  activeOpacity={0.9}
                  onPress={() => router.push({ pathname: '/gym-detail', params: { id: venue.id } } as any)}
                >
                  {/* Photo Container */}
                  <View style={styles.venueImageContainer}>
                    <Image source={{ uri: venue.image }} style={styles.venueImage} />
                    <TouchableOpacity
                      style={styles.favButton}
                      onPress={() => toggleFavorite(venue.id)}
                    >
                      <Heart
                        size={18}
                        color={isFav ? '#EF4444' : '#FFF'}
                        fill={isFav ? '#EF4444' : 'rgba(0,0,0,0.3)'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Info Pill / Header */}
                  <View style={styles.venueInfoRow}>
                    <Image source={{ uri: venue.avatarLogo }} style={styles.venueAvatar} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <ThemedText style={styles.venueName}>{venue.name}</ThemedText>
                        {venue.verified && (
                          <CheckCircle size={14} color="#3B82F6" fill="#3B82F6" />
                        )}
                      </View>
                      <ThemedText style={styles.venueSubtitle}>
                        {venue.location} • {venue.distance}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
    paddingBottom: 10,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  locationPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  heroBanner: {
    position: 'relative',
    height: 190,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 6,
  },
  heroImageContainer: {
    width: '100%',
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 30, 0.45)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  durationBadge: {
    marginTop: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  filterScroll: {
    marginTop: 14,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  filterChipSelected: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  activityScroll: {
    marginTop: 16,
  },
  activityContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
  activityItem: {
    alignItems: 'center',
    width: 64,
  },
  activityIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityIconBoxActive: {
    borderColor: '#EF4444',
  },
  activityIconImage: {
    width: '100%',
    height: '100%',
  },
  activityName: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  activityNameActive: {
    fontWeight: '800',
  },
  activeUnderline: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EF4444',
    marginTop: 3,
  },
  venuesContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 16,
  },
  venueCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
  },
  venueImageContainer: {
    position: 'relative',
    height: 190,
    width: '100%',
  },
  venueImage: {
    width: '100%',
    height: '100%',
  },
  favButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  venueInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  venueAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '800',
  },
  venueSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyBox: {
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
