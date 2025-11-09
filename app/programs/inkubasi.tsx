import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import {
    InfoNote,
    ReminderList,
    SectionHeader,
    StatusTimeline,
} from '@/components/program-shared';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const filters = {
  lokasi: ['Semua', 'DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Sumatera Barat'],
  sektor: ['Semua', 'F&B', 'Fashion', 'Agribisnis', 'Jasa Kreatif'],
  metode: ['Hybrid', 'Online', 'Offline'],
  durasi: ['< 1 bulan', '1-3 bulan', '> 3 bulan'],
};

const programs = [
  {
    id: 'prog-1',
    name: 'Inkubasi Nasional 2026',
    organizer: 'KemenKopUKM',
    benefit: 'Pendampingan ekspansi, akses investor, mentoring 1-on-1.',
    deadline: '15 Des 2025',
    startDate: '10 Jan 2026',
    quota: 'Kuota 40 peserta',
    fee: 'Gratis',
  },
  {
    id: 'prog-2',
    name: 'Bimbingan Teknis F&B Nusantara',
    organizer: 'Dinas KUKM Jawa Barat',
    benefit: 'Workshop formulasi produk, sertifikasi halal, pemasaran digital.',
    deadline: '30 Nov 2025',
    startDate: '05 Jan 2026',
    quota: 'Kuota 25 peserta',
    fee: 'Subsidi 50%',
  },
  {
    id: 'prog-3',
    name: 'Inkrel Fashion Forward',
    organizer: 'INKREL Indonesia',
    benefit: 'Mentoring desain, business matching, akses pameran luar negeri.',
    deadline: '20 Jan 2026',
    startDate: '12 Feb 2026',
    quota: 'Kuota 15 brand',
    fee: 'Biaya Rp 1.500.000',
  },
];

const timelineItems = [
  { label: 'Diajukan', description: 'Formulir pendaftaran terkirim.', state: 'complete' as const },
  { label: 'Seleksi Berkas', description: 'Tim menilai profil dan motivasi Anda.', state: 'current' as const },
  { label: 'Keputusan', description: 'Diterima / Cadangan / Tidak Lolos.', state: 'upcoming' as const },
];

const reminders = [
  { title: 'Unggah Portofolio Produk', detail: 'Deadline 11 Nov 2025 · Format PDF atau link katalog.', icon: 'photo-library' as const },
  { title: 'Jadwal Interview', detail: 'Pilih slot zoom interview sebelum 18 Nov 2025.', icon: 'event' as const },
];

