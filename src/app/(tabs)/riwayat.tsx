// src/app/(tabs)/riwayat.tsx
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, FlatList, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../types/favorit";

export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);

  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, []),
  );

  async function eksekusiHapus(id: number) {
    await hapusFavorit(id);
    setDaftarFavorit((prev) => prev.filter((item) => item.id !== id));
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
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Kota Favorit</Text>
      <Text style={{ fontSize: 14, color: "#555" }}>
        Tersimpan {daftarFavorit.length} kota
      </Text>

      <FlatList
        data={daftarFavorit}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Belum ada kota favorit</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
            }}
          >
            <Text>{item.nama}</Text>
            <Button title="Hapus" onPress={() => hapus(item)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
