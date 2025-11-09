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
    Checklist,
    DocumentVault,
    InfoNote,
    ReminderList,
    SectionHeader,
    StatusTimeline,
    SummaryRow,
} from '@/components/program-shared';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const eligibilityItems = [
  { id: 'entity', label: 'Berbadan hukum (Koperasi/UKM berbadan hukum)', note: 'Lampirkan akta dan pengesahan.', requiredYes: true },
  { id: 'age', label: 'Usia entitas minimal 2 tahun', note: 'Sertakan catatan aktivitas usaha.', requiredYes: true },
  { id: 'finance', label: 'Memiliki laporan keuangan sederhana', note: 'Minimal 12 bulan terakhir.', requiredYes: true },
  { id: 'plan', label: 'Memiliki rencana usaha tertulis', note: 'Konsep model bisnis dan proyeksi.', requiredYes: true },
];

const documents = [
  { id: 'ktpPengurus', label: 'e-KTP Pengurus', required: true },
  { id: 'akta', label: 'Akta & SK Pengesahan', required: true },
  { id: 'npwp', label: 'NPWP Badan', required: true },
  { id: 'nib', label: 'NIB / Izin Usaha', required: true },
  { id: 'rencana', label: 'Rencana Bisnis (PDF)', required: true },
  { id: 'laporan', label: 'Laporan Keuangan 12 bulan', required: true },
];

const vaultItems = [
  { id: 'vault-akta', name: 'Akta_Koperasi.pdf', type: 'PDF', lastUpdated: '10 Okt 2025' },
  { id: 'vault-rencana', name: 'Rencana-Bisnis-2026.pdf', type: 'PDF', lastUpdated: '28 Sep 2025' },
  { id: 'vault-laporan', name: 'Laporan-Keuangan-2025.xlsx', type: 'XLSX', lastUpdated: '05 Nov 2025' },
];

const timelineItems = [
  { label: 'Diajukan', description: 'Permohonan diterima LPDB.', state: 'complete' as const },
  { label: 'Administrasi', description: 'Pemeriksaan dokumen dan keabsahan legalitas.', state: 'complete' as const },
  { label: 'Penilaian Kelayakan', description: 'Analisis laporan keuangan dan rencana bisnis.', state: 'current' as const },
  { label: 'Komite', description: 'Paparan ke komite penyaluran dana.', state: 'upcoming' as const },
  { label: 'Keputusan', description: 'Disetujui atau Ditolak.', state: 'upcoming' as const },
];

const reminders = [
  { title: 'Upload Rencana Bisnis', detail: 'Gunakan template resmi LPDB sebelum 15 Nov 2025.', icon: 'upload' as const },
  { title: 'Persiapan Komite', detail: 'Siapkan materi presentasi untuk paparan komite.', icon: 'present-to-all' as const },
];

