import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

const serverUrl = "https://scheduler-server-a6deb2hrgug8evbw.westeurope-01.azurewebsites.net/";

export const api = axios.create({
  baseURL: serverUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    localStorage.setItem("token", token);
    console.log("Token set:", token); // Debugging log
  } else {
    delete api.defaults.headers.common["x-auth-token"];
    localStorage.removeItem("token");
    console.log("Token removed"); // Debugging log
  }
};

<<<<<<< HEAD
//a request interceptor to include the token from local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
=======
// Function to decode JWT token
export const decodeToken = (token) => {
  if (typeof token !== "string") {
    console.error("Invalid token specified: must be a string");
    return null;
  }
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// Function to check if token is expired
export const isTokenExpired = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    return true;
  }
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};
>>>>>>> 1408cdf67de0678b134fd1e573047456d3e59e43

export function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}