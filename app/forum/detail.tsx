import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type ThreadReply = {
  id: string;
  author: string;
  role: string;
  timeAgo: string;
  content: string;
  helpful: number;
  isSolution?: boolean;
};

type ThreadDetail = {
  id: string;
  title: string;
  category: string;
  status: 'Open' | 'Resolved';
  question: string;
  author: string;
  role: string;
  timeAgo: string;
  tags: string[];
  watchers: number;
  replies: ThreadReply[];
};

const threadBank: Record<string, ThreadDetail> = {
  'legalitas-umkm': {
    id: 'legalitas-umkm',
    title: 'Tips mengurus legalitas usaha (NIB, Merek, Sertifikasi) dengan cepat',
    category: 'Legalitas',
    status: 'Open',
    question:
      'Halo rekan UMKM, adakah pengalaman mengurus NIB dan sertifikasi halal yang bisa dibagikan? Dokumen apa saja yang wajib dikirim dan berapa lama prosesnya?',
    author: 'Rina Sari',
    role: 'Pendamping Koperasi',
    timeAgo: 'Diposting 2 jam lalu',
    tags: ['Legalitas', 'Perizinan', 'Sertifikasi'],
    watchers: 56,
    replies: [
      {
        id: 'reply-1',
        author: 'Dinas Koperasi Kab. Sleman',
        role: 'Admin Wilayah',
        timeAgo: 'Baru saja',
        content:
          'Pastikan NIB diajukan lewat OSS. Untuk sertifikasi halal, unggah dokumen KTP, NPWP, daftar produk, dan surat pernyataan. Proses verifikasi biasanya 3-5 hari kerja jika data lengkap.',
        helpful: 18,
        isSolution: true,
      },
      {
        id: 'reply-2',
        author: 'Budi Santoso',
        role: 'Pelaku UMKM',
        timeAgo: '30 menit lalu',
        content:
          'Saya baru selesai bulan lalu, gunakan template daftar bahan baku supaya audit lebih cepat. Jangan lupa lampirkan foto kemasan terbaru.',
        helpful: 9,
      },
    ],
  },
  'akses-pembiayaan': {
    id: 'akses-pembiayaan',
    title: 'Akses pembiayaan UMKM: pengalaman KUR vs LPDB',
    category: 'Pembiayaan',
    status: 'Open',
    question:
      'Teman-teman yang sudah pernah ajukan KUR/LPDB, apakah ada tips memilih bank atau koperasi penyalur yang prosesnya cepat?',
    author: 'Budi Santoso',
    role: 'Pelaku UMKM',
    timeAgo: 'Diposting 5 jam lalu',
    tags: ['KUR', 'LPDB', 'Pembiayaan'],
    watchers: 48,
    replies: [
      {
        id: 'reply-3',
        author: 'Bank BRI Unit Malioboro',
        role: 'Account Officer',
        timeAgo: '1 jam lalu',
        content:
          'Siapkan laporan arus kas minimal 6 bulan terakhir dan foto aset usaha. Untuk LPDB, pastikan badan hukum koperasi sudah aktif dan RAT terakhir dilaporkan.',
        helpful: 12,
      },
      {
        id: 'reply-4',
        author: 'Siti Lestari',
        role: 'Pelaku UMKM',
        timeAgo: '45 menit lalu',
        content:
          'Pengajuan saya disetujui dalam 10 hari. Kuncinya jadwalkan survey lapangan dengan cepat dan tunjukkan catatan penjualan selama pandemi.',
        helpful: 6,
      },
    ],
  },
  'digital-marketing-sosmed': {
    id: 'digital-marketing-sosmed',
    title: 'Strategi konten TikTok untuk produk kerajinan',
    category: 'Pemasaran',
    status: 'Resolved',
    question:
      'Butuh ide konten yang konsisten untuk promosi produk kerajinan tangan di TikTok. Bagaimana jadwal posting yang efektif?',
    author: 'Sinta Dewi',
    role: 'Pelaku UMKM',
    timeAgo: 'Diposting kemarin',
    tags: ['Konten', 'Pemasaran', 'Media Sosial'],
    watchers: 72,
    replies: [
      {
        id: 'reply-5',
        author: 'Admin Komunitas',
        role: 'Moderator',
        timeAgo: '12 jam lalu',
        content:
          'Gunakan pola 3 konten edukasi, 2 testimoni, dan 1 hiburan per minggu. Rekam stok konten di satu hari agar produksi lebih ringan.',
        helpful: 21,
        isSolution: true,
      },
      {
        id: 'reply-6',
        author: 'Yoga Pratama',
        role: 'Pelaku UMKM',
        timeAgo: '10 jam lalu',
        content:
          'Manfaatkan fitur Live untuk soft-selling. Saya biasa live setiap Jumat sore sambil demo proses produksi.',
        helpful: 11,
      },
    ],
  },
  'manajemen-operasional': {
    id: 'manajemen-operasional',
    title: 'Menyusun SOP produksi yang sederhana dan efektif',
    category: 'Manajemen',
    status: 'Open',
    question:
      'Butuh referensi SOP produksi untuk tim kecil (5 orang). Bagaimana cara memastikan SOP mudah diikuti?',
    author: 'Dimas Pratama',
    role: 'Pelaku UMKM',
    timeAgo: 'Diposting 3 hari lalu',
    tags: ['Operasional', 'Manajemen'],
    watchers: 33,
    replies: [
      {
        id: 'reply-7',
        author: 'Lia Wulandari',
        role: 'Konsultan Operasional',
        timeAgo: '1 hari lalu',
        content:
          'Gunakan format flowchart singkat dan tempelkan di area produksi. Sertakan daftar cek harian agar tim bisa self-audit.',
        helpful: 8,
      },
    ],
  },
};