export default function LpdbScreen() {
  const router = useRouter();
  const [eligibilityAnswers, setEligibilityAnswers] = useState<Record<string, 'ya' | 'tidak'>>({});

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
          LPDB (Dana Bergulir)
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Informasi LPDB', 'Dana bergulir dengan pendampingan intensif untuk Koperasi/UKM.')} 
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="info-outline" size={22} color="#0a7ea4" />
        </Pressable>
      </View>

      <ThemedView style={styles.card}>
        <SectionHeader title="Cek Kelayakan" subtitle="Pastikan kriteria dasar terpenuhi." />
        <View style={styles.eligibilityList}>
          {eligibilityItems.map(item => (
            <View key={item.id} style={styles.eligibilityRow}>
              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText style={styles.eligibilityLabel}>{item.label}</ThemedText>
                {item.note ? <ThemedText style={styles.eligibilityNote}>{item.note}</ThemedText> : null}
              </View>
              <View style={styles.chipRow}>
                {['ya', 'tidak'].map(option => (
                  <Pressable
                    key={option}
                    onPress={() => setEligibilityAnswers(prev => ({ ...prev, [item.id]: option as 'ya' | 'tidak' }))}
                    style={({ pressed }) => [
                      styles.chip,
                      eligibilityAnswers[item.id] === option && styles.chipActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <ThemedText style={eligibilityAnswers[item.id] === option ? styles.chipTextActive : styles.chipText}>
                      {option === 'ya' ? 'Ya' : 'Tidak'}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
        <InfoNote>
          Jika belum memiliki rencana bisnis, unduh template resmi LPDB untuk mempermudah penyusunan.
        </InfoNote>
        <Pressable
          onPress={() => Alert.alert('Template Rencana Bisnis', 'File contoh akan diunduh (mock).')}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="download" size={18} color="#0a7ea4" />
          <ThemedText style={styles.secondaryButtonText}>Unduh Template</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Profil Entitas" subtitle="Lengkapi data kelembagaan." />
        {[
          'Nama Koperasi/UKM',
          'Nomor Induk Koperasi / NIB',
          'Alamat Domisili',
          'Nama Ketua / Penanggung Jawab',
          'Nomor Kontak',
          'Email Administrasi',
        ].map(field => (
          <TextInput key={field} placeholder={field} placeholderTextColor="#94a3b8" style={styles.input} />
        ))}
        <TextInput
          placeholder="Jumlah Anggota (jika Koperasi)"
          placeholderTextColor="#94a3b8"
          keyboardType="number-pad"
          style={styles.input}
        />
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Rencana Penggunaan Dana" />
        <View style={styles.group}>
          <ThemedText style={styles.groupLabel}>Tujuan Dana</ThemedText>
          {['Modal Kerja', 'Investasi Peralatan', 'Perluasan Jaringan', 'Program Kemitraan'].map(option => (
            <Pressable key={option} style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}>
              <MaterialIcons name="checklist" size={18} color="#0a7ea4" />
              <ThemedText style={styles.optionLabel}>{option}</ThemedText>
            </Pressable>
          ))}
        </View>
        <TextInput
          placeholder="Proyeksi Arus Kas (ringkas)"
          placeholderTextColor="#94a3b8"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
        />
        <TextInput
          placeholder="Rencana Pengembalian Dana"
          placeholderTextColor="#94a3b8"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
        />
      </ThemedView>

      <Checklist title="Dokumen" subtitle="Unggah dokumen legal dan keuangan." items={documents} />

      <DocumentVault items={vaultItems} />

      <ThemedView style={styles.card}>
        <SectionHeader title="Ringkasan & Ajukan" />
        <SummaryRow icon="payments" label="Nilai Pengajuan" value="Rp 500.000.000" />
        <SummaryRow icon="schedule" label="Tenor Usulan" value="36 bulan" />
        <SummaryRow icon="groups" label="Jumlah Anggota" value="120 anggota" />
        <InfoNote>
          Pada tahap ini LPDB akan melakukan klarifikasi dan dapat meminta dokumen tambahan.
        </InfoNote>
        <Pressable
          onPress={() => Alert.alert('Pengajuan LPDB', 'Pengajuan dana bergulir telah dikirim (mock).')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="send" size={18} color="#ffffff" />
          <ThemedText style={styles.primaryButtonText}>Ajukan Dana Bergulir</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Pelacakan" subtitle="Tahapan proses penyaluran." />
        <StatusTimeline items={timelineItems} />
        <View style={styles.followUpCard}>
          <ThemedText type="defaultSemiBold" style={styles.followTitle}>
            Jika Disetujui
          </ThemedText>
          <ThemedText style={styles.followText}>
            Jadwal penandatanganan: 12 Des 2025 · 09.00 WIB
            Lokasi: Kantor LPDB KUMKM Jakarta. Konfirmasi kehadiran maksimal H-2.
          </ThemedText>
          <Pressable
            onPress={() => Alert.alert('Tambahkan ke Kalender', 'Agenda akan ditambahkan ke kalender (mock).')}
            style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
          >
            <MaterialIcons name="event-available" size={18} color="#ffffff" />
            <ThemedText style={styles.smallButtonText}>Simpan Jadwal</ThemedText>
          </Pressable>
        </View>
        <View style={styles.followUpCardWarning}>
          <ThemedText type="defaultSemiBold" style={styles.followTitle}>
            Jika Ditolak
          </ThemedText>
          <ThemedText style={styles.followText}>
            Alasan: Laporan keuangan belum diaudit.
            Rekomendasi: lakukan review internal dan sertakan neraca serta laporan rugi laba 12 bulan terakhir.
          </ThemedText>
        </View>
      </ThemedView>

      <ReminderList items={reminders} />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  eligibilityList: {
    gap: 16,
  },
  eligibilityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  eligibilityLabel: {
    color: '#0f172a',
  },
  eligibilityNote: {
    fontSize: 12,
    color: '#64748b',
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
  secondaryButton: {
    alignSelf: 'flex-start',
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
  secondaryButtonText: {
    color: '#0a7ea4',
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
  group: {
    gap: 10,
  },
  groupLabel: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  optionLabel: {
    flex: 1,
    color: '#0f172a',
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
  followUpCard: {
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
  },
  followUpCardWarning: {
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fef3c7',
  },
  followTitle: {
    color: '#0f172a',
  },
  followText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  smallButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#0a7ea4',
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
