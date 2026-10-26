// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ThemeMode,
  useTheme,
  useThemeMode,
} from "../../hooks/use-theme";
import { hapusSemuaCache } from "../../services/cacheRepository";

const pilihanTema: { mode: ThemeMode; label: string }[] = [
  { mode: "light", label: "Terang" },
  { mode: "dark", label: "Gelap" },
  { mode: "system", label: "Ikuti Sistem" },
];

export default function TabPengaturan() {
  const colors = useTheme();
  const { mode, setMode } = useThemeMode();
  const [pesan, setPesan] = useState<string | null>(null);
  const [pesanTema, setPesanTema] = useState<string | null>(null);

  async function pilihTema(newMode: ThemeMode) {
    try {
      await setMode(newMode);
      setPesanTema(null);
    } catch {
      setPesanTema("Preferensi tema gagal disimpan.");
    }
  }

  async function hapusDataTersimpan() {
    try {
      await hapusSemuaCache();
      setPesan("Data cuaca tersimpan sudah dihapus.");
    } catch {
      setPesan("Data cuaca tersimpan gagal dihapus.");
    }
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 12,
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
        Jelajah Aman
      </Text>
      <Text style={{ color: colors.text }}>Versi 1.0.0</Text>
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: "bold", color: colors.text }}>
          Mode Tampilan
        </Text>
        {pilihanTema.map((pilihan) => (
          <Button
            key={pilihan.mode}
            title={`${mode === pilihan.mode ? "✓ " : ""}${pilihan.label}`}
            color={mode === pilihan.mode ? colors.primary : colors.subtext}
            accessibilityState={{ selected: mode === pilihan.mode }}
            onPress={() => pilihTema(pilihan.mode)}
          />
        ))}
        {pesanTema && (
          <Text style={{ color: colors.danger }} accessibilityLabel={pesanTema}>
            {pesanTema}
          </Text>
        )}
      </View>
      <Button
        title="Hapus Data Cuaca Tersimpan"
        color={colors.danger}
        onPress={hapusDataTersimpan}
      />
      {pesan && (
        <Text style={{ color: colors.text }} accessibilityLabel={pesan}>
          {pesan}
        </Text>
      )}
    </SafeAreaView>
  );
}
