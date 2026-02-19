import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Función para obtener token directamente del sessionStorage
const getToken = () => sessionStorage.getItem("token");

// Función para logout global
const logoutUser = () => {
  sessionStorage.clear();
  window.location.href = "/"; // redirige al login
};

// Interceptor de requests: agrega token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de responses: maneja 401 globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token inválido o expirado. Cerrando sesión...");
      logoutUser(); // borrar session y redirigir
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
