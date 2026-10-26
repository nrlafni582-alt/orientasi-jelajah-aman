// src/components/SearchBox.tsx
import { TextInput, View } from "react-native";
import { useTheme } from "../hooks/use-theme";

interface SearchBoxProps {
  value: string;
  onCari: (teks: string) => void;
}
export default function SearchBox({ value, onCari }: SearchBoxProps) {
  const colors = useTheme();
  function handleChange(nilaiBaru: string) {
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }
  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={colors.subtext}
        value={value}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          padding: 8,
          borderRadius: 8,
          color: colors.text,
          backgroundColor: colors.card,
        }}
      />
    </View>
  );
}
