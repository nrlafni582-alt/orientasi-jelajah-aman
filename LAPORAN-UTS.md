# Laporan UTS Praktikum

## Implementasi Fitur Aplikasi Jelajah Aman

**Nama aplikasi:** Jelajah Aman

**Versi:** 1.0.0

**Platform:** React Native dengan Expo SDK 57

**Nama pembuat:** Nurul Afni

**Tanggal:** 27 Oktober 2026
**Repositori:** https://github.com/nrlafni582-alt/orientasi-jelajah-aman

## 1. Tujuan

Laporan ini menjelaskan kode yang ditambahkan atau diubah untuk memenuhi tugas
UTS: ikon navigasi, riwayat pencarian kota, penghapusan cache, dan tema
Terang/Gelap/Ikuti Sistem.

## 2. Daftar Kode yang Ditambahkan atau Diubah

| Fitur | File | Kode/perubahan utama |
|---|---|---|
| Ikon tab dan label | `src/app/(tabs)/_layout.tsx` | Mengimpor `Ionicons`, memberi ikon unik untuk setiap tab, serta membedakan judul halaman “Favorit & Riwayat” dari label tab “Riwayat”. |
| Provider tema | `src/hooks/use-theme.tsx` | Membuat `ThemeProvider`, palet warna terang/gelap, penyimpanan pilihan tema, dan hook `useTheme` / `useThemeMode`. File menggunakan ekstensi `.tsx` karena mengandung JSX. |
| Provider di tingkat aplikasi | `src/app/_layout.tsx` | Membungkus navigator dengan `ThemeProvider` dan menyelaraskan warna status bar, header, dan latar halaman dengan tema aktif. |
| Pilihan mode | `src/app/(tabs)/pengaturan.tsx` | Menambahkan tombol Terang, Gelap, dan Ikuti Sistem serta pesan jika penyimpanan pilihan gagal. |
| Penyimpanan riwayat | `src/lib/storage.ts` | Menambahkan `getHistory` dan `addHistory` memakai AsyncStorage. Riwayat dibatasi maksimal 10 dan nama yang sama tidak diduplikasi. |
| Menyimpan kota berhasil dicari | `src/app/(tabs)/index.tsx` | Menambahkan kota ke riwayat setelah data cuaca berhasil dimuat. Lokasi GPS tidak dicatat sebagai kota pencarian. |
| Memilih riwayat | `src/components/RiwayatList.tsx` | Membuat item riwayat dapat ditekan untuk kembali ke Beranda dan mencari nama kota tersebut. Parameter `t` membuat pencarian ulang kota yang sama tetap terpicu. |
| Daftar riwayat dan favorit | `src/app/(tabs)/riwayat.tsx` | Menampilkan riwayat pencarian dan daftar favorit dalam satu tab; fitur hapus favorit tetap tersedia. |
| Hapus cache per kota | `src/app/(tabs)/index.tsx` | Menambahkan tombol ikon tempat sampah dan dialog konfirmasi sebelum cache dihapus. |
| Hapus cache SQLite | `src/services/cacheRepository.ts` | Menambahkan `hapusKotaTersimpan(kunci)` untuk menghapus satu baris cache. |
| Hapus cache web | `src/services/cacheRepository.web.ts` | Menambahkan `hapusKotaTersimpan(kunci)` untuk menghapus satu entri localStorage. |
| Warna tema di komponen/layar | `src/components/SearchBox.tsx`, `WeatherCard.tsx`, `StatusData.tsx`, `AtribusiCuaca.tsx`, `src/app/(tabs)/tentang.tsx`, `src/app/detail/[kota].tsx`, `src/app/tambah-favorit.tsx` | Menggunakan warna dari `useTheme` agar teks, kartu, latar, dan tombol menyesuaikan mode. |
| Ikon | `package.json` | Menambahkan dependensi `@expo/vector-icons`. |

## 3. Contoh Potongan Kode

### 3.1 Membatasi riwayat menjadi 10 kota

File: `src/lib/storage.ts`

```ts
export const MAX_HISTORY = 10;

export async function addHistory(city: string): Promise<void> {
  const name = city.trim();
  if (!name) return;

  const history = await getHistory();
  const updated = [
    name,
    ...history.filter((item) => normalize(item) !== normalize(name)),
  ].slice(0, MAX_HISTORY);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}
```

### 3.2 Menjalankan pencarian dari item riwayat

File: `src/components/RiwayatList.tsx`

```tsx
onPress={() =>
  router.push({
    pathname: "/",
    params: { q: kota, t: String(Date.now()) },
  })
}
```

### 3.3 Menghapus cache setelah konfirmasi

