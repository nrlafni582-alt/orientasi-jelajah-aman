// src/app/detail/[kota].tsx
import { router, useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";
import { useTheme } from "../../hooks/use-theme";
import WeatherCard from "../../components/WeatherCard";

export default function HalamanDetail() {
  const colors = useTheme();
  const { kota } = useLocalSearchParams<{ kota: string }>();

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: colors.background,
      }}
    >
      <WeatherCard kota={kota} suhu={29} tingkatAQI="BAIK" />
      <Button
        title="Tambahkan ke Favorit"
        color={colors.primary}
        onPress={() => router.push("/tambah-favorit")}
      />
    </View>
  );
}
