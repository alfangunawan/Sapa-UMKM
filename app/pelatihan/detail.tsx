import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const trainingAssets: Record<string, number> = {
  'finance-1': require('@/assets/images/acara-manajemen-keuangan.png'),
  'marketing-1': require('@/assets/images/acara-branding.png'),
  'management-1': require('@/assets/images/acara-leadership.png'),
};

const trainingDetails = {
  'finance-1': {
    title: 'Manajemen Keuangan UMKM Terintegrasi',
    organizer: 'KemenKopUKM',
    duration: '2 hari (16 jam)',
    schedule: '15-16 November 2025 • 09.00 - 17.00 WIB',
    quota: 'Kuota tersisa: 28 peserta',
    description:
      'Pelajari cara menyusun laporan keuangan sederhana, mengelola arus kas, dan menerapkan sistem pencatatan berbasis aplikasi untuk usaha Anda.',
    benefits: [
      'Template laporan keuangan siap pakai.',
      'Pendampingan klinik keuangan selama 1 bulan.',
      'Sertifikat resmi KemenKopUKM.',
    ],
  },
  'marketing-1': {
    title: 'Strategi Branding Digital untuk UMKM',
    organizer: 'KemenKopUKM & LPEI',
    duration: '3 hari (18 jam)',
    schedule: '22-24 November 2025 • 13.00 - 19.00 WIB',
    quota: 'Kuota tersisa: 12 peserta',
    description:
      'Bangun identitas merek yang kuat untuk menembus pasar digital melalui marketplace, media sosial, dan kolaborasi influencer.',
    benefits: [
      'Audit brand profesional dari fasilitator.',
      'Materi konten dan kalender editorial 3 bulan.',
      'Kesempatan coaching 1-on-1 dengan mentor pemasaran.',
    ],
  },
  'management-1': {
    title: 'Leadership & SDM untuk Usaha Kecil',
    organizer: 'KemenKopUKM',
    duration: '2 hari (14 jam)',
    schedule: '3-4 Desember 2025 • 08.30 - 16.30 WIB',
    quota: 'Kuota tersisa: 40 peserta',
    description:
      'Tingkatkan kemampuan kepemimpinan, penyusunan SOP, dan coaching tim agar produktivitas usaha meningkat.',
    benefits: [
      'Toolkit SOP operasional harian.',
      'Simulasi coaching dan feedback fasilitator.',
      'Akses komunitas alumni pelatihan manajemen.',
    ],
  },
};

const historyMock = [
  { id: 'h1', title: 'Brand Activation untuk UMKM Lokal', status: 'Sertifikat diterbitkan' },
  { id: 'h2', title: 'Pengelolaan Pajak UMKM', status: 'Selesai 6 bulan lalu' },
];

export default function TrainingDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [isRegistered, setRegistered] = useState(false);

  const detail = useMemo(() => {
    if (params.id && params.id in trainingDetails) {
      return trainingDetails[params.id as keyof typeof trainingDetails];
    }
    return trainingDetails['finance-1'];
  }, [params.id]);

  const banner = params.id && params.id in trainingAssets
    ? trainingAssets[params.id]
    : trainingAssets['finance-1'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={banner} style={styles.banner} resizeMode="cover" />

        <View style={styles.appBar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <MaterialIcons name="arrow-back" size={22} color="#1f2933" />
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            {detail.title}
          </ThemedText>
        </View>

        <ThemedView style={styles.infoCard}>
          <InfoRow icon="apartment" label="Penyelenggara" value={detail.organizer} />
          <InfoRow icon="event" label="Durasi" value={detail.duration} />
          <InfoRow icon="schedule" label="Jadwal" value={detail.schedule} />
          <InfoRow icon="group" label="Kuota" value={detail.quota} />
        </ThemedView>

        <ThemedView style={styles.descriptionCard}>
          <SectionTitle icon="description" title="Deskripsi Pelatihan" />
          <ThemedText style={styles.descriptionText}>{detail.description}</ThemedText>

          <SectionTitle icon="emoji-events" title="Manfaat yang Didapat" />
          <View style={styles.list}>
            {detail.benefits.map(item => (
              <View key={item} style={styles.listRow}>
                <MaterialIcons name="check-circle" size={18} color="#1d4ed8" />
                <ThemedText style={styles.listText}>{item}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        <Pressable
          onPress={() => setRegistered(true)}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
          <ThemedText style={styles.primaryButtonText}>
            {isRegistered ? 'Menunggu Konfirmasi' : 'Daftar Sekarang'}
          </ThemedText>
        </Pressable>

        <ThemedView style={styles.historyCard}>
          <SectionTitle icon="history" title="Riwayat Pelatihan Anda" />
          {historyMock.map(record => (
            <View key={record.id} style={styles.historyRow}>
              <ThemedText type="defaultSemiBold" style={styles.historyTitle}>
                {record.title}
              </ThemedText>
              <ThemedText style={styles.historyStatus}>{record.status}</ThemedText>
            </View>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

type InfoRowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
};

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon} size={18} color="#1d4ed8" />
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.infoLabel}>{label}</ThemedText>
        <ThemedText style={styles.infoValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

type SectionTitleProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
};

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitleRow}>
      <MaterialIcons name={icon} size={18} color="#1f2933" />
      <ThemedText type="defaultSemiBold" style={styles.sectionTitleText}>
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    gap: 20,
    paddingBottom: 32,
  },
  banner: {
    width: '100%',
    height: 200,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
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
  title: {
    flex: 1,
    fontSize: 18,
  },
  infoCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
  },
  descriptionCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitleText: {
    fontSize: 15,
  },
  descriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  list: {
    gap: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    color: '#1f2937',
  },
  primaryButton: {
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#1d4ed8',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  historyCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyRow: {
    gap: 4,
  },
  historyTitle: {
    fontSize: 13,
  },
  historyStatus: {
    fontSize: 12,
    color: '#475569',
  },
});
