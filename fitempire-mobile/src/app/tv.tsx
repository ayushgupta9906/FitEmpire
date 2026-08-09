import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  Play,
  Clock,
  Flame,
  Star,
  ArrowLeft,
  Tv,
  CheckCircle2,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const VIDEO_CLASSES = [
  {
    id: 'tv1',
    title: '30-Min High-Intensity FightCamp & Combat HIIT',
    trainer: 'Coach Vikram (MMA Fighter)',
    duration: '30 Mins',
    calories: '420 kcal',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&auto=format&fit=crop',
    viewers: '2.4k Active',
  },
  {
    id: 'tv2',
    title: '25-Min Fat Burning Cardio & Core Shred',
    trainer: 'Sarah Chen (Pro Athlete)',
    duration: '25 Mins',
    calories: '310 kcal',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop',
    viewers: '1.8k Active',
  },
  {
    id: 'tv3',
    title: 'Power Vinyasa Flow & Deep Mobility Release',
    trainer: 'Aanya Sharma (Yoga Master)',
    duration: '40 Mins',
    calories: '220 kcal',
    level: 'All Levels',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop',
    viewers: '3.1k Active',
  },
  {
    id: 'tv4',
    title: 'Spin & RPM Speed Intervals #24',
    trainer: 'David Lee (Cycling Coach)',
    duration: '35 Mins',
    calories: '490 kcal',
    level: 'High Intensity',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop',
    viewers: '980 Active',
  },
];

export default function TvScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [activeVideo, setActiveVideo] = useState(VIDEO_CLASSES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (video: any) => {
    setActiveVideo(video);
    setIsPlaying(true);
    Alert.alert('Streaming Live Workout 📺', `Playing "${video.title}". Connect Bluetooth audio or Chromecast to TV.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>FitEmpire TV</ThemedText>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <ThemedText style={styles.liveBadgeText}>ON DEMAND</ThemedText>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Featured Video Player Viewfinder */}
        <View style={styles.playerCard}>
          <Image source={{ uri: activeVideo.image }} style={styles.playerImage} resizeMode="cover" />
          <View style={styles.playerOverlay} />

          <TouchableOpacity
            style={styles.bigPlayBtn}
            onPress={() => handlePlay(activeVideo)}
            activeOpacity={0.85}
          >
            <Play size={28} color="#FFF" fill="#FFF" />
          </TouchableOpacity>

          <View style={styles.playerBottom}>
            <View style={styles.levelTag}>
              <ThemedText style={styles.levelText}>{activeVideo.level}</ThemedText>
            </View>
            <ThemedText style={styles.playerTitle}>{activeVideo.title}</ThemedText>
            <ThemedText style={styles.playerTrainer}>Trainer: {activeVideo.trainer}</ThemedText>
          </View>
        </View>

        {/* Video Stats */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Clock size={16} color="#38BDF8" />
            <ThemedText style={styles.statVal}>{activeVideo.duration}</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Flame size={16} color="#EF4444" />
            <ThemedText style={styles.statVal}>{activeVideo.calories}</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Users size={16} color="#10B981" />
            <ThemedText style={styles.statVal}>{activeVideo.viewers}</ThemedText>
          </View>
        </View>

        {/* Library List */}
        <ThemedText style={styles.sectionHeading}>STREAM WORKOUT SESSIONS</ThemedText>
        <View style={{ gap: 12 }}>
          {VIDEO_CLASSES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.videoItemCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                activeVideo.id === item.id && { borderColor: '#6C63FF' },
              ]}
              onPress={() => handlePlay(item)}
              activeOpacity={0.8}
            >
              <View style={styles.thumbWrap}>
                <Image source={{ uri: item.image }} style={styles.thumb} />
                <View style={styles.thumbPlayIcon}>
                  <Play size={12} color="#FFF" fill="#FFF" />
                </View>
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <ThemedText style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.itemTrainer}>{item.trainer}</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <ThemedText style={styles.itemMeta}>⏱ {item.duration}</ThemedText>
                  <ThemedText style={[styles.itemMeta, { color: '#EF4444' }]}>🔥 {item.calories}</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  playerCard: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  playerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  bigPlayBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  playerBottom: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  levelTag: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
  },
  playerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFF',
  },
  playerTrainer: {
    fontSize: 11,
    color: '#A5B4FC',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  videoItemCard: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  thumbWrap: {
    width: 90,
    height: 65,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbPlayIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  itemTrainer: {
    fontSize: 10,
    color: '#94A3B8',
  },
  itemMeta: {
    fontSize: 10,
    color: '#38BDF8',
    fontWeight: '700',
  },
});
