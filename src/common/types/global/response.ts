export interface IResponse<T=any> {
    responsePayload: serverResponse<T>;
    statusCode: number;
    error?: string | null;
    message?: string | null;
}
export type serverResponse<D> = {
  message: string;
  data: D;
  cached: boolean;
  timestamp: string;
}

export const isRespError = (err: unknown): err is Pick<IResponse<any>, 'error' | 'message'> => {
    return (
      typeof err === 'object' &&
      err !== null &&
      typeof (err as Record<string, unknown>).error === 'string' && typeof (err as Record<string, unknown>).message === 'string'
    );
  };
  