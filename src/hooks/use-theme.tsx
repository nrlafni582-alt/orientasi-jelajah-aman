import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/theme";

export type ThemeMode = "light" | "dark" | "system";
export interface ThemeColors {
  text: string;
  background: string;
  backgroundElement: string;
  backgroundSelected: string;
  textSecondary: string;
  card: string;
  primary: string;
  border: string;
  subtext: string;
  danger: string;
}

const THEME_KEY = "@jelajah-aman:theme-mode";

const palettes: Record<"light" | "dark", ThemeColors> = {
  light: {
    ...Colors.light,
    card: "#FFFFFF",
    primary: "#2563EB",
    border: "#D1D5DB",
    subtext: "#60646C",
    danger: "#B91C1C",
  },
  dark: {
    ...Colors.dark,
    card: "#17191C",
    primary: "#60A5FA",
    border: "#3A3D42",
    subtext: "#B0B4BA",
    danger: "#F87171",
  },
};

interface ThemeContextValue {
  colors: ThemeColors;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_KEY)
      .then((savedMode) => {
        if (
          active &&
          (savedMode === "light" ||
            savedMode === "dark" ||
            savedMode === "system")
        ) {
          setModeState(savedMode);
        }
      })
      .catch((error: unknown) => {
        console.error("Gagal memuat preferensi tema:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const setMode = useCallback(async (newMode: ThemeMode) => {
    await AsyncStorage.setItem(THEME_KEY, newMode);
    setModeState(newMode);
  }, []);

  const activeScheme =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;
  const value = useMemo(
    () => ({ colors: palettes[activeScheme], mode, setMode }),
    [activeScheme, mode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme harus digunakan di dalam ThemeProvider.");
  }
  return context.colors;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode harus digunakan di dalam ThemeProvider.");
  }
  return { mode: context.mode, setMode: context.setMode };
}
