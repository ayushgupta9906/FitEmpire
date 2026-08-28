import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Calendar, Clock, MapPin, User as UserIcon, Sparkles, ShieldCheck, Dumbbell, Zap, CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { classesApi } from '@/services/api';

const DEFAULT_CLASSES = [
  {
    id: 'cls-1',
    name: 'ZUMBA Dance & Cardio',
    category: 'Zumba',
    trainer: 'Rahul Verma',
    startTime: '07:00 AM',
    endTime: '08:00 AM',
    spots: 6,
    gymName: 'Iron Culture Gym',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'cls-2',
    name: 'High Intensity HIIT Blast',
    category: 'Cardio',
    trainer: 'Simran Kaur',
    startTime: '08:30 AM',
    endTime: '09:30 AM',
    spots: 4,
    gymName: 'Gold Standard Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'cls-3',
    name: 'Power Yoga & Flexibility',
    category: 'Yoga',
    trainer: 'Ananya Sharma',
    startTime: '06:00 PM',
    endTime: '07:00 PM',
    spots: 8,
    gymName: 'Cult Core Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'cls-4',
    name: 'Heavy Compound Strength',
    category: 'Strength',
    trainer: 'Vikram Rajput',
    startTime: '07:30 PM',
    endTime: '08:30 PM',
    spots: 5,
    gymName: 'Empire Strength Arena',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
  },
];

export default function ClassesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [classesList, setClassesList] = useState<any[]>(DEFAULT_CLASSES);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookedIds, setBookedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await classesApi.getSchedules('', today);
      if (res.data?.data && res.data.data.length > 0) {
        setClassesList(res.data.data);
      } else {
        setClassesList(DEFAULT_CLASSES);
      }
    } catch (e) {
      console.warn('Failed to load classes from API, using default classes:', e);
      setClassesList(DEFAULT_CLASSES);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = (cls: any) => {
    if (bookedIds.includes(cls.id)) {
      Alert.alert('Already Booked', `You have already reserved a slot for ${cls.name || cls.fitnessClass?.name}.`);
      return;
    }

    Alert.alert(
      'Confirm Slot Booking',
      `Would you like to book a spot in ${cls.name || cls.fitnessClass?.name} at ${cls.startTime || 'Scheduled Time'} with FitEmpire All-Access Pass?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Book',
          onPress: () => {
            setBookedIds(prev => [...prev, cls.id]);
            Alert.alert(
              'Booking Confirmed! 🎉',
              `Your slot for ${cls.name || cls.fitnessClass?.name} is reserved. Your digital entry pass is now active on your Ticket tab!`,
              [
                { text: 'View Ticket', onPress: () => router.push('/ticket' as any) },
                { text: 'Done', style: 'cancel' },
              ]
            );
          },
        },
      ]
    );
  };

  const categories = ['All', 'Cardio', 'Strength', 'Yoga', 'Zumba'];

  const filteredClasses = selectedCategory === 'All'
    ? classesList
    : classesList.filter((c: any) => {
        const cat = (c.category || c.fitnessClass?.category || '').toUpperCase();
        return cat === selectedCategory.toUpperCase();
      });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <ThemedText style={styles.headerTitle}>Live Workout Classes</ThemedText>
        <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
          Book trainer-led studio sessions with your FitEmpire Pass
        </ThemedText>
      </View>

      {/* Category Pills Slider */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterChip,
                { borderColor: colors.border, backgroundColor: colors.surface },
                isActive && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <ThemedText style={[styles.filterText, isActive && styles.filterTextActive]}>
                {cat}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {filteredClasses.map((item: any) => {
            const isBooked = bookedIds.includes(item.id);
            const className = item.name || item.fitnessClass?.name || 'Workout Class';
            const categoryName = item.category || item.fitnessClass?.category || 'General';
            const trainerName = item.trainer || item.trainer?.user?.firstName || 'Certified Coach';
            const gymName = item.gymName || 'FitEmpire Partner Hub';
            const timeSlot = item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : '07:00 AM - 08:00 AM';
            const spotsLeft = item.spots || item.availableCapacity || 5;

            return (
              <View
                key={item.id}
                style={[styles.classCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Image
                  source={{ uri: item.imageUrl || item.fitnessClass?.imageUrl || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400' }}
                  style={styles.classImg}
                />
                <View style={styles.classContent}>
                  <View style={styles.classHeaderRow}>
                    <ThemedText style={styles.className}>{className}</ThemedText>
                    <View style={styles.categoryBadge}>
                      <ThemedText style={styles.categoryTxt}>{categoryName}</ThemedText>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <UserIcon size={13} color="#94A3B8" />
                    <ThemedText style={styles.infoTxt}>{trainerName}</ThemedText>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Clock size={13} color="#94A3B8" />
                    <ThemedText style={styles.infoTxt}>{timeSlot}</ThemedText>
                  </View>

                  <View style={styles.infoRow}>
                    <MapPin size={13} color="#94A3B8" />
                    <ThemedText style={styles.infoTxt}>{gymName}</ThemedText>
                  </View>

                  <View style={styles.footerRow}>
                    <ThemedText style={styles.spots}>{spotsLeft} spots left</ThemedText>
                    
                    <TouchableOpacity
                      style={[
                        styles.bookBtn,
                        isBooked && { backgroundColor: '#10B981' }
                      ]}
                      onPress={() => handleBookSlot(item)}
                      activeOpacity={0.85}
                    >
                      {isBooked ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={14} color="#FFF" />
                          <ThemedText style={styles.bookTxt}>Booked ✓</ThemedText>
                        </View>
                      ) : (
                        <ThemedText style={styles.bookTxt}>Book Slot</ThemedText>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  filterScroll: {
    maxHeight: 52,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  classCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  classImg: {
    width: '100%',
    height: 150,
    backgroundColor: '#333',
  },
  classContent: {
    padding: 16,
  },
  classHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  className: {
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryTxt: {
    color: '#6C63FF',
    fontSize: 11,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  infoTxt: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  spots: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '700',
  },
  bookBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
  },
  bookTxt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
