// src/app/(tabs)/riwayat.tsx
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RiwayatList from "../../components/RiwayatList";
import { useTheme } from "../../hooks/use-theme";
import { getHistory } from "../../lib/storage";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../types/favorit";

export default function TabRiwayat() {
  const colors = useTheme();
  const [daftarKota, setDaftarKota] = useState<string[]>([]);
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [pesanError, setPesanError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      Promise.all([getHistory(), ambilSemuaFavorit()])
        .then(([riwayat, favorit]) => {
          if (!aktif) return;
          setDaftarKota(riwayat);
          setDaftarFavorit(favorit);
          setPesanError(null);
        })
        .catch(() => {
          if (aktif) setPesanError("Data riwayat atau favorit gagal dimuat.");
        });
      return () => {
        aktif = false;
      };
    }, []),
  );

  async function eksekusiHapus(id: number) {
    try {
      await hapusFavorit(id);
      setDaftarFavorit((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setPesanError("Kota favorit gagal dihapus. Silakan coba lagi.");
    }
  }

  function hapus(kota: KotaFavorit) {
    const pesan = `Yakin hapus ${kota.nama}?`;

    // Penanganan khusus untuk React Native Web
    if (Platform.OS === "web") {
      if (window.confirm(pesan)) {
        eksekusiHapus(kota.id);
      }
      return;
    }

    // Penanganan untuk iOS / Android
    Alert.alert("Yakin hapus?", pesan, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => eksekusiHapus(kota.id),
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
            Riwayat Pencarian
          </Text>
          <Text style={{ fontSize: 14, color: colors.subtext }}>
            Maksimal 10 kota terakhir
          </Text>
          {daftarKota.length > 0 ? (
            <RiwayatList daftarKota={daftarKota} />
          ) : (
            <Text style={{ color: colors.subtext }}>
              Belum ada riwayat pencarian
            </Text>
          )}
        </View>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
            Kota Favorit
          </Text>
          <Text style={{ fontSize: 14, color: colors.subtext }}>
            Tersimpan {daftarFavorit.length} kota
          </Text>
          {daftarFavorit.length === 0 ? (
            <Text style={{ color: colors.subtext }}>Belum ada kota favorit</Text>
          ) : (
            daftarFavorit.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 8,
                }}
              >
                <Text style={{ color: colors.text }}>{item.nama}</Text>
                <Button
                  title="Hapus"
                  color={colors.danger}
                  onPress={() => hapus(item)}
                />
              </View>
            ))
          )}
        </View>
        {pesanError && (
          <Text style={{ color: colors.danger }} accessibilityLabel={pesanError}>
            {pesanError}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
