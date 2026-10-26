import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../hooks/use-theme";

interface RiwayatListProps {
  daftarKota: string[];
}

export default function RiwayatList({ daftarKota }: RiwayatListProps) {
  const colors = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {daftarKota.map((kota) => (
        <TouchableOpacity
          key={kota}
          onPress={() =>
            router.push({
              pathname: "/",
              params: { q: kota, t: String(Date.now()) },
            })
          }
          accessibilityRole="button"
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.text }}>{kota}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
