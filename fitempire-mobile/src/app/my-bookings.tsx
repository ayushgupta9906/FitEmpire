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
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  QrCode,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PREVIOUS_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&auto=format&fit=crop' },
  { id: 'studio', name: 'At Studio', icon: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop' },
  { id: 'home', name: 'At Home', icon: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&auto=format&fit=crop' },
  { id: 'nutrition', name: 'Nutrition', icon: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&auto=format&fit=crop' },
  { id: 'sports', name: 'Sports', icon: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=100&auto=format&fit=crop' },
  { id: 'doctors', name: 'Doctors', icon: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&auto=format&fit=crop' },
  { id: 'lab', name: 'Lab Tests', icon: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=100&auto=format&fit=crop' },
];

interface BookingRecord {
  id: string;
  category: string;
  title: string;
  centerName: string;
  locality: string;
  dateTime: string;
  status: 'Attended' | 'Cancelled' | 'Scheduled';
  avatarLogo: string;
}

const PAST_BOOKINGS: BookingRecord[] = [
  {
    id: 'b1',
    category: 'studio',
    title: 'Gym Workout',
    centerName: 'Iron Culture Gym',
    locality: 'Sector 168, Sector 168',
    dateTime: '08 Aug, 06:30 pm',
    status: 'Cancelled',
    avatarLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop',
  },
  {
    id: 'b2',
    category: 'studio',
    title: 'Gym Workout',
    centerName: 'Iron Culture Gym',
    locality: 'Sector 168, Sector 168',
    dateTime: '08 Aug, 05:30 pm',
    status: 'Cancelled',
    avatarLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop',
  },
  {
    id: 'b3',
    category: 'studio',
    title: 'Gym Workout',
    centerName: 'Iron Culture Gym',
    locality: 'Sector 168, Sector 168',
    dateTime: '04 Aug, 07:00 pm',
    status: 'Attended',
    avatarLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop',
  },
  {
    id: 'b4',
    category: 'studio',
    title: 'Gym Workout',
    centerName: 'Iron Culture Gym',
    locality: 'Sector 168, Sector 168',
    dateTime: '03 Aug, 08:00 pm',
    status: 'Attended',
    avatarLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop',
  },
  {
    id: 'b5',
    category: 'sports',
    title: '10M Air Pistol - 25 Pellets',
    centerName: 'Vijay Sri Shooting Academy',
    locality: 'Sector 141, Sector 141',
    dateTime: '01 Aug, 06:00 pm',
    status: 'Cancelled',
    avatarLogo: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=100&auto=format&fit=crop',
  },
  {
    id: 'b6',
    category: 'sports',
    title: 'Badminton Wooden Court 1',
    centerName: 'Kirney Bharat Badminton Academy',
    locality: 'Gaur City 1',
    dateTime: '28 Jul, 07:30 pm',
    status: 'Attended',
    avatarLogo: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=100&auto=format&fit=crop',
  },
];

export default function MyBookingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPastBookings = PAST_BOOKINGS.filter((b) => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Bar */}
      <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.circleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Centered 3D Calendar & Title */}
        <View style={styles.titleSection}>
          <View style={styles.calendarIconBadge}>
            <ThemedText style={{ fontSize: 32 }}>📅</ThemedText>
          </View>
          <ThemedText style={styles.mainTitle}>My bookings</ThemedText>

          {/* 3 Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricColumn}>
              <ThemedText style={styles.metricNumber}>209</ThemedText>
              <ThemedText style={styles.metricLabel}>Bookings</ThemedText>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricColumn}>
              <ThemedText style={styles.metricNumber}>148</ThemedText>
              <ThemedText style={styles.metricLabel}>Confirmed</ThemedText>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricColumn}>
              <ThemedText style={styles.metricNumber}>61</ThemedText>
              <ThemedText style={styles.metricLabel}>Cancelled</ThemedText>
            </View>
          </View>
        </View>

        {/* Section: UPCOMING BOOKINGS */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeaderLabel}>UPCOMING BOOKINGS</ThemedText>

          <TouchableOpacity
            style={styles.upcomingCard}
            activeOpacity={0.9}
            onPress={() => router.push('/ticket' as any)}
          >
            {/* Top Brand & Category Header */}
            <View style={styles.upcomingBrandHeader}>
              <ThemedText style={styles.upcomingBrandText}>🏋️ FITEMPIRE®</ThemedText>
            </View>

            <View style={styles.upcomingCenterContent}>
              <ThemedText style={styles.upcomingWorkoutTitle}>GYM WORKOUT</ThemedText>
              <ThemedText style={styles.upcomingWorkoutTime}>TODAY, 06:00 PM</ThemedText>
              <View style={styles.durationRow}>
                <Clock size={12} color="#94A3B8" />
                <ThemedText style={styles.durationText}>90 min</ThemedText>
              </View>

              {/* Status Pill */}
              <View style={styles.scheduledPill}>
                <ThemedText style={styles.scheduledPillText}>📅 Scheduled</ThemedText>
              </View>
            </View>

            {/* Bottom Venue Footer Bar */}
            <View style={styles.upcomingVenueFooter}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop',
                }}
                style={styles.upcomingVenueAvatar}
              />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <ThemedText style={styles.upcomingVenueName}>Iron Culture Gym</ThemedText>
                  <CheckCircle size={14} color="#3B82F6" fill="#3B82F6" />
                </View>
                <ThemedText style={styles.upcomingVenueLoc}>Sector 168, Sector 168</ThemedText>
              </View>
              <QrCode size={20} color="#EF4444" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: PREVIOUS BOOKINGS */}
        <View style={[styles.sectionContainer, { marginTop: 24 }]}>
          <ThemedText style={styles.sectionHeaderLabel}>PREVIOUS BOOKINGS</ThemedText>

          {/* Horizontal Category Icons Slider */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {PREVIOUS_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={styles.categoryTabItem}
                  activeOpacity={0.8}
                >
                  <View style={[styles.categoryIconBox, isSelected && styles.categoryIconBoxActive]}>
                    <Image source={{ uri: cat.iconImage || cat.icon }} style={styles.categoryIconImg} />
                  </View>
                  <ThemedText
                    style={[
                      styles.categoryTabText,
                      isSelected && { color: '#EF4444', fontWeight: '800' },
                    ]}
                  >
                    {cat.name}
                  </ThemedText>
                  {isSelected && <View style={styles.activeRedLine} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Past Bookings Rows List */}
          <View style={styles.pastBookingsList}>
            {filteredPastBookings.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.pastBookingRow, { borderBottomColor: colors.border }]}
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    b.title,
                    `${b.centerName}\n${b.locality}\nDate: ${b.dateTime}\nStatus: ${b.status}`
                  )
                }
              >
                {/* Avatar Icon */}
                <Image source={{ uri: b.avatarLogo }} style={styles.pastBookingAvatar} />

                {/* Info Text */}
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <ThemedText style={styles.pastBookingTitle}>{b.title}</ThemedText>
                  <ThemedText style={styles.pastBookingSub}>
                    {b.centerName}, {b.locality}
                  </ThemedText>

                  <View style={styles.pastBookingMetaRow}>
                    <Clock size={12} color="#94A3B8" />
                    <ThemedText style={styles.pastBookingTime}>{b.dateTime}</ThemedText>

                    {/* Status Pill */}
                    <View
                      style={[
                        styles.pastStatusPill,
                        b.status === 'Attended' ? styles.statusAttended : styles.statusCancelled,
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.pastStatusText,
                          b.status === 'Attended'
                            ? { color: '#10B981' }
                            : { color: '#EF4444' },
                        ]}
                      >
                        {b.status}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  calendarIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: width - 32,
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  metricColumn: {
    alignItems: 'center',
    gap: 2,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  upcomingCard: {
    borderRadius: 22,
    backgroundColor: '#FFF5F5',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  upcomingBrandHeader: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 4,
  },
  upcomingBrandText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#E53E3E',
    letterSpacing: 1.5,
  },
  upcomingCenterContent: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 4,
  },
  upcomingWorkoutTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A202C',
    letterSpacing: 1,
  },
  upcomingWorkoutTime: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E53E3E',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  durationText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
  },
  scheduledPill: {
    backgroundColor: '#FEFCBF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  scheduledPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B7791F',
  },
  upcomingVenueFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#FED7D7',
  },
  upcomingVenueAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  upcomingVenueName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A202C',
  },
  upcomingVenueLoc: {
    fontSize: 11,
    color: '#718096',
  },
  categoryScrollContent: {
    gap: 14,
    paddingBottom: 10,
  },
  categoryTabItem: {
    alignItems: 'center',
    width: 60,
  },
  categoryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIconBoxActive: {
    borderColor: '#EF4444',
  },
  categoryIconImg: {
    width: '100%',
    height: '100%',
  },
  categoryTabText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeRedLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EF4444',
    marginTop: 3,
  },
  pastBookingsList: {
    marginTop: 10,
  },
  pastBookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  pastBookingAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  pastBookingTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  pastBookingSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  pastBookingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  pastBookingTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  pastStatusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusAttended: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  pastStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
