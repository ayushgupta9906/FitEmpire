import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { aiApi } from '@/services/api';
import { BrainCircuit, Sparkles, Trophy, Dumbbell, Apple, Activity } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function AiWorkoutScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingWorkout, setGeneratingWorkout] = useState(false);
  const [generatingNutrition, setGeneratingNutrition] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await aiApi.getWorkoutPlan();
      setAiData(res.data.data);
    } catch (e) {
      console.warn("Failed to load AI plan:", e);
      Alert.alert('Error', 'Unable to fetch AI coach data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkout = async () => {
    setGeneratingWorkout(true);
    try {
      const res = await aiApi.generateWorkout();
      setAiData((prev: any) => ({ ...prev, workoutPlan: res.data.data }));
      Alert.alert("Workout Refreshed", "AI has generated a new workout regime based on your bio metrics.");
    } catch (e) {
      console.warn("Failed to generate workout:", e);
      Alert.alert('Error', 'Could not generate workout plan.');
    } finally {
      setGeneratingWorkout(false);
    }
  };

  const handleGenerateNutrition = async () => {
    setGeneratingNutrition(true);
    try {
      const res = await aiApi.generateNutrition();
      setAiData((prev: any) => ({ ...prev, nutritionPlan: res.data.data }));
      Alert.alert("Nutrition Refreshed", "AI has generated a new macro intake schedule.");
    } catch (e) {
      console.warn("Failed to generate nutrition:", e);
      Alert.alert('Error', 'Could not generate nutrition plan.');
    } finally {
      setGeneratingNutrition(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>← Profile</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>AI Coach Recommendation</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Intro Banner */}
        <View style={styles.introCard}>
          <BrainCircuit size={32} color="#6C63FF" />
          <ThemedText style={styles.introTitle}>Hyper-personalized Routine</ThemedText>
          <ThemedText style={styles.introSubtitle} themeColor="textSecondary">
            Our AI Coach aggregates your BMI, goal levels, and booking history to structure the ultimate fitness regimen.
          </ThemedText>
        </View>

        {/* Workout Plan Section */}
        {aiData?.workoutPlan && (
          <View style={[styles.planSection, { backgroundColor: colors.backgroundElement }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionMeta}>
                <Dumbbell size={20} color="#6C63FF" />
                <ThemedText style={styles.sectionTitle}>Workout: {aiData.workoutPlan.title}</ThemedText>
              </View>
              <ThemedText style={styles.goalText} themeColor="textSecondary">{aiData.workoutPlan.goal}</ThemedText>
            </View>

            <View style={styles.divider} />

            {aiData.workoutPlan.exercises.map((ex: any, idx: number) => (
              <View key={idx} style={styles.exerciseRow}>
                <View style={styles.exerciseIndex}>
                  <ThemedText style={styles.exerciseIndexText}>{idx + 1}</ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.exerciseName}>{ex.name}</ThemedText>
                  <ThemedText style={styles.exerciseDetails} themeColor="textSecondary">
                    Sets: {ex.sets} • Reps: {ex.reps}
                  </ThemedText>
                  {ex.note && (
                    <ThemedText style={styles.exerciseNote} themeColor="textSecondary">
                      💡 {ex.note}
                    </ThemedText>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerateWorkout} disabled={generatingWorkout}>
              <Sparkles size={16} color="#6C63FF" />
              <ThemedText style={styles.generateBtnText}>
                {generatingWorkout ? 'Regenerating...' : 'Regenerate Workout Routine'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Nutrition Plan Section */}
        {aiData?.nutritionPlan && (
          <View style={[styles.planSection, { backgroundColor: colors.backgroundElement }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionMeta}>
                <Apple size={20} color="#43D787" />
                <ThemedText style={styles.sectionTitle}>Nutrition Plan</ThemedText>
              </View>
              <ThemedText style={styles.goalText} themeColor="textSecondary">Daily Goal: {aiData.nutritionPlan.calories} kcal</ThemedText>
            </View>

            <View style={styles.divider} />

            {/* Macros */}
            <View style={styles.macrosRow}>
              <View style={styles.macroCol}>
                <ThemedText style={[styles.macroValue, { color: '#6C63FF', fontWeight: '800' }]}>
                  {aiData.nutritionPlan.macros.protein}
                </ThemedText>
                <ThemedText style={styles.macroLabel}>Protein</ThemedText>
              </View>
              <View style={styles.macroCol}>
                <ThemedText style={[styles.macroValue, { color: '#43D787', fontWeight: '800' }]}>
                  {aiData.nutritionPlan.macros.carbs}
                </ThemedText>
                <ThemedText style={styles.macroLabel}>Carbs</ThemedText>
              </View>
              <View style={styles.macroCol}>
                <ThemedText style={[styles.macroValue, { color: '#FFB038', fontWeight: '800' }]}>
                  {aiData.nutritionPlan.macros.fats}
                </ThemedText>
                <ThemedText style={styles.macroLabel}>Fats</ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Meals */}
            <View style={styles.mealsContainer}>
              <View style={styles.mealRow}>
                <ThemedText style={styles.mealTitle}>Breakfast</ThemedText>
                <ThemedText style={styles.mealDesc} themeColor="textSecondary">
                  {aiData.nutritionPlan.meals.breakfast}
                </ThemedText>
              </View>
              <View style={styles.mealRow}>
                <ThemedText style={styles.mealTitle}>Lunch</ThemedText>
                <ThemedText style={styles.mealDesc} themeColor="textSecondary">
                  {aiData.nutritionPlan.meals.lunch}
                </ThemedText>
              </View>
              <View style={styles.mealRow}>
                <ThemedText style={styles.mealTitle}>Evening Snack</ThemedText>
                <ThemedText style={styles.mealDesc} themeColor="textSecondary">
                  {aiData.nutritionPlan.meals.snack}
                </ThemedText>
              </View>
              <View style={styles.mealRow}>
                <ThemedText style={styles.mealTitle}>Dinner</ThemedText>
                <ThemedText style={styles.mealDesc} themeColor="textSecondary">
                  {aiData.nutritionPlan.meals.dinner}
                </ThemedText>
              </View>
            </View>

            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerateNutrition} disabled={generatingNutrition}>
              <Sparkles size={16} color="#43D787" />
              <ThemedText style={[styles.generateBtnText, { color: '#43D787' }]}>
                {generatingNutrition ? 'Regenerating...' : 'Regenerate Nutrition Macros'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  backButton: { paddingRight: 16 },
  backText: { color: '#6C63FF', fontSize: 14, fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '800', flex: 1 },
  scroll: { padding: 16 },
  introCard: { alignItems: 'center', padding: 20, marginBottom: 20 },
  introTitle: { fontSize: 18, fontWeight: '900', marginTop: 12 },
  introSubtitle: { fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 16 },
  planSection: { borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionHeader: { marginBottom: 12 },
  sectionMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  goalText: { fontSize: 11, marginTop: 4 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 14 },
  exerciseRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  exerciseIndex: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(108,99,255,0.12)', justifyContent: 'center', alignItems: 'center' },
  exerciseIndexText: { fontSize: 11, fontWeight: '700', color: '#6C63FF' },
  exerciseName: { fontSize: 13, fontWeight: '700' },
  exerciseDetails: { fontSize: 11, marginTop: 2 },
  exerciseNote: { fontSize: 10, marginTop: 4, fontStyle: 'italic' },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginTop: 12 },
  generateBtnText: { fontSize: 12, fontWeight: '700', color: '#6C63FF' },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
  macroCol: { alignItems: 'center' },
  macroValue: { fontSize: 18, fontWeight: '800' },
  macroLabel: { fontSize: 9, color: '#888', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  mealsContainer: { gap: 14, marginBottom: 12 },
  mealRow: {},
  mealTitle: { fontSize: 12, fontWeight: '800' },
  mealDesc: { fontSize: 11, marginTop: 3, lineHeight: 15 },
});
