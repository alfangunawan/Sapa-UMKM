import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type VaultItem = {
  id: string;
  label: string;
  type: 'image' | 'pdf' | 'document';
  updatedAt: string;
};

type DocumentVaultPickerProps = {
  label: string;
  selectedIds: string[];
  items: VaultItem[];
  onSelectionChange: (ids: string[]) => void;
  multiSelect?: boolean;
};

export function DocumentVaultPicker({
  label,
  selectedIds,
  items,
  onSelectionChange,
  multiSelect = true,
}: DocumentVaultPickerProps) {
  const [visible, setVisible] = useState(false);

  const selectedLabels = useMemo(() => {
    if (!selectedIds.length) {
      return 'Belum ada dokumen dipilih';
    }
    return items
      .filter(item => selectedIds.includes(item.id))
      .map(item => item.label)
      .join(', ');
  }, [items, selectedIds]);

  const toggleItem = (id: string) => {
    if (multiSelect) {
      onSelectionChange(
        selectedIds.includes(id)
          ? selectedIds.filter(itemId => itemId !== id)
          : [...selectedIds, id]
      );
      return;
    }

    onSelectionChange(selectedIds.includes(id) ? [] : [id]);
  };

  return (
    <View>
      <ThemedText type="defaultSemiBold" style={styles.label}>
        {label}
      </ThemedText>
      <Pressable
        accessibilityRole="button"
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}>
        <ThemedText style={styles.triggerText}>{selectedLabels}</ThemedText>
        <ThemedText style={styles.triggerHint}>Pilih dari Document Vault</ThemedText>
      </Pressable>

      <Modal animationType="slide" visible={visible} transparent onRequestClose={() => setVisible(false)}>
        <View style={styles.modalBackdrop}>
          <ThemedView style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                Document Vault
              </ThemedText>
              <ThemedText style={styles.modalSubtitle}>
                Pilih dokumen yang sudah Anda unggah sebelumnya.
              </ThemedText>
            </View>

            <ScrollView style={styles.modalList} contentContainerStyle={{ gap: 12 }}>
              {items.map(item => {
                const active = selectedIds.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => toggleItem(item.id)}
                    style={({ pressed }) => [
                      styles.modalItem,
                      active && styles.modalItemActive,
                      pressed && styles.modalItemPressed,
                    ]}>
                    <View style={styles.modalItemBody}>
                      <ThemedText type="defaultSemiBold" style={styles.modalItemTitle}>
                        {item.label}
                      </ThemedText>
                      <ThemedText style={styles.modalItemMeta}>
                        {item.type.toUpperCase()} • Diupdate {item.updatedAt}
                      </ThemedText>
                    </View>
                    <View
                      style={[styles.checkbox, active && styles.checkboxActive]}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={() => setVisible(false)}
              style={({ pressed }) => [styles.modalClose, pressed && styles.modalClosePressed]}>
              <ThemedText style={styles.modalCloseText}>Selesai</ThemedText>
            </Pressable>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  trigger: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  triggerPressed: {
    backgroundColor: '#f1f5f9',
  },
  triggerText: {
    fontSize: 14,
    color: '#1f2937',
  },
  triggerHint: {
    fontSize: 12,
    color: '#64748b',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 16,
    padding: 20,
    gap: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  modalList: {
    flexGrow: 0,
  },
  modalItem: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalItemActive: {
    borderColor: '#0ea5e9',
    backgroundColor: '#e0f2fe',
  },
  modalItemPressed: {
    opacity: 0.85,
  },
  modalItemBody: {
    gap: 6,
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 15,
  },
  modalItemMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#94a3b8',
    backgroundColor: '#ffffff',
  },
  checkboxActive: {
    borderColor: '#0284c7',
    backgroundColor: '#0284c7',
  },
  modalClose: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  modalClosePressed: {
    opacity: 0.85,
  },
  modalCloseText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
});
