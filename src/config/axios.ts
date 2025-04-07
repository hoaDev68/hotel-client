import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';

// url nào không nằm trong array thì sẽ refresh token
const routerNotRefreshed = ['reset-password', '/auth/login'];

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const instanceAxios: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instanceAxios.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('persist:auth-ruounhapkhau') ?? '';

  // khi đăng nhập thì userInfo có kiểu string, những lần sau sẽ là object json
  let persist;
  let tokenInfo;

  if (userInfo) {
    persist = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
    tokenInfo = typeof persist.token === 'object' ? persist.token : JSON.parse(persist.token);
  } else {
    persist = {};
    tokenInfo = {};
  }
  if (tokenInfo.accessToken) {
    const modifiedConfig = { ...config };
    modifiedConfig.headers.Authorization = `Bearer ${tokenInfo.accessToken}`;
    return modifiedConfig;
  }

  return config;
});

function handleTokenError() {
  const currentURL = new URL(window.location.href);
  localStorage.setItem(
    'persist:auth-ruounhapkhau',
    JSON.stringify({
      token: '',
      user: '',
    })
  );
  if (currentURL.pathname.includes('admin')) {
    // window.location.href = `${currentURL.origin}/admin/dang-nhap`;
  } else {
    // window.location.href = `${currentURL.origin}`;
  }
}

instanceAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response) {
      const { status } = error.response;
      if (status === 401 && !originalRequest._retry) {
        handleTokenError();
      }
    }
    return Promise.reject(error);
  }
);
