import axios from "axios";
import router from "@/router";

const baseUrl = process.env.VUE_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
