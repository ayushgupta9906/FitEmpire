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
import { ArrowRight, Phone, KeyRound, Dumbbell, ShieldCheck, Mail, Lock, UserCheck, Sparkles } from 'lucide-react-native';
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
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  // State for Email/Password Login (Both Customer and Partner)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Customer OTP Handlers ─────────────────────────────────
  const handleSendOtp = async () => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const cleanPhone = phone.trim().startsWith('+91') ? phone.trim() : `+91${phone.replace(/\D/g, '').slice(-10)}`;
      const otp = await requestOtp(cleanPhone);
      if (otp) {
        setCode(otp);
        Alert.alert(
          'OTP Received (Development)',
          `Your login OTP is: ${otp}`,
          [{ text: 'Proceed', onPress: () => setStep(2) }]
        );
      } else {
        setStep(2);
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP. Please check your phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!code || code.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    try {
      const cleanPhone = phone.trim().startsWith('+91') ? phone.trim() : `+91${phone.replace(/\D/g, '').slice(-10)}`;
      const user = await verifyOtp(cleanPhone, code);
      if (user?.role === 'PARTNER' || user?.role === 'GYM_PARTNER') {
        router.replace('/(partner-tabs)');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Verification Failed', err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // ── Email / Password Login Handler (Customer & Partner) ────
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both your registered email address and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      if (user?.role === 'PARTNER' || user?.role === 'GYM_PARTNER') {
        router.replace('/(partner-tabs)');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid email or password. Please verify your credentials.');
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

          {/* Mode Switch Tabs (Member vs Gym Partner) */}
          <View style={[styles.modeSelector, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={[styles.modeTab, loginMode === 'USER' && { backgroundColor: colors.primary }]}
              onPress={() => { setLoginMode('USER'); setStep(1); }}
            >
              <ThemedText style={[styles.modeText, loginMode === 'USER' && { color: '#FFF', fontWeight: 'bold' }]}>
                Member Login
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeTab, loginMode === 'PARTNER' && { backgroundColor: '#3B82F6' }]}
              onPress={() => { setLoginMode('PARTNER'); setAuthMethod('PASSWORD'); }}
            >
              <ThemedText style={[styles.modeText, loginMode === 'PARTNER' && { color: '#FFF', fontWeight: 'bold' }]}>
                Gym Partner
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Member Sub-selector: Phone OTP vs Email/Password */}
          {loginMode === 'USER' && (
            <View style={styles.subSelector}>
              <TouchableOpacity 
                style={[styles.subTab, authMethod === 'OTP' && { borderColor: colors.primary, backgroundColor: 'rgba(108,99,255,0.1)' }]}
                onPress={() => { setAuthMethod('OTP'); setStep(1); }}
              >
                <Phone size={14} color={authMethod === 'OTP' ? colors.primary : '#888'} />
                <ThemedText style={[styles.subTabText, authMethod === 'OTP' && { color: colors.primary, fontWeight: '700' }]}>
                  Phone OTP
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.subTab, authMethod === 'PASSWORD' && { borderColor: colors.primary, backgroundColor: 'rgba(108,99,255,0.1)' }]}
                onPress={() => setAuthMethod('PASSWORD')}
              >
                <Mail size={14} color={authMethod === 'PASSWORD' ? colors.primary : '#888'} />
                <ThemedText style={[styles.subTabText, authMethod === 'PASSWORD' && { color: colors.primary, fontWeight: '700' }]}>
                  Email & Password
                </ThemedText>
              </TouchableOpacity>
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
                    We will send a 6-digit one-time verification passcode.
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

                  <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
                    <ThemedText style={styles.backText}>← Change Phone Number</ThemedText>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              /* OPTION 2: Email & Password (for Customer OR Partner) */
              <View>
                <ThemedText style={styles.inputLabel}>
                  {loginMode === 'PARTNER' ? 'Gym Partner Registered Email' : 'Member Email Address'}
                </ThemedText>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <Mail size={18} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={loginMode === 'PARTNER' ? "partner@goldgym.com" : "customer@fitempire.in"}
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <ThemedText style={[styles.inputLabel, { marginTop: 14 }]}>Password</ThemedText>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <Lock size={18} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your account password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.submitButton, { backgroundColor: loginMode === 'PARTNER' ? '#3B82F6' : colors.primary }]}
                  onPress={handleEmailLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <ThemedText style={styles.submitText}>
                        {loginMode === 'PARTNER' ? 'Login as Gym Partner' : 'Login to Member Account'}
                      </ThemedText>
                      <ArrowRight size={18} color="#FFF" />
                    </>
                  )}
                </TouchableOpacity>

                {loginMode === 'PARTNER' && (
                  <ThemedText style={styles.partnerNote}>
                    🔒 Gym Partner accounts are provisioned exclusively by Super Admin via the Admin Onboarding Portal.
                  </ThemedText>
                )}
              </View>
            )}
          </View>

          {/* Quick Demo Credentials Assistant */}
          <View style={[styles.demoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.demoHeader}>
              <Sparkles size={16} color="#FFB038" />
              <ThemedText style={styles.demoTitle}>Quick Login Credentials</ThemedText>
            </View>
            <ThemedText style={styles.demoDesc}>
              • <strong>Member:</strong> Enter any 10-digit mobile number for instant OTP, or email <ThemedText style={{ color: colors.primary }}>priya@fitempire.in</ThemedText>
            </ThemedText>
            <ThemedText style={styles.demoDesc}>
              • <strong>Partner:</strong> Use onboarded credentials created in Admin Portal
            </ThemedText>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 30, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, textAlign: 'center', marginTop: 4, paddingHorizontal: 16, lineHeight: 18 },
  modeSelector: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 14,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeText: { fontSize: 13, color: '#888' },
  subSelector: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: 14,
  },
  subTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  subTabText: { fontSize: 12, color: '#888' },
  formCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  inputLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  countryCode: { fontWeight: '700', fontSize: 15, marginRight: 10, color: '#6C63FF' },
  input: { flex: 1, fontSize: 15, height: '100%' },
  hintText: { fontSize: 11, color: '#888', marginTop: 6, marginBottom: 16 },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  submitText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  backButton: { marginTop: 14, alignItems: 'center' },
  backText: { fontSize: 13, color: '#6C63FF', fontWeight: '600' },
  partnerNote: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 14, lineHeight: 16 },
  demoCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  demoHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  demoTitle: { fontSize: 13, fontWeight: '800', color: '#FFB038' },
  demoDesc: { fontSize: 11.5, color: '#aaa', marginVertical: 2, lineHeight: 16 },
});
