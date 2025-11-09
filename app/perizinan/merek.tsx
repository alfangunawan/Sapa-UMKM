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

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const kelasOptions = [
  { code: 'Kelas 30', description: 'Produk makanan, minuman, serta bumbu.' },
  { code: 'Kelas 25', description: 'Pakaian dan aksesori fesyen.' },
  { code: 'Kelas 35', description: 'Jasa ritel dan pemasaran.' },
];

const statusTimeline = [
  { label: 'Diajukan', description: 'Formulir lengkap dikirim 10 Nov 2025', state: 'complete' as const },
  { label: 'Pemeriksaan Formalitas', description: 'Memastikan dokumen memenuhi syarat', state: 'complete' as const },
  { label: 'Pemeriksaan Substantif', description: 'Menilai kemiripan dan keberatan', state: 'current' as const },
  { label: 'Diumumkan', description: 'Pengumuman selama 2 bulan', state: 'upcoming' as const },
  { label: 'Terdaftar', description: 'Sertifikat siap diunduh', state: 'upcoming' as const },
];

const reminderItems = [
  { title: 'Perpanjangan', detail: 'Ajukan perpanjangan merek minimal H-180 sebelum masa berlaku habis.' },
  { title: 'Ubah Data', detail: 'Pastikan alamat korespondensi terbaru untuk kirim dokumen resmi.' },
];

