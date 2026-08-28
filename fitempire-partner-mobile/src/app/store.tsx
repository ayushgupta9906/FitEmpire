import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  ShoppingBag,
  Search,
  Star,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Tag,
  Sparkles,
  Zap,
  Filter,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PRODUCTS = [
  {
    id: 'p1',
    name: 'QuickShift Pro Adjustable Dumbbell (2.5kg - 24kg)',
    category: 'EQUIPMENT',
    price: 8999,
    oldPrice: 14999,
    rating: 4.9,
    reviews: 142,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500&auto=format&fit=crop',
  },
  {
    id: 'p2',
    name: 'Origami Foldable Anti-Tear Yoga Mat (6mm)',
    category: 'GEAR',
    price: 2199,
    oldPrice: 3499,
    rating: 4.8,
    reviews: 89,
    badge: '38% OFF',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop',
  },
  {
    id: 'p3',
    name: 'Empire Pro 100% Whey Isolate (2kg Double Chocolate)',
    category: 'NUTRITION',
    price: 4499,
    oldPrice: 6299,
    rating: 4.9,
    reviews: 320,
    badge: 'HIGH PROTEIN',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop',
  },
  {
    id: 'p4',
    name: 'Heavy Duty Lever Lifting Belt (10mm Genuine Leather)',
    category: 'GEAR',
    price: 3499,
    oldPrice: 5999,
    rating: 4.9,
    reviews: 76,
    badge: 'PREMIUM',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop',
  },
  {
    id: 'p5',
    name: 'Micronized Creatine Monohydrate (250g / 83 Servings)',
    category: 'NUTRITION',
    price: 899,
    oldPrice: 1499,
    rating: 4.8,
    reviews: 215,
    badge: 'STRENGTH',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop',
  },
  {
    id: 'p6',
    name: 'Latex Loop Resistance Bands Set (5 Resistance Levels)',
    category: 'EQUIPMENT',
    price: 799,
    oldPrice: 1299,
    rating: 4.7,
    reviews: 94,
    badge: 'HOME GYM',
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop',
  },
];

export default function StoreScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'EQUIPMENT' | 'NUTRITION' | 'GEAR'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const categories = ['ALL', 'EQUIPMENT', 'NUTRITION', 'GEAR'];

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'ALL' || p.category === activeCategory;
    const matchQ = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1);
    Alert.alert('Added to Cart 🛒', `${productName} added to your FitEmpire Store cart.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>FitEmpire Store</ThemedText>
        <TouchableOpacity
          style={styles.cartBadge}
          onPress={() => Alert.alert('Your Cart', `${cartCount} items in cart. Checkout with Empire Coins or UPI.`)}
        >
          <ShoppingBag size={18} color="#FFF" />
          {cartCount > 0 && (
            <View style={styles.cartDot}>
              <ThemedText style={{ fontSize: 9, fontWeight: '900', color: '#000' }}>{cartCount}</ThemedText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={16} color="#94A3B8" />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search dumbbells, whey, mats, belts..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.catRow}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.catChip, activeCategory === c && styles.catChipActive]}
            onPress={() => setActiveCategory(c as any)}
          >
            <ThemedText style={[styles.catText, activeCategory === c && styles.catTextActive]}>
              {c}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Sale Promo Banner */}
        <LinearGradient colors={['#7C3AED', '#4F46E5']} style={styles.saleBanner}>
          <View>
            <ThemedText style={{ fontSize: 10, fontWeight: '900', color: '#FDE047', letterSpacing: 1 }}>
              FITNESS EXPO SPECIAL
            </ThemedText>
            <ThemedText style={{ fontSize: 18, fontWeight: '900', color: '#FFF', marginTop: 2 }}>
              Flat 40% Off with Code
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: '#E0E7FF' }}>Use coupon EMPIRE40 at checkout</ThemedText>
          </View>
          <View style={styles.discountBadge}>
            <ThemedText style={{ fontSize: 14, fontWeight: '900', color: '#FFF' }}>40%</ThemedText>
            <ThemedText style={{ fontSize: 8, fontWeight: '800', color: '#FDE047' }}>OFF</ThemedText>
          </View>
        </LinearGradient>

        {/* Product Cards Grid */}
        <View style={styles.productGrid}>
          {filtered.map((item) => (
            <View
              key={item.id}
              style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.imageWrap}>
                <Image source={{ uri: item.image }} style={styles.productImg} resizeMode="cover" />
                <View style={styles.badgePill}>
                  <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
                </View>
              </View>

              <View style={styles.productBody}>
                <ThemedText style={styles.productName} numberOfLines={2}>
                  {item.name}
                </ThemedText>

                <View style={styles.ratingRow}>
                  <Star size={12} color="#FBBF24" fill="#FBBF24" />
                  <ThemedText style={styles.ratingText}>
                    {item.rating} ({item.reviews})
                  </ThemedText>
                </View>

                <View style={styles.priceRow}>
                  <View>
                    <ThemedText style={styles.priceText}>₹{item.price.toLocaleString()}</ThemedText>
                    <ThemedText style={styles.oldPriceText}>₹{item.oldPrice.toLocaleString()}</ThemedText>
                  </View>

                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleAddToCart(item.name)}
                    activeOpacity={0.8}
                  >
                    <Plus size={14} color="#FFF" />
                    <ThemedText style={styles.addBtnText}>Add</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  cartBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FDE047',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
  },
  catRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  catChipActive: {
    backgroundColor: '#6C63FF',
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  catTextActive: {
    color: '#FFF',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  saleBanner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 4,
  },
  imageWrap: {
    height: 120,
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: '100%',
  },
  badgePill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#38BDF8',
  },
  productBody: {
    padding: 10,
    gap: 4,
  },
  productName: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    height: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#10B981',
  },
  oldPriceText: {
    fontSize: 10,
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
});
