import { toast } from "sonner";
import { IResponse, isRespError } from "../common/types/global/response";
type AsyncFunction<T,D=any> = (param?: D) => Promise<IResponse<T>>;

export const asyncHandler =<T=any,D=any>(fn: AsyncFunction<T>) => {
  return (param?: D): Promise<T> => {
      return fn(param)
        .then((result) => {
          return result.responsePayload.data})
        .catch((error: unknown) => {
          if (isRespError(error)) {
            toast.error(error.message,{style:{height:'100px',maxWidth: '400px', padding:"25px",fontSize:'medium'}});
          } else {
            toast('An unexpected error occurred.');
          }
          throw error;
        });
    };
  };
  