export default function InkubasiScreen() {
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState({
    lokasi: 'Semua',
    sektor: 'Semua',
    metode: 'Hybrid',
    durasi: '1-3 bulan',
  });
  const [progress, setProgress] = useState(45);

  const toggleFilter = (key: keyof typeof filters, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.appBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="arrow-back" size={22} color="#0a7ea4" />
        </Pressable>
        <ThemedText type="defaultSemiBold" style={styles.appBarTitle}>
          Inkubasi & Bimbingan
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Tips Seleksi', 'Buat jawaban motivasi yang spesifik dan lampirkan portofolio terbaik.')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="info-outline" size={22} color="#0a7ea4" />
        </Pressable>
      </View>

      <ThemedView style={styles.cardAccent}>
        <ThemedText type="defaultSemiBold" style={styles.lastSubmissionTitle}>
          Pengajuan Terakhir
        </ThemedText>
        <ThemedText style={styles.lastSubmissionText}>
          Program Inkubasi Nasional 2026 · Status: Seleksi Berkas
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Lanjutkan', 'Formulir sebelumnya akan dilanjutkan (mock).')}
          style={({ pressed }) => [styles.smallButtonPrimary, pressed && styles.pressed]}
        >
          <MaterialIcons name="play-arrow" size={18} color="#ffffff" />
          <ThemedText style={styles.smallButtonPrimaryText}>Lanjutkan</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Jelajah Program" subtitle="Gunakan filter agar rekomendasi lebih relevan." />
        {(
          Object.keys(filters) as Array<keyof typeof filters>
        ).map(key => (
          <View key={key} style={styles.filterGroup}>
            <ThemedText style={styles.filterLabel}>{key.toUpperCase()}</ThemedText>
            <View style={styles.chipRow}>
              {filters[key].map(option => (
                <Pressable
                  key={option}
                  onPress={() => toggleFilter(key, option)}
                  style={({ pressed }) => [
                    styles.chip,
                    selectedFilters[key] === option && styles.chipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText style={selectedFilters[key] === option ? styles.chipTextActive : styles.chipText}>
                    {option}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <InfoNote>
          Filter saat ini: {selectedFilters.lokasi} · {selectedFilters.sektor} · {selectedFilters.metode} · {selectedFilters.durasi}
        </InfoNote>
      </ThemedView>

      {programs.map(item => (
        <ThemedView key={item.id} style={styles.programCard}>
          <View style={styles.programHeader}>
            <View style={styles.programIcon}>
              <MaterialIcons name="workspace-premium" size={22} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={styles.programTitle}>
                {item.name}
              </ThemedText>
              <ThemedText style={styles.programOrganizer}>{item.organizer}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.programBenefit}>{item.benefit}</ThemedText>
          <View style={styles.programMetaRow}>
            <ProgramMeta icon="event" label={`Mulai ${item.startDate}`} />
            <ProgramMeta icon="hourglass-bottom" label={`Deadline ${item.deadline}`} />
          </View>
          <View style={styles.programMetaRow}>
            <ProgramMeta icon="group" label={item.quota} />
            <ProgramMeta icon="payments" label={item.fee} />
          </View>
          <Pressable
            onPress={() => Alert.alert(item.name, 'Detail program akan dibuka (mock).')}
            style={({ pressed }) => [styles.applyButton, pressed && styles.pressed]}
          >
            <ThemedText style={styles.applyButtonText}>Lihat Detail & Daftar</ThemedText>
          </Pressable>
        </ThemedView>
      ))}

      <ThemedView style={styles.card}>
        <SectionHeader title="Pendaftaran" subtitle="Lengkapi motivasi dan portofolio usaha." />
        <TextInput
          placeholder="Motivasi mengikuti program (maks 500 karakter)"
          placeholderTextColor="#94a3b8"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
        />
        <TextInput placeholder="Link Portofolio / Folder Drive" placeholderTextColor="#94a3b8" style={styles.input} />
        <TextInput placeholder="Website / Media Sosial" placeholderTextColor="#94a3b8" style={styles.input} />
        <Pressable
          onPress={() => Alert.alert('Unggah Produk', 'Foto produk akan diunggah (mock).')}
          style={({ pressed }) => [styles.uploadButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="file-upload" size={18} color="#0a7ea4" />
          <ThemedText style={styles.uploadButtonText}>Unggah Foto Produk</ThemedText>
        </Pressable>
        <SectionHeader title="Jadwal Interview" subtitle="Pilih slot jika diperlukan." />
        <View style={styles.chipRow}>
          {['12 Nov · 09:00', '13 Nov · 14:00', '15 Nov · 19:00'].map(slot => (
            <Pressable key={slot} style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
              <ThemedText style={styles.chipText}>{slot}</ThemedText>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={() => Alert.alert('Kirim Pendaftaran', 'Pendaftaran inkubasi berhasil dikirim (mock).')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="send" size={18} color="#ffffff" />
          <ThemedText style={styles.primaryButtonText}>Kirim Pendaftaran</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Pelacakan & Kegiatan" />
        <StatusTimeline items={timelineItems} />
        <View style={styles.progressBlock}>
          <ThemedText style={styles.progressLabel}>Progress Pra-Kelas</ThemedText>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <ThemedText style={styles.progressValue}>{progress}% terlaksana</ThemedText>
          <View style={styles.progressTasks}>
            {[{ label: 'Upload profil brand', done: true }, { label: 'Unggah foto produk', done: true }, { label: 'Isi form kebutuhan mentor', done: false }].map(task => (
              <View key={task.label} style={styles.taskRow}>
                <MaterialIcons name={task.done ? 'check-circle' : 'radio-button-unchecked'} size={18} color={task.done ? '#15a362' : '#94a3b8'} />
                <ThemedText style={styles.taskLabel}>{task.label}</ThemedText>
              </View>
            ))}
          </View>
        </View>
        <ThemedView style={styles.communityCard}>
          <MaterialIcons name="forum" size={22} color="#0a7ea4" />
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={styles.communityTitle}>
              Grup Komunitas
            </ThemedText>
            <ThemedText style={styles.communitySubtitle}>Join grup WA / Forum peserta untuk koordinasi kegiatan.</ThemedText>
          </View>
          <Pressable
            onPress={() => Alert.alert('Gabung Grup', 'Link grup akan dibuka (mock).')}
            style={({ pressed }) => [styles.smallButtonPrimary, pressed && styles.pressed]}
          >
            <ThemedText style={styles.smallButtonPrimaryText}>Gabung</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ReminderList items={reminders} />
    </ScrollView>
  );
}

function ProgramMeta({ icon, label }: { icon: keyof typeof MaterialIcons.glyphMap; label: string }) {
  return (
    <View style={styles.programMeta}>
      <MaterialIcons name={icon} size={16} color="#0a7ea4" />
      <ThemedText style={styles.programMetaText}>{label}</ThemedText>
    </View>
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
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#0f172a',
  },
  card: {
    gap: 18,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardAccent: {
    gap: 12,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#eef6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  lastSubmissionTitle: {
    color: '#0f172a',
  },
  lastSubmissionText: {
    fontSize: 13,
    color: '#475569',
  },
  smallButtonPrimary: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#0a7ea4',
  },
  smallButtonPrimaryText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  filterGroup: {
    gap: 10,
  },
  filterLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#ffffff',
  },
  chipActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  chipText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  programCard: {
    gap: 14,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  programIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a7ea4',
  },
  programTitle: {
    fontSize: 16,
    color: '#0f172a',
  },
  programOrganizer: {
    fontSize: 13,
    color: '#64748b',
  },
  programBenefit: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  programMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  programMetaText: {
    fontSize: 12,
    color: '#475569',
  },
  applyButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#0a7ea4',
  },
  applyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    backgroundColor: '#ffffff',
  },
  uploadButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#0a7ea4',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  progressBlock: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  progressLabel: {
    fontSize: 13,
    color: '#0f172a',
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#0a7ea4',
  },
  progressValue: {
    fontSize: 12,
    color: '#0f172a',
  },
  progressTasks: {
    gap: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskLabel: {
    fontSize: 13,
    color: '#475569',
  },
  communityCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ecfeff',
  },
  communityTitle: {
    color: '#0f172a',
  },
  communitySubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
});
