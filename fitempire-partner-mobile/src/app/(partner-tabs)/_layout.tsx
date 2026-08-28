import React from 'react';
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
