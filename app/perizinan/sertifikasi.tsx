import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const certificationTypes = [
  { id: 'halal', label: 'Sertifikasi Halal BPJPH', duration: 'Estimasi 30 hari kerja' },
  { id: 'sni', label: 'Sertifikasi SNI', duration: 'Estimasi 45 hari kerja' },
  { id: 'bpom', label: 'Izin Edar BPOM', duration: 'Estimasi 20 hari kerja' },
];

const timeline = [
  { label: 'Pre-Audit', description: 'Dokumen lengkap, jadwal audit disusun', state: 'complete' as const },
  { label: 'Audit Lapangan', description: 'Tim auditor melakukan inspeksi', state: 'current' as const },
  { label: 'Tindak Lanjut', description: 'Perbaikan temuan minor', state: 'upcoming' as const },
  { label: 'Sertifikat Terbit', description: 'Dokumen digital dan fisik diterbitkan', state: 'upcoming' as const },
];

const checklistItems = [
  { label: 'Dokumen legal usaha (NIB, NPWP)', required: true },
  { label: 'Standar Operasional Proses Produksi', required: true },
  { label: 'Hasil uji laboratorium pendukung', required: false },
  { label: 'Catatan Kalibrasi Alat Produksi', required: false },
];

export default function SertifikasiScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('halal');
  const [onSiteAudit, setOnSiteAudit] = useState(false);

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
          Pengajuan Sertifikasi
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Panduan Sertifikasi', 'Ikuti standar sanitasi dan dokumentasi proses produksi secara konsisten.')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="help-outline" size={22} color="#0a7ea4" />
        </Pressable>
      </View>

      <ThemedView style={styles.bannerCard}>
        <MaterialIcons name="verified" size={28} color="#0a7ea4" />
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" style={styles.bannerTitle}>
            Keunggulan Produk Tersertifikasi
          </ThemedText>
          <ThemedText style={styles.bannerSubtitle}>
            Tingkatkan kepercayaan dan akses pasar resmi melalui sertifikasi terakreditasi.
          </ThemedText>
        </View>
        <Pressable
          onPress={() => Alert.alert('Jadwalkan Konsultasi', 'Konsultasi awal akan dijadwalkan (mock).')}
          style={({ pressed }) => [styles.bannerButton, pressed && styles.pressed]}
        >
          <ThemedText style={styles.bannerButtonText}>Konsultasi</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Pilih Jenis Sertifikasi" subtitle="Sesuaikan dengan kebutuhan produk Anda." />
        {certificationTypes.map(option => (
          <Pressable
            key={option.id}
            onPress={() => setSelectedType(option.id)}
            style={({ pressed }) => [styles.typeRow, selectedType === option.id && styles.typeRowActive, pressed && styles.pressed]}
          >
            <MaterialIcons
              name={selectedType === option.id ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={20}
              color={selectedType === option.id ? '#0a7ea4' : '#94a3b8'}
            />
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={styles.typeLabel}>
                {option.label}
              </ThemedText>
              <ThemedText style={styles.typeDuration}>{option.duration}</ThemedText>
            </View>
          </Pressable>
        ))}
        <ValidationHint text="Biaya dan syarat tambahan menyesuaikan pilihan sertifikasi." />
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Informasi Produk" subtitle="Lengkapi detail produk dan proses produksi." />
        <InputField label="Nama Produk" placeholder="Contoh: Sambal Nusantara" />
        <InputField label="Komposisi Utama" placeholder="Daftar bahan baku utama" multiline />
        <InputField label="Lokasi Produksi" placeholder="Alamat lengkap fasilitas" />
        <SwitchRow
          label="Butuh Audit di Luar Jadwal?"
          caption="Aktifkan jika membutuhkan audit tambahan mendadak."
          value={onSiteAudit}
          onValueChange={setOnSiteAudit}
        />
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Unggahan Wajib" subtitle="Pastikan dokumen hasil scan terbaca jelas." />
        {checklistItems.map(item => (
          <UploadRow key={item.label} label={item.label} required={item.required} />
        ))}
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Checklist Kepatuhan" subtitle="Evaluasi mandiri sebelum auditor datang." />
        {[
          'Prosedur kebersihan tempat produksi terdokumentasi',
          'Alur penanganan bahan baku sesuai SOP',
          'Catatan penjemputan sampel uji tersedia',
        ].map(item => (
          <ComplianceRow key={item} label={item} />
        ))}
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Timeline Proses" subtitle="Pantau perkembangan permohonan sertifikasi." />
        <View style={styles.timeline}>
          {timeline.map(step => (
            <TimelineRow key={step.label} {...step} />
          ))}
        </View>
        <Pressable
          onPress={() => Alert.alert('Lihat Jadwal Audit', 'Daftar jadwal audit akan ditampilkan (mock).')}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="event-note" size={18} color="#0a7ea4" />
          <ThemedText style={styles.secondaryButtonText}>Lihat Jadwal Audit</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Rangkuman Biaya" subtitle="Estimasi berdasarkan pilihan sertifikasi dan layanan." />
        <SummaryRow label="Biaya Sertifikasi" value="Rp 3.200.000" />
        <SummaryRow label="Biaya Konsultasi" value="Rp 500.000" />
        <SummaryRow label="Audit Tambahan" value={onSiteAudit ? 'Rp 750.000' : 'Tidak dipilih'} />
        <View style={styles.totalRow}>
          <ThemedText type="defaultSemiBold" style={styles.totalLabel}>
            Total Estimasi
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.totalValue}>
            {onSiteAudit ? 'Rp 4.450.000' : 'Rp 3.700.000'}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => Alert.alert('Pengajuan Sertifikasi', 'Pengajuan sertifikasi telah dikirim (mock).')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <ThemedText style={styles.primaryButtonText}>Ajukan Sertifikasi</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Dokumen Sertifikat" subtitle="Unduh sertifikat dan lampiran audit." />
        <CertificateRow
          title="Sertifikat Halal BPJPH"
          detail="Terbit 04 Nov 2025 · Berlaku 4 tahun"
          actionLabel="Unduh"
          onPress={() => Alert.alert('Unduh Sertifikat', 'Sertifikat akan diunduh (mock).')}
        />
        <CertificateRow
          title="Laporan Audit"
          detail="Temuan minor terselesaikan"
          actionLabel="Lihat"
          onPress={() => Alert.alert('Laporan Audit', 'Laporan audit akan ditampilkan (mock).')}
        />
      </ThemedView>
    </ScrollView>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <ThemedText style={styles.sectionSubtitle}>{subtitle}</ThemedText>
    </View>
  );
}

