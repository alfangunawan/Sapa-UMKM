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

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type StatusStep = {
  label: string;
  description: string;
  state: 'complete' | 'current' | 'upcoming' | 'rejected';
};

const statusSteps: StatusStep[] = [
  {
    label: 'Diajukan',
    description: 'Pengajuan dikirim 21 Okt 2025',
    state: 'complete',
  },
  {
    label: 'Diverifikasi',
    description: 'Validasi data oleh petugas',
    state: 'current',
  },
  {
    label: 'Keputusan',
    description: 'Menunggu hasil persetujuan',
    state: 'upcoming',
  },
];

const validationHints = {
  nik: 'NIK wajib 16 digit angka.',
  npwp: 'NPWP minimal 15 digit angka.',
  kbli: 'Pilih KBLI sesuai jenis usaha.',
  dokumen: 'Ukuran berkas maksimal 2MB, format JPG/PNG/PDF.',
};

export default function NibScreen() {
  const router = useRouter();
  const [flowType, setFlowType] = useState<'buat' | 'perbarui'>('buat');
  const activeSteps = useMemo(() => statusSteps, []);

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
          Pengajuan & Pembaruan NIB
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Panduan OSS RBA', 'Ikuti langkah-langkah sesuai data usaha Anda.')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="help-outline" size={22} color="#0a7ea4" />
        </Pressable>
      </View>

      <ThemedView style={styles.selectionCard}>
        <ThemedText type="defaultSemiBold">Mulai Pengajuan</ThemedText>
        <View style={styles.toggleRow}>
          {[
            { label: 'Buat NIB Baru', value: 'buat' as const },
            { label: 'Perbarui NIB', value: 'perbarui' as const },
          ].map(option => (
            <Pressable
              key={option.value}
              onPress={() => setFlowType(option.value)}
              style={[styles.toggleButton, flowType === option.value && styles.toggleButtonActive]}
            >
              <ThemedText style={flowType === option.value ? styles.toggleLabelActive : styles.toggleLabel}>
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
        <ThemedText style={styles.helperText}>
          {flowType === 'buat'
            ? 'Panduan ini mengikuti OSS RBA untuk pelaku usaha baru.'
            : 'Gunakan fitur ini untuk memperbarui data usaha dan kelayakan NIB.'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionCard}>
        <SectionHeader title="Verifikasi Identitas" subtitle="Pastikan data pemilik usaha valid." />
        <InputRow label="NIK" placeholder="16 digit" helper={validationHints.nik} />
        <InputRow label="NPWP" placeholder="15 digit" helper={validationHints.npwp} />
        <Pressable
          onPress={() => Alert.alert('Verifikasi OTP', 'Kode OTP telah dikirim ke nomor terdaftar (mock).')}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="verified-user" size={18} color="#ffffff" />
          <ThemedText style={styles.actionButtonText}>Kirim OTP Verifikasi</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.sectionCard}>
        <SectionHeader title="Data Usaha" subtitle="Informasi utama usaha Anda." />
        <InputRow label="Nama Usaha" placeholder="Contoh: Kopi Nusantara" />
        <FieldRow
          label="Alamat Usaha"
          value="Belum dipilih"
          icon="map"
          onPress={() => Alert.alert('Pilih Lokasi', 'Maps picker akan tersedia di versi final.')}
          error="Alamat usaha belum diisi"
        />
        <FieldRow
          label="KBLI"
          value="Cari kode KBLI"
          icon="search"
          onPress={() => Alert.alert('Pencarian KBLI', 'Autocomplete KBLI akan tersedia (mock).')}
          error="KBLI belum dipilih"
        />
        <InputRow label="Sektor" placeholder="Perdagangan Besar" />
        <InputRow label="Skala Usaha" placeholder="Mikro / Kecil" helper="Pastikan omzet sesuai aturan." />
        <InputRow label="Modal Usaha (Rp)" placeholder="Masukkan estimasi modal" />
      </ThemedView>

      <ThemedView style={styles.sectionCard}>
        <SectionHeader title="Dokumen Pendukung" subtitle="Upload berkas maksimal 2MB." />
        {[
          { label: 'e-KTP Pemilik', required: true, status: 'Siap unggah' },
          { label: 'Surat Keterangan Domisili', required: false, status: 'Opsional' },
          { label: 'Foto Tempat Usaha', required: true, status: 'Perlu resolusi jelas' },
        ].map(doc => (
          <View key={doc.label} style={styles.documentRow}>
            <View style={styles.documentInfo}>
              <MaterialIcons name="upload-file" size={20} color="#0a7ea4" />
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={styles.documentTitle}>
                  {doc.label}
                </ThemedText>
                <ThemedText style={styles.documentMeta}>
                  {doc.required ? 'Wajib' : 'Opsional'} · {doc.status}
                </ThemedText>
              </View>
            </View>
            <Pressable
              onPress={() => Alert.alert('Unggah Dokumen', 'Simulasi upload akan ditambahkan.')}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <ThemedText style={styles.secondaryActionText}>Unggah</ThemedText>
            </Pressable>
          </View>
        ))}
        <ThemedText style={styles.helperText}>{validationHints.dokumen}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionCard}>
        <SectionHeader title="Tinjau & Kirim" subtitle="Periksa kembali seluruh data sebelum mengajukan." />
        <SummaryRow icon="fact-check" title="Ringkasan Data" value="7 field terisi" />
        <SummaryRow icon="error-outline" title="Dokumen" value="2 wajib · 1 opsional" />
        <View style={styles.declarationBox}>
          <MaterialIcons name="check-circle" size={20} color="#15a362" />
          <ThemedText style={styles.declarationText}>
            Saya menyatakan bahwa data dan dokumen yang saya kirim adalah benar dan dapat dipertanggungjawabkan.
          </ThemedText>
        </View>
        <Pressable
          onPress={() => Alert.alert('Pengajuan Dikirim', 'Pengajuan NIB Anda telah dikirim untuk diverifikasi (mock).')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <ThemedText style={styles.primaryButtonText}>Ajukan Sekarang</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.sectionCard}>
        <SectionHeader title="Pelacakan Status" subtitle="Pantau perkembangan pengajuan." />
        <View style={styles.timeline}>
          {activeSteps.map(step => (
            <StatusRow key={step.label} step={step} />
          ))}
        </View>
        <ThemedView style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialIcons name="picture-as-pdf" size={22} color="#0a7ea4" />
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">NIB-1234567890123.pdf</ThemedText>
              <ThemedText style={styles.statusMeta}>Terbit 12 Nov 2025 · 450KB</ThemedText>
            </View>
          </View>
          <View style={styles.statusActions}>
            <Pressable
              onPress={() => Alert.alert('Unduh NIB', 'File PDF akan diunduh (mock).')}
              style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
            >
              <MaterialIcons name="download" size={18} color="#ffffff" />
              <ThemedText style={styles.smallButtonText}>Unduh</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => Alert.alert('Bagikan NIB', 'Bagikan melalui email/WhatsApp (mock).')}
              style={({ pressed }) => [styles.smallButtonOutline, pressed && styles.pressed]}
            >
              <MaterialIcons name="share" size={18} color="#0a7ea4" />
              <ThemedText style={styles.smallButtonOutlineText}>Bagikan</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.vaultCard}>
        <ThemedText type="defaultSemiBold">Document Vault</ThemedText>
        {[
          { label: 'e-KTP Pemilik.pdf', size: '420KB' },
          { label: 'Akta Usaha.pdf', size: '1.1MB' },
          { label: 'Foto Toko.jpg', size: '600KB' },
        ].map(item => (
          <View key={item.label} style={styles.vaultRow}>
            <MaterialIcons name="folder" size={20} color="#0a7ea4" />
            <View style={{ flex: 1 }}>
              <ThemedText>{item.label}</ThemedText>
              <ThemedText style={styles.vaultMeta}>{item.size}</ThemedText>
            </View>
            <Pressable
              onPress={() => Alert.alert('Gunakan Dokumen', 'Dokumen siap dipakai ulang.')}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <ThemedText style={styles.secondaryActionText}>Gunakan</ThemedText>
            </Pressable>
          </View>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedText style={styles.sectionSubtitle}>{subtitle}</ThemedText>
    </View>
  );
}

function InputRow({
  label,
  placeholder,
  helper,
}: {
  label: string;
  placeholder: string;
  helper?: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TextInput
        placeholder={placeholder}
        style={styles.textInput}
        placeholderTextColor="#94a3b8"
      />
      {helper ? <ThemedText style={styles.helperText}>{helper}</ThemedText> : null}
    </View>
  );
}

function FieldRow({
  label,
  value,
  icon,
  onPress,
  error,
}: {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  error?: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.fieldRow, pressed && styles.fieldRowPressed]}
      >
        <MaterialIcons name={icon} size={18} color="#0a7ea4" />
        <ThemedText style={styles.fieldValue}>{value}</ThemedText>
        <MaterialIcons name="chevron-right" size={20} color="#cbd5f5" />
      </Pressable>
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
    </View>
  );
}

