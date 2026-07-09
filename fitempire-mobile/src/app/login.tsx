import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/services/auth-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Dumbbell, Phone, KeyRound, ChevronRight, ArrowLeft } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { requestOtp, verifyOtp } = useAuth();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const otp = await requestOtp(phone);
      if (otp) {
        setCode(otp);
        Alert.alert(
          'Dev Mode Bypass',
          `OTP received and auto-filled: ${otp}`,
          [{ text: 'OK', onPress: () => setStep(2) }]
        );
      } else {
        setStep(2);
      }
    } catch (e: any) {
      console.error(e);
      // For local testing/dev, if backend fails or TWILIO SID is not configured, fall back to step 2 with mock OTP
      Alert.alert(
        'Dev Mode Bypass',
        'OTP request failed. Proceeding with mock OTP: 123456.',
        [{ text: 'OK', onPress: () => { setCode('123456'); setStep(2); } }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!code || code.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone, code);
      router.replace('/(tabs)');
    } catch (e: any) {
      console.error(e);
      // Direct mock fallback for local testing
      if (code === '123456') {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Verification Failed', 'Incorrect OTP code. Try 123456.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1080&auto=format&fit=crop' }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBadge}>
                <Dumbbell size={38} color="#ffffff" />
              </View>
              <ThemedText style={styles.logoText}>FitEmpire</ThemedText>
              <ThemedText style={styles.logoTagline}>India's Premium Fitness Ecosystem</ThemedText>
            </View>

            {/* Login Card */}
            <View style={[styles.card, { backgroundColor: 'rgba(33, 34, 37, 0.85)' }]}>
              {step === 1 ? (
                <View>
                  <ThemedText style={styles.cardTitle}>Welcome to the Empire</ThemedText>
                  <ThemedText style={styles.cardSubtitle}>Enter your phone number to get started</ThemedText>

                  <View style={[styles.inputContainer, { borderColor: 'rgba(255,255,255,0.15)' }]}>
                    <Phone size={20} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Mobile Number"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>

                  <TouchableOpacity style={styles.btn} onPress={handleSendOtp} disabled={loading}>
                    <ThemedText style={styles.btnText}>{loading ? 'Sending...' : 'Send OTP'}</ThemedText>
                    <ChevronRight size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity style={styles.backLink} onPress={() => setStep(1)}>
                    <ArrowLeft size={16} color="#6C63FF" />
                    <ThemedText style={styles.backLinkText}>Change Number</ThemedText>
                  </TouchableOpacity>

                  <ThemedText style={styles.cardTitle}>Verification</ThemedText>
                  <ThemedText style={styles.cardSubtitle}>Enter the 6-digit OTP sent to +91 {phone}</ThemedText>

                  <View style={[styles.inputContainer, { borderColor: 'rgba(255,255,255,0.15)' }]}>
                    <KeyRound size={20} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="6-Digit OTP"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={code}
                      onChangeText={setCode}
                    />
                  </View>

                  <TouchableOpacity style={styles.btn} onPress={handleVerifyOtp} disabled={loading}>
                    <ThemedText style={styles.btnText}>{loading ? 'Verifying...' : 'Verify & Login'}</ThemedText>
                    <ChevronRight size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 19,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: { fontSize: 32, fontWeight: '800', color: '#ffffff', marginTop: 16 },
  logoTagline: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4, letterSpacing: 0.5 },
  card: { borderRadius: 24, padding: 24, backdropFilter: 'blur(20px)' },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#ffffff', marginBottom: 8 },
  cardSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#ffffff', fontSize: 16, fontWeight: '500' },
  btn: {
    flexDirection: 'row',
    backgroundColor: '#6C63FF',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backLinkText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
});
