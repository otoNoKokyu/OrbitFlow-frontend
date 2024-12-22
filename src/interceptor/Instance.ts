import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { IResponse } from '../common/types/global/response';


enum ExcludedEndpoint {
  LOGIN = '/signin',
  REGISTER = '/signup',
  OTP_VERIFY = '/verify',
  RESEND_OTP = '/sendOtp',
}

export const Instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

const isExcludedEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;

  const strippedUrl = url.split('?')[0];
  return Object.values(ExcludedEndpoint).some((endpoint) => strippedUrl.endsWith(endpoint));
};

Instance.interceptors.request.use(
  (config) => {
    if (isExcludedEndpoint(config.url)) {
      return config;
    }

    const tokens = localStorage.getItem('tokens')
      ? JSON.parse(localStorage.getItem('tokens')!)
      : null;

    if (tokens?.access_token) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Instance.interceptors.response.use(
  (response): IResponse => {
    const { data, status } = response;
    return { responsePayload: data, statusCode: status };
  },

  async (error): Promise<AxiosResponse<Pick<IResponse, 'error' | 'message'>, any>> => {
    const request = error.config!!
    if (error.response?.status === 401 && !request?.baseURL?.endsWith('/token')) {
      const tokens = localStorage.getItem('tokens')
        ? JSON.parse(localStorage.getItem('tokens')!)
        : null;

      if (tokens?.refresh_token) {
        try {
          const {responsePayload,statusCode}:IResponse = await Instance.post('/auth/token', {
            token: tokens.refresh_token,
          });
          if (statusCode === 200) {
            localStorage.setItem('tokens', JSON.stringify(responsePayload.data));
            Instance.defaults.headers.common.Authorization = `Bearer ${responsePayload.data.access_token}`;
            request.headers.Authorization = `Bearer ${responsePayload.data.access_token}`;
            return Instance(request);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
    }
    throw {
      error: error.response?.data?.error || 'Unknown error',
      message: error.response?.data?.message || 'An unexpected error occurred',
    };
  }
);