File: `src/app/(tabs)/index.tsx`

```tsx
Alert.alert("Hapus cache kota?", pesan, [
  { text: "Batal", style: "cancel" },
  {
    text: "Hapus",
    style: "destructive",
    onPress: () => void hapusCacheKota(kota),
  },
]);
```

Di web, konfirmasi menggunakan `window.confirm`. Setelah disetujui,
repository menghapus cache kota dan daftar kota tersimpan dimuat ulang.

### 3.4 Menyimpan pilihan tema

File: `src/hooks/use-theme.tsx`

```tsx
const setMode = useCallback(async (newMode: ThemeMode) => {
  await AsyncStorage.setItem(THEME_KEY, newMode);
  setModeState(newMode);
}, []);
```

Mode yang tersedia adalah `light`, `dark`, dan `system`.

## 4. Panduan Screenshot Hasil Implementasi

Jalankan aplikasi terlebih dahulu pada emulator/perangkat atau web. Screenshot
di bawah perlu diambil dari aplikasi yang benar-benar berjalan; dokumen ini
tidak menyertakan gambar hasil buatan.

### Screenshot 1 — Ikon navigasi

1. Buka aplikasi dan tampilkan bagian bawah layar.
2. Pastikan terlihat tab Beranda, Riwayat, Pengaturan, dan Tentang beserta
   ikon yang berbeda.
3. Ambil screenshot layar penuh.

**Hasil yang diharapkan:** setiap tab memiliki ikon representatif, bukan ikon
bawaan yang seragam.

### Screenshot 2 — Riwayat pencarian

1. Dari Beranda, cari dan pilih satu kota.
2. Ulangi untuk beberapa kota agar daftar terisi.
3. Buka tab Riwayat.

**Hasil yang diharapkan:** bagian “Riwayat Pencarian” menampilkan kota-kota
terakhir (maksimal 10), dan bagian “Kota Favorit” tetap tampil di bawahnya.

### Screenshot 3 — Pencarian dari riwayat

1. Dari tab Riwayat, tekan salah satu nama kota.
2. Ambil screenshot setelah aplikasi kembali ke Beranda dan hasil pencarian
   kota tersebut muncul/dipilih.

**Hasil yang diharapkan:** nama kota riwayat menjadi query pencarian di
Beranda; pemilihan kota yang sama tetap menjalankan pencarian kembali.

### Screenshot 4 — Konfirmasi hapus cache

1. Pastikan daftar “Tersimpan di perangkat” berisi minimal satu kota.
2. Tekan ikon tempat sampah di baris kota itu.
3. Ambil screenshot dialog konfirmasi sebelum menekan “Hapus”.

**Hasil yang diharapkan:** dialog menyebut cache kota yang akan dihapus dan
menawarkan pilihan batal atau hapus. Setelah hapus dikonfirmasi, kota hilang
dari daftar cache.

### Screenshot 5 — Pengaturan tema

1. Buka tab Pengaturan.
2. Ambil screenshot yang menampilkan pilihan Terang, Gelap, dan Ikuti Sistem.
3. Pilih Gelap dan ambil screenshot hasil perubahan tampilan.
4. Opsional: pilih Terang atau Ikuti Sistem dan dokumentasikan hasilnya.

**Hasil yang diharapkan:** pilihan aktif diberi tanda; warna layar, header,
dan navigasi berubah sesuai mode. Pilihan tetap digunakan setelah aplikasi
dibuka kembali.

Simpan gambar dengan nama yang jelas, misalnya `01-navigasi.png`,
`02-riwayat.png`, `03-pencarian-riwayat.png`, `04-konfirmasi-cache.png`,
dan `05-tema-gelap.png`, lalu masukkan gambar ke bagian laporan saat
mengumpulkan.

## 5. Hasil Validasi

- `npx tsc --noEmit`: berhasil tanpa error TypeScript.
- `npx expo install --check`: memberi peringatan bahwa beberapa versi paket
  Expo yang sudah ada di proyek tertinggal dari versi rekomendasi SDK 57.
  Paket yang disebut adalah `@expo/ui`, `expo`, `expo-location`, dan
  `expo-router`.
- Screenshot visual perlu diambil dari aplikasi yang dijalankan pada
  emulator/perangkat atau web sebelum laporan dikumpulkan.

## 6. Informasi Pengumpulan

Repositori: https://github.com/nrlafni582-alt/orientasi-jelajah-aman

Pastikan commit terbaru sudah di-push ke repositori GitHub yang dapat diakses
dosen. Lengkapi laporan ini dengan screenshot aktual dari setiap fitur,
kemudian unggah laporan dan gambar ke Classroom.
