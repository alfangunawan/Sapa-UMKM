import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const mainMenus = [
  {
    id: 'nib',
    title: 'Pengajuan & Pembaruan NIB',
    icon: 'assignment-turned-in' as const,
  },
  {
    id: 'merek',
    title: 'Registrasi & Manajemen Merek Produk',
    icon: 'branding-watermark' as const,
  },
  {
    id: 'sertifikasi',
    title: 'Pengajuan Sertifikasi (Halal, SNI, dll)',
    icon: 'verified' as const,
  },
];

const bannerSource = require('@/assets/images/banner-perizinan.png');

export default function PerizinanScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.appBar}>
        <Pressable
          onPress={() => Alert.alert('Kembali', 'Navigasi kembali ke beranda akan ditambahkan.')}
          style={({ pressed }) => [styles.appBarButton, pressed && styles.buttonPressed]}
        >
          <MaterialIcons name="arrow-back" size={20} color="#0a7ea4" />
        </Pressable>
        <ThemedText type="defaultSemiBold" style={styles.appBarTitle}>
          Layanan Publik & Perizinan
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Bantuan', 'Hubungi pusat layanan UMKM untuk bantuan lebih lanjut.')}
          style={({ pressed }) => [styles.appBarButton, pressed && styles.buttonPressed]}
        >
          <MaterialIcons name="info-outline" size={20} color="#0a7ea4" />
        </Pressable>
      </View>
      <ThemedView style={styles.bannerWrapper}>
        <Image
          source={bannerSource}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </ThemedView>

      <View style={styles.menuSection}>
        {mainMenus.map(menu => (
          <Pressable
            key={menu.id}
            onPress={() => router.push(`/perizinan/${menu.id}`)}
            style={({ pressed }) => [styles.menuCard, pressed && styles.menuCardPressed]}
          >
            <View style={styles.menuIconWrapper}>
              <MaterialIcons name={menu.icon} size={22} color="#0a7ea4" />
            </View>
            <ThemedText style={styles.menuTitle}>{menu.title}</ThemedText>
            <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
          </Pressable>
        ))}
      </View>

      <ThemedView style={styles.footerCard}>
        <ThemedText style={styles.footerText}>
          Butuh bantuan? Hubungi pusat layanan UMKM KemenKopUKM.
        </ThemedText>
        <Pressable
          onPress={() => Alert.alert('Hubungi Kami', 'Tim layanan pelanggan akan segera menghubungi Anda.')}
          style={({ pressed }) => [styles.footerButton, pressed && styles.footerButtonPressed]}
        >
          <ThemedText style={styles.footerButtonText}>Hubungi Kami</ThemedText>
        </Pressable>
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
    paddingVertical: 4,
  },
  appBarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f4fa',
  },
  appBarTitle: {
    fontSize: 18,
    color: '#0f172a',
    flex: 1,
    textAlign: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  bannerWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f0f8ff',
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
  menuSection: {
    gap: 14,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuCardPressed: {
    transform: [{ translateY: 1 }],
  },
  menuIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f4fa',
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  footerCard: {
    marginTop: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: '#eef6ff',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#0a7ea4',
  },
  footerButtonPressed: {
    opacity: 0.85,
  },
  footerButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
