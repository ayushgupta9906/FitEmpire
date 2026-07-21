import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useColorScheme } from 'react-native';
import { Banknote, ArrowUpRight, ArrowDownRight, CreditCard, Building2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PartnerSettlements() {
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.backgroundElement, borderBottomColor: colors.border }]}>
        <ThemedText style={styles.title}>Financials</ThemedText>
      </View>
      
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        
        {/* Balance Card */}
        <LinearGradient
          colors={[colors.primaryDark, colors.primary]}
          style={styles.balanceCard}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.balanceHeader}>
            <View>
              <ThemedText style={styles.balanceLabel}>Next Payout (Estimated)</ThemedText>
              <ThemedText style={styles.balanceAmount}>₹ 42,850.00</ThemedText>
            </View>
            <View style={styles.iconCircle}>
              <Banknote size={24} color={colors.primary} />
            </View>
          </View>
          <View style={styles.balanceFooter}>
            <ThemedText style={styles.footerText}>Settles on July 15, 2026</ThemedText>
            <View style={styles.bankTag}>
              <Building2 size={12} color="#FFF" style={{ marginRight: 4 }} />
              <ThemedText style={styles.bankText}>HDFC **** 4591</ThemedText>
            </View>
          </View>
        </LinearGradient>

        <ThemedText style={styles.sectionTitle}>Recent Settlements</ThemedText>

        {[
          { id: 1, date: 'July 09, 2026', amount: '12,500.00', fee: '1,875.00', status: 'COMPLETED' },
          { id: 2, date: 'July 02, 2026', amount: '18,400.00', fee: '2,760.00', status: 'COMPLETED' },
          { id: 3, date: 'June 25, 2026', amount: '15,200.00', fee: '2,280.00', status: 'COMPLETED' },
        ].map((invoice) => (
          <View key={invoice.id} style={[styles.invoiceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.row}>
              <View style={styles.dateRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <ArrowUpRight size={20} color="#10B981" />
                </View>
                <View>
                  <ThemedText style={[styles.date, { color: colors.text }]}>{invoice.date}</ThemedText>
                  <ThemedText style={styles.desc} themeColor="textSecondary">Bank Transfer</ThemedText>
                </View>
              </View>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeTxt}>{invoice.status}</ThemedText>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.amountRow}>
              <View>
                <ThemedText style={styles.desc} themeColor="textSecondary">Gross Volume</ThemedText>
                <ThemedText style={[styles.subAmount, { color: colors.text }]}>₹ {(parseFloat(invoice.amount.replace(/,/g, '')) + parseFloat(invoice.fee.replace(/,/g, ''))).toLocaleString('en-IN', {minimumFractionDigits: 2})}</ThemedText>
              </View>
              <View>
                <ThemedText style={styles.desc} themeColor="textSecondary">Platform Fee (15%)</ThemedText>
                <ThemedText style={[styles.subAmount, { color: '#EF4444' }]}>- ₹ {invoice.fee}</ThemedText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText style={styles.desc} themeColor="textSecondary">Net Payout</ThemedText>
                <ThemedText style={[styles.amount, { color: '#10B981' }]}>₹ {invoice.amount}</ThemedText>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    letterSpacing: -0.5,
  },
  list: { 
    padding: 24,
    paddingBottom: 100 
  },
  balanceCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '800',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16,
  },
  footerText: {
    color: '#FFF',
    fontSize: 14,
  },
  bankTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bankText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  invoiceCard: { 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  date: { 
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  badge: { 
    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 8 
  },
  badgeTxt: { 
    color: '#10B981', 
    fontSize: 11, 
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  amount: { 
    fontSize: 18, 
    fontWeight: '800', 
    marginTop: 4,
  },
  desc: { 
    fontSize: 12, 
  }
});
