import { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DocumentVaultPicker } from '@/components/ui/document-vault-picker';
import {
    StatusTimeline,
    type TimelineItem,
} from '@/components/ui/status-timeline';

type ProfileData = {
  businessName: string;
  ownerName: string;
  address: string;
  sector: string;
  kbli: string;
  scale: string;
  capital: string;
  contact: string;
  operatingHours: string;
  socialMedia: string;
  geoLocation: {
    lat: number | null;
    lng: number | null;
  };
  photoIds: string[];
  documentIds: string[];
};

type HistoryRecord = {
  id: string;
  date: string;
  actor: 'Pemilik' | 'Admin';
  changes: string[];
  status: 'Disetujui' | 'Menunggu Verifikasi' | 'Revisi';
};

const kbliOptions = [
  { code: '10792', label: 'Industri Roti dan Kue Basah' },
  { code: '47113', label: 'Perdagangan Eceran Khusus Makanan dan Minuman' },
  { code: '56102', label: 'Usaha Rumah Makan' },
  { code: '47221', label: 'Perdagangan Eceran Minuman di Toko Khusus' },
  { code: '96024', label: 'Jasa Boga untuk Event dan Catering' },
];

const sectorOptions = [
  'Makanan & Minuman',
  'Fashion & Aksesoris',
  'Kerajinan & Kreatif',
  'Pertanian & Perikanan',
  'Teknologi & Digital',
];

const scaleOptions = [
  { id: 'mikro', label: 'Mikro' },
  { id: 'kecil', label: 'Kecil' },
  { id: 'menengah', label: 'Menengah' },
];

const vaultItems = [
  { id: 'foto-etalase', label: 'Foto Etalase Toko', type: 'image' as const, updatedAt: '2 hari lalu' },
  { id: 'foto-produksi', label: 'Foto Area Produksi', type: 'image' as const, updatedAt: '1 minggu lalu' },
  { id: 'skd', label: 'Surat Keterangan Domisili', type: 'document' as const, updatedAt: '3 bulan lalu' },
  { id: 'nib', label: 'Sertifikat NIB', type: 'pdf' as const, updatedAt: '6 bulan lalu' },
];

const initialProfile: ProfileData = {
  businessName: 'Kopi Nusantara Sejahtera',
  ownerName: 'Dewi Rahmawati',
  address: 'Jl. Melati No. 45, Kecamatan Coblong, Kota Bandung',
  sector: 'Makanan & Minuman',
  kbli: '56102',
  scale: 'Mikro',
  capital: '150000000',
  contact: '0812-3456-7890',
  operatingHours: 'Senin - Sabtu, 08.00 - 21.00',
  socialMedia: '@kopinusantara.id',
  geoLocation: { lat: -6.8915, lng: 107.6107 },
  photoIds: ['foto-etalase'],
  documentIds: ['skd'],
};

const initialHistory: HistoryRecord[] = [
  {
    id: 'hist-1',
    date: '12 Oktober 2025',
    actor: 'Pemilik',
    changes: ['Alamat usaha', 'Jam operasional'],
    status: 'Disetujui',
  },
  {
    id: 'hist-2',
    date: '02 September 2025',
    actor: 'Admin',
    changes: ['Skala usaha'],
    status: 'Disetujui',
  },
];

