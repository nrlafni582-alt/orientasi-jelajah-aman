// src/app/tambah-favorit.tsx
import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";
import { useTheme } from "../hooks/use-theme";
import { tambahFavorit } from "../services/favoritStorage";
export default function ModalTambahFavorit() {
  const colors = useTheme();
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();
  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      nama,
      latitude: Number(lat),
      longitude: Number(lon),
    });
    router.back();
  }
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ color: colors.text }}>
        Tambahkan {nama} ke daftar favorit?
      </Text>
      <Button title="Simpan" color={colors.primary} onPress={simpan} />
    </View>
  );
}
