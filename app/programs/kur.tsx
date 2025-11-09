import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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

const eligibilityQuestions = [
  { id: 'duration', label: 'Usaha berjalan minimal 6 bulan', requiredYes: true },
  { id: 'revenue', label: 'Memiliki catatan omzet/buku penjualan', requiredYes: true },
  { id: 'noActiveKur', label: 'Tidak sedang menerima KUR aktif', requiredYes: true },
  { id: 'permit', label: 'Memiliki NIB/Izin Usaha', requiredYes: true },
];

const tenorOptions = ['12', '24', '36', '48', '60'];
const loanPurpose = ['Modal Kerja', 'Investasi', 'Pembelian Peralatan'];
const distributors = ['BRI', 'BNI', 'Mandiri', 'BTN', 'BPD DIY', 'KSP Nusantara'];

const documents = [
  { id: 'ktp', label: 'e-KTP Pemilik', required: true },
  { id: 'nib', label: 'NIB / Izin Usaha', required: true },
  { id: 'npwp', label: 'NPWP Usaha/Pemilik', required: true },
  { id: 'omzet', label: 'Rekap Omzet (foto buku kas)', required: true },
  { id: 'foto', label: 'Foto Tempat Usaha', required: false },
];

const timelineItems = [
  { label: 'Diajukan', description: 'Formulir terkirim ke penyalur KUR.', state: 'complete' as const },
  { label: 'Verifikasi Bank', description: 'Bank memeriksa kelengkapan dokumen.', state: 'current' as const },
  { label: 'Survey Lapangan', description: 'Petugas meninjau usaha secara langsung.', state: 'upcoming' as const },
  { label: 'Keputusan', description: 'Disetujui atau Ditolak.', state: 'upcoming' as const },
];

const vaultItems = [
  { id: 'vault-ktp', name: 'KTP_Pemilik.pdf', type: 'PDF', lastUpdated: '05 Nov 2025' },
  { id: 'vault-nib', name: 'NIB-Usaha-12345.pdf', type: 'PDF', lastUpdated: '30 Sep 2025' },
  { id: 'vault-npwp', name: 'NPWP-0168xxxx.pdf', type: 'PDF', lastUpdated: '12 Agu 2025' },
];

const reminders = [
  { title: 'Jadwal Survey', detail: 'Perkiraan 15 Nov 2025 · Persiapkan dokumen asli.', icon: 'pin-drop' as const },
  { title: 'Kelola Angsuran', detail: 'Bayar angsuran pertama H+30 setelah pencairan.', icon: 'event-available' as const },
];

