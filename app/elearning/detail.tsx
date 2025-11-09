import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const moduleAssets: Record<string, number> = {
  'digital-marketing': require('@/assets/images/orang-jualan-1.png'),
  'packaging-strategy': require('@/assets/images/orang-jualan-2.png'),
  'cashflow-quick': require('@/assets/images/orang-jualan-3.png'),
  'team-briefing': require('@/assets/images/orang-jualan-4.png'),
};

const moduleDetails = {
  'digital-marketing': {
    title: 'Digital Marketing Dasar',
    level: 'Pemula',
    duration: 'Total durasi 45 menit',
    description:
      'Pelajari langkah awal membangun pemasaran digital: membuat persona pelanggan, menyusun konten, dan menganalisis performa sederhana.',
    outline: [
      'Perkenalan pemasaran digital untuk UMKM.',
      'Mengenal kanal utama: marketplace, media sosial, dan WhatsApp Business.',
      'Membuat kalender konten mingguan dan CTA efektif.',
    ],
    quiz: {
      title: 'Kuis Evaluasi (5 Soal)',
      note: 'Minimal nilai 80 untuk mendapatkan sertifikat.',
    },
  },
  'packaging-strategy': {
    title: 'Strategi Pengemasan Produk',
    level: 'Menengah',
    duration: 'Total durasi 35 menit',
    description:
      'Optimalkan kemasan dari sisi estetika dan fungsionalitas agar produk Anda standout di rak offline maupun online.',
    outline: [
      'Menentukan identitas merek pada kemasan.',
      'Memilih material cost-effective dan ramah lingkungan.',
      'Checklist kelayakan kemasan untuk distribusi.',
    ],
    quiz: {
      title: 'Checklist Self Assessment',
      note: 'Isi lembar evaluasi sebelum melanjutkan modul lanjutan.',
    },
  },
  'cashflow-quick': {
    title: 'Cashflow Harian Praktis',
    level: 'Pemula',
    duration: 'Total durasi 30 menit',
    description:
      'Panduan praktis mencatat pemasukan dan pengeluaran harian agar usaha selalu terpantau sehat.',
    outline: [
      'Membuat template buku kas harian.',
      'Memahami rasio cashflow sehat.',
      'Studi kasus pengelolaan kas untuk usaha kuliner.',
    ],
    quiz: {
      title: 'Kuis & Simulasi',
      note: 'Selesaikan simulasi kasus untuk mengunduh sertifikat.',
    },
  },
  'team-briefing': {
    title: 'Briefing Tim 15 Menit',
    level: 'Pemula',
    duration: 'Total durasi 25 menit',
    description:
      'Latih kemampuan leadership dengan briefing singkat namun efektif setiap awal shift.',
    outline: [
      'Format briefing 3 langkah.',
      'Membangun kebiasaan feedback positif.',
      'Checklist evaluasi kerja harian.',
    ],
    quiz: {
      title: 'Checklist Tim Harian',
      note: 'Gunakan checklist selama seminggu dan tandai progres.',
    },
  },
};

export default function ElearningDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [progress, setProgress] = useState(0);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [certificateReady, setCertificateReady] = useState(false);

  const detail = useMemo(() => {
    if (params.id && params.id in moduleDetails) {
      return moduleDetails[params.id as keyof typeof moduleDetails];
    }
    return moduleDetails['digital-marketing'];
  }, [params.id]);

  const cover = params.id && params.id in moduleAssets
    ? moduleAssets[params.id]
    : moduleAssets['digital-marketing'];

  const handleStart = () => {
    setProgress(60);
    setQuizUnlocked(true);
  };

  const handleFinishQuiz = () => {
    setProgress(100);
    setCertificateReady(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={cover} style={styles.cover} resizeMode="cover" />

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
          <InfoChip icon="schedule" label={detail.duration} />
          <InfoChip icon="workspace-premium" label={`Level: ${detail.level}`} />
        </ThemedView>

        <ThemedView style={styles.descriptionCard}>
          <SectionTitle icon="menu-book" title="Tentang Modul" />
          <ThemedText style={styles.descriptionText}>{detail.description}</ThemedText>

          <SectionTitle icon="playlist-play" title="Rincian Materi" />
          <View style={styles.list}>
            {detail.outline.map(item => (
              <View key={item} style={styles.listRow}>
                <MaterialIcons name="play-circle" size={18} color="#1d4ed8" />
                <ThemedText style={styles.listText}>{item}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        <View style={styles.progressSection}>
          <SectionTitle icon="task" title="Progress Belajar" />
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <ThemedText style={styles.progressLabel}>{progress}% terselesaikan</ThemedText>
        </View>

        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
          <MaterialIcons name="play-arrow" size={20} color="#ffffff" />
          <ThemedText style={styles.primaryText}>Mulai Belajar</ThemedText>
        </Pressable>

        <ThemedView style={styles.quizCard}>
          <SectionTitle icon="quiz" title={detail.quiz.title} />
          <ThemedText style={styles.quizNote}>{detail.quiz.note}</ThemedText>
          <Pressable
            disabled={!quizUnlocked}
            onPress={handleFinishQuiz}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && quizUnlocked && styles.buttonPressed,
              !quizUnlocked && styles.disabledButton,
            ]}>
            <ThemedText style={styles.secondaryText}>
              {quizUnlocked ? 'Kerjakan Kuis' : 'Selesaikan materi untuk membuka kuis'}
            </ThemedText>
          </Pressable>
        </ThemedView>

        <Pressable
          disabled={!certificateReady}
          onPress={() => setCertificateReady(true)}
          style={({ pressed }) => [
            styles.certificateButton,
            pressed && certificateReady && styles.buttonPressed,
            !certificateReady && styles.disabledButton,
          ]}>
          <MaterialIcons
            name="file-download"
            size={20}
            color={certificateReady ? '#ffffff' : '#94a3b8'}
          />
          <ThemedText style={certificateReady ? styles.certificateTextActive : styles.certificateText}>
            {certificateReady ? 'Unduh Sertifikat' : 'Selesaikan kuis untuk sertifikat'}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

type InfoChipProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

function InfoChip({ icon, label }: InfoChipProps) {
  return (
    <View style={styles.infoChip}>
      <MaterialIcons name={icon} size={16} color="#1d4ed8" />
      <ThemedText style={styles.infoChipText}>{label}</ThemedText>
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
  cover: {
    width: '100%',
    height: 220,
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
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  infoChipText: {
    fontSize: 12,
    color: '#1f2937',
  },
  descriptionCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
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
  progressSection: {
    marginHorizontal: 20,
    gap: 10,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
  },
  progressLabel: {
    fontSize: 13,
    color: '#1f2937',
  },
  primaryButton: {
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1d4ed8',
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  quizCard: {
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
  quizNote: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1d4ed8',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  certificateButton: {
    marginHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  certificateText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  certificateTextActive: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
