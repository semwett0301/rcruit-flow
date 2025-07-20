import { useEffect, useState } from 'react';
import axios from 'axios';

export const useAxiosLoader = () => {
  const [loadingCount, setLoadingCount] = useState<number>(0);

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        setLoadingCount((count) => count + 1);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoadingCount((count) => count - 1);
        return response;
      },
      (error) => {
        setLoadingCount((count) => count - 1);
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return loadingCount > 0;
};
