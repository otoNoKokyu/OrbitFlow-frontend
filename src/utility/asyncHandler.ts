import { IResponse, isRespError } from "../common/types/global/response";
type AsyncFunction<T,D=any> = (param?: D) => Promise<IResponse<T>>;

export const asyncHandler =<T>(fn: AsyncFunction<T>) => {
  return (...param: any[]): Promise<T> => {
      return fn(...param)
        .then((result) => {
          return result.responsePayload.data})
        .catch((error: unknown) => {
          if (isRespError(error)) {
            alert(`${error.error}: ${error.message}`);
          } else {
            alert('An unexpected error occurred.');
          }
          throw error;
        });
    };
  };
  