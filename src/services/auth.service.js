// auth.service.js

import axiosIns from "../Api/axios"; 
import router from "../router"; 

class AuthService {
  async login(user) {
    const response = await axiosIns.post("user/login", {
      userName: user.username,
      password: user.password,
    });

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("isLoggedIn", true);

    return response.data;
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isLoggedIn");

    router.push("/login");
  }

  register(item) {
    return axiosIns.post("authentication/create", {
      id: item.id,
      name: item.name,
      password: item.password,
      refreshToken: item.refreshToken,
      refreshTokenExpiryTime: "2024-03-18T13:17:17.008Z",
    });
  }
}

export default new AuthService();
