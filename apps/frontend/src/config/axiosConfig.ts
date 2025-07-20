import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*, accept, content-type, access_token',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};
axios.defaults.withCredentials = false;
axios.defaults.responseType = 'json';

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  },
);
