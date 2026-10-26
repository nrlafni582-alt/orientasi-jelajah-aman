// src/components/AtribusiCuaca.tsx
import { Linking, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/use-theme";

export default function AtribusiCuaca() {
  const colors = useTheme();
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL("https://open-meteo.com/")}
    >
      <Text
        style={{
          fontSize: 11,
          color: colors.subtext,
          textAlign: "center",
        }}
      >
        Data cuaca disediakan oleh Open-Meteo.com
      </Text>
    </TouchableOpacity>
  );
}
