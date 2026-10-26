// app/(tabs)/tentang.tsx
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing, typeScale } from "../../constants/styles";
import { useTheme } from "../../hooks/use-theme";

export default function TabTentang() {
  const colors = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: spacing.sedang,
        gap: spacing.kecil,
        backgroundColor: colors.background,
      }}
    >
      <Text
        accessibilityLabel="Judul halaman Tentang"
        style={{
          fontSize: typeScale.judul,
          fontWeight: "bold",
          color: colors.text,
        }}
      >
        Jelajah Aman
      </Text>

      <Text style={{ fontSize: typeScale.isi, color: colors.text }}>
        Versi 1.0.0
      </Text>
      <Text style={{ fontSize: typeScale.isi, color: colors.text }}>
        Nama Pembuat: Nurul Afni
      </Text>
    </SafeAreaView>
  );
}
