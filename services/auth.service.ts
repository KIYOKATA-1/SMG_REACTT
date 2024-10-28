import axios from 'axios';
import { ISession } from './auth.types';
import { useSession } from '../lib/useSession';

const BACKEND_URL = 'https://api.smg.kz/en/api';

export class AuthService {
  static async login(username: string, password: string): Promise<ISession> {
    const response = await axios.post(`${BACKEND_URL}/login/`, {
      username,
      password,
    });
    return response.data;
  }

  static async logout(token: string) {
    try {
      await axios.post(`${BACKEND_URL}/logout/`, {}, {
        headers: { Authorization: `Token ${token}` },
      });
      const { removeSession } = useSession(); // Достаем removeSession
      await removeSession(); // Удаляем сессию
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  }
}
