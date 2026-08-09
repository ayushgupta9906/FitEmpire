import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  BrainCircuit,
  Sparkles,
  Dumbbell,
  Apple,
  Clock,
  CheckCircle2,
  Plus,
  Flame,
  ArrowLeft,
  Zap,
  Search,
  Check,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FOOD_DB from '@/constants/food_database.json';

export default function AiWorkoutScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [activeTab, setActiveTab] = useState<'WORKOUT' | 'NUTRITION'>('WORKOUT');
  const [selectedMuscle, setSelectedMuscle] = useState('Chest & Triceps');
  const [loggedCalories, setLoggedCalories] = useState(1650);
  const [loggedProtein, setLoggedProtein] = useState(128);

  const [exercises, setExercises] = useState([
    { id: '1', name: 'Barbell Bench Press', sets: '4 Sets', reps: '8-10 Reps', completed: true },
    { id: '2', name: 'Incline Dumbbell Flyes', sets: '3 Sets', reps: '12 Reps', completed: true },
    { id: '3', name: 'Cable Tricep Pushdowns', sets: '4 Sets', reps: '15 Reps', completed: false },
    { id: '4', name: 'Overhead Tricep Extension', sets: '3 Sets', reps: '12 Reps', completed: false },
  ]);

  const [meals, setMeals] = useState([
    { id: 'm1', name: 'Breakfast', time: '08:30 AM', items: '4 Boiled Eggs, Oats & Blueberries', calories: 480, protein: 32 },
    { id: 'm2', name: 'Post-Workout Shake', time: '11:45 AM', items: 'Whey Protein, Banana, Almond Milk', calories: 340, protein: 28 },
    { id: 'm3', name: 'Power Lunch', time: '02:00 PM', items: 'Grilled Chicken Bowl, Brown Rice, Broccoli', calories: 650, protein: 54 },
    { id: 'm4', name: 'Evening Snack', time: '05:30 PM', items: 'Greek Yogurt & Walnuts', calories: 180, protein: 14 },
  ]);

  const [mealModal, setMealModal] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);

  const muscleGroups = ['Chest & Triceps', 'Back & Biceps', 'Legs & Core', 'Shoulders & Arms', 'Full Body HIIT'];

  const filteredFoods = FOOD_DB.filter((f) =>
    f.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
  );

  const toggleExercise = (id: string) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const handleAddFoodMeal = () => {
    if (!selectedFood) return;
    const item = {
      id: `m-${Date.now()}`,
      name: selectedFood.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: `Serving: ${selectedFood.serving} (${selectedFood.protein}g Protein)`,
      calories: selectedFood.calories,
      protein: Math.round(selectedFood.protein),
    };
    setMeals([...meals, item]);
    setLoggedCalories((prev) => prev + selectedFood.calories);
    setLoggedProtein((prev) => prev + Math.round(selectedFood.protein));
    setMealModal(false);
    setSelectedFood(null);
    setFoodSearchQuery('');
    Alert.alert('Meal Logged 🎉', `Added ${selectedFood.name} (+${selectedFood.calories} kcal, +${selectedFood.protein}g protein)!`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>FitEmpire AI Coach</ThemedText>
        <View style={styles.aiBadge}>
          <Sparkles size={13} color="#F59E0B" />
          <ThemedText style={styles.aiBadgeText}>GPT-4o</ThemedText>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'WORKOUT' && styles.tabBtnActive]}
          onPress={() => setActiveTab('WORKOUT')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'WORKOUT' && styles.tabTextActive]}>
            🏋️ AI Workout Generator
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'NUTRITION' && styles.tabBtnActive]}
          onPress={() => setActiveTab('NUTRITION')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'NUTRITION' && styles.tabTextActive]}>
            🥗 Empire Feast Macros
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {activeTab === 'WORKOUT' ? (
          <>
            {/* Muscle Group Chips */}
            <ThemedText style={styles.sectionHeading}>TARGET MUSCLE SPLIT</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.muscleScroll}>
              {muscleGroups.map((m) => {
                const isSelected = selectedMuscle === m;
                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.muscleChip, isSelected && styles.muscleChipActive]}
                    onPress={() => {
                      setSelectedMuscle(m);
                      Alert.alert('Protocol Customized ⚡', `AI generated a new ${m} hypertrophy routine.`);
                    }}
                  >
                    <ThemedText style={[styles.muscleChipText, isSelected && styles.muscleChipTextActive]}>
                      {m}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Routine Summary Card */}
            <LinearGradient colors={['#1E1B4B', '#0F172A']} style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View>
                  <ThemedText style={styles.planTitle}>{selectedMuscle} Protocol</ThemedText>
                  <ThemedText style={styles.planSubtitle}>Hypertrophy & Progressive Overload</ThemedText>
                </View>
                <View style={styles.calBadge}>
                  <Flame size={14} color="#EF4444" />
                  <ThemedText style={styles.calText}>~550 kcal</ThemedText>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <ThemedText style={styles.metricLabel}>DURATION</ThemedText>
                  <ThemedText style={styles.metricVal}>45 Mins</ThemedText>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <ThemedText style={styles.metricLabel}>SETS</ThemedText>
                  <ThemedText style={styles.metricVal}>14 Total</ThemedText>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <ThemedText style={styles.metricLabel}>REST</ThemedText>
                  <ThemedText style={styles.metricVal}>60-90s</ThemedText>
                </View>
              </View>
            </LinearGradient>

            {/* Exercise Checklist */}
            <ThemedText style={[styles.sectionHeading, { marginTop: 20 }]}>EXERCISE CHECKLIST</ThemedText>
            <View style={{ gap: 10 }}>
              {exercises.map((ex) => (
                <TouchableOpacity
                  key={ex.id}
                  style={[
                    styles.exerciseCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    ex.completed && { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.08)' },
                  ]}
                  onPress={() => toggleExercise(ex.id)}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={[
                        styles.checkCircle,
                        ex.completed && { backgroundColor: '#10B981', borderColor: '#10B981' },
                      ]}
                    >
                      {ex.completed && <ThemedText style={{ color: '#000', fontSize: 12, fontWeight: '900' }}>✓</ThemedText>}
                    </View>
                    <View>
                      <ThemedText
                        style={[
                          styles.exName,
                          ex.completed && { textDecorationLine: 'line-through', color: '#94A3B8' },
                        ]}
                      >
                        {ex.name}
                      </ThemedText>
                      <ThemedText style={styles.exMeta}>
                        {ex.sets} • {ex.reps}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={{ fontSize: 11, color: ex.completed ? '#10B981' : '#6C63FF', fontWeight: '800' }}>
                    {ex.completed ? 'COMPLETED' : 'LOG SET'}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Daily Calorie & Protein Targets */}
            <LinearGradient colors={['#064E3B', '#065F46']} style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View>
                  <ThemedText style={styles.planTitle}>Daily Macro Target</ThemedText>
                  <ThemedText style={styles.planSubtitle}>High-Protein Clean Bulk (2,450 kcal)</ThemedText>
                </View>
                <TouchableOpacity onPress={() => setMealModal(true)} style={styles.addMealBtn}>
                  <Plus size={14} color="#FFF" />
                  <ThemedText style={{ fontSize: 11, fontWeight: '800', color: '#FFF' }}>Search Foods</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={{ marginVertical: 12 }}>
                <ThemedText style={{ fontSize: 26, fontWeight: '900', color: '#FFF' }}>
                  {loggedCalories} <ThemedText style={{ fontSize: 15, color: '#A7F3D0' }}>/ 2,450 kcal ({Math.round((loggedCalories / 2450) * 100)}%)</ThemedText>
                </ThemedText>
              </View>

              <View style={styles.macroPillsRow}>
                <View style={styles.macroPill}>
                  <ThemedText style={styles.macroPillVal}>{loggedProtein}g / 165g</ThemedText>
                  <ThemedText style={styles.macroPillLbl}>Protein</ThemedText>
                </View>
                <View style={styles.macroPill}>
                  <ThemedText style={styles.macroPillVal}>210g / 260g</ThemedText>
                  <ThemedText style={styles.macroPillLbl}>Carbs</ThemedText>
                </View>
                <View style={styles.macroPill}>
                  <ThemedText style={styles.macroPillVal}>52g / 65g</ThemedText>
                  <ThemedText style={styles.macroPillLbl}>Fats</ThemedText>
                </View>
              </View>
            </LinearGradient>

            {/* Meals Timeline */}
            <ThemedText style={[styles.sectionHeading, { marginTop: 20 }]}>TODAY'S LOGGED FOODS</ThemedText>
            <View style={{ gap: 10 }}>
              {meals.map((m) => (
                <View
                  key={m.id}
                  style={[styles.mealCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <ThemedText style={styles.mealName}>{m.name}</ThemedText>
                      <ThemedText style={styles.mealTime}>• {m.time}</ThemedText>
                    </View>
                    <ThemedText style={styles.mealItems}>{m.items}</ThemedText>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <ThemedText style={styles.mealCals}>+{m.calories} kcal</ThemedText>
                    <ThemedText style={{ fontSize: 10, color: '#38BDF8', fontWeight: '700' }}>+{m.protein}g protein</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Search & Log Food Modal */}
      {mealModal && (
        <Modal transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalBox, { backgroundColor: colors.surface, maxHeight: '80%' }]}>
              <ThemedText style={styles.modalTitle}>Search Empire Food Database</ThemedText>

              <View style={styles.searchBarWrap}>
                <Search size={16} color="#94A3B8" />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search chicken, eggs, whey, oats, paneer..."
                  placeholderTextColor="#94A3B8"
                  value={foodSearchQuery}
                  onChangeText={setFoodSearchQuery}
                />
              </View>

              <ScrollView style={{ maxHeight: 220 }}>
                {filteredFoods.map((f) => {
                  const isSelected = selectedFood?.id === f.id;
                  return (
                    <TouchableOpacity
                      key={f.id}
                      style={[
                        styles.foodItemRow,
                        isSelected && { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' },
                      ]}
                      onPress={() => setSelectedFood(f)}
                    >
                      <View style={{ flex: 1 }}>
                        <ThemedText style={{ fontSize: 13, fontWeight: '800' }}>{f.name}</ThemedText>
                        <ThemedText style={{ fontSize: 11, color: '#94A3B8' }}>{f.serving}</ThemedText>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <ThemedText style={{ fontSize: 12, fontWeight: '800', color: '#10B981' }}>{f.calories} kcal</ThemedText>
                        <ThemedText style={{ fontSize: 10, color: '#38BDF8', fontWeight: '700' }}>{f.protein}g Protein</ThemedText>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setMealModal(false)}>
                  <ThemedText style={{ color: '#94A3B8', fontWeight: '700' }}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSubmitBtn, !selectedFood && { opacity: 0.5 }]}
                  onPress={handleAddFoodMeal}
                  disabled={!selectedFood}
                >
                  <ThemedText style={{ color: '#FFF', fontWeight: '800' }}>
                    {selectedFood ? `Add ${selectedFood.name}` : 'Select Food'}
                  </ThemedText>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  backButton: {
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
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#6C63FF',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  muscleScroll: {
    gap: 8,
    marginBottom: 16,
  },
  muscleChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  muscleChipActive: {
    backgroundColor: '#6C63FF',
  },
  muscleChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  muscleChipTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  summaryCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  planSubtitle: {
    fontSize: 12,
    color: '#A5B4FC',
    marginTop: 2,
  },
  calBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  calText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exName: {
    fontSize: 13,
    fontWeight: '800',
  },
  exMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  addMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  macroPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroPill: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  macroPillVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF',
  },
  macroPillLbl: {
    fontSize: 10,
    color: '#A7F3D0',
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  mealName: {
    fontSize: 13,
    fontWeight: '800',
  },
  mealTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  mealItems: {
    fontSize: 11,
    color: '#38BDF8',
    marginTop: 2,
  },
  mealCals: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
  },
  foodItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalSubmitBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#10B981',
  },
});
