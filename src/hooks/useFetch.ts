import { IResponse } from '@/common/types/global/response';
import { useEffect, useState } from 'react';

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type Fn<T> = (param?:any) => Promise<T>;

export function useFetch<T = unknown>(fn: Fn<T>, query?:string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fn(query??undefined);
        if (!isCancelled) {
            setData(res);
          }
        }
      catch (err: any) {
        if (!isCancelled) {
          setError(err.message ?? 'Fetch failed');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [fn,query]);

  return { data, loading, error };
}
