import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { authApi, aiApi } from '@/services/api';
import { User, Activity, Dumbbell, Compass, RefreshCw, Star } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [userProfile, setUserProfile] = useState<any>(null);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [nutritionPlan, setNutritionPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfileAndAi = async () => {
    setLoading(true);
    try {
      const profRes = await authApi.getProfile();
      setUserProfile(profRes.data.data);

      const aiRes = await aiApi.getWorkoutPlan();
      const items = aiRes.data.data;
      const wp = items?.find((x: any) => x.type === 'WORKOUT');
      const np = items?.find((x: any) => x.type === 'NUTRITION');
      
      if (wp) setWorkoutPlan(JSON.parse(wp.content));
      if (np) setNutritionPlan(JSON.parse(np.content));
    } catch (e) {
      console.warn("Profile API Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndAi();
  }, []);

  const triggerWorkoutGeneration = async () => {
    setLoading(true);
    try {
      const res = await aiApi.generateWorkout();
      setWorkoutPlan(JSON.parse(res.data.data.content));
      alert("Fresh AI Workout Plan Generated!");
    } catch (e) {
      alert("Error generating workout plan.");
    } finally {
      setLoading(false);
    }
  };

  const triggerNutritionGeneration = async () => {
    setLoading(true);
    try {
      const res = await aiApi.generateNutrition();
      setNutritionPlan(JSON.parse(res.data.data.content));
      alert("Fresh AI Nutrition Plan Generated!");
    } catch (e) {
      alert("Error generating nutrition plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchProfileAndAi} tintColor="#6C63FF" />}
        >
          {/* User Header */}
          <View style={[styles.headerCard, { backgroundColor: colors.backgroundElement }]}>
            <View style={styles.avatarWrap}>
              <User size={36} color="#6C63FF" />
            </View>
            <View style={styles.headerMeta}>
              <ThemedText style={styles.name}>{userProfile?.user?.firstName} {userProfile?.user?.lastName}</ThemedText>
              <ThemedText style={styles.email}>{userProfile?.user?.email}</ThemedText>
            </View>
            <View style={styles.scoreWrap}>
              <Star size={16} color="#FFB038" fill="#FFB038" />
              <ThemedText style={styles.scoreVal}>{userProfile?.fitnessScore || 0}</ThemedText>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: colors.backgroundElement }]}>
              <ThemedText style={styles.statLabel}>Weight</ThemedText>
              <ThemedText style={styles.statVal}>{userProfile?.weightKg} kg</ThemedText>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.backgroundElement }]}>
              <ThemedText style={styles.statLabel}>Height</ThemedText>
              <ThemedText style={styles.statVal}>{userProfile?.heightCm} cm</ThemedText>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.backgroundElement }]}>
              <ThemedText style={styles.statLabel}>BMI</ThemedText>
              <ThemedText style={styles.statVal}>{userProfile?.bmi}</ThemedText>
            </View>
          </View>

          {/* AI Plan Section */}
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>AI Workout Coach</ThemedText>
            <TouchableOpacity onPress={triggerWorkoutGeneration}>
              <RefreshCw size={18} color="#6C63FF" />
            </TouchableOpacity>
          </View>
          <View style={[styles.aiCard, { backgroundColor: colors.backgroundElement, borderLeftColor: '#6C63FF' }]}>
            <ThemedText style={styles.aiTitle}>{workoutPlan?.title}</ThemedText>
            {workoutPlan?.plan?.map((step: string, idx: number) => (
              <ThemedText key={idx} style={styles.aiStep}>• {step}</ThemedText>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>AI Diet Coach</ThemedText>
            <TouchableOpacity onPress={triggerNutritionGeneration}>
              <RefreshCw size={18} color="#6C63FF" />
            </TouchableOpacity>
          </View>
          <View style={[styles.aiCard, { backgroundColor: colors.backgroundElement, borderLeftColor: '#43D787' }]}>
            <ThemedText style={styles.aiTitle}>{nutritionPlan?.title}</ThemedText>
            {nutritionPlan?.plan?.map((step: string, idx: number) => (
              <ThemedText key={idx} style={styles.aiStep}>• {step}</ThemedText>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: 16 },
  headerCard: { flexDirection: 'row', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  avatarWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(108,99,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerMeta: { flex: 1, marginLeft: 16 },
  name: { fontWeight: '800', fontSize: 18 },
  email: { fontSize: 13, color: '#888', marginTop: 2 },
  scoreWrap: { flexDirection: 'row', gap: 4, alignItems: 'center', backgroundColor: 'rgba(255,176,56,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  scoreVal: { fontWeight: '700', fontSize: 13, color: '#FFB038' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  statVal: { fontWeight: '700', fontSize: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 12 },
  sectionTitle: { fontWeight: '700', fontSize: 18 },
  aiCard: { padding: 16, borderRadius: 12, borderLeftWidth: 4, marginBottom: 20 },
  aiTitle: { fontWeight: '700', fontSize: 15, marginBottom: 10 },
  aiStep: { fontSize: 13, color: '#aaa', marginVertical: 3, lineHeight: 18 },
});
