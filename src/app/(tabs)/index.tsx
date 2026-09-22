// app/index.tsx
import { useEffect, useState } from "react";
import { View } from "react-native";

// Components
import IndikatorAQI from "../../components/IndikatorAQI";
import RiwayatList from "../../components/RiwayatList";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";

// Type
import { LaporanUdara } from "../../types/cuaca";

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("Pekalongan");
  const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);

  // Data laporan udara
  const laporan: LaporanUdara = {
    kota: kotaAktif,
    indeksAQI: 75,
    tingkat: "SEDANG",
    diperbaruiPada: "19 September 2026",
  };

  // Mencatat perubahan kota aktif
  useEffect(() => {
    console.log("Kota aktif berubah menjadi:", kotaAktif);
  }, [kotaAktif]);

  function handleCari(kota: string) {
    setKotaAktif(kota);

    if (!riwayat.includes(kota)) {
      setRiwayat([...riwayat, kota]);
    }
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <SearchBox onCari={handleCari} />

      <WeatherCard kota={kotaAktif} suhu={29} tingkatAQI="BAIK" />

      <IndikatorAQI data={laporan} />

      <RiwayatList daftarKota={riwayat} />
    </View>
  );
}
