import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ReactNode } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type TimelineState = 'complete' | 'current' | 'upcoming';

export type TimelineItem = {
  label: string;
  description: string;
  state: TimelineState;
};

export type ChecklistItem = {
  id: string;
  label: string;
  required?: boolean;
  note?: string;
};

export type DocumentVaultItem = {
  id: string;
  name: string;
  type: string;
  lastUpdated: string;
};

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {subtitle ? <ThemedText style={styles.sectionSubtitle}>{subtitle}</ThemedText> : null}
    </View>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <ThemedView style={styles.infoNote}>
      <MaterialIcons name="info" size={18} color="#0a7ea4" />
      <ThemedText style={styles.infoNoteText}>{children}</ThemedText>
    </ThemedView>
  );
}

export function StatusTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <View style={styles.timeline}>
      {items.map(item => {
        const config = timelineColors[item.state];
        return (
          <View key={item.label} style={styles.timelineRow}>
            <MaterialIcons name={config.icon} size={20} color={config.color} />
            <View style={styles.timelineContent}>
              <ThemedText type="defaultSemiBold" style={styles.timelineTitle}>
                {item.label}
              </ThemedText>
              <ThemedText style={styles.timelineDescription}>{item.description}</ThemedText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function Checklist({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: ChecklistItem[];
}) {
  return (
    <ThemedView style={styles.card}>
      <SectionHeader title={title} subtitle={subtitle} />
      <View style={styles.checklist}>
        {items.map(item => (
          <View key={item.id} style={styles.checklistRow}>
            <MaterialIcons name="assignment" size={18} color="#0a7ea4" />
            <View style={styles.checklistBody}>
              <ThemedText type="defaultSemiBold" style={styles.checklistLabel}>
                {item.label}
              </ThemedText>
              {item.note ? <ThemedText style={styles.checklistNote}>{item.note}</ThemedText> : null}
            </View>
            <View style={[styles.badge, { backgroundColor: item.required ? '#fee2e2' : '#e2e8f0' }]}
            >
              <ThemedText style={[styles.badgeText, { color: item.required ? '#b91c1c' : '#475569' }]}> 
                {item.required ? 'Wajib' : 'Opsional'}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

export function SummaryRow({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <MaterialIcons name={icon} size={20} color="#0a7ea4" />
      <ThemedText style={styles.summaryLabel}>{label}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
        {value}
      </ThemedText>
    </View>
  );
}

export function DocumentVault({
  items,
  onReuse,
  onUpload,
}: {
  items: DocumentVaultItem[];
  onReuse?: (item: DocumentVaultItem) => void;
  onUpload?: () => void;
}) {
  return (
    <ThemedView style={styles.card}>
      <SectionHeader title="Document Vault" subtitle="Gunakan kembali dokumen yang sudah pernah diunggah." />
      <View style={styles.vaultList}>
        {items.map(item => (
          <Pressable
            key={item.id}
            onPress={() => (onReuse ? onReuse(item) : Alert.alert('Gunakan Dokumen', `${item.name} siap digunakan.`))}
            style={({ pressed }) => [styles.vaultRow, pressed && styles.pressed]}
          >
            <MaterialIcons name="description" size={20} color="#0a7ea4" />
            <View style={styles.vaultContent}>
              <ThemedText type="defaultSemiBold" style={styles.vaultName}>
                {item.name}
              </ThemedText>
              <ThemedText style={styles.vaultMeta}>
                {item.type} · {item.lastUpdated}
              </ThemedText>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={() => (onUpload ? onUpload() : Alert.alert('Unggah Dokumen', 'Fitur unggah baru akan ditambahkan.'))}
        style={({ pressed }) => [styles.vaultButton, pressed && styles.pressed]}
      >
        <MaterialIcons name="cloud-upload" size={18} color="#0a7ea4" />
        <ThemedText style={styles.vaultButtonText}>Unggah Dokumen Baru</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

export function ReminderList({ items }: { items: { title: string; detail: string; icon?: keyof typeof MaterialIcons.glyphMap }[] }) {
  return (
    <ThemedView style={styles.card}>
      <SectionHeader title="Pengingat" subtitle="Catat jadwal penting agar tidak terlewat." />
      <View style={styles.reminderList}>
        {items.map(item => (
          <View key={item.title} style={styles.reminderRow}>
            <MaterialIcons name={item.icon ?? 'event'} size={18} color="#f97316" />
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={styles.reminderTitle}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.reminderDetail}>{item.detail}</ThemedText>
            </View>
            <MaterialIcons name="notifications" size={18} color="#94a3b8" />
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const timelineColors: Record<TimelineState, { icon: keyof typeof MaterialIcons.glyphMap; color: string }> = {
  complete: { icon: 'check-circle', color: '#15a362' },
  current: { icon: 'pending', color: '#f97316' },
  upcoming: { icon: 'radio-button-unchecked', color: '#94a3b8' },
};

const styles = StyleSheet.create({
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
  pressed: {
    opacity: 0.85,
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
  infoNote: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#ecfeff',
  },
  infoNoteText: {
    flex: 1,
    color: '#0f172a',
    fontSize: 13,
    lineHeight: 18,
  },
  timeline: {
    gap: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineContent: {
    flex: 1,
    gap: 4,
  },
  timelineTitle: {
    color: '#0f172a',
  },
  timelineDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  checklist: {
    gap: 12,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checklistBody: {
    flex: 1,
    gap: 4,
  },
  checklistLabel: {
    color: '#0f172a',
  },
  checklistNote: {
    fontSize: 12,
    color: '#64748b',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryLabel: {
    flex: 1,
    color: '#475569',
  },
  summaryValue: {
    color: '#0f172a',
  },
  vaultList: {
    gap: 10,
  },
  vaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  vaultContent: {
    flex: 1,
    gap: 2,
  },
  vaultName: {
    color: '#0f172a',
  },
  vaultMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  vaultButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    backgroundColor: '#ffffff',
  },
  vaultButtonText: {
    fontSize: 13,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  reminderList: {
    gap: 12,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  reminderTitle: {
    color: '#0f172a',
  },
  reminderDetail: {
    fontSize: 12,
    color: '#475569',
  },
});
