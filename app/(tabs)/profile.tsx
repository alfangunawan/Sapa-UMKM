import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const bannerImage = require('@/assets/images/banner-profile.png');

type FeatureCardProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  actionText: string;
  onPress: () => void;
};

type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  status: 'Disetujui' | 'Diajukan' | 'Revisi' | 'Diverifikasi';
};

const activityHistory: ActivityItem[] = [
  {
    id: 'report-nov-2025',
    title: 'Laporan November 2025',
    meta: 'Status: Diverifikasi',
    status: 'Diverifikasi',
  },
  {
    id: 'profile-update',
    title: 'Profil Usaha diperbarui',
    meta: '2 minggu lalu',
    status: 'Disetujui',
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  const handleReportingNavigation = () => {
    router.push('/pelaporan/wizard');
  };

  const handleProfileUpdateNavigation = () => {
    router.push('/profile/edit');
  };

  const handleHelp = () => {
    Alert.alert(
      'Bantuan',
      'Gunakan menu pelaporan untuk mengirim data perkembangan usaha, dan menu pembaruan untuk memperbarui profil UMKM Anda.'
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.appBar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.canGoBack() ? router.back() : router.push('/')}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <MaterialIcons name="arrow-back" size={22} color="#1f2933" />
          </Pressable>
          <ThemedText type="title" style={styles.appBarTitle}>
            Pelaporan & Data Usaha
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={handleHelp}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <MaterialIcons name="info" size={22} color="#1f2933" />
          </Pressable>
        </View>

        <ThemedView style={styles.bannerCard}>
          <Image source={bannerImage} resizeMode="cover" style={styles.bannerImage} />
        </ThemedView>

        <View style={styles.sectionSpacing}>
          <FeatureCard
            icon="insert-chart"
            title="Pelaporan Kegiatan & Perkembangan Usaha"
            description="Kirim laporan rutin tentang aktivitas dan pendapatan usaha Anda."
            actionText="Lihat Detail"
            onPress={handleReportingNavigation}
          />
          <FeatureCard
            icon="storefront"
            title="Pembaruan Data Profil UMKM"
            description="Perbarui data usaha seperti alamat, sektor, dan skala agar tetap sesuai."
            actionText="Perbarui Sekarang"
            onPress={handleProfileUpdateNavigation}
          />
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <View style={styles.historyLabelRow}>
              <MaterialIcons name="history" size={18} color="#0a7ea4" />
              <ThemedText type="defaultSemiBold" style={styles.historyTitle}>
                Riwayat Aktivitas
              </ThemedText>
            </View>
            <ThemedText style={styles.historySubtitle}>
              Aktivitas terbaru dari pelaporan dan pembaruan profil Anda.
            </ThemedText>
          </View>

          {activityHistory.map(item => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function FeatureCard({ icon, title, description, actionText, onPress }: FeatureCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.featureCard,
        pressed ? styles.featureCardPressed : undefined,
      ]}>
      <View style={styles.featureIconContainer}>
        <MaterialIcons name={icon} size={24} color="#0a7ea4" />
      </View>
      <View style={styles.featureContent}>
        <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
          {title}
        </ThemedText>
        <ThemedText style={styles.featureDescription}>
          {description}
        </ThemedText>
        <View style={styles.featureActionRow}>
          <ThemedText style={styles.featureActionText}>{actionText}</ThemedText>
          <MaterialIcons name="chevron-right" size={20} color="#0a7ea4" />
        </View>
      </View>
    </Pressable>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <View style={styles.activityRow}>
      <View style={styles.activityContent}>
        <ThemedText type="defaultSemiBold" style={styles.activityTitle}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.activityMeta}>{item.meta}</ThemedText>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusColorMap[item.status] ?? statusColorMap.Diajukan }]}>
        <ThemedText style={styles.statusText}>{item.status}</ThemedText>
      </View>
    </View>
  );
}

const statusColorMap: Record<ActivityItem['status'], string> = {
  Disetujui: 'rgba(46, 204, 113, 0.18)',
  Diajukan: 'rgba(243, 156, 18, 0.18)',
  Revisi: 'rgba(231, 76, 60, 0.18)',
  Diverifikasi: 'rgba(39, 174, 96, 0.2)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  iconButtonPressed: {
    opacity: 0.85,
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
  bannerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: 160,
  },
  sectionSpacing: {
    gap: 14,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  featureCardPressed: {
    backgroundColor: '#eaf6fb',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(10, 126, 164, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    gap: 8,
  },
  featureTitle: {
    fontSize: 16,
  },
  featureDescription: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  featureActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  featureActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  historySection: {
    gap: 12,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },
  historyHeader: {
    gap: 6,
  },
  historyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyTitle: {
    fontSize: 16,
  },
  historySubtitle: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 18,
  },
  activityContent: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    fontSize: 15,
  },
  activityMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
});
