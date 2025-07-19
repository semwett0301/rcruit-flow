import { AxiosError } from 'axios';
import '@tanstack/react-query';

interface Meta extends Record<string, unknown> {
  onError?: (error: AxiosError) => void;
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: Meta;
    defaultError: AxiosError;
  }
}
