import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  ArrowLeft,
  Settings,
  Bell,
  MessageSquare,
  Clock,
  ShoppingBag,
  Sparkles,
} from 'lucide-react-native';

export default function SettingsNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  // Toggle States
  const [pushEnabled, setPushEnabled] = useState(true);
  const [nutritionistMessages, setNutritionistMessages] = useState(true);
  const [nutritionReminders, setNutritionReminders] = useState(true);
  const [gymVisitReminders, setGymVisitReminders] = useState(true);
  const [exerciseReminders, setExerciseReminders] = useState(false);
  const [promosOffers, setPromosOffers] = useState(true);
  const [orderStatusUpdates, setOrderStatusUpdates] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.circleBackButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
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
        {/* Centered Graphic & Page Title */}
        <View style={styles.headerGraphicSection}>
          <View style={styles.gearIconContainer}>
            <Settings size={44} color="#EF4444" />
          </View>
          <ThemedText style={styles.pageTitle}>App settings & notifications</ThemedText>
        </View>

        {/* Global Push Notifications Toggle */}
        <View style={[styles.settingRow, styles.firstRow, { borderBottomColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.settingLabel}>Push notifications</ThemedText>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#334155', true: '#EF4444' }}
            thumbColor={pushEnabled ? '#FFFFFF' : '#94A3B8'}
          />
        </View>

        {/* Category: MESSAGES */}
        <View style={styles.categorySection}>
          <ThemedText style={styles.categoryHeader}>MESSAGES</ThemedText>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <ThemedText style={styles.settingLabel}>Nutritionist messages</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Get notified when your nutritionist sends you a message.
              </ThemedText>
            </View>
            <Switch
              value={nutritionistMessages}
              onValueChange={setNutritionistMessages}
              trackColor={{ false: '#334155', true: '#EF4444' }}
              thumbColor={nutritionistMessages ? '#FFFFFF' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Category: REMINDERS */}
        <View style={styles.categorySection}>
          <ThemedText style={styles.categoryHeader}>REMINDERS</ThemedText>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <ThemedText style={styles.settingLabel}>Nutrition reminders</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Receive reminders to log your meals.
              </ThemedText>
            </View>
            <Switch
              value={nutritionReminders}
              onValueChange={setNutritionReminders}
              trackColor={{ false: '#334155', true: '#EF4444' }}
              thumbColor={nutritionReminders ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <ThemedText style={styles.settingLabel}>Gym visit reminders</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Receive reminders before your gym session or class is about to start.
              </ThemedText>
            </View>
            <Switch
              value={gymVisitReminders}
              onValueChange={setGymVisitReminders}
              trackColor={{ false: '#334155', true: '#EF4444' }}
              thumbColor={gymVisitReminders ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <ThemedText style={styles.settingLabel}>Exercise reminders</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Receive reminders for your exercise routine
              </ThemedText>
            </View>
            <Switch
              value={exerciseReminders}
              onValueChange={setExerciseReminders}
              trackColor={{ false: '#334155', true: '#EF4444' }}
              thumbColor={exerciseReminders ? '#FFFFFF' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Category: STORE */}
        <View style={styles.categorySection}>
          <ThemedText style={styles.categoryHeader}>STORE</ThemedText>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <ThemedText style={styles.settingLabel}>Promos & offers</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Receive reminders for your exercise routine.
              </ThemedText>
            </View>
            <Switch
              value={promosOffers}
              onValueChange={setPromosOffers}
              trackColor={{ false: '#334155', true: '#EF4444' }}
              thumbColor={promosOffers ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <ThemedText style={styles.settingLabel}>Order status updates</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Get status updates about your store orders.
              </ThemedText>
            </View>
            <Switch
              value={orderStatusUpdates}
              onValueChange={setOrderStatusUpdates}
              trackColor={{ false: '#334155', true: '#EF4444' }}
              thumbColor={orderStatusUpdates ? '#FFFFFF' : '#94A3B8'}
            />
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
  topHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  circleBackButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerGraphicSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  gearIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  firstRow: {
    marginTop: 10,
  },
  categorySection: {
    marginTop: 20,
  },
  categoryHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
    lineHeight: 16,
  },
});
