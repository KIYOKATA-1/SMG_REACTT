import axios from 'axios';

const BACKEND_URL = 'https://api.smg.kz/en/api';

export class AuthService {
  static async login(username: string, password: string) {
    try {
      const response = await axios.post(`${BACKEND_URL}/login/`, {
        username,
        password,
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Ошибка при авторизации. Проверьте данные.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.non_field_errors?.join('\n') || 'Ошибка при авторизации';
        throw new Error(errorMessage);
      } else {
        throw new Error('Ошибка сети. Попробуйте позже.');
      }
    }
  }

  static async register(first_name: string, phone: string, password1: string, password2: string) {
    try {
      const response = await axios.post(`${BACKEND_URL}/registration/`, {
        first_name,
        phone,
        password1,
        password2,
      });

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error('Ошибка при регистрации.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.non_field_errors?.join('\n') || 'Ошибка при регистрации';
        throw new Error(errorMessage);
      } else {
        throw new Error('Ошибка сети. Попробуйте позже.');
      }
    }
  }

  static async changePassword(token: string, oldPassword: string, newPassword: string) {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/change-password/`,
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.status === 200) {
        return 'Пароль успешно изменен';
      } else {
        throw new Error('Ошибка при изменении пароля');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || 'Ошибка при изменении пароля';
        throw new Error(errorMessage);
      } else {
        throw new Error('Ошибка сети. Попробуйте позже.');
      }
    }
  }

  static async logout(token: string) {
    try {
      await axios.post(
        `${BACKEND_URL}/logout/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
    } catch (error: unknown) {
      console.error('Ошибка при выходе из системы', error);
    }
  }
}
