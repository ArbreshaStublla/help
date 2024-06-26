import router from "@/router";
import axios from "axios";

//import router from "@/router";

const baseUrl = process.env.VUE_APP_API_URL;

const access_token = localStorage.getItem("accessToken");

const axiosIns = axios.create({
  headers: {
    Accepts: "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${access_token}`,
  },
  baseURL: baseUrl,
});

axiosIns.interceptors.request.use(
  function (config) {
    const access_token = localStorage.getItem("accessToken");
    config.headers["Authorization"] = `Bearer ${access_token}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosIns.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      router.push("/login");
    }
    console.dir(error.response.status);

    console.dir(`Intercepting failed Response${error}`);
    return Promise.reject(error);
  }
);

export default axiosIns;
