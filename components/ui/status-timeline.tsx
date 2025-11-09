import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type TimelineStatus = 'completed' | 'current' | 'upcoming';

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  status: TimelineStatus;
};

type StatusTimelineProps = {
  items: TimelineItem[];
};

export function StatusTimeline({ items }: StatusTimelineProps) {
  return (
    <ThemedView style={styles.container}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <View key={item.id} style={styles.row}>
            <View style={styles.markerColumn}>
              <View
                style={[
                  styles.marker,
                  item.status === 'completed' && styles.markerCompleted,
                  item.status === 'current' && styles.markerCurrent,
                ]}
              />
              {!isLast && <View style={styles.connector} />}
            </View>
            <View style={styles.contentColumn}>
              <ThemedText type="defaultSemiBold" style={styles.title}>
                {item.title}
              </ThemedText>
              {item.description ? (
                <ThemedText style={styles.description}>{item.description}</ThemedText>
              ) : null}
            </View>
          </View>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  markerColumn: {
    alignItems: 'center',
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  markerCompleted: {
    borderColor: '#16a34a',
    backgroundColor: '#16a34a',
  },
  markerCurrent: {
    borderColor: '#0284c7',
    backgroundColor: '#ffffff',
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    marginTop: 4,
  },
  contentColumn: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
});
