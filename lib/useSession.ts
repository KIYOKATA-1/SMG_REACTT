import { ISession } from "../services/auth.types";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSession = () => {
  const saveSession = useCallback(async (session: ISession) => {
    try {
      await AsyncStorage.setItem("session", JSON.stringify(session));
      console.log("Сессия сохранена");
    } catch (error) {
      console.error("Ошибка при сохранении сессии:", error);
    }
  }, []);

  const getSession = useCallback(async (): Promise<ISession | null> => {
    try {
      const session = await AsyncStorage.getItem("session");
      return session ? (JSON.parse(session) as ISession) : null;
    } catch (error) {
      console.error("Ошибка при получении сессии:", error);
      return null;
    }
  }, []);

  const removeSession = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("session");
      console.log("Сессия удалена");
    } catch (error) {
      console.error("Ошибка при удалении сессии:", error);
    }
  }, []);

  return { saveSession, getSession, removeSession };
};
