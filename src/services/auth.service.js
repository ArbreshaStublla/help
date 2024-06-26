import axios from 'axios';
import router from '../router';

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL, 
  timeout: 5000, 
});

class AuthService {
  async login(user) {
    try {
      const response = await axiosInstance.post('user/login', {
        email: user.email,
        password: user.password,
      });

      const { accessToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('isLoggedIn', true);

      return accessToken; 
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');

    router.push('/login');
  }

  async register(item) {
    try {
      const response = await axiosInstance.post('authentication/create', {
        id: item.id,
        name: item.name,
        password: item.password,
        refreshToken: item.refreshToken,
        refreshTokenExpiryTime: '2024-03-18T13:17:17.008Z',
      });

      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
}

export default new AuthService();