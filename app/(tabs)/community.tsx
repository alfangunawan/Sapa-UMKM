import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type TrainingCategory = 'Keuangan' | 'Pemasaran' | 'Manajemen';
type DeliveryMode = 'Online' | 'Offline';

type OfficialTraining = {
  id: string;
  title: string;
  category: TrainingCategory;
  date: string;
  location: DeliveryMode;
  description: string;
  banner: number;
};

type ElearningModule = {
  id: string;
  title: string;
  duration: string;
  progress: number;
  status: 'OnGoing' | 'Completed' | 'NotStarted';
  type: 'Video' | 'Artikel' | 'Kuis';
  badges: string[];
  cover: number;
};

const trainingBanners = {
  finance: require('@/assets/images/acara-manajemen-keuangan.png'),
  marketing: require('@/assets/images/acara-branding.png'),
  management: require('@/assets/images/acara-leadership.png'),
};

const officialTrainings: OfficialTraining[] = [
  {
    id: 'finance-1',
    title: 'Manajemen Keuangan UMKM Terintegrasi',
    category: 'Keuangan',
    date: '15 Nov 2025',
    location: 'Online',
    description: 'Optimalkan cashflow dan laporan keuangan usaha Anda.',
    banner: trainingBanners.finance,
  },
  {
    id: 'marketing-1',
    title: 'Strategi Branding Digital untuk UMKM',
    category: 'Pemasaran',
    date: '22 Nov 2025',
    location: 'Offline',
    description: 'Bangun identitas merek di marketplace dan media sosial.',
    banner: trainingBanners.marketing,
  },
  {
    id: 'management-1',
    title: 'Leadership & SDM untuk Usaha Kecil',
    category: 'Manajemen',
    date: '3 Des 2025',
    location: 'Online',
    description: 'Pelajari manajemen tim dan SOP operasional sederhana.',
    banner: trainingBanners.management,
  },
];

const elearningCovers = {
  marketing: require('@/assets/images/orang-jualan-1.png'),
  packaging: require('@/assets/images/orang-jualan-2.png'),
  finance: require('@/assets/images/orang-jualan-3.png'),
  management: require('@/assets/images/orang-jualan-4.png'),
};

const elearningModules: ElearningModule[] = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Dasar',
    duration: '20 menit',
    progress: 60,
    status: 'OnGoing',
    type: 'Video',
    badges: ['Video', 'Kuis', 'Sertifikat'],
    cover: elearningCovers.marketing,
  },
  {
    id: 'packaging-strategy',
    title: 'Strategi Pengemasan Produk',
    duration: '25 menit',
    progress: 0,
    status: 'NotStarted',
    type: 'Artikel',
    badges: ['Artikel', 'Checklist'],
    cover: elearningCovers.packaging,
  },
  {
    id: 'cashflow-quick',
    title: 'Cashflow Harian Praktis',
    duration: '18 menit',
    progress: 100,
    status: 'Completed',
    type: 'Video',
    badges: ['Video', '✅ Selesai'],
    cover: elearningCovers.finance,
  },
  {
    id: 'team-briefing',
    title: 'Briefing Tim 15 Menit',
    duration: '12 menit',
    progress: 40,
    status: 'OnGoing',
    type: 'Kuis',
    badges: ['Kuis', 'Checklist'],
    cover: elearningCovers.management,
  },
];

const categoryColors: Record<TrainingCategory, string> = {
  Keuangan: '#16a34a',
  Pemasaran: '#f97316',
  Manajemen: '#1d4ed8',
};

const moduleTypeColors: Record<ElearningModule['type'], string> = {
  Video: '#1d4ed8',
  Artikel: '#475569',
  Kuis: '#f97316',
};

