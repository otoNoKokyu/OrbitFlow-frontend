import { toast } from "sonner";
import { IResponse, isRespError } from "../common/types/global/response";

// Generic async function with variadic args
type AsyncFunction<T, Args extends any[] = any[]> = (
  ...args: Args
) => Promise<IResponse<T>>;

export const asyncHandler = <T = any, Args extends any[] = any[]>(
  fn: AsyncFunction<T, Args>
) => {
  return (...args: Args): Promise<T> => {
    return fn(...args)
      .then((result) => result.responsePayload.data)
      .catch((error: unknown) => {
        if (isRespError(error)) {
          toast.error(error.message, {
            style: {
              height: "100px",
              maxWidth: "400px",
              padding: "25px",
              fontSize: "medium",
            },
          });
        } else {
          toast("An unexpected error occurred.");
        }
        throw error;
      });
  };
};
