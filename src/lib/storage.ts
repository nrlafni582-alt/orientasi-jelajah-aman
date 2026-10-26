import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "@jelajah-aman:search-history";
export const MAX_HISTORY = 10;

const normalize = (city: string) => city.trim().toLocaleLowerCase();

export async function getHistory(): Promise<string[]> {
  const stored = await AsyncStorage.getItem(HISTORY_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
    throw new Error("Format riwayat pencarian tidak valid.");
  }
  return parsed.slice(0, MAX_HISTORY);
}

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
