import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type QuickAction = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  href?: '/(tabs)/perizinan' | '/(tabs)/explore' | '/(tabs)/community' | '/(tabs)/profile';
  onPress?: () => void;
};

const quickActions: QuickAction[] = [
  {
    title: 'Perizinan',
    icon: 'task',
    color: '#1f70ff',
    href: '/(tabs)/perizinan',
  },
  {
    title: 'Program',
    icon: 'playlist-add-check',
    color: '#15a362',
    href: '/(tabs)/explore',
  },
  {
    title: 'Pelaporan',
    icon: 'fact-check',
    color: '#ff8b38',
    onPress: () => Alert.alert('Pelaporan', 'Fitur pelaporan sedang dipersiapkan.'),
  },
  {
    title: 'Pelatihan',
    icon: 'menu-book',
    color: '#7358ff',
    href: '/(tabs)/community',
  },
  {
    title: 'KUR',
    icon: 'account-balance',
    color: '#0fb4c6',
    href: '/(tabs)/explore',
  },
  {
    title: 'Forum',
    icon: 'forum',
    color: '#f04461',
    href: '/(tabs)/community',
  },
];

type NewsItem = {
  title: string;
  summary: string;
  date: string;
  image: ImageSourcePropType;
};

const newsItems: NewsItem[] = [
  {
    title: 'Pelatihan Digital Marketing Batch 2',
    summary: 'Optimalkan pemasaran daring UMKM dengan sesi praktik bersama mentor tersertifikasi.',
    date: '20 Oktober 2025',
    image: require('@/assets/images/orang-jualan-1.png'),
  },
  {
    title: 'Forum Kolaborasi UMKM Kuliner',
    summary: 'Diskusi tren kemasan ramah lingkungan dan strategi penjualan lintas platform.',
    date: '18 Oktober 2025',
    image: require('@/assets/images/orang-jualan-2.png'),
  },
  {
    title: 'Program KUR Khusus Musiman',
    summary: 'Ajukan akses permodalan dengan fasilitas tenor fleksibel bagi usaha musiman.',
    date: '15 Oktober 2025',
    image: require('@/assets/images/orang-jualan-3.png'),
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoRow}>
            <MaterialIcons name="storefront" size={26} color="#0a7ea4" />
            <ThemedText type="title" style={styles.logoText}>
              Sapa UMKM
            </ThemedText>
          </View>
          <ThemedText style={styles.headerGreeting}>Halo, Rahmat!</ThemedText>
        </View>
        <Pressable
          onPress={() => Alert.alert('Notifikasi', 'Belum ada notifikasi terbaru.')}
          style={styles.notificationButton}>
          <MaterialIcons name="notifications-none" size={24} color="#0a7ea4" />
        </Pressable>
      </View>

      <ThemedView style={styles.bannerWrapper}>
        <Image
          source={require('@/assets/images/gambar-banner.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </ThemedView>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Menu Fitur Utama
        </ThemedText>
        <View style={styles.actionGrid}>
          {quickActions.map(action => (
            <Pressable
              key={action.title}
              onPress={() => {
                if (action.href) {
                  router.push(action.href);
                } else if (action.onPress) {
                  action.onPress();
                }
              }}
              style={({ pressed }) => [styles.actionButton, pressed && styles.cardPressed]}>
              <View style={[styles.actionIconWrapper, { backgroundColor: action.color }]}>
                <MaterialIcons name={action.icon} size={28} color="#ffffff" />
              </View>
              <ThemedText style={styles.actionLabel}>{action.title}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Kegiatan Terakhir
        </ThemedText>
        <ThemedView style={styles.activityCard}>
          <View style={styles.activityRow}>
            <MaterialIcons name="assignment" size={24} color="#0a7ea4" />
            <View style={styles.activityBody}>
              <ThemedText type="defaultSemiBold" style={styles.activityText}>
                Pelaporan usaha terakhir: Minggu lalu
              </ThemedText>
              <ThemedText style={styles.activityMeta}>Status: Menunggu verifikasi petugas</ThemedText>
            </View>
          </View>
          <Pressable
            style={styles.detailButton}
            onPress={() => Alert.alert('Aktivitas Terakhir', 'Detail aktivitas akan tersedia segera.')}
          >
            <ThemedText style={styles.detailButtonText}>Lihat Detail Aktivitas</ThemedText>
          </Pressable>
        </ThemedView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Berita & Pelatihan Terbaru
          </ThemedText>
          <Pressable
            style={styles.seeAllButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <ThemedText style={styles.seeAllButtonText}>Lihat Semua</ThemedText>
          </Pressable>
        </View>
        <View style={styles.newsList}>
          {newsItems.map(item => (
            <ThemedView key={item.title} style={styles.newsCard}>
              <Image source={item.image} style={styles.newsImage} resizeMode="cover" />
              <View style={styles.newsContent}>
                <ThemedText type="defaultSemiBold" style={styles.newsTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.newsSummary}>{item.summary}</ThemedText>
                <ThemedText style={styles.newsMeta}>{item.date}</ThemedText>
              </View>
            </ThemedView>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    gap: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  headerGreeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181c',
  },
  notificationButton: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: '#e0f4fa',
  },
  bannerWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181c',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  actionButton: {
    width: '30%',
    alignItems: 'center',
    gap: 10,
  },
  cardPressed: {
    opacity: 0.85,
  },
  actionIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 14,
    textAlign: 'center',
    color: '#11181c',
  },
  activityCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#f7fbff',
    gap: 16,
    borderWidth: 1,
    borderColor: '#d9ecf5',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityBody: {
    flex: 1,
    gap: 6,
  },
  activityText: {
    fontSize: 15,
    color: '#11181c',
  },
  activityMeta: {
    fontSize: 13,
    color: '#687076',
  },
  detailButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#0a7ea4',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  detailButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsList: {
    gap: 14,
  },
  newsCard: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e4eef2',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  newsImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  newsContent: {
    flex: 1,
    gap: 6,
  },
  newsTitle: {
    fontSize: 15,
    color: '#11181c',
  },
  newsSummary: {
    fontSize: 13,
    color: '#687076',
    lineHeight: 18,
  },
  newsMeta: {
    fontSize: 12,
    color: '#4091a8',
    fontWeight: '600',
  },
  seeAllButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#e0f4fa',
  },
  seeAllButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0a7ea4',
  },
});
