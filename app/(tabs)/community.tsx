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

type ForumThread = {
  id: string;
  title: string;
  author: string;
  role: string;
  timeAgo: string;
  replies: number;
  views: number;
  status: 'Open' | 'Resolved';
  excerpt: string;
  tags: string[];
  pinned?: boolean;
  lastActivity: string;
  lastActivityMinutes: number;
  engagementScore: number;
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

const forumThreads: ForumThread[] = [
  {
    id: 'legalitas-umkm',
    title: 'Tips mengurus legalitas usaha (NIB, Merek, Sertifikasi) dengan cepat',
    author: 'Rina Sari',
    role: 'Pendamping Koperasi',
    timeAgo: '2 jam lalu',
    replies: 18,
    views: 320,
    status: 'Open',
    excerpt: 'Bagikan pengalaman Anda mengurus NIB, merek, dan sertifikasi halal. Apa saja dokumen wajib?',
    tags: ['Legalitas', 'Perizinan'],
    pinned: true,
    lastActivity: 'Baru saja diperbarui oleh Dinas Koperasi',
    lastActivityMinutes: 15,
    engagementScore: 95,
  },
  {
    id: 'akses-pembiayaan',
    title: 'Akses pembiayaan UMKM: pengalaman KUR vs LPDB',
    author: 'Budi Santoso',
    role: 'Pelaku UMKM',
    timeAgo: '5 jam lalu',
    replies: 24,
    views: 410,
    status: 'Open',
    excerpt: 'Teman-teman, yuk diskusi mengenai strategi pengajuan KUR dan LPDB. Apa saja syarat yang perlu disiapkan?',
    tags: ['Pembiayaan', 'KUR'],
    lastActivity: '15 menit lalu oleh Rika',
    lastActivityMinutes: 35,
    engagementScore: 88,
  },
  {
    id: 'digital-marketing-sosmed',
    title: 'Strategi konten TikTok untuk produk kerajinan',
    author: 'Sinta Dewi',
    role: 'Pelaku UMKM',
    timeAgo: 'Kemarin',
    replies: 12,
    views: 265,
    status: 'Resolved',
    excerpt: 'Ada yang punya contoh konten viral? Bagaimana cara konsisten upload tanpa tim besar?',
    tags: ['Pemasaran', 'Konten'],
    lastActivity: '12 jam lalu oleh Admin Komunitas',
    lastActivityMinutes: 720,
    engagementScore: 72,
  },
  {
    id: 'manajemen-operasional',
    title: 'Menyusun SOP produksi yang sederhana dan efektif',
    author: 'Dimas Pratama',
    role: 'Pelaku UMKM',
    timeAgo: '3 hari lalu',
    replies: 7,
    views: 198,
    status: 'Open',
    excerpt: 'SOP seperti apa yang cocok untuk tim kecil (5 orang)? Mohon share format atau template ya!',
    tags: ['Operasional', 'Manajemen'],
    lastActivity: '1 hari lalu oleh Lia',
    lastActivityMinutes: 1440,
    engagementScore: 60,
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

const forumStatusColors: Record<ForumThread['status'], string> = {
  Open: '#1d4ed8',
  Resolved: '#16a34a',
};

type ActiveTab = 'official' | 'elearning' | 'forum';
type ElearningTab = 'ongoing' | 'completed';
type ForumFilter = 'trending' | 'recent' | 'open';

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('official');
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory | 'Semua'>('Semua');
  const [modeFilter, setModeFilter] = useState<DeliveryMode>('Online');
  const [elearningFilter, setElearningFilter] = useState<ElearningTab>('ongoing');
  const [forumFilter, setForumFilter] = useState<ForumFilter>('trending');
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

  const filteredThreads = useMemo(() => {
    const trending = [...forumThreads].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.engagementScore - a.engagementScore;
    });

    if (forumFilter === 'recent') {
      return [...forumThreads].sort((a, b) => a.lastActivityMinutes - b.lastActivityMinutes);
    }

    if (forumFilter === 'open') {
      return trending.filter(item => item.status === 'Open');
    }

    return trending;
  }, [forumFilter]);

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
        <TabButton
          label="Forum UMKM"
          active={activeTab === 'forum'}
          icon="forum"
          onPress={() => setActiveTab('forum')}
        />
      </ThemedView>

      {activeTab === 'official' && (
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
      )}

      {activeTab === 'elearning' && (
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

      {activeTab === 'forum' && (
        <View style={styles.sectionGap}>
          <ThemedView style={styles.forumHeader}>
            <View style={styles.forumHeaderRow}>
              <View>
                <ThemedText type="defaultSemiBold" style={styles.forumTitleIntro}>
                  Forum Komunikasi UMKM
                </ThemedText>
                <ThemedText style={styles.forumSubtitle}>
                  Diskusi bersama pendamping dan pelaku UMKM lain, berbagi solusi nyata.
                </ThemedText>
              </View>
              <Pressable
                onPress={() =>
                  Alert.alert(
                    'Mulai Diskusi',
                    'Fitur posting diskusi akan segera tersedia. Untuk sementara, bergabunglah pada topik yang ada ya!'
                  )}
                style={({ pressed }) => [styles.startThreadButton, pressed && styles.buttonPressed]}>
                <MaterialIcons name="add-circle-outline" size={20} color="#ffffff" />
                <ThemedText style={styles.startThreadText}>Mulai Diskusi</ThemedText>
              </Pressable>
            </View>

            <View style={styles.forumStatsRow}>
              <View style={styles.forumStatCard}>
                <MaterialIcons name="chat" size={20} color="#1d4ed8" />
                <View>
                  <ThemedText type="defaultSemiBold">{forumThreads.length}</ThemedText>
                  <ThemedText style={styles.forumStatLabel}>Topik Aktif</ThemedText>
                </View>
              </View>
              <View style={styles.forumStatCard}>
                <MaterialIcons name="groups" size={20} color="#16a34a" />
                <View>
                  <ThemedText type="defaultSemiBold">+180</ThemedText>
                  <ThemedText style={styles.forumStatLabel}>Anggota Berbagi</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.forumFilters}>
              <Pressable
                onPress={() => setForumFilter('trending')}
                style={({ pressed }) => [
                  styles.forumFilterChip,
                  forumFilter === 'trending' && styles.forumFilterChipActive,
                  pressed && styles.buttonPressed,
                ]}>
                <ThemedText
                  style={
                    forumFilter === 'trending'
                      ? styles.forumFilterTextActive
                      : styles.forumFilterText
                  }>
                  Trending
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setForumFilter('recent')}
                style={({ pressed }) => [
                  styles.forumFilterChip,
                  forumFilter === 'recent' && styles.forumFilterChipActive,
                  pressed && styles.buttonPressed,
                ]}>
                <ThemedText
                  style={
                    forumFilter === 'recent'
                      ? styles.forumFilterTextActive
                      : styles.forumFilterText
                  }>
                  Terbaru
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setForumFilter('open')}
                style={({ pressed }) => [
                  styles.forumFilterChip,
                  forumFilter === 'open' && styles.forumFilterChipActive,
                  pressed && styles.buttonPressed,
                ]}>
                <ThemedText
                  style={
                    forumFilter === 'open'
                      ? styles.forumFilterTextActive
                      : styles.forumFilterText
                  }>
                  Belum Terjawab
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>

          <View style={styles.forumList}>
            {filteredThreads.map(thread => (
              <Pressable
                key={thread.id}
                onPress={() =>
                  router.push({
                    pathname: '/forum/detail',
                    params: { id: thread.id },
                  })
                }
                style={({ pressed }) => [styles.forumCard, pressed && styles.trainingCardPressed]}>
                <View style={styles.forumCardHeader}>
                  <View style={styles.forumTitleWrapper}>
                    {thread.pinned ? (
                      <View style={styles.pinnedBadge}>
                        <MaterialIcons name="push-pin" size={14} color="#1d4ed8" />
                        <ThemedText style={styles.pinnedText}>Pinned</ThemedText>
                      </View>
                    ) : null}
                    <ThemedText type="defaultSemiBold" style={styles.forumCardTitle}>
                      {thread.title}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: `${forumStatusColors[thread.status]}1A` },
                    ]}>
                    <MaterialIcons
                      name={thread.status === 'Resolved' ? 'verified' : 'chat-bubble'}
                      size={14}
                      color={forumStatusColors[thread.status]}
                    />
                    <ThemedText
                      style={[styles.statusPillText, { color: forumStatusColors[thread.status] }]}
                    >
                      {thread.status === 'Resolved' ? 'Selesai' : 'Diskusi Aktif'}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.forumExcerpt}>{thread.excerpt}</ThemedText>

                <View style={styles.forumTagRow}>
                  {thread.tags.map(tag => (
                    <View key={tag} style={styles.forumTag}>
                      <ThemedText style={styles.forumTagText}>{tag}</ThemedText>
                    </View>
                  ))}
                </View>

                <View style={styles.forumMetaRow}>
                  <View style={styles.forumMetaItem}>
                    <MaterialIcons name="person" size={14} color="#475569" />
                    <ThemedText style={styles.forumMetaText}>
                      {thread.author} · {thread.role}
                    </ThemedText>
                  </View>
                  <View style={styles.forumMetaItem}>
                    <MaterialIcons name="access-time" size={14} color="#475569" />
                    <ThemedText style={styles.forumMetaText}>{thread.timeAgo}</ThemedText>
                  </View>
                </View>

                <View style={styles.forumStatsFooter}>
                  <View style={styles.forumStatItem}>
                    <MaterialIcons name="question-answer" size={15} color="#1d4ed8" />
                    <ThemedText style={styles.forumStatText}>{thread.replies} balasan</ThemedText>
                  </View>
                  <View style={styles.forumStatItem}>
                    <MaterialIcons name="visibility" size={15} color="#1d4ed8" />
                    <ThemedText style={styles.forumStatText}>{thread.views} dilihat</ThemedText>
                  </View>
                  <ThemedText style={styles.forumActivityText}>{thread.lastActivity}</ThemedText>
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
  forumHeader: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  forumHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  forumTitleIntro: {
    fontSize: 16,
  },
  forumSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginTop: 4,
  },
  startThreadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1d4ed8',
  },
  startThreadText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  forumStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  forumStatCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  forumStatLabel: {
    fontSize: 12,
    color: '#475569',
  },
  forumFilters: {
    flexDirection: 'row',
    gap: 10,
  },
  forumFilterChip: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
  },
  forumFilterChipActive: {
    backgroundColor: '#1d4ed8',
  },
  forumFilterText: {
    fontSize: 13,
    color: '#1f2933',
    fontWeight: '600',
  },
  forumFilterTextActive: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  forumList: {
    gap: 16,
  },
  forumCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  forumCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  forumTitleWrapper: {
    flex: 1,
    gap: 6,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#dbeafe',
  },
  pinnedText: {
    fontSize: 11,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  forumCardTitle: {
    fontSize: 15,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  forumExcerpt: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  forumTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  forumTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },
  forumTagText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  forumMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  forumMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  forumMetaText: {
    fontSize: 12,
    color: '#475569',
  },
  forumStatsFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forumStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  forumStatText: {
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  forumActivityText: {
    fontSize: 12,
    color: '#475569',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
