import React, { useState } from 'react';
import {
  View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, Dimensions, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/services/auth-context';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ArrowRight, Phone, KeyRound, Dumbbell, ShieldCheck, Mail, Lock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scheme = useColorScheme() ?? 'dark';
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;
  
  const { requestOtp, verifyOtp, login } = useAuth();

  const [loginMode, setLoginMode] = useState<'USER' | 'PARTNER'>((params.mode as any) || 'USER');
  const [authMethod, setAuthMethod] = useState<'OTP' | 'PASSWORD'>('OTP');
  
  // State for OTP Login
  const [phone, setPhone] = useState('9876543210');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State for Email/Password Login (Both Customer and Partner)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        setNotice(`✅ SMS Dispatched to +91 ${cleanPhone}! (Real Twilio delivery active. Code: ${returnedOtp})`);
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
      const user = await verifyOtp(cleanPhone, code);
      if (user?.role === 'PARTNER' || user?.role === 'GYM_PARTNER') {
        router.replace('/(partner-tabs)');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP code.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Verification Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Email / Password Login Handler (Customer & Partner) ────
  const handleEmailLogin = async () => {
    setError(null);
    if (!email || !password) {
      const msg = 'Please enter both your registered email address and password.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Missing Fields', msg);
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please verify your credentials.';
      setError(msg);
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Login Failed', msg);
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
              colors={[colors.primary, colors.primaryDark]}
              style={styles.logoContainer}
            >
              <Dumbbell color="#FFF" size={32} />
            </LinearGradient>
            <ThemedText style={styles.title}>FitEmpire</ThemedText>
            <ThemedText style={styles.subtitle} themeColor="textSecondary">
              {loginMode === 'USER'
                ? 'Your All-Access Pass to India’s Elite Fitness Centers'
                : 'Partner Portal: Manage Bookings, Check-ins & Revenue'}
            </ThemedText>
          </View>

          {/* Sub-selector: Phone OTP vs Email/Password */}
          <View style={styles.subSelector}>
            <TouchableOpacity 
              style={[styles.subTab, authMethod === 'OTP' && { borderColor: colors.primary, backgroundColor: 'rgba(108,99,255,0.1)' }]}
              onPress={() => { setAuthMethod('OTP'); setStep(1); setError(null); setNotice(null); }}
            >
              <Phone size={14} color={authMethod === 'OTP' ? colors.primary : '#888'} />
              <ThemedText style={[styles.subTabText, authMethod === 'OTP' && { color: colors.primary, fontWeight: '700' }]}>
                Phone OTP
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.subTab, authMethod === 'PASSWORD' && { borderColor: colors.primary, backgroundColor: 'rgba(108,99,255,0.1)' }]}
              onPress={() => { 
                setAuthMethod('PASSWORD'); 
                setEmail('testuser@fitempire.in'); 
                setPassword('Password@123');
                setError(null);
                setNotice(null);
              }}
            >
              <Mail size={14} color={authMethod === 'PASSWORD' ? colors.primary : '#888'} />
              <ThemedText style={[styles.subTabText, authMethod === 'PASSWORD' && { color: colors.primary, fontWeight: '700' }]}>
                Email & Password
              </ThemedText>
            </TouchableOpacity>
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
            {/* OPTION 1: Customer Phone OTP */}
            {loginMode === 'USER' && authMethod === 'OTP' ? (
              step === 1 ? (
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
                    A 6-digit verification code will be sent to your mobile phone via SMS.
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
                        <ThemedText style={styles.submitText}>Verify & Login</ThemedText>
                        <ShieldCheck size={18} color="#FFF" />
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => { setStep(1); setNotice(null); }} style={styles.backButton}>
                    <ThemedText style={styles.backText}>← Change Phone Number</ThemedText>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              /* OPTION 2: Email & Password (Member or Gym Partner) */
              <View>
                <ThemedText style={styles.inputLabel}>
                  {loginMode === 'PARTNER' ? 'Partner Business Email' : 'Email Address'}
                </ThemedText>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <Mail size={18} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="name@example.com"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <ThemedText style={[styles.inputLabel, { marginTop: 16 }]}>Password</ThemedText>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <Lock size={18} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                {loginMode === 'PARTNER' && (
                  <TouchableOpacity 
                    onPress={() => { setEmail('partner@fitempire.in'); setPassword('Partner@123'); }}
                    style={styles.demoFillBtn}
                  >
                    <Sparkles size={13} color="#3B82F6" />
                    <ThemedText style={[styles.demoFillText, { color: '#3B82F6' }]}>
                      Fill Demo Partner Credentials
                    </ThemedText>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={[
                    styles.submitButton, 
                    { backgroundColor: loginMode === 'PARTNER' ? '#3B82F6' : colors.primary }
                  ]}
                  onPress={handleEmailLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <ThemedText style={styles.submitText}>
                        {loginMode === 'PARTNER' ? 'Access Partner Portal' : 'Login with Password'}
                      </ThemedText>
                      <ArrowRight size={18} color="#FFF" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
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
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeText: {
    fontSize: 14,
    color: '#888',
  },
  subSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  subTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  subTabText: {
    fontSize: 12,
    color: '#888',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
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
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    color: '#AAA',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
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
    fontSize: 15,
    height: '100%',
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
    marginTop: -4,
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  submitText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  backText: {
    fontSize: 13,
    color: '#888',
  },
});
