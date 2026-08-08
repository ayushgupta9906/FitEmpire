import React, { useState } from 'react';
import {
  View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, Dimensions, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/services/auth-context';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ArrowRight, Phone, KeyRound, Dumbbell, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;
  
  const { requestOtp, verifyOtp } = useAuth();

  // State for Pure Phone OTP Login
  const [phone, setPhone] = useState('9876543210');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Customer OTP Handlers ─────────────────────────────────
  const handleSendOtp = async () => {
    setError(null);
    setNotice(null);
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      const msg = 'Please enter a valid 10-digit mobile number.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Invalid Phone', msg);
      return;
    }
    setLoading(true);
    try {
      const cleanPhone = digits.slice(-10);
      const returnedOtp = await requestOtp(cleanPhone);
      setStep(2);
      if (returnedOtp) {
        setCode(returnedOtp);
        setNotice(`✅ SMS Dispatched to +91 ${cleanPhone}! (Verification Code: ${returnedOtp})`);
      } else {
        setNotice(`✅ SMS sent to +91 ${cleanPhone} via Twilio. Please enter your 6-digit OTP.`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please check your phone number.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    if (!code || code.length < 4) {
      const msg = 'Please enter the 6-digit verification code.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Invalid OTP', msg);
      return;
    }
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      await verifyOtp(cleanPhone, code);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP code.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Verification Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[colors.background, colors.backgroundElement]}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header Banner */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#6C63FF', '#4F46E5']}
              style={styles.logoContainer}
            >
              <View style={{ transform: [{ scaleX: -1 }] }}>
                <Dumbbell color="#FFFFFF" size={34} strokeWidth={2.3} />
              </View>
            </LinearGradient>
            <ThemedText style={styles.title}>FitEmpire Member</ThemedText>
            <ThemedText style={styles.subtitle} themeColor="textSecondary">
              Enter your mobile number to receive an instant verification code
            </ThemedText>
          </View>

          {/* Notice and Error Banners */}
          {notice && (
            <View style={styles.noticeBanner}>
              <CheckCircle2 size={16} color="#10B981" />
              <ThemedText style={styles.noticeText}>{notice}</ThemedText>
            </View>
          )}

          {error && (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color="#EF4444" />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {step === 1 ? (
              <View>
                <ThemedText style={styles.inputLabel}>Mobile Phone Number</ThemedText>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <ThemedText style={styles.countryCode}>+91</ThemedText>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                <ThemedText style={styles.hintText}>
                  A 6-digit verification code will be sent to your mobile phone via Twilio SMS.
                </ThemedText>

                <TouchableOpacity 
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <ThemedText style={styles.submitText}>Send Verification Code</ThemedText>
                      <ArrowRight size={18} color="#FFF" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <ThemedText style={styles.inputLabel}>Enter 6-Digit OTP</ThemedText>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <KeyRound size={20} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.input, { color: colors.text, letterSpacing: 4, fontWeight: '700' }]}
                    placeholder="• • • • • •"
                    placeholderTextColor="#888"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={code}
                    onChangeText={setCode}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <ThemedText style={styles.submitText}>Verify & Enter FitEmpire</ThemedText>
                      <ShieldCheck size={18} color="#FFF" />
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setStep(1); setNotice(null); }} style={styles.backButton}>
                  <ThemedText style={styles.backText}>← Change Phone Number</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Footer Features */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>⚡</ThemedText>
              <ThemedText style={styles.featureText}>Instant Access</ThemedText>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>🛡️</ThemedText>
              <ThemedText style={styles.featureText}>Secure OTP</ThemedText>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>🎟️</ThemedText>
              <ThemedText style={styles.featureText}>Digital Pass</ThemedText>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
    paddingBottom: 40,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  noticeText: {
    color: '#10B981',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    flex: 1,
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 10,
    color: '#888',
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  hintText: {
    fontSize: 11,
    color: '#888',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 16,
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  backText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 32,
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: 'center',
    gap: 4,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  featureDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
