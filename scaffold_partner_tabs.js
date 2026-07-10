const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'fitempire-mobile', 'src', 'app');
const partnerTabsDir = path.join(appDir, '(partner-tabs)');
fs.mkdirSync(partnerTabsDir, { recursive: true });

// 1. Create _layout.tsx for partner tabs
const partnerLayoutContent = `import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme';
import { Activity, LayoutDashboard, QrCode } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from 'react-native';

export default function PartnerTabLayout() {
  const scheme = useColorScheme();
  const theme = useTheme();
  // We use a distinct dark blue/black theme for Partner mode
  const partnerTheme = {
    background: '#0B0F19',
    tint: '#3B82F6', // Blue tint for partner
    tabBar: '#111827',
    text: '#FFFFFF'
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: partnerTheme.tint,
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: partnerTheme.tabBar,
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          position: 'absolute',
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView tint="dark" intensity={80} style={{ flex: 1 }} />
          ) : null
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scan QR',
          tabBarIcon: ({ color, size }) => (
            <QrCode size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settlements"
        options={{
          title: 'Settlements',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
`;
fs.writeFileSync(path.join(partnerTabsDir, '_layout.tsx'), partnerLayoutContent);
console.log("Created (partner-tabs)/_layout.tsx");

// 2. Create index.tsx (Dashboard)
const partnerIndexContent = `import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/services/auth-context';
import { Users, TrendingUp, LogOut } from 'lucide-react-native';

export default function PartnerDashboard() {
  const { user, logout } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.greeting}>Partner Dashboard</ThemedText>
            <ThemedText style={styles.title}>{user?.gym?.name || 'Your Gym'}</ThemedText>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users size={24} color="#3B82F6" />
            <ThemedText style={styles.statValue}>142</ThemedText>
            <ThemedText style={styles.statLabel}>Today's Check-ins</ThemedText>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#10B981" />
            <ThemedText style={styles.statValue}>₹ 12,500</ThemedText>
            <ThemedText style={styles.statLabel}>This Week Revenue</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  scroll: { padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  greeting: { fontSize: 16, color: '#9CA3AF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  logoutBtn: { padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12 },
  statsGrid: { flexDirection: 'row', gap: 16 },
  statCard: { flex: 1, backgroundColor: '#111827', padding: 20, borderRadius: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 12 },
  statLabel: { fontSize: 14, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },
});
`;
fs.writeFileSync(path.join(partnerTabsDir, 'index.tsx'), partnerIndexContent);
console.log("Created (partner-tabs)/index.tsx");

// 3. Create scanner.tsx
const partnerScannerContent = `import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { QrCode, Camera } from 'lucide-react-native';

export default function PartnerScanner() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Scan Check-in</ThemedText>
        <ThemedText style={styles.subtitle}>Scan member's QR code to mark attendance</ThemedText>
      </View>

      <View style={styles.scannerShell}>
        <QrCode size={100} color="#3B82F6" style={{ opacity: 0.5 }} />
        <TouchableOpacity style={styles.activateBtn}>
          <Camera size={20} color="#FFF" style={{ marginRight: 8 }} />
          <ThemedText style={styles.btnText}>Tap to open Camera</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19', padding: 24, paddingTop: 60 },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  subtitle: { fontSize: 16, color: '#9CA3AF', marginTop: 8 },
  scannerShell: { flex: 1, backgroundColor: '#111827', borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(59, 130, 246, 0.2)', borderStyle: 'dashed' },
  activateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B82F6', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, marginTop: 32 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
`;
fs.writeFileSync(path.join(partnerTabsDir, 'scanner.tsx'), partnerScannerContent);
console.log("Created (partner-tabs)/scanner.tsx");

// 4. Create settlements.tsx
const partnerSettlementsContent = `import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PartnerSettlements() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Settlements</ThemedText>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.invoiceCard}>
          <View style={styles.row}>
            <ThemedText style={styles.date}>July 09, 2026</ThemedText>
            <View style={styles.badge}><ThemedText style={styles.badgeTxt}>COMPLETED</ThemedText></View>
          </View>
          <ThemedText style={styles.amount}>₹ 12,500.00</ThemedText>
          <ThemedText style={styles.desc}>Platform Fee Deducted: ₹ 1,875</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19', padding: 24, paddingTop: 60 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  list: { paddingBottom: 100 },
  invoiceCard: { backgroundColor: '#111827', padding: 20, borderRadius: 16, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  date: { color: '#9CA3AF', fontSize: 14 },
  badge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeTxt: { color: '#10B981', fontSize: 10, fontWeight: 'bold' },
  amount: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  desc: { color: '#6B7280', fontSize: 12, marginTop: 8 }
});
`;
fs.writeFileSync(path.join(partnerTabsDir, 'settlements.tsx'), partnerSettlementsContent);
console.log("Created (partner-tabs)/settlements.tsx");

// 5. Update _layout.tsx in root
const layoutPath = path.join(appDir, '_layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (!layoutContent.includes('user?.role === \'PARTNER\'')) {
    layoutContent = layoutContent.replace(
        'const { isAuthenticated, isLoading } = useAuth();',
        'const { isAuthenticated, isLoading, user } = useAuth();'
    );
    
    const routingLogic = `
    if (!isAuthenticated && !isLoginScreen) {
      router.replace('/login');
    } else if (isAuthenticated && isLoginScreen) {
      if (user?.role === 'PARTNER') {
        router.replace('/(partner-tabs)');
      } else {
        router.replace('/(tabs)');
      }
    }
    `;
    layoutContent = layoutContent.replace(
        /if \(\!isAuthenticated[\s\S]*?router\.replace\('\/\(tabs\)'\);\n    \}/,
        routingLogic
    );
    fs.writeFileSync(layoutPath, layoutContent);
    console.log("Updated root _layout.tsx for Partner routing");
}
