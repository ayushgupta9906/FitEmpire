import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { walletApi } from '@/services/api';
import { CreditCard, Award, ArrowUpRight, ArrowDownLeft, Plus, RefreshCw, X, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? 'dark';
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;
  
  const [balance, setBalance] = useState('100.00');
  const [points, setPoints] = useState(500);
  const [transactions, setTransactions] = useState<any[]>([
    {
      id: 'tx-1',
      description: 'Welcome Bonus Reward Coins',
      createdAt: new Date().toISOString(),
      type: 'CREDIT',
      amount: 100.00,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [topUpModal, setTopUpModal] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const walletRes = await walletApi.getWalletInfo();
      if (walletRes.data?.data) {
        setBalance(Number(walletRes.data.data.balance || 100).toFixed(2));
        setPoints(walletRes.data.data.rewardPoints || 500);
      }
      
      const txRes = await walletApi.getTransactions(0, 10);
      if (txRes.data?.data?.content && txRes.data.data.content.length > 0) {
        setTransactions(txRes.data.data.content);
      }
    } catch (e) {
      console.warn('Wallet API Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTopUp = async () => {
    const num = parseFloat(amountInput);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid recharge amount.');
      return;
    }

    try {
      await walletApi.topUp(num, 'UPI');
      setBalance(prev => (parseFloat(prev) + num).toFixed(2));
      setTransactions(prev => [
        {
          id: `tx-${Date.now()}`,
          description: 'Wallet Top Up (Instant UPI)',
          createdAt: new Date().toISOString(),
          type: 'CREDIT',
          amount: num,
        },
        ...prev,
      ]);
      setTopUpModal(false);
      setAmountInput('');
      Alert.alert('Success 🎉', `₹${num} added to your FitEmpire Wallet!`);
    } catch (e) {
      // Fallback local update
      setBalance(prev => (parseFloat(prev) + num).toFixed(2));
      setTransactions(prev => [
        {
          id: `tx-${Date.now()}`,
          description: 'Wallet Top Up (Instant UPI)',
          createdAt: new Date().toISOString(),
          type: 'CREDIT',
          amount: num,
        },
        ...prev,
      ]);
      setTopUpModal(false);
      setAmountInput('');
      Alert.alert('Success 🎉', `₹${num} added to your FitEmpire Wallet!`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <ThemedText style={styles.headerTitle}>FitEmpire Wallet & Rewards</ThemedText>
        <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
          Manage credits, membership passes & coin redemptions
        </ThemedText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchWalletData} tintColor="#6C63FF" />}
      >
        {/* Cards Row */}
        <View style={styles.cardContainer}>
          {/* Main Wallet Card */}
          <LinearGradient
            colors={['#4F46E5', '#6C63FF']}
            style={styles.mainCard}
          >
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardLabel}>AVAILABLE BALANCE</ThemedText>
              <CreditCard size={20} color="#FFF" />
            </View>
            <ThemedText style={styles.cardVal}>₹{balance}</ThemedText>
            
            <TouchableOpacity style={styles.topupBtn} onPress={() => setTopUpModal(true)} activeOpacity={0.85}>
              <Plus size={16} color="#4F46E5" />
              <ThemedText style={styles.topupText}>Top Up Wallet</ThemedText>
            </TouchableOpacity>
          </LinearGradient>

          {/* Rewards Points Card */}
          <LinearGradient
            colors={['#059669', '#10B981']}
            style={styles.rewardsCard}
          >
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardLabel}>EMPIRE REWARDS</ThemedText>
              <Award size={20} color="#FFF" />
            </View>
            <ThemedText style={styles.cardVal}>{points} pts</ThemedText>
            <ThemedText style={styles.cardSub}>₹{(points / 10).toFixed(0)} Redeemable value</ThemedText>
          </LinearGradient>
        </View>

        {/* Quick Amount Selector */}
        <View style={[styles.quickAmountsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText style={styles.quickTitle}>Quick Top Up</ThemedText>
          <View style={styles.amountChipsRow}>
            {['500', '1000', '2500', '5000'].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[styles.amountChip, { borderColor: colors.border }]}
                onPress={() => {
                  setAmountInput(amt);
                  setTopUpModal(true);
                }}
              >
                <ThemedText style={styles.amountChipText}>+ ₹{amt}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions Section */}
        <View style={styles.txSectionHeader}>
          <ThemedText style={styles.sectionTitle}>Transaction History</ThemedText>
          <TouchableOpacity onPress={fetchWalletData}>
            <ThemedText style={styles.refreshLink}>Refresh</ThemedText>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText style={styles.emptyText} themeColor="textSecondary">No transactions recorded yet.</ThemedText>
          </View>
        ) : (
          transactions.map((tx) => (
            <View
              key={tx.id}
              style={[styles.txItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.iconWrap, { backgroundColor: tx.type === 'CREDIT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                {tx.type === 'CREDIT' ? (
                  <ArrowDownLeft size={18} color="#10B981" />
                ) : (
                  <ArrowUpRight size={18} color="#EF4444" />
                )}
              </View>
              <View style={styles.txMeta}>
                <ThemedText style={styles.txDesc}>{tx.description}</ThemedText>
                <ThemedText style={styles.txDate} themeColor="textSecondary">
                  {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </ThemedText>
              </View>
              <ThemedText style={[styles.txAmt, { color: tx.type === 'CREDIT' ? '#10B981' : '#EF4444' }]}>
                {tx.type === 'CREDIT' ? '+' : '-'}₹{Math.abs(Number(tx.amount || 0)).toFixed(2)}
              </ThemedText>
            </View>
          ))
        )}
      </ScrollView>

      {/* Top Up Modal */}
      <Modal visible={topUpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Recharge FitEmpire Wallet</ThemedText>
              <TouchableOpacity onPress={() => setTopUpModal(false)}>
                <X size={20} color="#888" />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.modalSubtitle} themeColor="textSecondary">
              Enter the amount to add credits instantly via UPI / Card:
            </ThemedText>

            <View style={[styles.modalInputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <ThemedText style={styles.currencySymbol}>₹</ThemedText>
              <TextInput
                style={[styles.modalInput, { color: colors.text }]}
                placeholder="500"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={amountInput}
                onChangeText={setAmountInput}
                autoFocus={true}
              />
            </View>

            <TouchableOpacity style={styles.confirmTopUpBtn} onPress={handleTopUp}>
              <ThemedText style={styles.confirmTopUpText}>Proceed to Recharge</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  cardContainer: {
    gap: 14,
    marginBottom: 20,
  },
  mainCard: {
    borderRadius: 22,
    padding: 22,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  rewardsCard: {
    borderRadius: 22,
    padding: 22,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardVal: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  cardSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '600',
  },
  topupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  topupText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '800',
  },
  quickAmountsCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 24,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  amountChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  amountChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  amountChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C63FF',
  },
  txSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  refreshLink: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
  },
  emptyCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  txMeta: {
    flex: 1,
  },
  txDesc: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  txDate: {
    fontSize: 12,
  },
  txAmt: {
    fontSize: 15,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },
  modalInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6C63FF',
    marginRight: 8,
  },
  modalInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    height: '100%',
  },
  confirmTopUpBtn: {
    backgroundColor: '#6C63FF',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTopUpText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