function formatCurrency(value: number) {
  if (Number.isNaN(value)) {
    return 'Rp 0';
  }
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function KurScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, 'ya' | 'tidak'>>({});
  const [plafon, setPlafon] = useState('150000000');
  const [tenor, setTenor] = useState('36');
  const [purpose, setPurpose] = useState('Modal Kerja');
  const [distributor, setDistributor] = useState('BRI');

  const installment = useMemo(() => {
    const amount = Number(plafon);
    const months = Number(tenor);
    if (!amount || !months) {
      return 'Lengkapi plafon dan tenor';
    }
    const rate = 0.06 / 12; // subsidi bunga 6% per tahun
    const installmentValue = (amount * rate) / (1 - Math.pow(1 + rate, -months));
    return `${formatCurrency(Math.round(installmentValue))} / bulan`;
  }, [plafon, tenor]);

  const eligibility = useMemo(() => {
    const unmet = eligibilityQuestions.some(q => {
      const answer = answers[q.id];
      if (!answer) {
        return true;
      }
      return q.requiredYes && answer !== 'ya';
    });
    return unmet ? 'Perlu Ditinjau' : 'Layak';
  }, [answers]);

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
          KUR (Kredit Usaha Rakyat)
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Ketentuan KUR', 'Bunga efektif 3-6% per tahun. Pastikan tidak memiliki kredit macet.')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="help-outline" size={22} color="#0a7ea4" />
        </Pressable>
      </View>

      <ThemedView style={styles.card}>
        <SectionHeader title="Cek Kelayakan" subtitle="Jawab beberapa pertanyaan singkat." />
        <View style={styles.eligibilityList}>
          {eligibilityQuestions.map(question => (
            <View key={question.id} style={styles.eligibilityRow}>
              <ThemedText style={styles.eligibilityLabel}>{question.label}</ThemedText>
              <View style={styles.chipRow}>
                {['ya', 'tidak'].map(option => (
                  <Pressable
                    key={option}
                    onPress={() => setAnswers(prev => ({ ...prev, [question.id]: option as 'ya' | 'tidak' }))}
                    style={({ pressed }) => [
                      styles.chip,
                      answers[question.id] === option && styles.chipActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <ThemedText style={answers[question.id] === option ? styles.chipTextActive : styles.chipText}>
                      {option === 'ya' ? 'Ya' : 'Tidak'}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
        <View style={styles.eligibilityIndicator}>
          <MaterialIcons name={eligibility === 'Layak' ? 'thumb-up-alt' : 'priority-high'} size={20} color={eligibility === 'Layak' ? '#15a362' : '#f97316'} />
          <ThemedText type="defaultSemiBold" style={styles.eligibilityText}>
            Status: {eligibility}
          </ThemedText>
        </View>
        <InfoNote>
          Hasil ini hanya simulasi. Penyalur tetap melakukan verifikasi lanjutan sebelum pencairan.
        </InfoNote>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Formulir Pengajuan" subtitle="Lengkapi data usaha dan kebutuhan pembiayaan." />
        <View style={styles.group}>
          <ThemedText style={styles.groupLabel}>Data Usaha</ThemedText>
          {[
            { placeholder: 'Nama Usaha', key: 'namaUsaha' },
            { placeholder: 'Alamat Lengkap', key: 'alamat' },
            { placeholder: 'Sektor / KBLI', key: 'kbli' },
            { placeholder: 'Skala Usaha (mikro/kecil)', key: 'skala' },
            { placeholder: 'Omzet per Bulan', key: 'omzet' },
            { placeholder: 'Laba Bersih per Bulan', key: 'laba' },
            { placeholder: 'Jumlah Karyawan', key: 'karyawan' },
          ].map(field => (
            <TextInput
              key={field.key}
              placeholder={field.placeholder}
              placeholderTextColor="#94a3b8"
              style={styles.input}
            />
          ))}
        </View>

        <View style={styles.group}>
          <ThemedText style={styles.groupLabel}>Pembiayaan Diminta</ThemedText>
          <TextInput
            placeholder="Plafon (contoh: 150000000)"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            value={plafon}
            onChangeText={setPlafon}
            style={styles.input}
          />
          <View style={styles.selectorBlock}>
            <ThemedText style={styles.selectorTitle}>Tenor (bulan)</ThemedText>
            <View style={styles.chipRow}>
              {tenorOptions.map(option => (
                <Pressable
                  key={option}
                  onPress={() => setTenor(option)}
                  style={({ pressed }) => [styles.chip, tenor === option && styles.chipActive, pressed && styles.pressed]}
                >
                  <ThemedText style={tenor === option ? styles.chipTextActive : styles.chipText}>{option}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.selectorBlock}>
            <ThemedText style={styles.selectorTitle}>Tujuan Pembiayaan</ThemedText>
            <View style={styles.chipRow}>
              {loanPurpose.map(option => (
                <Pressable
                  key={option}
                  onPress={() => setPurpose(option)}
                  style={({ pressed }) => [styles.chip, purpose === option && styles.chipActive, pressed && styles.pressed]}
                >
                  <ThemedText style={purpose === option ? styles.chipTextActive : styles.chipText}>{option}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.group}>
          <ThemedText style={styles.groupLabel}>Penyalur</ThemedText>
          {distributors.map(option => (
            <Pressable
              key={option}
              onPress={() => setDistributor(option)}
              style={({ pressed }) => [styles.optionRow, distributor === option && styles.optionRowActive, pressed && styles.pressed]}
            >
              <MaterialIcons
                name={distributor === option ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={18}
                color={distributor === option ? '#0a7ea4' : '#94a3b8'}
              />
              <ThemedText style={styles.optionLabel}>{option}</ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.group}>
          <ThemedText style={styles.groupLabel}>Kontak & Lokasi</ThemedText>
          <TextInput placeholder="Nomor HP" placeholderTextColor="#94a3b8" keyboardType="phone-pad" style={styles.input} />
          <TextInput placeholder="Email" placeholderTextColor="#94a3b8" keyboardType="email-address" style={styles.input} />
          <Pressable
            onPress={() => Alert.alert('Pin Lokasi', 'Fitur pilih lokasi di peta akan ditambahkan (mock).')}
            style={({ pressed }) => [styles.mapPicker, pressed && styles.pressed]}
          >
            <MaterialIcons name="place" size={20} color="#0a7ea4" />
            <ThemedText style={styles.mapPickerText}>Pilih lokasi usaha di peta</ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      <Checklist title="Dokumen" subtitle="Unggah dokumen sesuai ketentuan." items={documents} />

      <DocumentVault items={vaultItems} />

      <ThemedView style={styles.card}>
        <SectionHeader title="Ringkasan & Ajukan" subtitle="Periksa kembali sebelum mengirim." />
        <SummaryRow icon="payments" label="Plafon Diminta" value={formatCurrency(Number(plafon) || 0)} />
        <SummaryRow icon="schedule" label="Tenor" value={`${tenor || '-'} bulan`} />
        <SummaryRow icon="trending-up" label="Estimasi Angsuran" value={installment} />
        <InfoNote>
          Estimasi angsuran menggunakan asumsi bunga subsidi 6% per tahun. Nilai aktual mengikuti perhitungan bank penyalur.
        </InfoNote>
        <Pressable
          onPress={() => Alert.alert('Pengajuan Dikirim', 'Pengajuan KUR dikirim ke penyalur (mock).')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="send" size={18} color="#ffffff" />
          <ThemedText style={styles.primaryButtonText}>Ajukan Pembiayaan</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Pelacakan & Tindak Lanjut" subtitle="Pantau status pengajuan Anda." />
        <StatusTimeline items={timelineItems} />
        <View style={styles.followUpCard}>
          <ThemedText type="defaultSemiBold" style={styles.followTitle}>
            Jika Disetujui
          </ThemedText>
          <ThemedText style={styles.followText}>
            Unduh surat persetujuan dan jadwalkan kedatangan ke bank pada 20 Nov 2025 pukul 10.00 WIB.
          </ThemedText>
          <Pressable
            onPress={() => Alert.alert('Surat Persetujuan', 'File PDF dummy akan diunduh (mock).')}
            style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
          >
            <MaterialIcons name="picture-as-pdf" size={18} color="#ffffff" />
            <ThemedText style={styles.smallButtonText}>Unduh Surat</ThemedText>
          </Pressable>
        </View>
        <View style={styles.followUpCardWarning}>
          <ThemedText type="defaultSemiBold" style={styles.followTitle}>
            Jika Ditolak
          </ThemedText>
          <ThemedText style={styles.followText}>
            Alasan: Rekap omzet kurang lengkap.
            Rekomendasi: unggah bukti omzet 3 bulan terakhir dan lampirkan pembukuan sederhana.
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
    gap: 14,
  },
  eligibilityRow: {
    gap: 8,
  },
  eligibilityLabel: {
    color: '#0f172a',
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
  eligibilityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
  },
  eligibilityText: {
    color: '#0f172a',
  },
  group: {
    gap: 10,
  },
  groupLabel: {
    fontSize: 14,
    color: '#0f172a',
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
  selectorBlock: {
    gap: 8,
  },
  selectorTitle: {
    color: '#475569',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    padding: 12,
  },
  optionRowActive: {
    backgroundColor: '#f1f5f9',
    borderColor: '#0a7ea4',
  },
  optionLabel: {
    flex: 1,
    color: '#0f172a',
  },
  mapPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#f8fafc',
  },
  mapPickerText: {
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
