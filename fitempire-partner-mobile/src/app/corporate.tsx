import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Search,
  Sparkles,
  Award,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CorporateScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [companyEmail, setCompanyEmail] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  const partneredCompanies = [
    { name: 'Tata Consultancy Services (TCS)', subsidy: 'Up to 60% Subsidised', code: '@tcs.com' },
    { name: 'Infosys Limited', subsidy: 'Up to 50% Subsidised', code: '@infosys.com' },
    { name: 'Wipro Technologies', subsidy: 'Up to 50% Subsidised', code: '@wipro.com' },
    { name: 'Google India', subsidy: '100% Fully Covered', code: '@google.com' },
    { name: 'Microsoft India', subsidy: '100% Fully Covered', code: '@microsoft.com' },
    { name: 'Amazon Development Centre', subsidy: 'Up to 70% Subsidised', code: '@amazon.com' },
  ];

  const handleVerifyCorporate = () => {
    if (!companyEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter your official work email address.');
      return;
    }
    Alert.alert(
      'Corporate Benefit Verified! 🏢',
      `Verification OTP sent to ${companyEmail}. You are eligible for corporate subsidised FitEmpire passes!`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Corporate Wellness</ThemedText>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={['#1E1B4B', '#0F172A']} style={styles.banner}>
          <Building2 size={36} color="#38BDF8" />
          <ThemedText style={styles.bannerTitle}>FitEmpire for Corporates</ThemedText>
          <ThemedText style={styles.bannerDesc}>
            Over 500+ top enterprises empower their employees with all-access gym passes, nutrition consults, and team challenges.
          </ThemedText>
        </LinearGradient>

        <ThemedText style={styles.sectionHeading}>VERIFY YOUR WORK EMAIL</ThemedText>
        <View style={[styles.verifyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.inputWrap}>
            <Mail size={16} color="#94A3B8" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g. rahul@tcs.com / ananya@google.com"
              placeholderTextColor="#94A3B8"
              value={companyEmail}
              onChangeText={setCompanyEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyCorporate}>
            <ThemedText style={styles.verifyBtnText}>Verify Company Email →</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={[styles.sectionHeading, { marginTop: 24 }]}>PARTNERED ENTERPRISES</ThemedText>
        <View style={{ gap: 10 }}>
          {partneredCompanies.map((comp) => (
            <View
              key={comp.name}
              style={[styles.companyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.compName}>{comp.name}</ThemedText>
                <ThemedText style={styles.compSubsidy}>{comp.subsidy}</ThemedText>
              </View>
              <View style={styles.checkTag}>
                <CheckCircle2 size={16} color="#10B981" />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  backBtn: {
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  banner: {
    borderRadius: 20,
    padding: 20,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
  },
  bannerDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  verifyCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
  },
  verifyBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  compName: {
    fontSize: 13,
    fontWeight: '800',
  },
  compSubsidy: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 2,
  },
  checkTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: 6,
    borderRadius: 8,
  },
});
