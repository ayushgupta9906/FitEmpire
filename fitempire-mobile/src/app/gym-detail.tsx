import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Star, MapPin, Phone, Globe, Shield, Calendar, Trophy, ChevronRight, ArrowLeft, Plus, CheckCircle2, Dumbbell, Zap } from 'lucide-react-native';
import { gymsApi, membershipsApi } from '@/services/api';

const FALLBACK_GYM = {
  name: 'Strike Force MMA & Fitness Hub',
  category: 'PREMIUM FITNESS CENTER',
  avgRating: '4.9',
  totalReviews: 482,
  description: 'Bangalore’s highest rated MMA arena, Olympic free weights zone, cardio deck, sauna steam bath, and certified coaches.',
  phone: '+91 98800 72520',
  websiteUrl: 'https://fitempire.in',
  coverImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
};

const FALLBACK_BRANCHES = [
  {
    id: 'br-1',
    name: 'Koramangala 100ft Rd Arena',
    addressLine1: '80 Feet Road, 5th Block, Koramangala',
    city: 'Bengaluru',
    state: 'KA',
    pincode: '560095',
    openTime: '06:00 AM',
    closeTime: '11:00 PM',
  },
  {
    id: 'br-2',
    name: 'Indiranagar Hub',
    addressLine1: '100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'KA',
    pincode: '560038',
    openTime: '05:30 AM',
    closeTime: '11:30 PM',
  },
];

export default function GymDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [gym, setGym] = useState<any>(FALLBACK_GYM);
  const [branches, setBranches] = useState<any[]>(FALLBACK_BRANCHES);
  const [selectedBranch, setSelectedBranch] = useState<any>(FALLBACK_BRANCHES[0]);
  const [loading, setLoading] = useState(false);

  const [reviews, setReviews] = useState([
    { id: 'r1', user: 'Rahul Sharma', rating: 5, date: 'Yesterday', comment: 'Best gym in Koramangala! Turnstile check-in with FitEmpire app was instant.' },
    { id: 'r2', user: 'Priya Patel', rating: 5, date: '3 days ago', comment: 'Spacious Olympic weightlifting area and clean hot shower rooms.' },
    { id: 'r3', user: 'Amit Kumar', rating: 5, date: '1 week ago', comment: 'Superb MMA training coaches and top-tier Technogym treadmills.' },
  ]);

  const [reviewModal, setReviewModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('5');

  const amenitiesList = [
    { icon: '❄️', name: 'Air Conditioned' },
    { icon: '🚿', name: 'Hot Showers' },
    { icon: '🔒', name: 'Digital Lockers' },
    { icon: '🧖', name: 'Steam Sauna' },
    { icon: '🏋️', name: 'Olympic Weights' },
    { icon: '🥤', name: 'Juice Bar' },
  ];

  const handleAddReview = () => {
    if (!newComment) return;
    const r = {
      id: `r-${Date.now()}`,
      user: 'You (Rahul)',
      rating: Number(newRating) || 5,
      date: 'Just now',
      comment: newComment,
    };
    setReviews([r, ...reviews]);
    setReviewModal(false);
    setNewComment('');
    Alert.alert('Review Published ⭐', 'Thanks for sharing your gym experience!');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: gym.coverImageUrl }} style={styles.coverImage} resizeMode="cover" />
          <View style={styles.gradientOverlay} />

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerDetails}>
            <ThemedText style={styles.categoryBadge}>{gym.category}</ThemedText>
            <ThemedText style={styles.gymTitle}>{gym.name}</ThemedText>
            <View style={styles.ratingRow}>
              <Star size={16} color="#FBBF24" fill="#FBBF24" />
              <ThemedText style={styles.ratingText}>{gym.avgRating} ({reviews.length} reviews)</ThemedText>
            </View>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.content}>
          {/* About Gym */}
          <ThemedText style={styles.sectionHeader}>ABOUT VENUE</ThemedText>
          <ThemedText style={styles.description}>{gym.description}</ThemedText>

          {/* Amenities Grid */}
          <ThemedText style={[styles.sectionHeader, { marginTop: 20 }]}>CENTER AMENITIES</ThemedText>
          <View style={styles.amenitiesGrid}>
            {amenitiesList.map((a, idx) => (
              <View key={idx} style={[styles.amenityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ThemedText style={{ fontSize: 20 }}>{a.icon}</ThemedText>
                <ThemedText style={styles.amenityText}>{a.name}</ThemedText>
              </View>
            ))}
          </View>

          {/* Location Branches */}
          <ThemedText style={[styles.sectionHeader, { marginTop: 20 }]}>SELECT CENTER LOCATION</ThemedText>
          <View style={{ gap: 10 }}>
            {branches.map((b) => {
              const isSelected = selectedBranch?.id === b.id;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.branchCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    isSelected && { borderColor: '#6C63FF', backgroundColor: 'rgba(108, 99, 255, 0.12)' },
                  ]}
                  onPress={() => setSelectedBranch(b)}
                >
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontSize: 14, fontWeight: '800' }}>{b.name}</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{b.addressLine1}</ThemedText>
                    <ThemedText style={{ fontSize: 11, color: '#38BDF8', marginTop: 4 }}>
                      ⏰ Open {b.openTime} – {b.closeTime}
                    </ThemedText>
                  </View>
                  {isSelected && <CheckCircle2 size={20} color="#6C63FF" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Member Reviews */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 10 }}>
            <ThemedText style={styles.sectionHeader}>MEMBER REVIEWS ({reviews.length})</ThemedText>
            <TouchableOpacity onPress={() => setReviewModal(true)} style={styles.writeReviewBtn}>
              <Plus size={13} color="#6C63FF" />
              <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#6C63FF' }}>Write Review</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            {reviews.map((r) => (
              <View key={r.id} style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <ThemedText style={{ fontSize: 13, fontWeight: '800' }}>{r.user}</ThemedText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={12} color="#FBBF24" fill="#FBBF24" />
                    ))}
                  </View>
                </View>
                <ThemedText style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 17 }}>{r.comment}</ThemedText>
                <ThemedText style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>{r.date}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Booking Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View>
          <ThemedText style={{ fontSize: 11, color: '#94A3B8', fontWeight: '700' }}>ENTRY PASS</ThemedText>
          <ThemedText style={{ fontSize: 16, fontWeight: '900', color: '#10B981' }}>Included in FitEmpire Pro</ThemedText>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            router.push({
              pathname: '/booking',
              params: {
                gymId: id || '11111111-1111-1111-1111-111111111111',
                branchId: selectedBranch?.id || '22222222-2222-2222-2222-222222222222',
                bookingType: 'GYM',
              },
            } as any)
          }
        >
          <ThemedText style={styles.bookButtonText}>Book Slot Now →</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Write Review Modal */}
      {reviewModal && (
        <Modal transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
              <ThemedText style={{ fontSize: 16, fontWeight: '800' }}>Write a Gym Review</ThemedText>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder="Share your experience (e.g. equipment, cleanliness, trainers)..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={newComment}
                onChangeText={setNewComment}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setReviewModal(false)}>
                  <ThemedText style={{ color: '#94A3B8', fontWeight: '700' }}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSubmit} onPress={handleAddReview}>
                  <ThemedText style={{ color: '#FFF', fontWeight: '800' }}>Submit Review</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 260,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 20,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 11, 20, 0.65)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerDetails: {
    gap: 4,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  gymTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FBBF24',
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityCard: {
    width: '30%',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  amenityText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  branchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    gap: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
  },
  modalSubmit: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    borderRadius: 10,
  },
});
