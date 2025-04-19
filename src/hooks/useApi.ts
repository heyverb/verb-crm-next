"use client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
interface ApiFunction {
  (payload?: any): Promise<any>;
}

interface UseCallApiResult {
  mutation: UseMutationResult<any, unknown, any, unknown>;
  data: any;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown;
  status: string;
  isError: boolean;
  reason: unknown;
}

const useApi = (Api: ApiFunction): UseCallApiResult => {
  const mutation = useMutation({
    mutationFn: (payload: any) => {
      return Api(payload);
    },
  });

  const objParam = {
    mutation,
    error: mutation.error,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    status: mutation.status,
    isError: mutation.isError,
    reason: mutation.failureReason,
  };

  return objParam;
};

export default useApi;
