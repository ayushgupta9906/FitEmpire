import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Calendar, Clock, MapPin, User as UserIcon } from 'lucide-react-native';
import { classesApi } from '@/services/api';

export default function ClassesScreen() {
  const router = useRouter();
  const [classesList, setClassesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await classesApi.getSchedules('', today);
      setClassesList(res.data.data || []);
    } catch (e) {
      console.warn("Failed to load classes:", e);
      setClassesList([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Cardio', 'Strength', 'Yoga', 'Zumba'];

  const filteredClasses = selectedCategory === 'All'
    ? classesList
    : classesList.filter((c: any) => c.fitnessClass?.category?.toUpperCase() === selectedCategory.toUpperCase());

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Book a Class</ThemedText>
        <ThemedText style={styles.subtitle}>Find your next favorite workout</ThemedText>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <ThemedText style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>{cat}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {filteredClasses.length === 0 ? (
            <ThemedText style={{ textAlign: 'center', marginTop: 40, color: '#6B7280' }}>
              No classes scheduled for today.
            </ThemedText>
          ) : (
            filteredClasses.map((item: any) => (
              <View key={item.id} style={styles.classCard}>
                <Image
                  source={{ uri: item.fitnessClass?.imageUrl || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=300&h=200' }}
                  style={styles.classImg}
                />
                <View style={styles.classContent}>
                  <View style={styles.classHeaderRow}>
                    <ThemedText style={styles.className}>{item.fitnessClass?.name || 'Fitness Class'}</ThemedText>
                    <View style={styles.categoryBadge}>
                      <ThemedText style={styles.categoryTxt}>{item.fitnessClass?.category || 'General'}</ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <UserIcon size={14} color="#6B7280" />
                    <ThemedText style={styles.infoTxt}>{item.trainer?.user?.firstName || 'Certified Trainer'}</ThemedText>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock size={14} color="#6B7280" />
                    <ThemedText style={styles.infoTxt}>{item.startTime} - {item.endTime}</ThemedText>
                  </View>

                  <View style={styles.footerRow}>
                    <ThemedText style={styles.spots}>{item.availableCapacity || 10} spots left</ThemedText>
                    <TouchableOpacity
                      style={styles.bookBtn}
                      onPress={() => router.push({ pathname: '/booking', params: { gymId: item.gymId, branchId: item.branchId, bookingType: 'CLASS' } })}
                    >
                      <ThemedText style={styles.bookTxt}>Book Slot</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 60 },
  header: { paddingHorizontal: 24, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  filterScroll: { maxHeight: 50, marginBottom: 16 },
  filterContent: { paddingHorizontal: 24, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E5E7EB', height: 36, justifyContent: 'center' },
  filterChipActive: { backgroundColor: '#6C63FF' },
  filterText: { color: '#4B5563', fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  classCard: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  classImg: { width: '100%', height: 140 },
  classContent: { padding: 16 },
  classHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  className: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  categoryBadge: { backgroundColor: 'rgba(108, 99, 255, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoryTxt: { color: '#6C63FF', fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoTxt: { color: '#6B7280', marginLeft: 6, fontSize: 14 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  spots: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 },
  bookBtn: { backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  bookTxt: { color: '#FFF', fontWeight: 'bold' }
});
