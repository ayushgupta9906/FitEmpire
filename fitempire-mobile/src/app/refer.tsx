import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  Gift,
  Copy,
  Share2,
  Users,
  Coins,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReferScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const referralCode = 'EMPIRE-RAHUL500';

  const handleCopy = () => {
    Alert.alert('Code Copied! 📋', `Referral code "${referralCode}" copied to clipboard.`);
  };

  const handleShare = () => {
    Alert.alert('Share Link 🚀', 'Join FitEmpire and get ₹500 discount on your first pass! Use code EMPIRE-RAHUL500 at https://fitempire.in');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Refer & Earn</ThemedText>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.heroCard}>
          <Gift size={44} color="#FDE047" />
          <ThemedText style={styles.heroTitle}>Earn ₹500 FitEmpire Cash</ThemedText>
          <ThemedText style={styles.heroDesc}>
            Invite your workout buddies. They get ₹500 off on any pass, and you get ₹500 credited to your wallet instantly!
          </ThemedText>
        </LinearGradient>

        <ThemedText style={styles.sectionHeading}>YOUR EXCLUSIVE REFERRAL CODE</ThemedText>
        <View style={[styles.codeBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText style={styles.codeText}>{referralCode}</ThemedText>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Copy size={16} color="#FFF" />
            <ThemedText style={styles.copyText}>Copy</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Share2 size={18} color="#FFF" />
          <ThemedText style={styles.shareBtnText}>Share on WhatsApp / Socials</ThemedText>
        </TouchableOpacity>

        <ThemedText style={[styles.sectionHeading, { marginTop: 24 }]}>HOW IT WORKS</ThemedText>
        <View style={[styles.stepsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><ThemedText style={styles.numText}>1</ThemedText></View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.stepHeading}>Share your code</ThemedText>
              <ThemedText style={styles.stepSub}>Send your unique code or link to friends & family.</ThemedText>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><ThemedText style={styles.numText}>2</ThemedText></View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.stepHeading}>They purchase a pass</ThemedText>
              <ThemedText style={styles.stepSub}>Your friend signs up and gets ₹500 instant discount.</ThemedText>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><ThemedText style={styles.numText}>3</ThemedText></View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.stepHeading}>You get ₹500 Reward</ThemedText>
              <ThemedText style={styles.stepSub}>₹500 is credited to your FitEmpire Wallet for renewals or store.</ThemedText>
            </View>
          </View>
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
  heroCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: 12,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#38BDF8',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  copyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  shareBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  shareBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  stepsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6C63FF',
  },
  stepHeading: {
    fontSize: 13,
    fontWeight: '800',
  },
  stepSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
});
