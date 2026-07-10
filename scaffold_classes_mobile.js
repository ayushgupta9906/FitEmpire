const fs = require('fs');
const path = require('path');

const tabsDir = path.join(__dirname, 'fitempire-mobile', 'src', 'app', '(tabs)');

const classesContent = `import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Calendar, Clock, MapPin, User as UserIcon } from 'lucide-react-native';

const dummyClasses = [
  { id: 1, name: 'Zumba Masterclass', trainer: 'Rahul Sharma', time: '05:00 PM', duration: '60 min', spots: 5, category: 'Cardio', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 2, name: 'Power Yoga', trainer: 'Anjali Desai', time: '07:00 AM', duration: '45 min', spots: 2, category: 'Flexibility', img: 'https://images.unsplash.com/photo-1599901860904-17e08627cba4?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 3, name: 'HIIT Explosion', trainer: 'Vikram Singh', time: '06:30 PM', duration: '45 min', spots: 12, category: 'Strength', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300&h=200' }
];

export default function ClassesScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Book a Class</ThemedText>
        <ThemedText style={styles.subtitle}>Find your next favorite workout</ThemedText>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {['All', 'Cardio', 'Strength', 'Yoga', 'Zumba'].map((cat, i) => (
          <TouchableOpacity key={i} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
            <ThemedText style={[styles.filterText, i === 0 && styles.filterTextActive]}>{cat}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {dummyClasses.map((item) => (
          <View key={item.id} style={styles.classCard}>
            <Image source={{ uri: item.img }} style={styles.classImg} />
            <View style={styles.classContent}>
              <View style={styles.classHeaderRow}>
                <ThemedText style={styles.className}>{item.name}</ThemedText>
                <View style={styles.categoryBadge}>
                  <ThemedText style={styles.categoryTxt}>{item.category}</ThemedText>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <UserIcon size={14} color="#6B7280" />
                <ThemedText style={styles.infoTxt}>{item.trainer}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Clock size={14} color="#6B7280" />
                <ThemedText style={styles.infoTxt}>{item.time} ({item.duration})</ThemedText>
              </View>

              <View style={styles.footerRow}>
                <ThemedText style={styles.spots}>{item.spots} spots left</ThemedText>
                <TouchableOpacity style={styles.bookBtn}>
                  <ThemedText style={styles.bookTxt}>Book Slot</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 60 },
  header: { paddingHorizontal: 24, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  filterScroll: { maxHeight: 50, marginBottom: 16 },
  filterContent: { paddingHorizontal: 24, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E5E7EB', height: 36, justifyContent: 'center' },
  filterChipActive: { backgroundColor: '#6C63FF' },
  filterText: { color: '#4B5563', fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  classCard: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  classImg: { width: '100%', height: 140 },
  classContent: { padding: 16 },
  classHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  className: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  categoryBadge: { backgroundColor: 'rgba(108, 99, 255, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoryTxt: { color: '#6C63FF', fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoTxt: { color: '#6B7280', marginLeft: 6, fontSize: 14 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  spots: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 },
  bookBtn: { backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  bookTxt: { color: '#FFF', fontWeight: 'bold' }
});
`;

fs.writeFileSync(path.join(tabsDir, 'classes.tsx'), classesContent);
console.log("Created classes.tsx");

// Update _layout.tsx
const layoutPath = path.join(tabsDir, '_layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (!layoutContent.includes('name="classes"')) {
    layoutContent = layoutContent.replace(
        'import { Home, Compass, Wallet, User, QrCode } from \'lucide-react-native\';',
        'import { Home, Compass, Wallet, User, QrCode, CalendarHeart } from \'lucide-react-native\';'
    );
    
    layoutContent = layoutContent.replace(
        '      <Tabs.Screen\n        name="ticket"',
        `      <Tabs.Screen
        name="classes"
        options={{
          title: 'Classes',
          tabBarIcon: ({ color, size }) => <CalendarHeart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="ticket"`
    );
    
    fs.writeFileSync(layoutPath, layoutContent);
    console.log("Updated user tabs layout to include Classes tab");
}
