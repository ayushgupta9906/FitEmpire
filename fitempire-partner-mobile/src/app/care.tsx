import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  Heart,
  Stethoscope,
  Activity,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  PhoneCall,
  Sparkles,
  Award,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CareScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [activeTab, setActiveTab] = useState<'DOCTORS' | 'LAB_TESTS'>('DOCTORS');

  const doctors = [
    {
      id: 'd1',
      name: 'Dr. Ananya Sen',
      specialty: 'Chief Sports Nutritionist & Dietitian',
      experience: '9+ Years Exp',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1594824813576-06835260195e?w=400&auto=format&fit=crop',
      nextSlot: 'Today, 04:30 PM',
      fee: 'FREE with FitEmpire Pro',
    },
    {
      id: 'd2',
      name: 'Dr. Rajesh Nair',
      specialty: 'Sports Physiotherapist & Rehab',
      experience: '12+ Years Exp',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop',
      nextSlot: 'Tomorrow, 11:00 AM',
      fee: 'FREE with FitEmpire Pro',
    },
    {
      id: 'd3',
      name: 'Dr. Meera Kapoor',
      specialty: 'General Physician & Wellness',
      experience: '8+ Years Exp',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop',
      nextSlot: 'Today, 06:00 PM',
      fee: 'FREE with FitEmpire Pro',
    },
  ];

  const labTests = [
    {
      id: 'l1',
      title: 'Full Body Athlete Performance Panel',
      testsCount: '64 Parameters (CBC, Lipid, Thyroid, Liver, Kidney, Vitamin D & B12)',
      price: '₹999',
      oldPrice: '₹2,499',
      sampleType: 'Free Home Sample Pickup',
    },
    {
      id: 'l2',
      title: 'Hormone & Testosterone Optimization Panel',
      testsCount: '18 Parameters (Free & Total Testosterone, Cortisol, Thyroid Profile)',
      price: '₹1,299',
      oldPrice: '₹2,999',
      sampleType: 'Free Home Sample Pickup',
    },
    {
      id: 'l3',
      title: 'Cardiac & Lipid Health Profile',
      testsCount: '28 Parameters (Cholesterol, HDL, LDL, Triglycerides, HbA1c)',
      price: '₹699',
      oldPrice: '₹1,499',
      sampleType: 'Free Home Sample Pickup',
    },
  ];

  const handleBookConsultation = (doctorName: string) => {
    Alert.alert('Consultation Booked 🩺', `Video appointment confirmed with ${doctorName}. A meeting link will be sent via SMS & notification.`);
  };

  const handleBookLabTest = (testTitle: string) => {
    Alert.alert('Lab Test Scheduled 🩸', `Order placed for "${testTitle}". Phlebotomist will visit your address tomorrow morning.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>FitEmpire Care</ThemedText>
        <View style={styles.proTag}>
          <ShieldCheck size={14} color="#10B981" />
          <ThemedText style={styles.proTagText}>FREE WITH PRO</ThemedText>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'DOCTORS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('DOCTORS')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'DOCTORS' && styles.tabTextActive]}>
            🩺 Consult Doctors & Dietitians
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'LAB_TESTS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('LAB_TESTS')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'LAB_TESTS' && styles.tabTextActive]}>
            🩸 Full Body Health Tests
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {activeTab === 'DOCTORS' ? (
          <>
            {/* Banner */}
            <LinearGradient colors={['#065F46', '#064E3B']} style={styles.banner}>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 16, fontWeight: '900', color: '#FFF' }}>
                  Unlimited Video Consultations
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: '#A7F3D0', marginTop: 2 }}>
                  Certified sports nutritionists, dietitians & physicians available daily.
                </ThemedText>
              </View>
              <PhoneCall size={28} color="#A7F3D0" />
            </LinearGradient>

            <ThemedText style={styles.sectionHeading}>AVAILABLE DOCTORS TODAY</ThemedText>
            <View style={{ gap: 12 }}>
              {doctors.map((doc) => (
                <View
                  key={doc.id}
                  style={[styles.docCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Image source={{ uri: doc.image }} style={styles.docImage} />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.docName}>{doc.name}</ThemedText>
                    <ThemedText style={styles.docSpecialty}>{doc.specialty}</ThemedText>
                    <ThemedText style={styles.docExp}>{doc.experience} • ⭐ {doc.rating}</ThemedText>

                    <View style={styles.slotRow}>
                      <Clock size={12} color="#38BDF8" />
                      <ThemedText style={styles.slotText}>{doc.nextSlot}</ThemedText>
                    </View>

                    <TouchableOpacity
                      style={styles.bookDocBtn}
                      onPress={() => handleBookConsultation(doc.name)}
                      activeOpacity={0.8}
                    >
                      <ThemedText style={styles.bookDocBtnText}>Book Video Call (FREE)</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <LinearGradient colors={['#7C2D12', '#991B1B']} style={styles.banner}>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 16, fontWeight: '900', color: '#FFF' }}>
                  At-Home Blood & Health Checkups
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: '#FECACA', marginTop: 2 }}>
                  NABL accredited diagnostics with digital reports in 24 hours.
                </ThemedText>
              </View>
              <Activity size={28} color="#FECACA" />
            </LinearGradient>

            <ThemedText style={styles.sectionHeading}>POPULAR HEALTH PANELS</ThemedText>
            <View style={{ gap: 12 }}>
              {labTests.map((test) => (
                <View
                  key={test.id}
                  style={[styles.testCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <ThemedText style={styles.testTitle}>{test.title}</ThemedText>
                  <ThemedText style={styles.testDesc}>{test.testsCount}</ThemedText>
                  <ThemedText style={styles.sampleText}>🏠 {test.sampleType}</ThemedText>

                  <View style={styles.testPriceRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                      <ThemedText style={styles.testPrice}>{test.price}</ThemedText>
                      <ThemedText style={styles.testOldPrice}>{test.oldPrice}</ThemedText>
                    </View>

                    <TouchableOpacity
                      style={styles.bookTestBtn}
                      onPress={() => handleBookLabTest(test.title)}
                    >
                      <ThemedText style={styles.bookTestText}>Book Home Pickup</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
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
    marginBottom: 12,
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
  proTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  proTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
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
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  banner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  docCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  docImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },
  docName: {
    fontSize: 14,
    fontWeight: '800',
  },
  docSpecialty: {
    fontSize: 11,
    color: '#38BDF8',
    marginTop: 1,
  },
  docExp: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  slotText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '700',
  },
  bookDocBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  bookDocBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  testCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  testDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
  sampleText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
  testPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  testPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  testOldPrice: {
    fontSize: 12,
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  bookTestBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  bookTestText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
});