type ActiveTab = 'official' | 'elearning';
type ElearningTab = 'ongoing' | 'completed';

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('official');
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory | 'Semua'>('Semua');
  const [modeFilter, setModeFilter] = useState<DeliveryMode>('Online');
  const [elearningFilter, setElearningFilter] = useState<ElearningTab>('ongoing');
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  const filteredTrainings = useMemo(() => {
    return officialTrainings.filter(item => {
      const categoryMatch = selectedCategory === 'Semua' || item.category === selectedCategory;
      const modeMatch = item.location === modeFilter;
      return categoryMatch && modeMatch;
    });
  }, [modeFilter, selectedCategory]);

  const filteredModules = useMemo(() => {
    return elearningModules.filter(item => {
      if (elearningFilter === 'ongoing') {
        return item.status === 'OnGoing' || item.status === 'NotStarted';
      }
      return item.status === 'Completed';
    });
  }, [elearningFilter]);

  const stickyIndices = [1];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      stickyHeaderIndices={stickyIndices}>
      <ThemedView style={styles.header}>
        <View style={styles.appBar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <MaterialIcons name="arrow-back" size={22} color="#1f2933" />
          </Pressable>
          <ThemedText type="title" style={styles.appBarTitle}>
            Kompetensi & Pelatihan
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert(
                'Tentang Kompetensi',
                'Akses pelatihan resmi dan modul mandiri untuk meningkatkan kapasitas usaha Anda.'
              )}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <MaterialIcons name="info" size={22} color="#1f2933" />
          </Pressable>
        </View>
        <ThemedText style={styles.subtitle}>
          Cari pelatihan terkurasi dari KemenKopUKM atau lanjutkan modul e-learning mandiri Anda.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.tabSwitch}>
        <TabButton
          label="Pelatihan Resmi"
          active={activeTab === 'official'}
          icon="apartment"
          onPress={() => setActiveTab('official')}
        />
        <TabButton
          label="E-Learning Mandiri"
          active={activeTab === 'elearning'}
          icon="cast-for-education"
          onPress={() => setActiveTab('elearning')}
        />
      </ThemedView>

      {activeTab === 'official' ? (
        <View style={styles.sectionGap}>
          <ThemedView style={styles.filterCard}>
            <View style={styles.filterRow}>
              <View style={styles.filterColumn}>
                <ThemedText type="defaultSemiBold" style={styles.filterLabel}>
                  Kategori
                </ThemedText>
                <Pressable
                  onPress={() => setCategoryPickerOpen(!categoryPickerOpen)}
                  style={({ pressed }) => [styles.dropdownTrigger, pressed && styles.dropdownTriggerPressed]}>
                  <ThemedText>
                    {selectedCategory === 'Semua' ? 'Semua Kategori' : selectedCategory}
                  </ThemedText>
                  <MaterialIcons name="expand-more" size={20} color="#475569" />
                </Pressable>
                {categoryPickerOpen ? (
                  <View style={styles.dropdownList}>
                    {(['Semua', 'Keuangan', 'Pemasaran', 'Manajemen'] as const).map(option => (
                      <Pressable
                        key={option}
                        onPress={() => {
                          setSelectedCategory(option as TrainingCategory | 'Semua');
                          setCategoryPickerOpen(false);
                        }}
                        style={({ pressed }) => [
                          styles.dropdownItem,
                          pressed && styles.dropdownItemPressed,
                        ]}>
                        <ThemedText>{option}</ThemedText>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>

              <View style={styles.filterColumn}>
                <ThemedText type="defaultSemiBold" style={styles.filterLabel}>
                  Mode
                </ThemedText>
                <View style={styles.toggleRow}>
                  <Switch
                    value={modeFilter === 'Online'}
                    onValueChange={value => setModeFilter(value ? 'Online' : 'Offline')}
                  />
                  <ThemedText style={styles.toggleText}>
                    {modeFilter === 'Online' ? 'Online' : 'Offline'}
                  </ThemedText>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => Alert.alert('Cari Pelatihan', 'Filter pencarian diterapkan.')}
              style={({ pressed }) => [styles.searchButton, pressed && styles.buttonPressed]}>
              <MaterialIcons name="search" size={20} color="#ffffff" />
              <ThemedText style={styles.searchButtonText}>Cari Pelatihan</ThemedText>
            </Pressable>
          </ThemedView>

          {filteredTrainings.map(training => (
            <Pressable
              key={training.id}
              onPress={() =>
                router.push({
                  pathname: '/pelatihan/detail',
                  params: { id: training.id },
                })
              }
              style={({ pressed }) => [styles.trainingCard, pressed && styles.trainingCardPressed]}>
              <Image source={training.banner} style={styles.trainingBanner} resizeMode="cover" />
              <View style={styles.trainingContent}>
                <View style={styles.trainingHeader}>
                  <View style={[styles.categoryDot, { backgroundColor: categoryColors[training.category] }]} />
                  <ThemedText type="defaultSemiBold" style={styles.trainingTitle}>
                    {training.title}
                  </ThemedText>
                </View>
                <View style={styles.trainingMetaRow}>
                  <MetaBadge icon="apartment" label="KemenKopUKM" />
                  <MetaBadge icon="schedule" label={training.date} />
                  <MetaBadge icon="place" label={training.location} />
                </View>
                <ThemedText style={styles.trainingDescription}>{training.description}</ThemedText>
                <Pressable
                  onPress={() =>
                    Alert.alert('Daftar Pelatihan', 'Pendaftaran terkirim. Status menunggu konfirmasi.')}
                  style={({ pressed }) => [styles.enrollButton, pressed && styles.buttonPressed]}>
                  <ThemedText style={styles.enrollText}>Daftar</ThemedText>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.sectionGap}>
          <ThemedView style={styles.elearningHeader}>
            <View style={styles.elearningTabs}>
              <Pressable
                onPress={() => setElearningFilter('ongoing')}
                style={({ pressed }) => [
                  styles.elearningTab,
                  elearningFilter === 'ongoing' && styles.elearningTabActive,
                  pressed && styles.buttonPressed,
                ]}>
                <ThemedText
                  style={
                    elearningFilter === 'ongoing'
                      ? styles.elearningTabTextActive
                      : styles.elearningTabText
                  }>
                  Sedang Berjalan
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setElearningFilter('completed')}
                style={({ pressed }) => [
                  styles.elearningTab,
                  elearningFilter === 'completed' && styles.elearningTabActive,
                  pressed && styles.buttonPressed,
                ]}>
                <ThemedText
                  style={
                    elearningFilter === 'completed'
                      ? styles.elearningTabTextActive
                      : styles.elearningTabText
                  }>
                  Selesai
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>

          <View style={styles.moduleGrid}>
            {filteredModules.map(module => (
              <Pressable
                key={module.id}
                onPress={() =>
                  router.push({
                    pathname: '/elearning/detail',
                    params: { id: module.id },
                  })
                }
                style={({ pressed }) => [styles.moduleCard, pressed && styles.trainingCardPressed]}>
                <Image source={module.cover} style={styles.moduleCover} resizeMode="cover" />
                <View style={styles.moduleContent}>
                  <ThemedText type="defaultSemiBold" style={styles.moduleTitle}>
                    {module.title}
                  </ThemedText>
                  <ThemedText style={styles.moduleDuration}>{module.duration}</ThemedText>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[styles.progressBarFill, { width: `${module.progress}%` }]}
                    />
                  </View>
                  <ThemedText style={styles.moduleProgressLabel}>
                    Progress: {module.progress}%
                  </ThemedText>
                  <View style={styles.badgeRow}>
                    {module.badges.map(badge => (
                      <View
                        key={badge}
                        style={[styles.badge, badgeStyle(badge, module.type)]}>
                        <ThemedText style={styles.badgeText}>{badge}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

type TabButtonProps = {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  active: boolean;
  onPress: () => void;
};

function TabButton({ label, icon, active, onPress }: TabButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabButton,
        active && styles.tabButtonActive,
        pressed && styles.buttonPressed,
      ]}>
      <MaterialIcons
        name={icon}
        size={18}
        color={active ? '#ffffff' : '#1f2933'}
      />
      <ThemedText style={active ? styles.tabButtonTextActive : styles.tabButtonText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

type MetaBadgeProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

function MetaBadge({ icon, label }: MetaBadgeProps) {
  return (
    <View style={styles.metaBadge}>
      <MaterialIcons name={icon} size={14} color="#0f172a" />
      <ThemedText style={styles.metaBadgeText}>{label}</ThemedText>
    </View>
  );
}

function badgeStyle(badge: string, type: ElearningModule['type']) {
  if (badge.includes('✅')) {
    return { backgroundColor: 'rgba(22, 163, 74, 0.18)' };
  }
  const color = moduleTypeColors[type];
  return { backgroundColor: `${color}1A` };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingBottom: 32,
    gap: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 2,
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
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  iconButtonPressed: {
    opacity: 0.85,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  tabSwitch: {
    marginHorizontal: 20,
    marginTop: -24,
    padding: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 6,
    zIndex: 1,
  },
  tabButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: '#1d4ed8',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#1f2933',
    fontWeight: '600',
  },
  tabButtonTextActive: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  sectionGap: {
    paddingHorizontal: 20,
    gap: 18,
  },
  filterCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 16,
  },
  filterColumn: {
    flex: 1,
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    color: '#475569',
  },
  dropdownTrigger: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerPressed: {
    backgroundColor: '#f1f5f9',
  },
  dropdownList: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
  },
  dropdownItemPressed: {
    backgroundColor: '#f8fafc',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleText: {
    fontSize: 13,
    color: '#1f2937',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1d4ed8',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  trainingCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  trainingCardPressed: {
    opacity: 0.9,
  },
  trainingBanner: {
    width: '100%',
    height: 120,
  },
  trainingContent: {
    padding: 16,
    gap: 12,
  },
  trainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  trainingTitle: {
    fontSize: 16,
  },
  trainingMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trainingDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  enrollButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1d4ed8',
  },
  enrollText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  metaBadgeText: {
    fontSize: 12,
    color: '#0f172a',
  },
  elearningHeader: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  elearningTabs: {
    flexDirection: 'row',
    gap: 10,
  },
  elearningTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
  },
  elearningTabActive: {
    backgroundColor: '#1d4ed8',
  },
  elearningTabText: {
    fontSize: 14,
    color: '#1f2933',
    fontWeight: '600',
  },
  elearningTabTextActive: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  moduleCard: {
    width: '47%',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  moduleCover: {
    width: '100%',
    height: 96,
  },
  moduleContent: {
    padding: 14,
    gap: 10,
  },
  moduleTitle: {
    fontSize: 14,
  },
  moduleDuration: {
    fontSize: 12,
    color: '#475569',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
  },
  moduleProgressLabel: {
    fontSize: 12,
    color: '#1f2937',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    color: '#0f172a',
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
