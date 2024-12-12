import { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';

const useApiManager = <T>(
    fn: (data?:any) =>  Promise<AxiosResponse<T>>,
    fetchType?: 'event' | 'onMount'
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<number | null>(null);

    const callAPI = async (data?:any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await (data? fn(data): fn());
            const result = response.data;
            if(fetchType !== 'onMount') return result
            else{
                setData(result);
                setStatus(response.status);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchType && fetchType === 'onMount') callAPI();
    
    }, [fn]);

    return { data, loading, error, status, performNetworkCall: callAPI };
};

export default useApiManager;
