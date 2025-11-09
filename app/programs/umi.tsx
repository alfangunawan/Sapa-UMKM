import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    View,
} from 'react-native';

import {
    Checklist,
    DocumentVault,
    InfoNote,
    SectionHeader,
    StatusTimeline,
    SummaryRow,
} from '@/components/program-shared';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const eligibilityChecks = [
  { id: 'scale', label: 'Skala usaha mikro (asset < Rp 50 juta)', requiredYes: true },
  { id: 'plafon', label: 'Butuh plafon ≤ Rp 20 juta', requiredYes: true },
  { id: 'domicile', label: 'Domisili sesuai titik layanan penyalur', requiredYes: true },
  { id: 'arrears', label: 'Tidak menunggak pembiayaan lain', requiredYes: true },
];

const distributors = ['PT Pegadaian', 'PNM Mekaar', 'BLU UMi', 'Koperasi Sejahtera'];
const timelineItems = [
  { label: 'Diajukan', description: 'Permohonan diterima di sistem penyalur.', state: 'complete' as const },
  { label: 'Verifikasi', description: 'Petugas memeriksa kelengkapan data.', state: 'current' as const },
  { label: 'Keputusan', description: 'Disetujui atau Ditolak.', state: 'upcoming' as const },
];

const documents = [
  { id: 'ktp', label: 'e-KTP Pemilik', required: true },
  { id: 'fotoTempat', label: 'Foto Tempat Usaha', required: true },
  { id: 'aktivitas', label: 'Bukti Aktivitas Usaha (produk/lapak)', required: true },
  { id: 'rekening', label: 'Rekening / QRIS (opsional)', required: false },
];

const vaultItems = [
  { id: 'vault-ktp', name: 'KTP_Pemilik.pdf', type: 'PDF', lastUpdated: '05 Nov 2025' },
  { id: 'vault-foto', name: 'Foto-Lapak-UMi.jpg', type: 'JPG', lastUpdated: '01 Nov 2025' },
];

