import {
  type Query,
  QueryCache,
  QueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

const queryHandler = (
  error: AxiosError,
  query: Query<unknown, unknown, unknown, QueryKey>,
) => {
  query.meta?.onError?.(error);
};

export const generateQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 0,
      },
    },
    queryCache: new QueryCache({ onError: queryHandler }),
  });

export const queryClient = generateQueryClient();
