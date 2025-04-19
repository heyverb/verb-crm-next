import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface UseRequestHandlerInterface<T>
  extends Omit<UseQueryOptions<T, Error>, "queryFn"> {
  queryFn: (payload?: any) => Promise<AxiosResponse<T>>;
}

const useRequestHandler = <T>(
  ApiRequest: UseRequestHandlerInterface<T>
): UseQueryResult<T, Error> => {
  const { queryFn, ...rest } = ApiRequest;

  const query = useQuery<T, Error>({
    queryFn: async (payload?: any) => {
      const res = await queryFn(payload);
      return res.data;
    },
    ...rest,
  });

  return query;
};

export default useRequestHandler;
