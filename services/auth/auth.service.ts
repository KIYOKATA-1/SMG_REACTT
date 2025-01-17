import {ISession, IUpdateUserProfile, IUser} from "./auth.types";
import {ICourseInfiniteScroll} from "../../services/course/course.types";

const BACKEND_URL = 'https://api.smg.kz/en/api';


export class AuthService {

  static async login(username: string, password: string): Promise<ISession> {
    const response = await fetch(`${BACKEND_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.status !== 200) {
      if ('non_field_errors' in data) {
        throw data.non_field_errors.join('\n');
      }
      if ('username' in data) {
        throw data.username.join('\n');
      }
      throw new Error('Error while logging in');
    }
    return data as ISession;
  }
  

  static async register(first_name: string, phone: string, password1: string, password2: string) {
    const response = await fetch(`${BACKEND_URL}/registration/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({first_name, phone, password1, password2}),
    });
    const data = await response.json();
    if (response.status !== 200 && response.status !== 201) {
      if ('non_field_errors' in data) {
        throw data.non_field_errors.join('\n') as string;
      }
      if ('first_name' in data) {
        throw data.first_name.join('\n') as string;
      }
      if ('phone' in data) {
        throw data.phone.join('\n') as string;
      }
      if ('password1' in data) {
        throw data.password1.join('\n') as string;
      }
      if ('password2' in data) {
        throw data.password2.join('\n') as string;
      }
      throw new Error('Error while registering');
    }
    return data as IUser; // Предполагается, что интерфейс IUser уже определен
  }

  static async confirmation(phone: string, code: number) {
    const response = await fetch(`${BACKEND_URL}/user/confirm/registration/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({phone, code}),
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.message || 'Error while confirming');
    }
    return data;
  }

  static async changePassword(code: number, phone: string, password1: string, password2: string) {
    const response = await fetch(`${BACKEND_URL}/user/reset/password/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({code, phone, password1, password2}),
    });
    // const data = await response.json();
    // if (response.status !== 200) {
    //   throw new Error(data.message || 'Error while confirming');
    // }
    return 'Success';
  }

  static async resendCode(phone: string) {
    const response = await fetch(`${BACKEND_URL}/user/resend/code/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({phone}),
    });
    // const data = response.headers.get('content-length') === '0' ? {} : await response.json();
    //
    // if (response.status !== 200) {
    //   throw new Error(data.message || 'Error while confirming');
    // }

    return "Success";
  }

  static async changeProfile(token: string, userData: IUpdateUserProfile) {
    const response = await fetch(`${BACKEND_URL}/user/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({...userData}),
      }
    );
    const data = response.json()
    if (response.status !== 200) {
      throw new Error('Error while logging in');
    }
    return data
  }
  static async changeUserRole(token: string, user_id:number, role:number) {
    const response = await fetch(`${BACKEND_URL}/user/allusers/${user_id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          role:role
        }),
      }
    );
    const data = response.json()
    if (response.status !== 200) {
      throw new Error('Error while changing user role');
    }
    return data
  }

  static async getAllUsers(token:string, page: number = 0, search:string, role?: number) {
    const response = await fetch(`${BACKEND_URL}/user/allusers/?limit=100&offset=${page}&${role && 'role=' + role}&search=${search}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as ICourseInfiniteScroll<IUser>
  }
  static async getUserInfo(token:string) {
    const response = await fetch(`${BACKEND_URL}/user/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IUser
  }
}