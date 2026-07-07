import { useState, useEffect } from 'react';
import { Platform, StyleSheet, Pressable, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MapPin } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

const CATEGORIES = ['All', 'GYM', 'MMA', 'BOXING', 'KICKBOXING', 'DANCE', 'SWIMMING', 'YOGA', 'SPORTS', 'GAMES'];

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
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

const DELHI_CENTERS: Center[] = [
  { id: '1', name: 'Gold\'s Gym Elite', category: 'GYM', description: 'Premium fitness club with high-end machinery.', rating: 4.8, reviews: 240, distance: '1.2 km', address: 'Connaught Place, New Delhi', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop', coordinate: { latitude: 28.6315, longitude: 77.2167 } },
  { id: '2', name: 'Strike Force MMA', category: 'MMA', description: 'Train under expert coaches in Muay Thai, Boxing, and BJJ.', rating: 4.9, reviews: 110, distance: '2.5 km', address: 'Hauz Khas, New Delhi', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500&auto=format&fit=crop', coordinate: { latitude: 28.5494, longitude: 77.2001 } },
  { id: '3', name: 'Zen Yoga & Meditation', category: 'YOGA', description: 'Hatha and Vinyasa yoga inside a silent garden.', rating: 4.8, reviews: 72, distance: '0.9 km', address: 'GK-II, New Delhi', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop', coordinate: { latitude: 28.5335, longitude: 77.2408 } },
  { id: '4', name: 'Rhythm & Beats Studio', category: 'DANCE', description: 'A fun place for Zumba, Hip Hop, and salsa.', rating: 4.7, reviews: 154, distance: '3.0 km', address: 'Vasant Kunj, New Delhi', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop', coordinate: { latitude: 28.5293, longitude: 77.1539 } },
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
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  useEffect(() => {
    if (params.category) {
      setActiveCategory(params.category as string);
    }
  }, [params.category]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const filteredCenters = centers.filter((c) => {
    if (activeCategory === 'All') return true;
    return c.category.toUpperCase() === activeCategory.toUpperCase();
  });

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {Platform.OS === 'web' ? (
        <View style={styles.webFallback}>
          <Compass size={48} color="#6C63FF" style={{ marginBottom: 16 }} />
          <ThemedText style={{ textAlign: 'center', fontWeight: '700' }}>
            Interactive Map is not supported on Web preview.
          </ThemedText>
          <ThemedText style={{ textAlign: 'center', marginTop: 8 }} themeColor="textSecondary">
            Please use the Expo Go app on your phone to view the live Google Maps integration.
          </ThemedText>
        </View>
      ) : (
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={{
            latitude: location ? location.coords.latitude : 28.6139,
            longitude: location ? location.coords.longitude : 77.2090,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {filteredCenters.map(center => (
            <Marker
              key={center.id}
              coordinate={center.coordinate}
              title={center.name}
              description={center.category}
              onPress={() => setSelectedCenter(center)}
            />
          ))}
        </MapView>
      )}

      {/* Header Overlay */}
      <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              onPress={() => {
                setActiveCategory(category);
                setSelectedCenter(null);
              }}
              style={[
                styles.chip,
                { backgroundColor: theme.backgroundElement },
                activeCategory.toUpperCase() === category.toUpperCase() && { backgroundColor: '#6C63FF' },
              ]}
            >
              <ThemedText style={[styles.chipText, activeCategory.toUpperCase() === category.toUpperCase() && { color: '#ffffff' }]}>
                {category}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Selected Center Bottom Card */}
      {selectedCenter && (
        <View style={[styles.bottomCardContainer, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable
            style={[styles.centerCard, { backgroundColor: colors.backgroundElement }]}
            onPress={() => router.push({ pathname: '/gym-detail', params: { id: selectedCenter.id } })}
          >
            <Image source={{ uri: selectedCenter.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <ThemedText style={styles.cardTitle}>{selectedCenter.name}</ThemedText>
              <ThemedText style={styles.cardDesc} numberOfLines={2}>{selectedCenter.description}</ThemedText>
              <View style={styles.addressBox}>
                <MapPin size={12} color="#888" />
                <ThemedText style={styles.addressText} themeColor="textSecondary" numberOfLines={1}>{selectedCenter.address}</ThemedText>
              </View>
              <Pressable style={styles.bookBtn} onPress={() => router.push({ pathname: '/gym-detail', params: { id: selectedCenter.id } })}>
                <ThemedText style={styles.bookBtnText}>View Details</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  webFallback: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  filtersContainer: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  chipText: { fontWeight: '600', fontSize: 13 },
  bottomCardContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16 },
  centerCard: { borderRadius: 16, overflow: 'hidden', flexDirection: 'row', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  cardImage: { width: 100, height: '100%' },
  cardInfo: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#888', marginBottom: 8 },
  addressBox: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  addressText: { fontSize: 11, flex: 1 },
  bookBtn: { backgroundColor: '#6C63FF', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  bookBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
});
