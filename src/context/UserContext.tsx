import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchProfileApi } from "../api/auth";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  walletAddress: string;
  balance: number;
  balanceHistory?: number[];
  transactions?: Transaction[];
}

type Theme = "light" | "dark";

interface UserContextType {
  user: User | null;
  token: string | null;
  loadingUser: boolean;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  logout: () => Promise<void>;
  loadUserProfile: (t?: string) => Promise<void>;
  deposit: (amount: number, description?: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  token: null,
  loadingUser: true,
  setUser: () => {},
  setToken: () => {},
  logout: async () => {},
  loadUserProfile: async () => {},
  deposit: () => {},
  language: "en",
  setLanguage: () => {},
  theme: "dark",
  setTheme: () => {},
});

interface Props {
  children: ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [language, setLanguage] = useState<string>("en");
  const [theme, setTheme] = useState<Theme>("dark");

  // Load token on app launch
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await loadUserProfile(storedToken);
        }

        const storedLang = await AsyncStorage.getItem("language");
        if (storedLang) setLanguage(storedLang);

        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
      } catch (e) {
        console.error("Failed loading app settings", e);
      } finally {
        setLoadingUser(false);
      }
    };
    init();
  }, []);

  const loadUserProfile = async (t?: string) => {
    try {
      const jwt = t ?? token;
      if (!jwt) return;
      const { ok, data } = await fetchProfileApi(jwt);
      if (ok && data?.success) setUser(data.user);
    } catch (e) {
      console.error("loadUserProfile error", e);
    }
  };

  const persistToken = async (t: string | null) => {
    if (t) await AsyncStorage.setItem("token", t);
    else await AsyncStorage.removeItem("token");
    setToken(t);
  };

  const logout = async () => {
    await persistToken(null);
    setUser(null);
  };

  const deposit = (amount: number, description = "Test deposit") => {
    if (!user) return;
    const newEntry = {
      id: Date.now().toString(),
      description,
      amount,
      date: new Date().toISOString(),
    };
    setUser({
      ...user,
      balance: user.balance + amount,
      transactions: [...(user.transactions ?? []), newEntry],
      balanceHistory: [...(user.balanceHistory ?? []), user.balance + amount],
    });
  };

  // Persist language and theme changes
  useEffect(() => {
    AsyncStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    AsyncStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loadingUser,
        setUser,
        setToken: persistToken,
        loadUserProfile,
        logout,
        deposit,
        language,
        setLanguage,
        theme,
        setTheme,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
