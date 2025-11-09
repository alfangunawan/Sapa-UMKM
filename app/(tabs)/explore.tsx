import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const menuItems = [
  {
    id: 'kur',
    title: 'Kredit Usaha Rakyat (KUR)',
    icon: 'volunteer-activism' as const,
  },
  {
    id: 'umi',
    title: 'Pembiayaan Ultra Mikro (UMi)',
    icon: 'account-balance' as const,
  },
  {
    id: 'lpdb',
    title: 'Dana Bergulir (LPDB)',
    icon: 'account-balance-wallet' as const,
  },
  {
    id: 'inkubasi',
    title: 'Inkubasi & Bimbingan',
    icon: 'emoji-objects' as const,
  },
];

const joinedPrograms = [
  {
    id: 'kur-001',
    name: 'KUR Mikro BRI',
    status: 'Diajukan' as const,
    date: '12 Okt 2025',
  },
  {
    id: 'umi-002',
    name: 'UMi PT Pegadaian',
    status: 'Diverifikasi' as const,
    date: '03 Nov 2025',
  },
  {
    id: 'lpdb-003',
    name: 'LPDB Koperasi',
    status: 'Diterima' as const,
    date: '21 Sep 2025',
  },
  {
    id: 'ink-004',
    name: 'Inkubasi Nasional',
    status: 'Ditolak' as const,
    date: '08 Agu 2025',
  },
];

const bannerSource = require('@/assets/images/banner-program.png');

const statusStyles = {
  Diajukan: { label: 'Diajukan', background: '#fef3c7', color: '#b45309' },
  Diverifikasi: { label: 'Diverifikasi', background: '#dbeafe', color: '#1d4ed8' },
  Diterima: { label: 'Diterima', background: '#dcfce7', color: '#15803d' },
  Ditolak: { label: 'Ditolak', background: '#fee2e2', color: '#b91c1c' },
} as const;

export default function ProgramScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.appBar}>
        <Pressable
          onPress={() => router.push('/(tabs)/index')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="arrow-back" size={22} color="#0a7ea4" />
        </Pressable>
        <ThemedText type="defaultSemiBold" style={styles.appBarTitle}>
          Program Pemberdayaan
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Panduan Program', 'Pelajari kriteria dan langkah pengajuan program pemberdayaan UMKM di pusat bantuan.')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="info-outline" size={22} color="#0a7ea4" />
        </Pressable>
      </View>

      <ThemedView style={styles.bannerWrapper}>
        <Image
          source={bannerSource}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </ThemedView>

      <View style={styles.menuSection}>
        {menuItems.map(item => (
          <Pressable
            key={item.id}
            onPress={() => router.push(`/programs/${item.id}`)}
            style={({ pressed }) => [styles.menuCard, pressed && styles.menuCardPressed]}
          >
            <View style={styles.menuIconWrapper}>
              <MaterialIcons name={item.icon} size={22} color="#0a7ea4" />
            </View>
            <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
          </Pressable>
        ))}
      </View>

      <ThemedView style={styles.historySection}>
        <View style={styles.historyHeader}>
          <ThemedText type="defaultSemiBold" style={styles.historyTitle}>
            Program yang Diikuti
          </ThemedText>
          <ThemedText style={styles.historySubtitle}>
            Lihat status pengajuan terbaru Anda.
          </ThemedText>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
          <View style={styles.historyRow}>
            {joinedPrograms.map(program => {
              const badge = statusStyles[program.status];
              return (
                <ThemedView key={program.id} style={styles.historyCard}>
                  <ThemedText type="defaultSemiBold" style={styles.historyProgram}>
                    {program.name}
                  </ThemedText>
                  <View style={[styles.statusBadge, { backgroundColor: badge.background }]}> 
                    <ThemedText style={[styles.statusLabel, { color: badge.color }]}>
                      {badge.label}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.historyDate}>{program.date}</ThemedText>
                  <Pressable
                    onPress={() => Alert.alert(program.name, 'Detail status program akan ditampilkan (mock).')}
                    style={({ pressed }) => [styles.historyButton, pressed && styles.pressed]}
                  >
                    <ThemedText style={styles.historyButtonText}>Lihat Detail</ThemedText>
                  </Pressable>
                </ThemedView>
              );
            })}
          </View>
        </ScrollView>
      </ThemedView>

      <ThemedView style={styles.footerCard}>
        <ThemedText style={styles.footerTitle}>
          Belum tahu program yang cocok?
        </ThemedText>
        <ThemedText style={styles.footerSubtitle}>
          Coba panduan “Pilih Program Sesuai Usaha Anda”.
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Panduan Program', 'Panduan pemilihan program akan segera tersedia (mock).')}
          style={({ pressed }) => [styles.footerButton, pressed && styles.pressed]}
        >
          <ThemedText style={styles.footerButtonText}>Mulai Panduan</ThemedText>
        </Pressable>
      </ThemedView>
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
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#0f172a',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f4fa',
  },
  pressed: {
    opacity: 0.85,
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
  bannerWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f0f8ff',
  },
  menuSection: {
    gap: 14,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuCardPressed: {
    transform: [{ translateY: 1 }],
  },
  menuIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f4fa',
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  historySection: {
    gap: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyHeader: {
    gap: 4,
  },
  historyTitle: {
    fontSize: 16,
    color: '#0f172a',
  },
  historySubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  historyScroll: {
    marginHorizontal: -4,
  },
  historyRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  historyCard: {
    width: 210,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyProgram: {
    fontSize: 15,
    color: '#0f172a',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 12,
    color: '#64748b',
  },
  historyButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#0a7ea4',
  },
  historyButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  footerCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#eef6ff',
  },
  footerTitle: {
    fontSize: 14,
    color: '#0f172a',
  },
  footerSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
  },
  footerButton: {
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#0a7ea4',
  },
  footerButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
