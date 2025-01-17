export interface IUser {
  id: number;
  last_login: string;
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
  birthdate: string | null;
  gender: string;
  file: string | null;
  phone: string;
  activated_date: string;
  birthplace: string;
  address: string;
  role: number;
  branch?: number;
  grade?: number;
  coins: number;
  is_offline: boolean;
  assigned_teacher?: number | null;
}

export interface IUpdateUserProfile {
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  password?: string;
}

export interface ISession {
  key: string;
  user: IUser;
  created: string;
}

export interface LoginResponseError extends Error {
  non_field_errors: string[];
}