function SummaryRow({
  icon,
  title,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <MaterialIcons name={icon} size={20} color="#0a7ea4" />
      <ThemedText style={styles.summaryTitle}>{title}</ThemedText>
      <ThemedText style={styles.summaryValue}>{value}</ThemedText>
    </View>
  );
}

function StatusRow({ step }: { step: StatusStep }) {
  const iconConfig = {
    complete: { name: 'check-circle', color: '#15a362' },
    current: { name: 'pending', color: '#f97316' },
    upcoming: { name: 'radio-button-unchecked', color: '#cbd5f5' },
    rejected: { name: 'highlight-off', color: '#f04461' },
  } as const;

  const icon = iconConfig[step.state];

  return (
    <View style={styles.timelineRow}>
      <MaterialIcons name={icon.name} size={20} color={icon.color} />
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{step.label}</ThemedText>
        <ThemedText style={styles.timelineMeta}>{step.description}</ThemedText>
      </View>
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
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#0f172a',
  },
  pressed: {
    opacity: 0.85,
  },
  selectionCard: {
    gap: 14,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#eef6ff',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  toggleLabel: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  toggleLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  sectionCard: {
    gap: 16,
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
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#0f172a',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#475569',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  fieldRowPressed: {
    backgroundColor: '#f1f5f9',
  },
  fieldValue: {
    flex: 1,
    color: '#64748b',
  },
  errorText: {
    fontSize: 12,
    color: '#f04461',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#0a7ea4',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f6',
    gap: 12,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  documentTitle: {
    fontSize: 14,
    color: '#0f172a',
  },
  documentMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  secondaryAction: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#e0f4fa',
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryTitle: {
    flex: 1,
    color: '#475569',
  },
  summaryValue: {
    color: '#0f172a',
    fontWeight: '600',
  },
  declarationBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
  },
  declarationText: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  timeline: {
    gap: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  timelineMeta: {
    fontSize: 13,
    color: '#64748b',
  },
  statusCard: {
    marginTop: 12,
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f0f9ff',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  statusActions: {
    flexDirection: 'row',
    gap: 12,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  smallButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  smallButtonOutlineText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  vaultCard: {
    gap: 12,
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
  vaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vaultMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