export default function EditProfileScreen() {
  const router = useRouter();

  const [currentProfile, setCurrentProfile] = useStateProfile(initialProfile);
  const [formState, setFormState] = useState<ProfileData>(initialProfile);
  const [history, setHistory] = useState(initialHistory);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [pendingDiff, setPendingDiff] = useState<string[]>([]);
  const [kbliQuery, setKbliQuery] = useState('');
  const [showKbliSuggestion, setShowKbliSuggestion] = useState(false);
  const [sectorModalVisible, setSectorModalVisible] = useState(false);
  const [scaleModalVisible, setScaleModalVisible] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const completionProgress = useMemo(() => {
    const fields = [
      formState.businessName,
      formState.address,
      formState.sector,
      formState.kbli,
      formState.scale,
      formState.capital,
    ];
    const filled = fields.filter(field => field && field.trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [formState]);

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const lastStatus = history[0]?.status ?? 'Menunggu Verifikasi';
    return [
      {
        id: 'submitted',
        title: 'Diajukan',
        description: 'Perubahan dikirim ke petugas dinas.',
        status: 'completed',
      },
      {
        id: 'verification',
        title: 'Menunggu Verifikasi',
        description: 'Petugas memeriksa kelengkapan data.',
        status: lastStatus === 'Disetujui' ? 'completed' : 'current',
      },
      {
        id: 'approval',
        title: lastStatus === 'Revisi' ? 'Revisi Diperlukan' : 'Disetujui',
        description:
          lastStatus === 'Revisi'
            ? 'Sesuaikan data sesuai catatan dan kirim ulang.'
            : 'Data terbaru telah disetujui.',
        status: lastStatus === 'Disetujui' ? 'completed' : lastStatus === 'Revisi' ? 'current' : 'upcoming',
      },
    ];
  }, [history]);

  const kbliSuggestions = useMemo(() => {
    if (!kbliQuery.trim()) {
      return [];
    }
    return kbliOptions.filter(option =>
      option.code.includes(kbliQuery) || option.label.toLowerCase().includes(kbliQuery.toLowerCase())
    );
  }, [kbliQuery]);

  const handlePickLocation = () => {
    setFormState(prev => ({
      ...prev,
      geoLocation: { lat: -6.8902, lng: 107.6115 },
    }));
    Alert.alert('Lokasi Terpilih', 'Koordinat usaha diperbarui dari map picker simulasi.');
  };

  const handleValidate = () => {
    const errors: string[] = [];
    if (!formState.address.trim()) {
      errors.push('Alamat usaha wajib diisi.');
    }
    if (!kbliOptions.find(option => option.code === formState.kbli)) {
      errors.push('Pilih kode KBLI yang valid.');
    }
    if (!formState.scale.trim()) {
      errors.push('Pilih skala usaha.');
    }
    if (formState.capital && Number(formState.capital) < 0) {
      errors.push('Modal/Omzet tidak boleh bernilai minus.');
    }

    return errors;
  };

  const handlePrepareDiff = () => {
    const diff: string[] = [];
    const map: Array<{ key: keyof ProfileData; label: string }> = [
      { key: 'businessName', label: 'Nama usaha' },
      { key: 'address', label: 'Alamat' },
      { key: 'sector', label: 'Sektor usaha' },
      { key: 'kbli', label: 'Kode KBLI' },
      { key: 'scale', label: 'Skala usaha' },
      { key: 'capital', label: 'Modal/Omzet' },
      { key: 'contact', label: 'Kontak' },
      { key: 'operatingHours', label: 'Jam operasional' },
      { key: 'socialMedia', label: 'Media sosial' },
    ];

    map.forEach(item => {
      if (formState[item.key] !== currentProfile[item.key]) {
        diff.push(`${item.label}: ${currentProfile[item.key] || '-'} → ${formState[item.key] || '-'}`);
      }
    });

    if (formState.photoIds.sort().join(',') !== currentProfile.photoIds.sort().join(',')) {
      diff.push('Foto usaha diperbarui.');
    }
    if (formState.documentIds.sort().join(',') !== currentProfile.documentIds.sort().join(',')) {
      diff.push('Dokumen pendukung diperbarui.');
    }
    if (formState.geoLocation.lat !== currentProfile.geoLocation.lat || formState.geoLocation.lng !== currentProfile.geoLocation.lng) {
      diff.push('Geotag lokasi usaha berubah.');
    }

    return diff;
  };

  const handleSubmit = () => {
    const errors = handleValidate();
    if (errors.length) {
      Alert.alert('Periksa Data', errors.join('\n'));
      return;
    }

    const diff = handlePrepareDiff();
    if (!diff.length) {
      Alert.alert('Tidak Ada Perubahan', 'Tidak ada data yang diubah.');
      return;
    }

    setPendingDiff(diff);
    setShowDiffModal(true);
  };

  const handleConfirmSubmit = () => {
    setSubmitInProgress(true);
    setTimeout(() => {
      setSubmitInProgress(false);
      setShowDiffModal(false);
      setCurrentProfile(cloneProfile(formState));
      setHistory(prev => [
        {
          id: `hist-${prev.length + 1}`,
          date: '9 November 2025',
          actor: 'Pemilik',
          changes: pendingDiff,
          status: 'Menunggu Verifikasi',
        },
        ...prev,
      ]);
      Alert.alert('Pembaruan Diajukan', 'Data usaha Anda menunggu verifikasi petugas.');
    }, 800);
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
            Pembaruan Profil UMKM
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert('Dokumentasi', 'Riwayat perubahan akan tersimpan sebagai audit trail.')}>
            <MaterialIcons name="info" size={22} color="#1f2933" />
          </Pressable>
        </View>

        <ThemedView style={styles.summaryCard}>
          <ThemedText type="defaultSemiBold" style={styles.summaryTitle}>
            Insight Cepat
          </ThemedText>
          <View style={styles.insightRow}>
            <InsightBadge icon="trending-up" label="Pendapatan Terakhir" value="Rp 12.000.000" />
            <InsightBadge icon="event" label="Update Terakhir" value={history[0]?.date ?? '-'} />
          </View>
          <View style={styles.progressContainer}>
            <ThemedText style={styles.progressLabel}>Kelengkapan Profil</ThemedText>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${completionProgress}%` }]} />
            </View>
            <ThemedText style={styles.progressValue}>{completionProgress}% lengkap</ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <SectionHeader title="Data Usaha" icon="storefront" color="#2563eb" />

          <TextField
            label="Nama Usaha"
            value={formState.businessName}
            onChangeText={text => setFormState(prev => ({ ...prev, businessName: text }))}
          />

          <TextField
            label="Alamat Usaha"
            multiline
            value={formState.address}
            onChangeText={text => setFormState(prev => ({ ...prev, address: text }))}
          />

          <Pressable
            onPress={handlePickLocation}
            style={({ pressed }) => [styles.geoButton, pressed && styles.buttonPressed]}>
            <MaterialIcons name="place" size={18} color="#0ea5e9" />
            <ThemedText style={styles.geoButtonText}>
              Geotag Lokasi Usaha ({formState.geoLocation.lat?.toFixed(4) ?? '-'}, {formState.geoLocation.lng?.toFixed(4) ?? '-'})
            </ThemedText>
          </Pressable>

          <View>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Sektor Usaha
            </ThemedText>
            <Pressable
              onPress={() => setSectorModalVisible(true)}
              style={({ pressed }) => [styles.dropdownTrigger, pressed && styles.dropdownTriggerPressed]}>
              <ThemedText>{formState.sector || 'Pilih sektor usaha'}</ThemedText>
              <MaterialIcons name="expand-more" size={20} color="#475569" />
            </Pressable>
          </View>

          <View>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Kode KBLI
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Cari kode atau nama KBLI"
              placeholderTextColor="#94a3b8"
              value={formState.kbli}
              onFocus={() => {
                setKbliQuery(formState.kbli);
                setShowKbliSuggestion(true);
              }}
              onChangeText={text => {
                setFormState(prev => ({ ...prev, kbli: text }));
                setKbliQuery(text);
                setShowKbliSuggestion(true);
              }}
            />
            {showKbliSuggestion && kbliSuggestions.length ? (
              <View style={styles.suggestionCard}>
                {kbliSuggestions.map(option => (
                  <Pressable
                    key={option.code}
                    onPress={() => {
                      setFormState(prev => ({ ...prev, kbli: option.code }));
                      setKbliQuery(option.code);
                      setShowKbliSuggestion(false);
                    }}
                    style={({ pressed }) => [styles.suggestionRow, pressed && styles.suggestionRowPressed]}>
                    <ThemedText type="defaultSemiBold" style={styles.suggestionTitle}>
                      {option.code}
                    </ThemedText>
                    <ThemedText style={styles.suggestionSubtitle}>{option.label}</ThemedText>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          <View>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Skala Usaha
            </ThemedText>
            <Pressable
              onPress={() => setScaleModalVisible(true)}
              style={({ pressed }) => [styles.dropdownTrigger, pressed && styles.dropdownTriggerPressed]}>
              <ThemedText>{formState.scale || 'Pilih skala usaha'}</ThemedText>
              <MaterialIcons name="expand-more" size={20} color="#475569" />
            </Pressable>
            <ThemedView style={styles.infoBanner}>
              <MaterialIcons name="info" size={18} color="#2563eb" />
              <ThemedText style={styles.infoText}>
                Penetapan skala mengikuti ketentuan KemenKopUKM. Sesuaikan omzet agar akurat.
              </ThemedText>
            </ThemedView>
          </View>

          <TextField
            label="Modal/Omzet Perkiraan"
            value={formState.capital}
            keyboardType="number-pad"
            onChangeText={text =>
              setFormState(prev => ({ ...prev, capital: text.replace(/[^0-9]/g, '') }))
            }
          />

          <TextField
            label="Kontak (Opsional)"
            value={formState.contact}
            onChangeText={text => setFormState(prev => ({ ...prev, contact: text }))}
          />

          <TextField
            label="Jam Operasional (Opsional)"
            value={formState.operatingHours}
            onChangeText={text => setFormState(prev => ({ ...prev, operatingHours: text }))}
          />

          <TextField
            label="Media Sosial (Opsional)"
            value={formState.socialMedia}
            onChangeText={text => setFormState(prev => ({ ...prev, socialMedia: text }))}
          />

          <DocumentVaultPicker
            label="Foto Tempat Usaha"
            items={vaultItems}
            selectedIds={formState.photoIds}
            onSelectionChange={ids => setFormState(prev => ({ ...prev, photoIds: ids }))}
          />

          <DocumentVaultPicker
            label="SKD / Dokumen Pendukung"
            items={vaultItems}
            selectedIds={formState.documentIds}
            onSelectionChange={ids => setFormState(prev => ({ ...prev, documentIds: ids }))}
          />
        </ThemedView>

        <ThemedView style={styles.timelineCard}>
          <SectionHeader title="Timeline Status" icon="timeline" color="#0ea5e9" />
          <StatusTimeline items={timelineItems} />
          {history[0]?.status === 'Revisi' ? (
            <Pressable
              onPress={() => Alert.alert('Perbaikan Data', 'Silakan perbaiki catatan dan ajukan ulang.')}
              style={({ pressed }) => [styles.reviseButton, pressed && styles.buttonPressed]}>
              <ThemedText style={styles.reviseText}>Perbaiki & Kirim Ulang</ThemedText>
            </Pressable>
          ) : null}
        </ThemedView>

        <ThemedView style={styles.historyCard}>
          <SectionHeader title="Riwayat Perubahan" icon="history" color="#d97706" />
          {history.map(record => (
            <View key={record.id} style={styles.historyRow}>
              <View style={styles.historyRowHeader}>
                <ThemedText type="defaultSemiBold" style={styles.historyRowTitle}>
                  {record.date}
                </ThemedText>
                <View style={[styles.statusBadge, badgeColor(record.status)]}>
                  <ThemedText style={styles.statusBadgeText}>{record.status}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.historyRowMeta}>
                Diubah oleh {record.actor}
              </ThemedText>
              <View style={styles.historyChangeList}>
                {record.changes.map(change => (
                  <View key={change} style={styles.historyChip}>
                    <ThemedText style={styles.historyChipText}>{change}</ThemedText>
                  </View>
                ))}
              </View>
              <Pressable
                onPress={() => Alert.alert('Versi Profil', changeSummary(changeLines(record.changes)))}
                style={({ pressed }) => [styles.historyButton, pressed && styles.buttonPressed]}>
                <ThemedText style={styles.historyButtonText}>Lihat Versi</ThemedText>
              </Pressable>
            </View>
          ))}
        </ThemedView>

        <View style={styles.footerActions}>
          <Pressable
            onPress={() => setFormState(cloneProfile(currentProfile))}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
            <ThemedText style={styles.secondaryText}>Batalkan</ThemedText>
          </Pressable>
          <Pressable onPress={handleSubmit} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
            <ThemedText style={styles.primaryText}>Kirim Pembaruan</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={sectorModalVisible} animationType="slide" transparent onRequestClose={() => setSectorModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <ThemedView style={styles.modalCard}>
            <SectionHeader title="Pilih Sektor Usaha" icon="category" color="#2563eb" />
            <ScrollView contentContainerStyle={styles.modalList}>
              {sectorOptions.map(option => (
                <Pressable
                  key={option}
                  onPress={() => {
                    setFormState(prev => ({ ...prev, sector: option }));
                    setSectorModalVisible(false);
                  }}
                  style={({ pressed }) => [styles.modalItem, pressed && styles.modalItemPressed]}>
                  <ThemedText>{option}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setSectorModalVisible(false)} style={({ pressed }) => [styles.modalClose, pressed && styles.buttonPressed]}>
              <ThemedText style={styles.modalCloseText}>Selesai</ThemedText>
            </Pressable>
          </ThemedView>
        </View>
      </Modal>

      <Modal visible={scaleModalVisible} animationType="slide" transparent onRequestClose={() => setScaleModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <ThemedView style={styles.modalCard}>
            <SectionHeader title="Pilih Skala Usaha" icon="bar-chart" color="#0ea5e9" />
            <ScrollView contentContainerStyle={styles.modalList}>
              {scaleOptions.map(option => (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    setFormState(prev => ({ ...prev, scale: option.label }));
                    setScaleModalVisible(false);
                  }}
                  style={({ pressed }) => [styles.modalItem, pressed && styles.modalItemPressed]}>
                  <ThemedText>{option.label}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setScaleModalVisible(false)} style={({ pressed }) => [styles.modalClose, pressed && styles.buttonPressed]}>
              <ThemedText style={styles.modalCloseText}>Selesai</ThemedText>
            </Pressable>
          </ThemedView>
        </View>
      </Modal>

      <Modal visible={showDiffModal} animationType="slide" transparent onRequestClose={() => setShowDiffModal(false)}>
        <View style={styles.modalBackdrop}>
          <ThemedView style={styles.diffCard}>
            <SectionHeader title="Tinjau Perubahan" icon="fact-check" color="#d97706" />
            <ScrollView contentContainerStyle={styles.modalList}>
              {pendingDiff.map(item => (
                <View key={item} style={styles.diffRow}>
                  <MaterialIcons name="change-circle" size={18} color="#0ea5e9" />
                  <ThemedText style={styles.diffText}>{item}</ThemedText>
                </View>
              ))}
            </ScrollView>
            <View style={styles.diffFooter}>
              <View style={styles.confirmationRow}>
                <Switch value={true} disabled />
                <ThemedText style={styles.confirmationNote}>
                  Data siap dikirim untuk verifikasi.
                </ThemedText>
              </View>
              <View style={styles.diffActions}>
                <Pressable
                  onPress={() => setShowDiffModal(false)}
                  style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
                  <ThemedText style={styles.secondaryText}>Kembali</ThemedText>
                </Pressable>
                <Pressable
                  disabled={submitInProgress}
                  onPress={handleConfirmSubmit}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.buttonPressed,
                    submitInProgress && styles.disabledButton,
                  ]}>
                  <ThemedText style={styles.primaryText}>
                    {submitInProgress ? 'Mengirim...' : 'Konfirmasi & Kirim' }
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

function useStateProfile(initial: ProfileData) {
  const [value, setValue] = useState(initial);
  return [value, setValue] as const;
}

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
};

function TextField({ label, value, onChangeText, multiline, keyboardType = 'default' }: TextFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <ThemedText type="defaultSemiBold" style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, multiline && styles.multilineInput]}
        multiline={multiline}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
      />
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

type InsightBadgeProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
};

function InsightBadge({ icon, label, value }: InsightBadgeProps) {
  return (
    <ThemedView style={styles.insightBadge}>
      <View style={styles.insightIcon}>
        <MaterialIcons name={icon} size={20} color="#0ea5e9" />
      </View>
      <View style={styles.insightContent}>
        <ThemedText style={styles.insightLabel}>{label}</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.insightValue}>
          {value}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

function changeSummary(lines: string[]) {
  return lines.join('\n• ');
}

function changeLines(changes: string[]) {
  return ['Perubahan kunci:', ...changes];
}

function badgeColor(status: HistoryRecord['status']) {
  switch (status) {
    case 'Disetujui':
      return styles.badgeApproved;
    case 'Revisi':
      return styles.badgeRevision;
    default:
      return styles.badgePending;
  }
}

function cloneProfile(profile: ProfileData): ProfileData {
  return {
    ...profile,
    photoIds: [...profile.photoIds],
    documentIds: [...profile.documentIds],
    geoLocation: { ...profile.geoLocation },
  };
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
  summaryCard: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
  },
  insightRow: {
    flexDirection: 'row',
    gap: 12,
  },
  insightBadge: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#f0f9ff',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    gap: 4,
  },
  insightLabel: {
    fontSize: 12,
    color: '#475569',
  },
  insightValue: {
    fontSize: 15,
  },
  progressContainer: {
    gap: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#475569',
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  progressValue: {
    fontSize: 12,
    color: '#0f172a',
  },
  section: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    gap: 18,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  geoButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ecfeff',
  },
  geoButtonText: {
    fontSize: 13,
    color: '#0f172a',
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerPressed: {
    backgroundColor: '#f1f5f9',
  },
  suggestionCard: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  suggestionRow: {
    padding: 12,
    gap: 4,
  },
  suggestionRowPressed: {
    backgroundColor: '#f8fafc',
  },
  suggestionTitle: {
    fontSize: 14,
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  infoBanner: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1d4ed8',
    lineHeight: 18,
  },
  timelineCard: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  reviseButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fef3c7',
  },
  reviseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  historyCard: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  historyRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 10,
  },
  historyRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyRowTitle: {
    fontSize: 15,
  },
  historyRowMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  historyChangeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyChip: {
    borderRadius: 999,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  historyChipText: {
    fontSize: 12,
    color: '#2563eb',
  },
  historyButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#0ea5e9',
  },
  historyButtonText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  badgeApproved: {
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
  },
  badgeRevision: {
    backgroundColor: 'rgba(248, 113, 113, 0.18)',
  },
  badgePending: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  footerActions: {
    flexDirection: 'row',
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
  secondaryText: {
    fontSize: 15,
    color: '#0f172a',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 18,
    padding: 20,
    gap: 18,
    maxHeight: '80%',
  },
  modalList: {
    gap: 12,
  },
  modalItem: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  modalItemPressed: {
    backgroundColor: '#f8fafc',
  },
  modalClose: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  diffCard: {
    borderRadius: 18,
    padding: 20,
    gap: 18,
    maxHeight: '80%',
    backgroundColor: '#ffffff',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 6,
  },
  diffText: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  diffFooter: {
    gap: 14,
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confirmationNote: {
    flex: 1,
    fontSize: 12,
    color: '#1f2937',
  },
  diffActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
