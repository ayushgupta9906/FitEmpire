import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { authApi, aiApi } from '@/services/api';
import { useAuth } from '@/services/auth-context';
import { useRouter } from 'expo-router';
import {
  User, Activity, Dumbbell, Compass, RefreshCw, Star,
  LogOut, Shield, Phone, Mail, Award, CheckCircle2, ChevronRight
} from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

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
      Alert.alert("Success", "Fresh AI Workout Plan Generated!");
    } catch (e) {
      Alert.alert("Error", "Error generating workout plan.");
    } finally {
      setLoading(false);
    }
  };

  const triggerNutritionGeneration = async () => {
    setLoading(true);
    try {
      const res = await aiApi.generateNutrition();
      setNutritionPlan(JSON.parse(res.data.data.content));
      Alert.alert("Success", "Fresh AI Nutrition Plan Generated!");
    } catch (e) {
      Alert.alert("Error", "Error generating nutrition plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of FitEmpire?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const displayName = userProfile?.user?.firstName 
    ? `${userProfile?.user?.firstName} ${userProfile?.user?.lastName || ''}`.trim()
    : authUser?.firstName || 'FitEmpire Member';

  const displayEmail = userProfile?.user?.email || authUser?.email || 'member@fitempire.in';
  const displayPhone = userProfile?.user?.phone || authUser?.phone || '+91 98765 43210';
  const roleName = authUser?.role || 'CUSTOMER';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchProfileAndAi} tintColor="#6C63FF" />}
        >
          {/* Header Title */}
          <View style={styles.topBar}>
            <ThemedText style={styles.pageTitle}>My Profile</ThemedText>
            <TouchableOpacity onPress={handleLogout} style={styles.topLogoutBtn}>
              <LogOut size={18} color="#EF4444" />
              <ThemedText style={styles.topLogoutText}>Log Out</ThemedText>
            </TouchableOpacity>
          </View>

          {/* User Header Card */}
          <View style={[styles.headerCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <View style={styles.avatarWrap}>
              <User size={36} color="#6C63FF" />
            </View>
            <View style={styles.headerMeta}>
              <ThemedText style={styles.name}>{displayName}</ThemedText>
              <View style={styles.contactRow}>
                <Mail size={12} color="#888" />
                <ThemedText style={styles.email}>{displayEmail}</ThemedText>
              </View>
              <View style={styles.contactRow}>
                <Phone size={12} color="#888" />
                <ThemedText style={styles.email}>{displayPhone}</ThemedText>
              </View>
            </View>
            <View style={styles.badgeWrap}>
              <Shield size={14} color="#6C63FF" />
              <ThemedText style={styles.badgeText}>{roleName}</ThemedText>
            </View>
          </View>

          {/* Membership Status Pill */}
          <View style={[styles.membershipCard, { backgroundColor: 'rgba(108, 99, 255, 0.12)', borderColor: 'rgba(108, 99, 255, 0.3)' }]}>
            <Award size={22} color="#6C63FF" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <ThemedText style={styles.membershipTitle}>FitEmpire All-Access Pass</ThemedText>
              <ThemedText style={styles.membershipSub}>Unlimited gym check-ins & classes</ThemedText>
            </View>
            <View style={styles.activeTag}>
              <CheckCircle2 size={14} color="#10B981" />
              <ThemedText style={styles.activeTagText}>Active</ThemedText>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <ThemedText style={styles.statLabel}>Weight</ThemedText>
              <ThemedText style={styles.statVal}>{userProfile?.weightKg || 72} kg</ThemedText>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <ThemedText style={styles.statLabel}>Height</ThemedText>
              <ThemedText style={styles.statVal}>{userProfile?.heightCm || 178} cm</ThemedText>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <ThemedText style={styles.statLabel}>BMI</ThemedText>
              <ThemedText style={styles.statVal}>{userProfile?.bmi || '22.7'}</ThemedText>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <ThemedText style={styles.statLabel}>Score</ThemedText>
              <ThemedText style={[styles.statVal, { color: '#FFB038' }]}>{userProfile?.fitnessScore || 85}</ThemedText>
            </View>
          </View>

          {/* AI Plan Section */}
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>AI Workout Coach</ThemedText>
            <TouchableOpacity onPress={triggerWorkoutGeneration} style={styles.refreshBtn}>
              <RefreshCw size={14} color="#6C63FF" />
              <ThemedText style={styles.refreshText}>Generate</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={[styles.aiCard, { backgroundColor: colors.backgroundElement, borderLeftColor: '#6C63FF', borderColor: colors.border }]}>
            <ThemedText style={styles.aiTitle}>{workoutPlan?.title || 'Personalized Hypertrophy & Strength'}</ThemedText>
            {(workoutPlan?.plan || [
              'Day 1: Incline Dumbbell Press + Cable Flies (4 sets x 12 reps)',
              'Day 2: Barbell Squats + Romanian Deadlifts (4 sets x 10 reps)',
              'Day 3: Pull-ups + Seated Cable Rows (4 sets x 12 reps)',
              'Day 4: Core Plank & HIIT Cardio Interval (20 mins)'
            ]).map((step: string, idx: number) => (
              <ThemedText key={idx} style={styles.aiStep}>• {step}</ThemedText>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>AI Diet & Nutrition</ThemedText>
            <TouchableOpacity onPress={triggerNutritionGeneration} style={styles.refreshBtn}>
              <RefreshCw size={14} color="#43D787" />
              <ThemedText style={[styles.refreshText, { color: '#43D787' }]}>Generate</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={[styles.aiCard, { backgroundColor: colors.backgroundElement, borderLeftColor: '#43D787', borderColor: colors.border }]}>
            <ThemedText style={styles.aiTitle}>{nutritionPlan?.title || 'High-Protein Muscle Building Diet'}</ThemedText>
            {(nutritionPlan?.plan || [
              'Breakfast: 4 Egg Whites + Oatmeal with Almonds and Berries',
              'Lunch: Grilled Chicken Breast / Tofu with Brown Rice & Broccoli',
              'Pre-workout: Banana + Black Coffee + Whey Protein Shake',
              'Dinner: Steamed Fish / Paneer with Mixed Greens Salad'
            ]).map((step: string, idx: number) => (
              <ThemedText key={idx} style={styles.aiStep}>• {step}</ThemedText>
            ))}
          </View>

          {/* Primary Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} color="#FFFFFF" />
            <ThemedText style={styles.logoutButtonText}>Log Out of Account</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.versionText}>FitEmpire App v1.0.0 • Build 2026</ThemedText>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: '800' },
  topLogoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  topLogoutText: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
  headerCard: { flexDirection: 'row', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1 },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(108,99,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerMeta: { flex: 1, marginLeft: 14 },
  name: { fontWeight: '800', fontSize: 17, marginBottom: 2 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  email: { fontSize: 12, color: '#888' },
  badgeWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(108,99,255,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#6C63FF' },
  membershipCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  membershipTitle: { fontWeight: '700', fontSize: 14, color: '#6C63FF' },
  membershipSub: { fontSize: 12, color: '#888', marginTop: 1 },
  activeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  activeTagText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  statsGrid: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statBox: { flex: 1, padding: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  statLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  statVal: { fontWeight: '800', fontSize: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 6 },
  sectionTitle: { fontWeight: '700', fontSize: 16 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4 },
  refreshText: { fontSize: 12, fontWeight: '700', color: '#6C63FF' },
  aiCard: { padding: 14, borderRadius: 12, borderLeftWidth: 4, borderWidth: 1, marginBottom: 16 },
  aiTitle: { fontWeight: '700', fontSize: 14, marginBottom: 8 },
  aiStep: { fontSize: 12.5, color: '#aaa', marginVertical: 2, lineHeight: 18 },
  logoutButton: { backgroundColor: '#EF4444', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, marginTop: 10, marginBottom: 16 },
  logoutButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  versionText: { textAlign: 'center', fontSize: 11, color: '#666', marginTop: 4 },
});
