import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DocumentVaultPicker } from '@/components/ui/document-vault-picker';
import {
    StatusTimeline,
    type TimelineItem,
    type TimelineStatus,
} from '@/components/ui/status-timeline';

const periods = [
  { id: 'nov-2025', label: 'November 2025', dueDate: '10 Desember 2025', status: 'Belum' as const },
  { id: 'oct-2025', label: 'Oktober 2025', dueDate: '10 November 2025', status: 'Diajukan' as const },
  { id: 'sep-2025', label: 'September 2025', dueDate: '10 Oktober 2025', status: 'Disetujui' as const },
  { id: 'aug-2025', label: 'Agustus 2025', dueDate: '10 September 2025', status: 'Diverifikasi' as const },
];

const existingSubmittedPeriods = ['oct-2025', 'sep-2025', 'aug-2025'];

const salesChannelOptions = [
  'Offline',
  'Marketplace',
  'Instagram',
  'WhatsApp',
  'Facebook',
  'Website',
];

type ReportingFormState = {
  periodId: string;
  revenue: string;
  expenses: string;
  transactions: string;
  employees: string;
  salesChannels: string[];
  activityDescription: string;
  photoIds: string[];
  attachmentIds: string[];
  taxDocIds: string[];
  confirmation: boolean;
};

const initialForm: ReportingFormState = {
  periodId: 'nov-2025',
  revenue: '',
  expenses: '',
  transactions: '',
  employees: '',
  salesChannels: [],
  activityDescription: '',
  photoIds: [],
  attachmentIds: [],
  taxDocIds: [],
  confirmation: false,
};

const vaultItems = [
  { id: 'foto-etalase', label: 'Foto Etalase Toko', type: 'image' as const, updatedAt: '2 hari lalu' },
  { id: 'invoice-nov', label: 'Invoice 05-11-2025', type: 'pdf' as const, updatedAt: '5 hari lalu' },
  { id: 'buku-kas', label: 'Foto Buku Kas November', type: 'image' as const, updatedAt: '1 hari lalu' },
  { id: 'skd', label: 'Surat Keterangan Domisili', type: 'document' as const, updatedAt: '3 bulan lalu' },
];

const miniRevenueHistory = [8.2, 9.1, 10.5];

