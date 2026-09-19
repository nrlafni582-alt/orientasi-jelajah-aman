import { Text, View } from "react-native";
import { LaporanUdara } from "../types/cuaca";

interface Props {
  data: LaporanUdara;
}

export default function IndikatorAQI({ data }: Props) {
  let warna = "#28a745";

  if (data.tingkat === "SEDANG") {
    warna = "#ffc107";
  } else if (data.tingkat === "TIDAK_SEHAT") {
    warna = "#fd7e14";
  } else if (data.tingkat === "BERBAHAYA") {
    warna = "#dc3545";
  }

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{data.kota}</Text>

      <Text style={{ fontSize: 18 }}>AQI: {data.indeksAQI}</Text>

      <Text style={{ color: warna, fontWeight: "bold" }}>
        Kualitas Udara: {data.tingkat}
      </Text>

      {data.diperbaruiPada && <Text>Diperbarui: {data.diperbaruiPada}</Text>}
    </View>
  );
}
