import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors, BottomTabInset } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import {
  Trophy,
  Plus,
  Clock,
  Users,
  Flame,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Zap,
  Award,
  Footprints,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CommunityChallenge {
  id: string;
  tag: string;
  heroText: string;
  title: string;
  description: string;
  daysLeft: number;
  participants: string;
  image: string;
  joined: boolean;
}

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme] ?? Colors.dark;

  const [dailySteps, setDailySteps] = useState(5420);
  const [completedWorkouts, setCompletedWorkouts] = useState(4);

  const [communityChallenges, setCommunityChallenges] = useState<CommunityChallenge[]>([
    {
      id: 'c1',
      tag: 'Walk Away',
      heroText: '8K\nSTEPS CHALLENGE',
      title: 'August 8k Steps Challenge',
      description: 'Ace 8k steps/day for 100 Empire Coins',
      daysLeft: 22,
      participants: '11.4k Participants',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop',
      joined: true,
    },
    {
      id: 'c2',
      tag: 'Fitness',
      heroText: 'I WORKOUT\nREGULARLY\nCHALLENGE',
      title: 'August Workout Streak',
      description: 'Attend at least 6 workouts this month',
      daysLeft: 22,
      participants: '10.8k Participants',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop',
      joined: true,
    },
    {
      id: 'c3',
      tag: 'Endurance',
      heroText: '10K\nSTEPS CHALLENGE',
      title: 'August 10k Steps Challenge',
      description: 'Ace 10k steps/day',
      daysLeft: 22,
      participants: '11.2k Participants',
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop',
      joined: false,
    },
    {
      id: 'c4',
      tag: 'Strength',
      heroText: 'BEAST MODE\n100 PUSHUPS',
      title: '100 Daily Pushups Sprint',
      description: 'Hit 100 pushups across the day',
      daysLeft: 18,
      participants: '8.9k Participants',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop',
      joined: false,
    },
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'Aarav Sharma', score: '2,840 pts', streak: '24 days 🔥', avatar: '🥇' },
    { rank: 2, name: 'Priya Patel', score: '2,690 pts', streak: '21 days 🔥', avatar: '🥈' },
    { rank: 3, name: 'Kabir Mehta', score: '2,420 pts', streak: '19 days 🔥', avatar: '🥉' },
    { rank: 4, name: 'You (Rahul)', score: '2,150 pts', streak: '16 days 🔥', avatar: '⭐', isUser: true },
    { rank: 5, name: 'Sneha Verma', score: '1,980 pts', streak: '14 days 🔥', avatar: '🏃‍♀️' },
  ]);

  const toggleJoin = (id: string) => {
    setCommunityChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextState = !c.joined;
          Alert.alert(
            nextState ? 'Challenge Joined! 🎯' : 'Left Challenge',
            nextState
              ? `You've joined "${c.title}". Complete milestones to earn Empire Coins!`
              : `You have left "${c.title}".`
          );
          return { ...c, joined: nextState };
        }
        return c;
      })
    );
  };

  const handleAddSteps = () => {
    setDailySteps((prev) => {
      const next = prev + 500;
      if (next >= 8000 && prev < 8000) {
        Alert.alert('Goal Achieved! 🎉', 'You crushed the 8,000 steps daily milestone! +50 Empire Coins added.');
      }
      return next;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + BottomTabInset + 24,
        }}
      >
        {/* Top Hero Banner */}
        <View style={styles.heroBannerCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop',
            }}
            style={styles.heroBannerImage}
            resizeMode="cover"
          />
          <View style={styles.heroBannerOverlay} />

          <View style={styles.heroBannerContent}>
            <View style={styles.heroRibbon}>
              <ThemedText style={styles.heroRibbonText}>FITNESS SPRINT</ThemedText>
              <ThemedText style={styles.heroRibbonSub}>Win 5,000 Empire Coins 💰</ThemedText>
            </View>

            <TouchableOpacity
              style={styles.heroGetStartedBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/booking' as any)}
            >
              <ThemedText style={styles.heroGetStartedText}>Book Workout & Compete</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Step Counter Widget */}
        <View style={[styles.stepWidget, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Footprints size={18} color="#10B981" />
              <ThemedText style={{ fontSize: 14, fontWeight: '800' }}>Today's Steps</ThemedText>
            </View>
            <TouchableOpacity onPress={handleAddSteps} style={styles.addStepsBtn}>
              <Plus size={12} color="#10B981" />
              <ThemedText style={{ fontSize: 11, fontWeight: '800', color: '#10B981' }}>+500 Steps</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <ThemedText style={{ fontSize: 26, fontWeight: '900', color: colors.text }}>
              {dailySteps.toLocaleString()}
            </ThemedText>
            <ThemedText style={{ fontSize: 13, color: '#94A3B8' }}>/ 8,000 steps goal</ThemedText>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min((dailySteps / 8000) * 100, 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* Section 1: My Challenges */}
        <View style={styles.sectionHeaderRow}>
          <ThemedText style={styles.sectionTitle}>ACTIVE CHALLENGES</ThemedText>
          <TouchableOpacity
            style={styles.newChallengeBtn}
            onPress={() => Alert.alert('Challenges Roster', 'All active streaks and milestones are synced!')}
          >
            <Trophy size={14} color="#6C63FF" />
            <ThemedText style={styles.newChallengeText}>Streaks</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={[styles.myChallengeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.myChallengeTop}>
            <View style={styles.myChallengeIconBadge}>
              <ThemedText style={{ fontSize: 20 }}>💪</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.myChallengeTitle}>August Workout Streak</ThemedText>
              <ThemedText style={styles.myChallengeProgressText}>
                <ThemedText style={{ fontWeight: '800', color: colors.text }}>{completedWorkouts} </ThemedText>
                /6 workouts
              </ThemedText>
            </View>
            <ThemedText style={styles.completedTag}>ACTIVE</ThemedText>
          </View>

          {/* Segmented Progress Bar */}
          <View style={styles.progressSegments}>
            {[1, 2, 3, 4, 5, 6].map((seg) => (
              <View
                key={seg}
                style={[
                  styles.segmentBar,
                  { backgroundColor: seg <= completedWorkouts ? '#10B981' : colors.backgroundElement },
                ]}
              />
            ))}
          </View>

          {/* Rank Badge */}
          <View style={styles.rankRow}>
            <View style={styles.rankPill}>
              <ThemedText style={styles.rankPillLabel}>RANK</ThemedText>
              <TrendingUp size={12} color="#10B981" />
              <ThemedText style={styles.rankPillValue}>4th</ThemedText>
            </View>
            <ThemedText style={styles.rankSubtitle}>Top 4% in Bangalore Central</ThemedText>
          </View>
        </View>

        {/* Section 2: Community Challenges */}
        <View style={[styles.sectionHeaderRow, { marginTop: 20 }]}>
          <View>
            <ThemedText style={styles.communityMainTitle}>Community Challenges</ThemedText>
            <ThemedText style={styles.communitySubTitle}>Earn FitEmpire reward coins</ThemedText>
          </View>
        </View>

        {/* Community Challenges Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.communityScrollContent}
        >
          {communityChallenges.map((challenge) => (
            <View
              key={challenge.id}
              style={[styles.communityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              {/* Graphic Header */}
              <View style={styles.communityCardGraphic}>
                <Image source={{ uri: challenge.image }} style={styles.communityCardImage} />
                <View style={styles.communityCardOverlay} />
                <View style={styles.communityCardBadgeTag}>
                  <ThemedText style={styles.communityCardTagText}>{challenge.tag}</ThemedText>
                </View>
                <ThemedText style={styles.communityCardHeroText}>{challenge.heroText}</ThemedText>
              </View>

              {/* Card Body */}
              <View style={styles.communityCardBody}>
                <ThemedText style={styles.communityChallengeTitle} numberOfLines={1}>
                  {challenge.title}
                </ThemedText>
                <ThemedText style={styles.communityChallengeDesc} numberOfLines={1}>
                  {challenge.description}
                </ThemedText>

                <View style={styles.communityMetaRow}>
                  <Clock size={12} color="#94A3B8" />
                  <ThemedText style={styles.communityMetaText}>{challenge.daysLeft} days left</ThemedText>
                </View>

                <View style={styles.communityFooterRow}>
                  <ThemedText style={styles.participantsText}>{challenge.participants}</ThemedText>
                  <TouchableOpacity
                    style={[
                      styles.joinButton,
                      challenge.joined && styles.joinedButton,
                    ]}
                    onPress={() => toggleJoin(challenge.id)}
                    activeOpacity={0.8}
                  >
                    <ThemedText style={[styles.joinButtonText, challenge.joined && styles.joinedButtonText]}>
                      {challenge.joined ? 'Joined ✓' : 'Join'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Section 3: Live Leaderboard */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <ThemedText style={styles.sectionTitle}>CITY LEADERBOARD</ThemedText>
          <ThemedText style={{ fontSize: 11, color: '#38BDF8', fontWeight: '700' }}>Bangalore Hub</ThemedText>
        </View>

        <View style={[styles.leaderboardCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {leaderboard.map((user) => (
            <View
              key={user.rank}
              style={[
                styles.leaderboardRow,
                user.isUser && { backgroundColor: 'rgba(108, 99, 255, 0.15)', borderRadius: 12 },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ThemedText style={{ fontSize: 16 }}>{user.avatar}</ThemedText>
                <View>
                  <ThemedText style={{ fontSize: 13, fontWeight: user.isUser ? '900' : '700', color: user.isUser ? '#38BDF8' : colors.text }}>
                    {user.name}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 11, color: '#94A3B8' }}>{user.streak}</ThemedText>
                </View>
              </View>

              <ThemedText style={{ fontSize: 13, fontWeight: '800', color: '#10B981' }}>
                {user.score}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroBannerCard: {
    marginHorizontal: 16,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  heroBannerContent: {
    position: 'relative',
    alignItems: 'center',
    gap: 10,
  },
  heroRibbon: {
    alignItems: 'center',
  },
  heroRibbonText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
  },
  heroRibbonSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  heroGetStartedBtn: {
    backgroundColor: '#6C63FF',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGetStartedText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  stepWidget: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  addStepsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  newChallengeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newChallengeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C63FF',
  },
  myChallengeCard: {
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  myChallengeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  myChallengeIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myChallengeTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  myChallengeProgressText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  completedTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  progressSegments: {
    flexDirection: 'row',
    gap: 4,
  },
  segmentBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rankPillLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  rankPillValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },
  rankSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  communityMainTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  communitySubTitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  communityScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingTop: 8,
  },
  communityCard: {
    width: 240,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  communityCardGraphic: {
    height: 110,
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 10,
  },
  communityCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  communityCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  communityCardBadgeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  communityCardTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  communityCardHeroText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 16,
  },
  communityCardBody: {
    padding: 10,
    gap: 4,
  },
  communityChallengeTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  communityChallengeDesc: {
    fontSize: 10,
    color: '#94A3B8',
  },
  communityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  communityMetaText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  communityFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  participantsText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  joinButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  joinedButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  joinButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  joinedButtonText: {
    color: '#10B981',
  },
  leaderboardCard: {
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