function formatCurrency(value: number) {
  if (Number.isNaN(value)) {
    return 'Rp 0';
  }
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function UMiScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, 'ya' | 'tidak'>>({});
  const [plafon, setPlafon] = useState('8000000');
  const [tenor, setTenor] = useState('12');
  const [useCollateral, setUseCollateral] = useState(false);
  const [distributor, setDistributor] = useState('PT Pegadaian');

  const installment = useMemo(() => {
    const amount = Number(plafon);
    const months = Number(tenor);
    if (!amount || !months) {
      return 'Lengkapi plafon dan tenor';
    }
    const rate = 0.03 / 12; // bunga lebih rendah untuk UMi
    const installmentValue = (amount * rate) / (1 - Math.pow(1 + rate, -months));
    return `${formatCurrency(Math.round(installmentValue))} / bulan`;
  }, [plafon, tenor]);

  const eligibility = useMemo(() => {
    const unmet = eligibilityChecks.some(check => {
      const answer = answers[check.id];
      if (!answer) {
        return true;
      }
      return check.requiredYes && answer !== 'ya';
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
          Pembiayaan Ultra Mikro (UMi)
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Tentang UMi', 'Pendanaan cepat tanpa agunan tambahan dengan plafon maksimal Rp 20 juta.')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="info-outline" size={22} color="#0a7ea4" />
        </Pressable>
      </View>

      <ThemedView style={styles.card}>
        <SectionHeader title="Cek Kelayakan" subtitle="Pastikan usaha Anda memenuhi kriteria dasar." />
        <View style={styles.eligibilityList}>
          {eligibilityChecks.map(check => (
            <View key={check.id} style={styles.eligibilityRow}>
              <ThemedText style={styles.eligibilityLabel}>{check.label}</ThemedText>
              <View style={styles.chipRow}>
                {['ya', 'tidak'].map(option => (
                  <Pressable
                    key={option}
                    onPress={() => setAnswers(prev => ({ ...prev, [check.id]: option as 'ya' | 'tidak' }))}
                    style={({ pressed }) => [
                      styles.chip,
                      answers[check.id] === option && styles.chipActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <ThemedText style={answers[check.id] === option ? styles.chipTextActive : styles.chipText}>
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
          Estimasi proses 3-5 hari kerja setelah dokumen lengkap.
        </InfoNote>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Formulir" subtitle="Masukkan kebutuhan pendanaan Anda." />
        <TextInput
          placeholder="Plafon diminta (contoh: 8000000)"
          placeholderTextColor="#94a3b8"
          keyboardType="number-pad"
          value={plafon}
          onChangeText={setPlafon}
          style={styles.input}
        />
        <View style={styles.selectorBlock}>
          <ThemedText style={styles.selectorTitle}>Tenor (bulan)</ThemedText>
          <View style={styles.chipRow}>
            {['6', '9', '12', '18'].map(option => (
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
        <TextInput
          placeholder="Kegunaan dana (contoh: modal stok, peralatan)"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={styles.switchLabel}>
              Opsi Tanpa Agunan Tambahan
            </ThemedText>
            <ThemedText style={styles.switchCaption}>Centang jika memilih skema tanpa agunan.</ThemedText>
          </View>
          <Switch
            value={!useCollateral}
            onValueChange={value => setUseCollateral(!value)}
            trackColor={{ false: '#cbd5f5', true: '#0a7ea4' }}
            thumbColor="#ffffff"
          />
        </View>
        <SectionHeader title="Pilih Penyalur" />
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
      </ThemedView>

      <Checklist title="Dokumen" subtitle="Lengkapi bukti usaha untuk percepat verifikasi." items={documents} />

      <DocumentVault items={vaultItems} />

      <ThemedView style={styles.card}>
        <SectionHeader title="Ringkasan & Ajukan" />
        <SummaryRow icon="payments" label="Plafon" value={formatCurrency(Number(plafon) || 0)} />
        <SummaryRow icon="schedule" label="Tenor" value={`${tenor || '-'} bulan`} />
        <SummaryRow icon="trending-up" label="Estimasi Angsuran" value={installment} />
        <SummaryRow icon="shield" label="Agunan Tambahan" value={useCollateral ? 'Dibutuhkan' : 'Tanpa agunan'} />
        <Pressable
          onPress={() => Alert.alert('Pengajuan UMi', 'Permohonan UMi berhasil dikirim (mock).')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="send" size={18} color="#ffffff" />
          <ThemedText style={styles.primaryButtonText}>Ajukan Sekarang</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Pelacakan" subtitle="Pantau perkembangan permohonan." />
        <StatusTimeline items={timelineItems} />
        <View style={styles.followUpCard}>
          <ThemedText type="defaultSemiBold" style={styles.followTitle}>
            Jika Disetujui
          </ThemedText>
          <ThemedText style={styles.followText}>
            Datangi titik layanan {distributor} terdekat dalam 2 hari kerja untuk pencairan tunai atau transfer cepat.
          </ThemedText>
          <Pressable
            onPress={() => Alert.alert('Titik Layanan', 'Map layanan terdekat akan dibuka (mock).')}
            style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
          >
            <MaterialIcons name="map" size={18} color="#ffffff" />
            <ThemedText style={styles.smallButtonText}>Lihat Lokasi</ThemedText>
          </Pressable>
        </View>
        <View style={styles.followUpCardWarning}>
          <ThemedText type="defaultSemiBold" style={styles.followTitle}>
            Jika Ditolak
          </ThemedText>
          <ThemedText style={styles.followText}>
            Alasan umum: bukti aktivitas usaha belum lengkap. Unggah foto produk terbaru atau lampirkan bukti transaksi.
          </ThemedText>
        </View>
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  switchLabel: {
    color: '#0f172a',
  },
  switchCaption: {
    fontSize: 12,
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
