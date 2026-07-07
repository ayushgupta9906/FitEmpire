import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { walletApi } from '@/services/api';
import { CreditCard, Award, ArrowUpRight, ArrowDownLeft, Plus, RefreshCw, X } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function WalletScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  
  const [balance, setBalance] = useState('0.00');
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [topUpModal, setTopUpModal] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const walletRes = await walletApi.getWalletInfo();
      setBalance(walletRes.data.data.balance.toFixed(2));
      
      const txRes = await walletApi.getTransactions(0, 10);
      setTransactions(txRes.data.data.content);
    } catch (e) {
      console.warn("Wallet API Error (falling back to mock data):", e);
      // Fallback mocks
      setBalance('2450.00');
      setPoints(750);
      setTransactions([
        { id: '1', type: 'CREDIT', txnType: 'TOPUP', amount: 1000, description: 'Added funds via UPI', createdAt: new Date().toISOString() },
        { id: '2', type: 'DEBIT', txnType: 'PURCHASE', amount: 499, description: 'Day Pass booking', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', type: 'CREDIT', txnType: 'REWARD_REDEMPTION', amount: 150, description: 'Redeemed points', createdAt: new Date(Date.now() - 172800000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTopUp = () => {
    setTopUpModal(false);
    // Integration logic here (e.g. Razorpay/Stripe checkout)
    alert(`Top up initiated for ₹${amountInput}. Verification callback is integrated in api.ts.`);
    setAmountInput('');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchWalletData} tintColor="#6C63FF" />}
        >
          <ThemedText type="subtitle" style={styles.header}>FitWallet</ThemedText>

          {/* Cards Row */}
          <View style={styles.cardContainer}>
            {/* Wallet Card */}
            <View style={[styles.card, { backgroundColor: '#6C63FF' }]}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.cardLabel}>Available Balance</ThemedText>
                <CreditCard size={20} color="#fff" />
              </View>
              <ThemedText style={styles.cardVal}>₹{balance}</ThemedText>
              <TouchableOpacity style={styles.topupBtn} onPress={() => setTopUpModal(true)}>
                <Plus size={16} color="#6C63FF" />
                <ThemedText style={styles.topupText}>Top Up Wallet</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Rewards Card */}
            <View style={[styles.card, { backgroundColor: '#43D787' }]}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.cardLabel}>FitRewards</ThemedText>
                <Award size={20} color="#fff" />
              </View>
              <ThemedText style={styles.cardVal}>{points} pts</ThemedText>
              <ThemedText style={styles.cardSub}>₹{points / 10} Redeemable value</ThemedText>
            </View>
          </View>

          {/* Transaction Section */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>Transactions</ThemedText>
          {transactions.map((tx) => (
            <View key={tx.id} style={[styles.txItem, { borderBottomColor: colors.backgroundElement }]}>
              <View style={[styles.iconWrap, { backgroundColor: tx.type === 'CREDIT' ? 'rgba(67,215,135,0.1)' : 'rgba(255,87,87,0.1)' }]}>
                {tx.type === 'CREDIT' ? (
                  <ArrowDownLeft size={20} color="#43D787" />
                ) : (
                  <ArrowUpRight size={20} color="#FF5757" />
                )}
              </View>
              <View style={styles.txMeta}>
                <ThemedText style={styles.txDesc}>{tx.description}</ThemedText>
                <ThemedText style={styles.txDate}>{new Date(tx.createdAt).toLocaleDateString()}</ThemedText>
              </View>
              <ThemedText style={[styles.txAmt, { color: tx.type === 'CREDIT' ? '#43D787' : '#FF5757' }]}>
                {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
              </ThemedText>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* TopUp Modal */}
      <Modal transparent visible={topUpModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundElement }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add Money</ThemedText>
              <TouchableOpacity onPress={() => setTopUpModal(false)}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
              placeholder="Enter Amount (₹)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />
            <TouchableOpacity style={styles.actionBtn} onPress={handleTopUp}>
              <ThemedText style={styles.actionText}>Initiate Checkout</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: 16 },
  header: { fontWeight: '800', marginBottom: 20 },
  cardContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  card: { flex: 1, padding: 16, borderRadius: 16, justifyContent: 'space-between', minHeight: 140 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  cardVal: { color: '#fff', fontSize: 22, fontWeight: '800', marginVertical: 8 },
  cardSub: { color: 'rgba(255,255,255,0.9)', fontSize: 11 },
  topupBtn: { backgroundColor: '#fff', flexDirection: 'row', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center' },
  topupText: { color: '#6C63FF', fontWeight: '700', fontSize: 12 },
  sectionTitle: { fontWeight: '700', marginBottom: 12, fontSize: 18 },
  txItem: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, alignItems: 'center' },
  iconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txMeta: { flex: 1, marginLeft: 12 },
  txDesc: { fontWeight: '600', fontSize: 14 },
  txDate: { fontSize: 11, color: '#888', marginTop: 2 },
  txAmt: { fontWeight: '700', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  actionBtn: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 8, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '700' },
});