function ValidationHint({ text }: { text: string }) {
  return <ThemedText style={styles.validationHint}>{text}</ThemedText>;
}

function InputField({
  label,
  placeholder,
  multiline,
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );
}

function SwitchRow({
  label,
  caption,
  value,
  onValueChange,
}: {
  label: string;
  caption: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.switchRow}>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold" style={styles.switchLabel}>
          {label}
        </ThemedText>
        <ThemedText style={styles.switchCaption}>{caption}</ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#cbd5f5', true: '#0a7ea4' }}
        thumbColor={value ? '#ffffff' : '#f8fafc'}
      />
    </View>
  );
}

function UploadRow({ label, required }: { label: string; required: boolean }) {
  return (
    <View style={styles.uploadRow}>
      <MaterialIcons name="cloud-upload" size={20} color="#0a7ea4" />
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{label}</ThemedText>
        <ThemedText style={styles.uploadMeta}>{required ? 'Wajib' : 'Opsional'} · PDF/JPG</ThemedText>
      </View>
      <Pressable
        onPress={() => Alert.alert('Unggah Dokumen', `${label} siap diunggah (mock).`)}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
      >
        <MaterialIcons name="upload" size={18} color="#0a7ea4" />
        <ThemedText style={styles.secondaryButtonText}>Unggah</ThemedText>
      </Pressable>
    </View>
  );
}

function ComplianceRow({ label }: { label: string }) {
  return (
    <View style={styles.complianceRow}>
      <MaterialIcons name="checklist" size={20} color="#0a7ea4" />
      <ThemedText style={styles.complianceLabel}>{label}</ThemedText>
      <Pressable
        onPress={() => Alert.alert(label, 'Checklist detail akan ditampilkan (mock).')}
        style={({ pressed }) => [styles.tag, pressed && styles.pressed]}
      >
        <ThemedText style={styles.tagText}>Detail</ThemedText>
      </Pressable>
    </View>
  );
}

function TimelineRow({
  label,
  description,
  state,
}: {
  label: string;
  description: string;
  state: 'complete' | 'current' | 'upcoming';
}) {
  const config = {
    complete: { icon: 'check-circle', color: '#15a362' },
    current: { icon: 'pending', color: '#f97316' },
    upcoming: { icon: 'radio-button-unchecked', color: '#94a3b8' },
  } as const;

  const current = config[state];
  return (
    <View style={styles.timelineRow}>
      <MaterialIcons name={current.icon} size={20} color={current.color} />
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{label}</ThemedText>
        <ThemedText style={styles.timelineDescription}>{description}</ThemedText>
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <ThemedText style={styles.summaryLabel}>{label}</ThemedText>
      <ThemedText style={styles.summaryValue}>{value}</ThemedText>
    </View>
  );
}

function CertificateRow({
  title,
  detail,
  actionLabel,
  onPress,
}: {
  title: string;
  detail: string;
  actionLabel: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.certificateRow}>
      <MaterialIcons name="picture-as-pdf" size={22} color="#0a7ea4" />
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText style={styles.certificateDetail}>{detail}</ThemedText>
      </View>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}>
        <ThemedText style={styles.smallButtonText}>{actionLabel}</ThemedText>
      </Pressable>
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
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#0f172a',
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
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
  },
  bannerTitle: {
    fontSize: 15,
    color: '#0f172a',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  bannerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#0a7ea4',
  },
  bannerButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  card: {
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
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  typeRowActive: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  typeLabel: {
    color: '#0f172a',
  },
  typeDuration: {
    fontSize: 12,
    color: '#64748b',
  },
  validationHint: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    color: '#475569',
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
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    color: '#0f172a',
  },
  switchCaption: {
    fontSize: 12,
    color: '#64748b',
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  uploadMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  complianceLabel: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#e0f4fa',
  },
  tagText: {
    fontSize: 12,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  timeline: {
    gap: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  secondaryButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  secondaryButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    color: '#475569',
  },
  summaryValue: {
    color: '#0f172a',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalLabel: {
    color: '#0f172a',
  },
  totalValue: {
    color: '#0a7ea4',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  certificateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  certificateDetail: {
    fontSize: 12,
    color: '#64748b',
  },
  smallButton: {
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