export default function ReportingWizardScreen() {
  const router = useRouter();
  const [formState, setFormState] = useState<ReportingFormState>(initialForm);
  const [step, setStep] = useState(0);

  const selectedPeriod = useMemo(() => periods.find(p => p.id === formState.periodId) ?? periods[0], [formState.periodId]);

  const profit = useMemo(() => {
    const revenue = Number(formState.revenue) || 0;
    const expenses = Number(formState.expenses) || 0;
    return revenue - expenses;
  }, [formState.expenses, formState.revenue]);

  const periodIsLate = selectedPeriod.status === 'Belum' && selectedPeriod.id !== initialForm.periodId;

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const firstStatus: TimelineStatus = step === 2 && formState.confirmation ? 'completed' : 'current';
    return [
      {
        id: 'submitted',
        title: 'Diajukan',
        description: 'Laporan terkirim ke Dinas Koperasi.',
        status: firstStatus,
      },
      {
        id: 'verified',
        title: 'Diverifikasi',
        description: 'Petugas sedang melakukan verifikasi dokumen.',
        status: 'upcoming',
      },
      {
        id: 'approved',
        title: 'Disetujui',
        description: 'Laporan dinyatakan valid dan diterima.',
        status: 'upcoming',
      },
    ];
  }, [formState.confirmation, step]);

  const handleToggleChannel = (channel: string) => {
    setFormState(prev => ({
      ...prev,
      salesChannels: prev.salesChannels.includes(channel)
        ? prev.salesChannels.filter(item => item !== channel)
        : [...prev.salesChannels, channel],
    }));
  };

  const handleNext = () => {
    if (step === 0 && !validateStepOne()) {
      return;
    }
    if (step === 1 && !validateStepTwo()) {
      return;
    }
    setStep(prev => Math.min(prev + 1, 2));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    const errors = validateAll();
    if (errors.length) {
      Alert.alert('Periksa Data', errors.join('\n'));
      return;
    }

  Alert.alert('Laporan Diajukan', 'Laporan Anda telah terkirim dan menunggu verifikasi.');
  setFormState({ ...initialForm });
    setStep(0);
  };

  const validateStepOne = () => {
    const messages: string[] = [];

    if (existingSubmittedPeriods.includes(formState.periodId)) {
      messages.push('Periode tersebut sudah memiliki laporan. Pilih periode lain.');
    }

    const numericFields = [
      { key: 'Pendapatan', value: formState.revenue },
      { key: 'Biaya Operasional', value: formState.expenses },
      { key: 'Jumlah Transaksi', value: formState.transactions },
      { key: 'Jumlah Karyawan Aktif', value: formState.employees },
    ];

    numericFields.forEach(field => {
      if (field.value && Number(field.value) < 0) {
        messages.push(`${field.key} tidak boleh bernilai negatif.`);
      }
    });

    if (!formState.revenue && !formState.expenses && !formState.employees) {
      messages.push('Isi minimal salah satu dari Pendapatan, Biaya, atau Jumlah Karyawan.');
    }

    if (messages.length) {
      Alert.alert('Data Inti Belum Lengkap', messages.join('\n'));
      return false;
    }

    return true;
  };

  const validateStepTwo = () => {
    if (!formState.activityDescription.trim()) {
      Alert.alert('Aktivitas Usaha', 'Tuliskan singkat aktivitas usaha pada periode ini.');
      return false;
    }
    return true;
  };

  const validateAll = () => {
    const messages: string[] = [];
    if (!validateStepOne()) {
      messages.push('Periksa Data Inti sebelum melanjutkan.');
    }
    if (!validateStepTwo()) {
      messages.push('Lengkapi aktivitas usaha.');
    }
    if (!formState.confirmation) {
      messages.push('Centang pernyataan kebenaran sebelum mengajukan.');
    }
    return messages;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.appBar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <MaterialIcons name="arrow-back" size={22} color="#1f2933" />
          </Pressable>
          <ThemedText type="title" style={styles.appBarTitle}>
            Pelaporan Kegiatan Usaha
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert(
                'Bantuan Pelaporan',
                'Isi data inti, lampirkan aktivitas, lalu tinjau sebelum mengajukan laporan.'
              )}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <MaterialIcons name="help-outline" size={22} color="#1f2933" />
          </Pressable>
        </View>

        <ThemedView style={styles.currentCard}>
          <View style={styles.cardHeader}>
            <View>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Laporan Periode Ini
              </ThemedText>
              <ThemedText style={styles.cardSubtitle}>{selectedPeriod.label}</ThemedText>
            </View>
            <View style={[styles.statusBadge, badgeStyles(selectedPeriod.status)]}>
              <ThemedText style={styles.statusText}>{selectedPeriod.status}</ThemedText>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <ThemedText style={styles.cardMeta}>Batas unggah: {selectedPeriod.dueDate}</ThemedText>
            {periodIsLate ? (
              <View style={styles.lateBadge}>
                <ThemedText style={styles.lateText}>Terlambat</ThemedText>
              </View>
            ) : null}
          </View>
          <View style={styles.sparklineContainer}>
            <ThemedText style={styles.sparklineLabel}>Pendapatan 3 bulan terakhir</ThemedText>
            <Sparkline data={miniRevenueHistory} />
          </View>
        </ThemedView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodHistoryContainer}>
          {periods.slice(1, 4).map(period => (
            <ThemedView key={period.id} style={styles.periodCard}>
              <ThemedText type="defaultSemiBold" style={styles.periodCardTitle}>
                {period.label}
              </ThemedText>
              <ThemedText style={styles.periodCardMeta}>Status: {period.status}</ThemedText>
            </ThemedView>
          ))}
        </ScrollView>

        <StepIndicator currentStep={step} />

        {step === 0 && (
          <ThemedView style={styles.section}>
            <SectionHeader title="Data Inti Laporan" icon="dataset" color="#2563eb" />

            <View style={styles.fieldGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Pilih Periode
              </ThemedText>
              <View style={styles.periodList}>
                {periods.map(period => (
                  <Pressable
                    key={period.id}
                    onPress={() => setFormState(prev => ({ ...prev, periodId: period.id }))}
                    style={({ pressed }) => [
                      styles.periodItem,
                      formState.periodId === period.id && styles.periodItemActive,
                      pressed && styles.periodItemPressed,
                    ]}>
                    <ThemedText style={styles.periodItemLabel}>{period.label}</ThemedText>
                    <ThemedText style={styles.periodItemStatus}>{period.status}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <NumberInput
              label="Ringkasan Pendapatan"
              placeholder="Contoh: 12000000"
              value={formState.revenue}
              onChangeText={value => setFormState(prev => ({ ...prev, revenue: value }))}
            />
            <NumberInput
              label="Biaya Operasional"
              placeholder="Contoh: 4500000"
              value={formState.expenses}
              onChangeText={value => setFormState(prev => ({ ...prev, expenses: value }))}
            />
            <ThemedView style={styles.profitCard}>
              <ThemedText type="defaultSemiBold">Laba / Selisih Otomatis</ThemedText>
              <ThemedText style={styles.profitValue}>Rp {profit.toLocaleString('id-ID')}</ThemedText>
            </ThemedView>
            <NumberInput
              label="Jumlah Transaksi (Opsional)"
              placeholder="Contoh: 128"
              value={formState.transactions}
              onChangeText={value => setFormState(prev => ({ ...prev, transactions: value }))}
            />
            <NumberInput
              label="Jumlah Karyawan Aktif"
              placeholder="Contoh: 5"
              value={formState.employees}
              onChangeText={value => setFormState(prev => ({ ...prev, employees: value }))}
            />

            <View style={styles.fieldGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Saluran Penjualan
              </ThemedText>
              <View style={styles.chipContainer}>
                {salesChannelOptions.map(option => {
                  const selected = formState.salesChannels.includes(option);
                  return (
                    <Pressable
                      key={option}
                      onPress={() => handleToggleChannel(option)}
                      style={({ pressed }) => [
                        styles.chip,
                        selected && styles.chipSelected,
                        pressed && styles.chipPressed,
                      ]}>
                      <ThemedText style={selected ? styles.chipTextSelected : styles.chipText}>
                        {option}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ThemedView>
        )}

        {step === 1 && (
          <ThemedView style={styles.section}>
            <SectionHeader title="Aktivitas & Lampiran" icon="dynamic-feed" color="#059669" />

            <View style={styles.fieldGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Deskripsi Kegiatan
              </ThemedText>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Tuliskan aktivitas utama, promosi, atau capaian usaha di periode ini."
                placeholderTextColor="#94a3b8"
                multiline
                value={formState.activityDescription}
                onChangeText={value => setFormState(prev => ({ ...prev, activityDescription: value }))}
              />
            </View>

            <DocumentVaultPicker
              label="Foto Pendukung"
              items={vaultItems}
              selectedIds={formState.photoIds}
              onSelectionChange={ids => setFormState(prev => ({ ...prev, photoIds: ids }))}
            />

            <DocumentVaultPicker
              label="Lampiran Rekap Penjualan"
              items={vaultItems}
              selectedIds={formState.attachmentIds}
              onSelectionChange={ids => setFormState(prev => ({ ...prev, attachmentIds: ids }))}
            />

            <DocumentVaultPicker
              label="Bukti Pajak / Izin (Opsional)"
              items={vaultItems}
              selectedIds={formState.taxDocIds}
              onSelectionChange={ids => setFormState(prev => ({ ...prev, taxDocIds: ids }))}
            />
          </ThemedView>
        )}

        {step === 2 && (
          <ThemedView style={styles.section}>
            <SectionHeader title="Tinjau & Kirim" icon="fact-check" color="#d97706" />
            <ReviewRow label="Periode" value={selectedPeriod.label} />
            <ReviewRow label="Pendapatan" value={formatCurrency(formState.revenue)} />
            <ReviewRow label="Biaya" value={formatCurrency(formState.expenses)} />
            <ReviewRow label="Laba" value={formatCurrency(String(profit))} />
            <ReviewRow label="Transaksi" value={formState.transactions || '-'} />
            <ReviewRow label="Karyawan" value={formState.employees || '-'} />
            <ReviewRow label="Saluran Penjualan" value={formState.salesChannels.join(', ') || '-'} />
            <ReviewRow label="Aktivitas" value={formState.activityDescription || '-'} multiline />
            <ReviewRow label="Foto Pendukung" value={mapLabels(formState.photoIds)} />
            <ReviewRow label="Lampiran" value={mapLabels(formState.attachmentIds)} />
            <ReviewRow label="Bukti Pajak / Izin" value={mapLabels(formState.taxDocIds)} />

            <View style={styles.confirmationRow}>
              <Switch
                value={formState.confirmation}
                onValueChange={value => setFormState(prev => ({ ...prev, confirmation: value }))}
              />
              <ThemedText style={styles.confirmationText}>
                Saya menyatakan data yang diajukan benar dan dapat dipertanggungjawabkan.
              </ThemedText>
            </View>

            <ThemedView style={styles.timelineCard}>
              <ThemedText type="defaultSemiBold" style={styles.timelineTitle}>
                Status Pelaporan
              </ThemedText>
              <StatusTimeline items={timelineItems} />
            </ThemedView>
          </ThemedView>
        )}

        <View style={styles.footerActions}>
          <Pressable
            disabled={step === 0}
            onPress={handlePrev}
            style={({ pressed }) => [
              styles.secondaryButton,
              step === 0 && styles.secondaryButtonDisabled,
              pressed && step !== 0 && styles.buttonPressed,
            ]}>
            <ThemedText style={styles.secondaryText}>Kembali</ThemedText>
          </Pressable>

          {step < 2 ? (
            <Pressable onPress={handleNext} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
              <ThemedText style={styles.primaryText}>Lanjut</ThemedText>
            </Pressable>
          ) : (
            <Pressable onPress={handleSubmit} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
              <ThemedText style={styles.primaryText}>Ajukan Laporan</ThemedText>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function badgeStyles(status: string) {
  switch (status) {
    case 'Disetujui':
      return styles.badgeApproved;
    case 'Diajukan':
      return styles.badgeSubmitted;
    case 'Diverifikasi':
      return styles.badgeVerified;
    case 'Belum':
    default:
      return styles.badgePending;
  }
}

function formatCurrency(value: string) {
  const number = Number(value);
  if (!number) {
    return '-';
  }
  return `Rp ${number.toLocaleString('id-ID')}`;
}

function mapLabels(ids: string[]) {
  if (!ids.length) {
    return '-';
  }
  return ids
    .map(id => vaultItems.find(item => item.id === id)?.label)
    .filter(Boolean)
    .join(', ');
}

type NumberInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
};

function NumberInput({ label, placeholder, value, onChangeText }: NumberInputProps) {
  return (
    <View style={styles.fieldGroup}>
      <ThemedText type="defaultSemiBold" style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={text => onChangeText(text.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        style={styles.input}
      />
    </View>
  );
}

type ReviewRowProps = {
  label: string;
  value: string;
  multiline?: boolean;
};

function ReviewRow({ label, value, multiline }: ReviewRowProps) {
  return (
    <View style={styles.reviewRow}>
      <ThemedText style={styles.reviewLabel}>{label}</ThemedText>
      <ThemedText style={multiline ? styles.reviewValueMultiline : styles.reviewValue}>
        {value}
      </ThemedText>
    </View>
  );
}

type SectionHeaderProps = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
};

function SectionHeader({ title, icon, color }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={[styles.sectionIcon, { backgroundColor: color }]}>
        <MaterialIcons name={icon} size={18} color="#ffffff" />
      </View>
      <ThemedText type="defaultSemiBold" style={styles.sectionHeaderText}>
        {title}
      </ThemedText>
    </View>
  );
}

type StepIndicatorProps = {
  currentStep: number;
};

function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = ['Data Inti', 'Aktivitas & Lampiran', 'Tinjau'];
  return (
    <View style={styles.stepIndicator}>
      {steps.map((label, index) => {
        const active = index === currentStep;
        const done = index < currentStep;
        return (
          <View key={label} style={styles.stepItem}>
            <View style={[styles.stepBullet, done && styles.stepBulletDone, active && styles.stepBulletActive]}>
              <ThemedText style={styles.stepBulletText}>{index + 1}</ThemedText>
            </View>
            <ThemedText style={active ? styles.stepLabelActive : styles.stepLabel}>{label}</ThemedText>
            {index < steps.length - 1 && <View style={[styles.stepConnector, done && styles.stepConnectorDone]} />}
          </View>
        );
      })}
    </View>
  );
}

type SparklineProps = {
  data: number[];
};

function Sparkline({ data }: SparklineProps) {
  const maxValue = Math.max(...data, 1);
  return (
    <View style={styles.sparkline}>
      {data.map((value, index) => {
        const height = (value / maxValue) * 48;
        return <View key={index} style={[styles.sparklineBar, { height }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    gap: 20,
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
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
  currentCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#475569',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeApproved: {
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
  },
  badgeSubmitted: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  badgeVerified: {
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
  },
  badgePending: {
    backgroundColor: 'rgba(148, 163, 184, 0.22)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: '#475569',
  },
  lateBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  lateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#b91c1c',
  },
  sparklineContainer: {
    gap: 8,
  },
  sparklineLabel: {
    fontSize: 12,
    color: '#475569',
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  sparklineBar: {
    width: 16,
    borderRadius: 6,
    backgroundColor: '#0ea5e9',
  },
  periodHistoryContainer: {
    gap: 12,
  },
  periodCard: {
    width: 160,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  periodCardTitle: {
    fontSize: 14,
  },
  periodCardMeta: {
    fontSize: 12,
    color: '#475569',
  },
  section: {
    padding: 20,
    gap: 18,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    fontSize: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  profitCard: {
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#f0fdf4',
    gap: 6,
  },
  profitValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15803d',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
  },
  chipSelected: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipText: {
    fontSize: 13,
    color: '#0f172a',
  },
  chipTextSelected: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  periodList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  periodItem: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#ffffff',
    width: '48%',
    gap: 4,
  },
  periodItemActive: {
    borderColor: '#0ea5e9',
    backgroundColor: '#e0f2fe',
  },
  periodItemPressed: {
    opacity: 0.85,
  },
  periodItemLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  periodItemStatus: {
    fontSize: 11,
    color: '#475569',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  reviewLabel: {
    width: 140,
    fontSize: 13,
    color: '#475569',
  },
  reviewValue: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    textAlign: 'right',
  },
  reviewValueMultiline: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    textAlign: 'right',
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confirmationText: {
    flex: 1,
    fontSize: 12,
    color: '#1f2937',
    lineHeight: 18,
  },
  timelineCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  timelineTitle: {
    fontSize: 14,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryText: {
    fontSize: 15,
    color: '#0f172a',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  stepIndicator: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  stepBullet: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#cbd5f5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  stepBulletDone: {
    borderColor: '#0ea5e9',
    backgroundColor: '#0ea5e9',
  },
  stepBulletActive: {
    borderColor: '#0ea5e9',
  },
  stepBulletText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  stepLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  stepLabelActive: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepConnector: {
    position: 'absolute',
    top: 16,
    right: -36,
    width: 72,
    height: 2,
    backgroundColor: '#e2e8f0',
  },
  stepConnectorDone: {
    backgroundColor: '#0ea5e9',
  },
});
