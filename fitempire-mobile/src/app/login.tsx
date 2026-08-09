import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, Dimensions, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/services/auth-context';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ArrowRight, Phone, KeyRound, Dumbbell, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;
  
  const { requestOtp, verifyOtp } = useAuth();

  // State for Mobile OTP Login
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const getFullPhone = () => {
    const raw = phone.trim();
    if (raw.startsWith('+')) return raw;
    const cleanDigits = raw.replace(/\D/g, '');
    return `${countryCode}${cleanDigits}`;
  };

  // ── Send SMS OTP ──────────────────────────────────────────
  const handleSendOtp = async () => {
    setError(null);
    setNotice(null);
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 8) {
      const msg = 'Please enter a valid mobile phone number.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Invalid Phone', msg);
      return;
    }

    const fullPhoneNumber = getFullPhone();
    setLoading(true);
    try {
      await requestOtp(fullPhoneNumber);
      setStep(2);
      setCode('');
      setResendTimer(45);
      setNotice(`✅ Verification code sent via SMS to ${fullPhoneNumber}. Please check your phone.`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please check your phone number and try again.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Verify SMS OTP ────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setError(null);
    const cleanCode = code.trim();
    if (!cleanCode || cleanCode.length < 4) {
      const msg = 'Please enter the 6-digit verification code.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Invalid OTP', msg);
      return;
    }

    const fullPhoneNumber = getFullPhone();
    setLoading(true);
    try {
      await verifyOtp(fullPhoneNumber, cleanCode);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP code. Please try again.';
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
              <View style={{ transform: [{ scaleX: -1 }], ...(Platform.OS === 'web' ? { transform: 'scaleX(-1)' } : {}) }}>
                <Dumbbell color="#FFFFFF" size={34} strokeWidth={2.3} />
              </View>
            </LinearGradient>
            <ThemedText style={styles.title}>FitEmpire Member</ThemedText>
            <ThemedText style={styles.subtitle} themeColor="textSecondary">
              {step === 1 ? 'Enter your mobile number to receive an SMS verification code' : 'Enter the verification code sent to your mobile'}
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
                
                <View style={styles.countryRow}>
                  <TouchableOpacity 
                    style={[styles.countryBadge, countryCode === '+91' && styles.countryBadgeActive]}
                    onPress={() => setCountryCode('+91')}
                  >
                    <ThemedText style={[styles.countryBadgeText, countryCode === '+91' && styles.countryBadgeTextActive]}>🇮🇳 +91</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.countryBadge, countryCode === '+1' && styles.countryBadgeActive]}
                    onPress={() => setCountryCode('+1')}
                  >
                    <ThemedText style={[styles.countryBadgeText, countryCode === '+1' && styles.countryBadgeTextActive]}>🇺🇸 +1</ThemedText>
                  </TouchableOpacity>
                </View>

                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <ThemedText style={styles.countryCode}>{countryCode}</ThemedText>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={countryCode === '+91' ? '9880072520' : '6592745532'}
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    maxLength={15}
                    value={phone}
                    onChangeText={setPhone}
                    autoFocus={Platform.OS === 'web'}
                  />
                </View>

                <ThemedText style={styles.hintText}>
                  We will send a 6-digit real SMS verification code to your phone.
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
                <ThemedText style={styles.inputLabel}>Enter 6-Digit SMS Code</ThemedText>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <KeyRound size={20} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.input, { color: colors.text, letterSpacing: 6, fontWeight: '700', fontSize: 18 }]}
                    placeholder="• • • • • •"
                    placeholderTextColor="#888"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={code}
                    onChangeText={setCode}
                    autoFocus={true}
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

                <View style={styles.resendRow}>
                  {resendTimer > 0 ? (
                    <ThemedText style={styles.timerText}>Resend code in {resendTimer}s</ThemedText>
                  ) : (
                    <TouchableOpacity onPress={handleSendOtp} disabled={loading} style={styles.resendBtn}>
                      <RefreshCw size={14} color={colors.primary} />
                      <ThemedText style={[styles.resendText, { color: colors.primary }]}>Resend SMS Code</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity onPress={() => { setStep(1); setNotice(null); setError(null); }} style={styles.backButton}>
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
              <ThemedText style={styles.featureText}>Secure SMS</ThemedText>
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
    marginBottom: 24,
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
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  noticeText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#EF4444',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  countryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  countryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  countryBadgeActive: {
    borderColor: '#6C63FF',
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
  },
  countryBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  countryBadgeTextActive: {
    color: '#6C63FF',
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 10,
    color: '#888',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
    lineHeight: 18,
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  featureIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  featureDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
