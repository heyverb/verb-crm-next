import { AxiosError } from "axios";

export function getErrorMessage(
  error: AxiosError | unknown,
  prefix: boolean = false
): string {
  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "No error message provided";

    return message;
  }

  if (error instanceof Error) {
    return `${prefix ? "Error:" : ""} ${error.message}`;
  }

  return "An unexpected error occurred. Please try again.";
}
