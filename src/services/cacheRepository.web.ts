import {
  DataTersimpan,
  KotaUntukCache,
  RingkasanKotaTersimpan,
} from "../types/cache";
import { DataCuacaLengkap, DataKualitasUdara } from "../types/weather";

interface BarisCache {
  kunci: string;
  kota_id: number;
  nama_kota: string;
  latitude: number;
  longitude: number;
  cuaca_json: string;
  aqi_json: string;
  disimpan_pada: number;
}

type DataCacheWeb = Record<string, BarisCache>;

const KUNCI_STORAGE = "@jelajah-aman:cache-cuaca";

export function buatKunci(latitude: number, longitude: number): string {
  return `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
}

function bacaSemuaCache(): DataCacheWeb {
  // localStorage tidak tersedia saat static rendering di server.
  if (typeof localStorage === "undefined") {
    return {};
  }

  try {
    const data = localStorage.getItem(KUNCI_STORAGE);
    return data ? (JSON.parse(data) as DataCacheWeb) : {};
  } catch {
    return {};
  }
}

function simpanSemuaCache(data: DataCacheWeb): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(data));
  } catch (error) {
    console.error("Gagal menyimpan cache cuaca:", error);
    throw error;
  }
}

export async function simpanCache(
  kota: KotaUntukCache,
  cuaca: DataCuacaLengkap,
  kualitasUdara: DataKualitasUdara,
): Promise<void> {
  const semua = bacaSemuaCache();
  const kunci = buatKunci(kota.latitude, kota.longitude);

  semua[kunci] = {
    kunci,
    kota_id: kota.id,
    nama_kota: kota.nama,
    latitude: kota.latitude,
    longitude: kota.longitude,
    cuaca_json: JSON.stringify(cuaca),
    aqi_json: JSON.stringify(kualitasUdara),
    disimpan_pada: Date.now(),
  };

  simpanSemuaCache(semua);
}

export async function ambilCache(
  latitude: number,
  longitude: number,
): Promise<DataTersimpan | null> {
  const kunci = buatKunci(latitude, longitude);
  const baris = bacaSemuaCache()[kunci];

  if (!baris) {
    return null;
  }

  try {
    return {
      cuaca: JSON.parse(baris.cuaca_json) as DataCuacaLengkap,
      kualitasUdara: JSON.parse(baris.aqi_json) as DataKualitasUdara,
      disimpanPada: baris.disimpan_pada,
    };
  } catch {
    return null;
  }
}

export async function daftarKotaTersimpan(): Promise<RingkasanKotaTersimpan[]> {
  return Object.values(bacaSemuaCache())
    .sort((a, b) => b.disimpan_pada - a.disimpan_pada)
    .slice(0, 5)
    .map((baris) => ({
      kunci: baris.kunci,
      id: baris.kota_id,
      nama: baris.nama_kota,
      latitude: baris.latitude,
      longitude: baris.longitude,
      disimpanPada: baris.disimpan_pada,
    }));
}

export async function hapusKotaTersimpan(kunci: string): Promise<void> {
  const semua = bacaSemuaCache();
  delete semua[kunci];
  simpanSemuaCache(semua);
}

export async function bersihkanCacheLama(batasUmurMs: number): Promise<void> {
  const batasWaktu = Date.now() - batasUmurMs;
  const semua = bacaSemuaCache();

  for (const [kunci, baris] of Object.entries(semua)) {
    if (baris.disimpan_pada < batasWaktu) {
      delete semua[kunci];
    }
  }

  simpanSemuaCache(semua);
}

export async function hapusSemuaCache(): Promise<void> {
  if (typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(KUNCI_STORAGE);
  } catch (error) {
    console.error("Gagal menghapus cache cuaca:", error);
    throw error;
  }
}