export default function MerekScreen() {
  const router = useRouter();
  const [tipe, setTipe] = useState<'kata' | 'logo' | 'kombinasi'>('kata');
  const [kelas, setKelas] = useState<string>('');

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
          Registrasi & Manajemen Merek
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Panduan DJKI', 'Pastikan nama merek unik dan tidak bertentangan dengan hukum.')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="info-outline" size={22} color="#0a7ea4" />
        </Pressable>
      </View>

      <ThemedView style={styles.card}>
        <SectionHeader title="Mulai Registrasi" subtitle="Pilih jenis merek yang akan diajukan." />
        <View style={styles.segmentRow}>
          {[
            { label: 'Kata', value: 'kata' as const },
            { label: 'Logo', value: 'logo' as const },
            { label: 'Kombinasi', value: 'kombinasi' as const },
          ].map(option => (
            <Pressable
              key={option.value}
              onPress={() => setTipe(option.value)}
              style={[styles.segmentButton, tipe === option.value && styles.segmentButtonActive]}
            >
              <ThemedText style={tipe === option.value ? styles.segmentLabelActive : styles.segmentLabel}>
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
        <ValidationHint text="Nama merek tidak boleh kurang dari 3 karakter dan hindari kata umum." />
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Detail Merek" subtitle="Isi nama merek dan pilih kelas Nice Classification." />
        <InputGroup label="Nama Merek" placeholder="Contoh: Sari Nusantara" />
        <Pressable
          onPress={() => setKelas('Kelas 30')}
          style={({ pressed }) => [styles.selectorRow, pressed && styles.selectorRowActive]}
        >
          <MaterialIcons name="category" size={20} color="#0a7ea4" />
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={styles.selectorTitle}>
              {kelas || 'Pilih Kelas Barang/Jasa'}
            </ThemedText>
            <ThemedText style={styles.selectorSubtitle}>
              {kelas ? 'Tekan untuk mengganti kelas.' : 'Daftar Nice Classification versi ringkas tersedia.'}
            </ThemedText>
          </View>
          <MaterialIcons name="expand-more" size={24} color="#94a3b8" />
        </Pressable>
        <ThemedView style={styles.optionList}>
          {kelasOptions.map(item => (
            <Pressable
              key={item.code}
              onPress={() => setKelas(item.code)}
              style={({ pressed }) => [styles.optionRow, pressed && styles.optionRowActive]}
            >
              <MaterialIcons
                name={kelas === item.code ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={18}
                color={kelas === item.code ? '#0a7ea4' : '#94a3b8'}
              />
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">{item.code}</ThemedText>
                <ThemedText style={styles.optionDescription}>{item.description}</ThemedText>
              </View>
            </Pressable>
          ))}
        </ThemedView>
        <InputGroup
          label="Deskripsi Barang/Jasa"
          placeholder="Jelaskan produk atau layanan yang dilindungi merek."
          multiline
        />
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Lampiran" subtitle="Unggah bukti kepemilikan dan identitas." />
        {[
          { label: 'Logo (PNG/SVG)', required: true },
          { label: 'Contoh Kemasan / Label', required: false },
          { label: 'KTP / NPWP Pemilik', required: true },
        ].map(item => (
          <AttachmentRow key={item.label} label={item.label} required={item.required} />
        ))}
        <ValidationHint text="File logo maksimal 2MB. Gunakan latar transparan untuk hasil terbaik." />
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Cek Kemiripan" subtitle="Simulasi pengecekan sederhana terhadap basis data merek." />
        <View style={styles.riskMeter}>
          <MaterialIcons name="speed" size={22} color="#f97316" />
          <ThemedText type="defaultSemiBold" style={styles.riskLabel}>
            Risiko Kemiripan: Sedang
          </ThemedText>
          <ThemedText style={styles.riskCaption}>Disarankan meninjau kembali kata kunci atau menambah elemen visual.</ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Ringkasan & Biaya" subtitle="Konfirmasi informasi sebelum mengajukan." />
        <SummaryRow icon="fact-check" title="Kolom terisi" value="8/8" />
        <SummaryRow icon="attach-money" title="Estimasi PNBP" value="Rp 1.800.000" />
        <SummaryRow icon="policy" title="Jangka Waktu Pelindungan" value="10 tahun" />
        <View style={styles.declarationBox}>
          <MaterialIcons name="check-circle" size={20} color="#15a362" />
          <ThemedText style={styles.declarationText}>
            Saya menyetujui biaya dan ketentuan pendaftaran merek sesuai regulasi DJKI.
          </ThemedText>
        </View>
        <Pressable
          onPress={() => Alert.alert('Pengajuan Dikirim', 'Pengajuan merek berhasil dikirim (mock).')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <ThemedText style={styles.primaryButtonText}>Ajukan Registrasi</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Pelacakan Status" subtitle="Ikuti tahapan registrasi merek." />
        <View style={styles.timeline}>
          {statusTimeline.map(item => (
            <TimelineRow key={item.label} {...item} />
          ))}
        </View>
        <ThemedView style={styles.statusCard}>
          <View style={styles.pdfRow}>
            <MaterialIcons name="picture-as-pdf" size={22} color="#0a7ea4" />
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">Sertifikat-Merek-SariNusantara.pdf</ThemedText>
              <ThemedText style={styles.statusMeta}>Tersedia setelah status Terdaftar</ThemedText>
            </View>
          </View>
          <View style={styles.ctaRow}>
            <Pressable
              onPress={() => Alert.alert('Unduh Sertifikat', 'Sertifikat akan diunduh (mock).')}
              style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
            >
              <MaterialIcons name="download" size={18} color="#ffffff" />
              <ThemedText style={styles.smallButtonText}>Unduh</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => Alert.alert('Lihat Riwayat', 'Riwayat perubahan akan ditampilkan.')}
              style={({ pressed }) => [styles.smallButtonOutline, pressed && styles.pressed]}
            >
              <MaterialIcons name="history" size={18} color="#0a7ea4" />
              <ThemedText style={styles.smallButtonOutlineText}>Riwayat</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.card}>
        <SectionHeader title="Manajemen Setelah Terdaftar" subtitle="Atur perpanjangan dan perubahan data." />
        {reminderItems.map(item => (
          <View key={item.title} style={styles.reminderRow}>
            <MaterialIcons name="notifications-active" size={20} color="#f97316" />
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText style={styles.reminderDetail}>{item.detail}</ThemedText>
            </View>
            <Pressable
              onPress={() => Alert.alert(item.title, 'Fitur detail akan ditambahkan.')}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <ThemedText style={styles.secondaryActionText}>Kelola</ThemedText>
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

function InputGroup({
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
        style={[styles.textInput, multiline && styles.textArea]}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );
}

function AttachmentRow({ label, required }: { label: string; required: boolean }) {
  return (
    <View style={styles.attachmentRow}>
      <MaterialIcons name="cloud-upload" size={20} color="#0a7ea4" />
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{label}</ThemedText>
        <ThemedText style={styles.attachmentMeta}>{required ? 'Wajib' : 'Opsional'} · Maks 2MB</ThemedText>
      </View>
      <Pressable
        onPress={() => Alert.alert('Unggah', `${label} siap diunggah (mock).`)}
        style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
      >
        <ThemedText style={styles.secondaryActionText}>Unggah</ThemedText>
      </Pressable>
    </View>
  );
}

function ValidationHint({ text }: { text: string }) {
  return <ThemedText style={styles.validationHint}>{text}</ThemedText>;
}

function SummaryRow({ icon, title, value }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <MaterialIcons name={icon} size={20} color="#0a7ea4" />
      <ThemedText style={styles.summaryTitle}>{title}</ThemedText>
      <ThemedText style={styles.summaryValue}>{value}</ThemedText>
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

  const icon = config[state];
  return (
    <View style={styles.timelineRow}>
      <MaterialIcons name={icon.icon} size={20} color={icon.color} />
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{label}</ThemedText>
        <ThemedText style={styles.timelineDescription}>{description}</ThemedText>
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
  segmentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  segmentLabel: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  segmentLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  validationHint: {
    fontSize: 12,
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
  textArea: {
    minHeight: 120,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    padding: 12,
  },
  selectorRowActive: {
    backgroundColor: '#f1f5f9',
  },
  selectorTitle: {
    color: '#0f172a',
  },
  selectorSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  optionList: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  optionRowActive: {
    backgroundColor: '#f8fafc',
  },
  optionDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  attachmentMeta: {
    fontSize: 12,
    color: '#94a3b8',
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
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
  },
  declarationText: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 4,
    backgroundColor: '#0a7ea4',
    borderRadius: 14,
    paddingVertical: 14,
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
  timelineDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  statusCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f0f9ff',
    gap: 12,
  },
  pdfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  ctaRow: {
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
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
  },
  reminderDetail: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
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
});
