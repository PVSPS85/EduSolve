import { api } from './api';
import { StudentRegistrationData, NgoRegistrationData } from '../types';

export const authService = {
  async studentLogin(credentials: { email: string; password: string }) {
    return api.post<{ token: string; user: any }>('/auth/student/login', credentials);
  },

  async studentRegister(data: StudentRegistrationData) {
    return api.post<{ message: string; user: any }>('/auth/student/register', data);
  },

  async ngoLogin(credentials: { email: string; password: string }) {
    return api.post<{ token: string; user: any }>('/auth/ngo/login', credentials);
  },

  async ngoRegister(data: NgoRegistrationData) {
    return api.post<{ message: string; user: any }>('/auth/ngo/register', data);
  },

  async getCurrentUser() {
    return api.get<{ user: any }>('/auth/me');
  },

  logout() {
    localStorage.removeItem('edusolve_token');
  },
};

