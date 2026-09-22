// app/(tabs)/tentang.tsx
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing, typeScale } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView style={{ padding: spacing.sedang, gap: spacing.kecil }}>
      <Text
        accessibilityLabel="Judul halaman Tentang"
        style={{ fontSize: typeScale.judul, fontWeight: "bold" }}
      >
        Jelajah Aman
      </Text>

      <Text style={{ fontSize: typeScale.isi }}>Versi 1.0.0</Text>
      <Text style={{ fontSize: typeScale.isi }}>Nama Pembuat: Nurul Afni</Text>
    </SafeAreaView>
  );
}
