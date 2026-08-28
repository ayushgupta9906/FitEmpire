import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Dumbbell,
  Heart,
  Scale,
  Flame,
  Activity,
  Award,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function OnboardingHraScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [step, setStep] = useState(1);

  // Bio Form State
  const [name, setName] = useState('Rahul Sharma');
  const [age, setAge] = useState('26');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [height, setHeight] = useState('178'); // cm
  const [weight, setWeight] = useState('74'); // kg
  const [goal, setGoal] = useState('Muscle Hypertrophy & Strength');
  const [workoutDays, setWorkoutDays] = useState('4-5 days / week');
  const [diet, setDiet] = useState('High-Protein Non-Veg');

  const goalsList = [
    { title: 'Muscle Hypertrophy & Strength', desc: 'Build lean mass & hit progressive overload', icon: '🏋️' },
    { title: 'Fat Loss & Athletic Shred', desc: 'Burn calories with high-tempo conditioning', icon: '🔥' },
    { title: 'Endurance & Sports Agility', desc: 'Improve stamina, VO2 max & agility', icon: '⚡' },
    { title: 'General Health & Flexibility', desc: 'Mobility, core strength & stress reduction', icon: '🧘' },
  ];

  const dietList = ['High-Protein Non-Veg', 'Pure Vegetarian', 'Eggitarian', 'Vegan'];

  // Calculations
  const hM = Number(height) / 100;
  const bmi = (Number(weight) / (hM * hM)).toFixed(1);
  const targetCalories = Math.round(Number(weight) * 32);
  const targetProtein = Math.round(Number(weight) * 2.2);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setStep(5); // Show Results
    }
  };

  const handleFinish = () => {
    Alert.alert('Profile Complete 🎉', '+100 FitPoints added to your wallet! Welcome to FitEmpire.');
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        {step > 1 && step < 5 ? (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
        <ThemedText style={styles.title}>
          {step === 5 ? 'FitScore Assessment' : `Health Profile (${step}/4)`}
        </ThemedText>
        <View style={{ width: 38 }} />
      </View>

      {/* Progress Bar */}
      {step < 5 && (
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBarFill, { width: `${(step / 4) * 100}%` }]} />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {step === 1 && (
          <View style={styles.stepContent}>
            <ThemedText style={styles.questionTitle}>Let's get to know your bio metrics 📊</ThemedText>
            <ThemedText style={styles.questionSubtitle}>Calculates your baseline metabolic rate.</ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.inputLabel}>Age</ThemedText>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.inputLabel}>Gender</ThemedText>
                <View style={styles.genderRow}>
                  {['MALE', 'FEMALE'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderChip, gender === g && styles.genderChipActive]}
                      onPress={() => setGender(g as any)}
                    >
                      <ThemedText style={[styles.genderChipText, gender === g && styles.genderChipTextActive]}>
                        {g === 'MALE' ? 'Male' : 'Female'}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.inputLabel}>Height (cm)</ThemedText>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.inputLabel}>Weight (kg)</ThemedText>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <ThemedText style={styles.questionTitle}>What is your primary fitness goal? 🎯</ThemedText>
            <ThemedText style={styles.questionSubtitle}>We tailor workouts and pass recommendations based on this.</ThemedText>

            <View style={{ gap: 10, marginTop: 12 }}>
              {goalsList.map((g) => {
                const isSelected = goal === g.title;
                return (
                  <TouchableOpacity
                    key={g.title}
                    style={[
                      styles.choiceCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isSelected && { borderColor: '#6C63FF', backgroundColor: 'rgba(108, 99, 255, 0.12)' },
                    ]}
                    onPress={() => setGoal(g.title)}
                  >
                    <ThemedText style={{ fontSize: 24 }}>{g.icon}</ThemedText>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={{ fontSize: 14, fontWeight: '800' }}>{g.title}</ThemedText>
                      <ThemedText style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{g.desc}</ThemedText>
                    </View>
                    {isSelected && <CheckCircle2 size={20} color="#6C63FF" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <ThemedText style={styles.questionTitle}>How often do you plan to train? ⏱️</ThemedText>
            <ThemedText style={styles.questionSubtitle}>Helps calculate optimal recovery windows.</ThemedText>

            <View style={{ gap: 10, marginTop: 12 }}>
              {['1-2 days / week (Beginner)', '3-4 days / week (Consistent)', '5-6 days / week (Pro Beast)'].map((d) => {
                const isSelected = workoutDays === d;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.choiceCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isSelected && { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)' },
                    ]}
                    onPress={() => setWorkoutDays(d)}
                  >
                    <ThemedText style={{ fontSize: 14, fontWeight: '800', flex: 1 }}>{d}</ThemedText>
                    {isSelected && <CheckCircle2 size={20} color="#10B981" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContent}>
            <ThemedText style={styles.questionTitle}>Dietary & Nutrition Preferences 🥗</ThemedText>
            <ThemedText style={styles.questionSubtitle}>Empire Feast customized macros.</ThemedText>

            <View style={{ gap: 10, marginTop: 12 }}>
              {dietList.map((d) => {
                const isSelected = diet === d;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.choiceCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isSelected && { borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.12)' },
                    ]}
                    onPress={() => setDiet(d)}
                  >
                    <ThemedText style={{ fontSize: 14, fontWeight: '800', flex: 1 }}>{d}</ThemedText>
                    {isSelected && <CheckCircle2 size={20} color="#F59E0B" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 5 && (
          <View style={styles.stepContent}>
            <LinearGradient colors={['#1E1B4B', '#0F172A']} style={styles.resultCard}>
              <View style={styles.scoreTop}>
                <View>
                  <ThemedText style={{ fontSize: 12, color: '#A5B4FC', fontWeight: '800' }}>FITEMPIRE HEALTH SCORE</ThemedText>
                  <ThemedText style={{ fontSize: 32, fontWeight: '900', color: '#10B981' }}>88 / 100</ThemedText>
                </View>
                <Award size={36} color="#F59E0B" />
              </View>

              <View style={styles.statsDivider} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <ThemedText style={{ fontSize: 11, color: '#94A3B8' }}>BMI INDEX</ThemedText>
                  <ThemedText style={{ fontSize: 18, fontWeight: '900', color: '#FFF' }}>{bmi} (Optimal)</ThemedText>
                </View>
                <View>
                  <ThemedText style={{ fontSize: 11, color: '#94A3B8' }}>DAILY CALORIES</ThemedText>
                  <ThemedText style={{ fontSize: 18, fontWeight: '900', color: '#38BDF8' }}>{targetCalories} kcal</ThemedText>
                </View>
                <View>
                  <ThemedText style={{ fontSize: 11, color: '#94A3B8' }}>DAILY PROTEIN</ThemedText>
                  <ThemedText style={{ fontSize: 18, fontWeight: '900', color: '#10B981' }}>{targetProtein}g</ThemedText>
                </View>
              </View>
            </LinearGradient>

            <View style={[styles.bonusCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ThemedText style={{ fontSize: 24 }}>🎁</ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 14, fontWeight: '800' }}>+100 FitPoints Bonus Unlocked</ThemedText>
                <ThemedText style={{ fontSize: 12, color: '#94A3B8' }}>Available in your FitEmpire Wallet for gym passes & store rewards.</ThemedText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.primaryBtn, step === 5 && { backgroundColor: '#10B981' }]}
          onPress={step === 5 ? handleFinish : handleNext}
        >
          <ThemedText style={styles.primaryBtnText}>
            {step === 5 ? 'Launch FitEmpire Home →' : 'Continue'}
          </ThemedText>
          {step < 5 && <ArrowRight size={18} color="#FFF" />}
        </TouchableOpacity>
      </View>
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
    marginBottom: 10,
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
  progressBarWrap: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 2,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  stepContent: {
    gap: 14,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
  },
  questionSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
  },
  genderChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  genderChipActive: {
    backgroundColor: '#6C63FF',
  },
  genderChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  genderChipTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  resultCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.4)',
    gap: 14,
  },
  scoreTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  bonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  primaryBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
