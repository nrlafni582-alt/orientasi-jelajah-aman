// src/app/(tabs)/index.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Button,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import SearchBox from "../../components/SearchBox";
import StatusData from "../../components/StatusData";
import WeatherCard from "../../components/WeatherCard";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { useDebounce } from "../../hooks/use-debounce";
import { useTheme } from "../../hooks/use-theme";
import { addHistory } from "../../lib/storage";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
  hapusKotaTersimpan,
} from "../../services/cacheRepository";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import { cariKota } from "../../services/geocodingService";
import {
  ambilKoordinatSaatIni,
  mintaIzinLokasi,
} from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { HasilCuacaOffline, RingkasanKotaTersimpan } from "../../types/cache";
import { HasilGeocoding } from "../../types/geocoding";
import { Ionicons } from "@expo/vector-icons";

export default function HalamanUtama() {
  const colors = useTheme();
  const { q, t } = useLocalSearchParams<{ q?: string; t?: string }>();
  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    [],
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanRiwayat, setPesanRiwayat] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const teksPencarian = q ?? teksCari;
  const parameterPencarian = useMemo(
    () => ({ query: teksPencarian, token: t }),
    [teksPencarian, t],
  );
  const teksTertunda = useDebounce(parameterPencarian, 500);
  const requestIdRef = useRef(0); // pencegah race condition
  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }
  // Saat aplikasi dibuka: buang cache > 7 hari, lalu tampilkan daftar tersimpan
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (q) setTeksCari(q);
  }, [q, t]);
  useEffect(() => {
    if (teksTertunda.query.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }
    cariKota(teksTertunda.query)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);
  async function pilihKota(kota: HasilGeocoding, paksaPerbarui = false) {
    setKotaTerpilih(kota);
    const idSaatIni = ++requestIdRef.current;
    setSedangMemuat(true);
    setPesanError(null);
    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui },
      );
      if (idSaatIni !== requestIdRef.current) return; // hasil basi, abaikan
      setHasil(data);
      if (kota.id !== -1) {
        try {
          await addHistory(kota.name);
          setPesanRiwayat(null);
        } catch {
          setPesanRiwayat("Riwayat pencarian gagal disimpan.");
        }
      }
      muatKotaTersimpan();
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;
      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi.",
      );
    } finally {
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
    }
  }
  async function hapusCacheKota(kota: RingkasanKotaTersimpan) {
    try {
      await hapusKotaTersimpan(kota.kunci);
      await muatKotaTersimpan();
    } catch {
      setPesanError("Cache kota gagal dihapus. Silakan coba lagi.");
    }
  }
  function konfirmasiHapusCache(kota: RingkasanKotaTersimpan) {
    const pesan = `Data offline untuk ${kota.nama} akan dihapus dari perangkat.`;
    if (Platform.OS === "web") {
      if (window.confirm(`Hapus cache kota?\n\n${pesan}`)) {
        void hapusCacheKota(kota);
      }
      return;
    }
    Alert.alert("Hapus cache kota?", pesan, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => void hapusCacheKota(kota),
      },
    ]);
  }
  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();
    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
      );
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
      );
      return;
    }
    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBox
          value={teksPencarian}
          onCari={(teks) => {
            setTeksCari(teks);
            if (q) router.setParams({ q: undefined, t: undefined });
          }}
        />
        {pesanRiwayat && (
          <Text style={{ color: colors.danger }} accessibilityLabel={pesanRiwayat}>
            {pesanRiwayat}
          </Text>
        )}
        <Button
          title="Gunakan Lokasi Saat Ini"
          onPress={gunakanLokasiSaatIni}
          color={colors.primary}
        />
        {pesanLokasi && (
          <Text style={{ color: colors.text }} accessibilityLabel={pesanLokasi}>
            {pesanLokasi}
          </Text>
        )}
        {hasilPencarian.map((kota) => (
          <TouchableOpacity
            key={kota.id}
            onPress={() => pilihKota(kota)}
            style={{
              padding: 8,
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: colors.text }}>{kota.name}</Text>
          </TouchableOpacity>
        ))}
        {kotaTersimpan.length > 0 && (
          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: "bold", color: colors.text }}>
              Tersimpan di perangkat (bisa dibuka offline)
            </Text>
            {kotaTersimpan.map((k) => (
              <View
                key={k.kunci}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 8,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    pilihKota({
                      id: k.id,
                      name: k.nama,
                      latitude: k.latitude,
                      longitude: k.longitude,
                      country: "",
                    })
                  }
                >
                  <Text style={{ color: colors.text }}>{k.nama}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => konfirmasiHapusCache(k)}
                  accessibilityRole="button"
                  accessibilityLabel={`Hapus cache ${k.nama}`}
                  hitSlop={10}
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color={colors.danger}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        {sedangMemuat && <ActivityIndicator />}
        {pesanError && (
          <View>
            <Text style={{ color: colors.danger }} accessibilityLabel={pesanError}>
              {pesanError}
            </Text>
            <Button
              title="Coba Lagi"
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
              color={colors.primary}
            />
          </View>
        )}
        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />
            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
            />
            <Text style={{ fontSize: 12, color: colors.subtext }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}{" "}
              {"\u2022"} Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Text>
            <Button
              title="Perbarui Sekarang"
              onPress={() => pilihKota(kotaTerpilih, true)}
              color={colors.primary}
            />
            <Button
              title="Tambahkan ke Favorit"
              color={colors.primary}
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",
                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
            />
          </>
        )}
        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}
