import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/services/auth-context';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ArrowRight, Phone, KeyRound, Dumbbell, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  
  const { requestOtp, verifyOtp, loginAsPartner } = useAuth();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loginMode, setLoginMode] = useState<'USER' | 'PARTNER'>((params.mode as any) || 'USER');
  const [loading, setLoading] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPassword, setPartnerPassword] = useState('');

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
          'OTP Received',
          `Use this OTP to login: ${otp}`,
          [{ text: 'Proceed', onPress: () => setStep(2) }]
        );
      } else {
        setStep(2);
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!code || code.length < 4) return;
    setLoading(true);
    try {
      await verifyOtp(phone, code);
      router.replace('/(tabs)/explore');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerLogin = async () => {
    if (!partnerEmail || !partnerPassword) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await loginAsPartner(partnerEmail, partnerPassword);
      router.replace('/(partner-tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Invalid credentials.');
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
        {/* Dynamic Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.logoContainer}
          >
            <Dumbbell color="#FFF" size={32} />
          </LinearGradient>
          <ThemedText style={styles.title}>FitEmpire</ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            {loginMode === 'USER' ? 'Your premium fitness journey starts here.' : 'Manage your business beautifully.'}
          </ThemedText>
        </View>

        {/* Toggle Mode */}
        <View style={[styles.toggleContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.toggleButton, loginMode === 'USER' && { backgroundColor: colors.primary }]}
            onPress={() => { setLoginMode('USER'); setStep(1); }}
          >
            <ThemedText style={[styles.toggleText, loginMode === 'USER' && { color: '#FFF' }]}>Member</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, loginMode === 'PARTNER' && { backgroundColor: colors.primary }]}
            onPress={() => { setLoginMode('PARTNER'); setStep(1); }}
          >
            <ThemedText style={[styles.toggleText, loginMode === 'PARTNER' && { color: '#FFF' }]}>Partner</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <View style={styles.formContainer}>
          {loginMode === 'USER' ? (
            step === 1 ? (
              <View style={styles.inputWrapper}>
                <ThemedText style={styles.label}>Mobile Number</ThemedText>
                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Phone color={colors.textSecondary} size={20} style={styles.inputIcon} />
                  <ThemedText style={styles.prefix}>+91</ThemedText>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your phone number"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#FFF" /> : (
                    <>
                      <ThemedText style={styles.buttonText}>Continue</ThemedText>
                      <ArrowRight color="#FFF" size={20} />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputWrapper}>
                <ThemedText style={styles.label}>Enter OTP</ThemedText>
                <ThemedText style={styles.hint} themeColor="textSecondary">
                  Sent securely to +91 {phone}
                </ThemedText>
                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <KeyRound color={colors.textSecondary} size={20} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text, fontSize: 20, letterSpacing: 8, fontWeight: '700' }]}
                    placeholder="0000"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={code}
                    onChangeText={setCode}
                    autoFocus
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#FFF" /> : (
                    <>
                      <ThemedText style={styles.buttonText}>Verify & Secure Login</ThemedText>
                      <Zap color="#FFF" size={20} />
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.textButton} onPress={() => setStep(1)}>
                  <ThemedText style={[styles.textButtonText, { color: colors.primary }]}>Change Number</ThemedText>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 16 }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Business Email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={partnerEmail}
                  onChangeText={setPartnerEmail}
                />
              </View>
              <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  value={partnerPassword}
                  onChangeText={setPartnerPassword}
                />
              </View>
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: colors.primary, marginTop: 24 }]}
                onPress={handlePartnerLogin}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <ThemedText style={styles.buttonText}>Access Dashboard</ThemedText>}
              </TouchableOpacity>
            </View>
          )}
        </View>

      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: -60,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    transform: [{ rotate: '-10deg' }]
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    padding: 4,
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 14,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    height: '100%',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 16,
    marginTop: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  textButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  textButtonText: {
    fontSize: 15,
    fontWeight: '600',
  }
});