const FALLBACK_THREAD_ID = 'legalitas-umkm';

export default function ForumDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const thread = useMemo(() => {
    if (id && typeof id === 'string' && threadBank[id]) {
      return threadBank[id];
    }
    return threadBank[FALLBACK_THREAD_ID];
  }, [id]);

  const isResolved = thread.status === 'Resolved';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ThemedView style={styles.headerCard}>
        <View style={styles.appBar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}>
            <MaterialIcons name="arrow-back" size={22} color="#1f2933" />
          </Pressable>
          <ThemedText type="title" style={styles.headerTitle}>
            Forum UMKM
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert('Bagikan Diskusi', 'Fitur bagikan akan tersedia pada rilis berikutnya.')
            }
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}>
            <MaterialIcons name="ios-share" size={20} color="#1f2933" />
          </Pressable>
        </View>
        <View style={[styles.statusBadge, isResolved ? styles.statusResolved : styles.statusOpen]}>
          <MaterialIcons
            name={isResolved ? 'verified' : 'chat-bubble'}
            size={16}
            color={isResolved ? '#166534' : '#1d4ed8'}
          />
          <ThemedText
            style={[styles.statusBadgeText, isResolved ? styles.statusResolvedText : styles.statusOpenText]}>
            {isResolved ? 'Diskusi Selesai' : 'Diskusi Aktif'}
          </ThemedText>
        </View>
        <ThemedText type="defaultSemiBold" style={styles.threadTitle}>
          {thread.title}
        </ThemedText>
        <View style={styles.tagRow}>
          {thread.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </View>
          ))}
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialIcons name="person" size={16} color="#475569" />
            <ThemedText style={styles.metaText}>
              {thread.author} · {thread.role}
            </ThemedText>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="schedule" size={16} color="#475569" />
            <ThemedText style={styles.metaText}>{thread.timeAgo}</ThemedText>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="visibility" size={16} color="#475569" />
            <ThemedText style={styles.metaText}>{thread.watchers} mengikuti</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.questionText}>{thread.question}</ThemedText>
        <Pressable
          onPress={() => Alert.alert('Balas Diskusi', 'Fitur komentar akan segera aktif.')}
          style={({ pressed }) => [styles.replyButton, pressed && styles.iconPressed]}>
          <MaterialIcons name="mode-comment" size={18} color="#ffffff" />
          <ThemedText style={styles.replyButtonText}>Ikut Berdiskusi</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Balasan Komunitas
      </ThemedText>

      <View style={styles.replyList}>
        {thread.replies.map(reply => (
          <ThemedView key={reply.id} style={styles.replyCard}>
            <View style={styles.replyHeader}>
              <View style={styles.replyAuthorBlock}>
                <ThemedText type="defaultSemiBold" style={styles.replyAuthor}>
                  {reply.author}
                </ThemedText>
                <ThemedText style={styles.replyRole}>{reply.role}</ThemedText>
              </View>
              <ThemedText style={styles.replyTime}>{reply.timeAgo}</ThemedText>
            </View>

            {reply.isSolution ? (
              <View style={styles.solutionBadge}>
                <MaterialIcons name="lightbulb" size={16} color="#fff7ed" />
                <ThemedText style={styles.solutionText}>Solusi Terpilih</ThemedText>
              </View>
            ) : null}

            <ThemedText style={styles.replyContent}>{reply.content}</ThemedText>

            <View style={styles.replyActions}>
              <Pressable
                onPress={() => Alert.alert('Terima kasih', 'Balasan ditandai bermanfaat.')}
                style={({ pressed }) => [styles.helpfulButton, pressed && styles.iconPressed]}>
                <MaterialIcons name="thumb-up" size={16} color="#1d4ed8" />
                <ThemedText style={styles.helpfulText}>{reply.helpful} bermanfaat</ThemedText>
              </Pressable>
              {isResolved || reply.isSolution ? null : (
                <Pressable
                  onPress={() => Alert.alert('Tandai Solusi', 'Moderator akan meninjau penandaan ini.')}
                  style={({ pressed }) => [styles.solutionButton, pressed && styles.iconPressed]}>
                  <MaterialIcons name="check-circle" size={16} color="#16a34a" />
                  <ThemedText style={styles.solutionButtonText}>Tandai solusi</ThemedText>
                </Pressable>
              )}
            </View>
          </ThemedView>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  headerCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
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
  iconPressed: {
    opacity: 0.85,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusOpen: {
    backgroundColor: '#dbeafe',
  },
  statusResolved: {
    backgroundColor: '#dcfce7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusOpenText: {
    color: '#1d4ed8',
  },
  statusResolvedText: {
    color: '#166534',
  },
  threadTitle: {
    fontSize: 18,
    lineHeight: 26,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },
  tagText: {
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
  },
  questionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  replyButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1d4ed8',
  },
  replyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
  },
  replyList: {
    gap: 16,
  },
  replyCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  replyAuthorBlock: {
    flex: 1,
    gap: 4,
  },
  replyAuthor: {
    fontSize: 14,
  },
  replyRole: {
    fontSize: 12,
    color: '#475569',
  },
  replyTime: {
    fontSize: 12,
    color: '#475569',
  },
  solutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#fb923c',
  },
  solutionText: {
    color: '#fff7ed',
    fontSize: 12,
    fontWeight: '600',
  },
  replyContent: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  replyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
  },
  helpfulText: {
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  solutionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#dcfce7',
  },
  solutionButtonText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
});
