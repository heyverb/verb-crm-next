import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  EMAIL_REGEX,
  NUMBER_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  PINCODE_REGEX,
} from "./stringUtils";
import { DateTime } from "luxon";
import encode from "jwt-encode";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isFieldRequired = () => {};

export const emailValidator = (email: string) => {
  if (email.match(EMAIL_REGEX)) {
    return undefined;
  }
  return "please enter a valid email.";
};

export const phoneValidator = (phone: string) => {
  if (phone.match(PHONE_REGEX)) {
    return undefined;
  } else {
    return "please enter a valid phone number.";
  }
};

export const pincodeValidator = (pincode: string) => {
  if (pincode.match(PINCODE_REGEX)) {
    return undefined;
  } else {
    return "please enter a valid pincode.";
  }
};

export const otpValidator = (otp: string) => {
  if (otp.match(PINCODE_REGEX)) {
    return undefined;
  } else {
    return "please enter a valid otp.";
  }
};

export const passwordValidator = (password: string) => {
  if (password.match(PASSWORD_REGEX)) {
    return undefined;
  } else {
    return "Password does not meet the criteria.";
  }
};

export const numberValidator = (number: string) => {
  if (number.match(NUMBER_REGEX)) {
    return undefined;
  } else {
    return "Please enter a valid number.";
  }
};

export const capitalizeEnum = (value: string) => {
  if (!value) return;
  return value
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(" ");
};

export const enumToArray = <T extends Record<string, string>>(enumType: T) => {
  return Object.values(enumType).map((item) => ({
    label: capitalizeEnum(item) as string,
    value: item as string,
  }));
};

export function convertToCamelCase(str: string) {
  if (!str) return;

  return str
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(" ");
}

export function formatNumber({
  value,
  locale = "en-US",
  options = {},
  useShortForm = true,
}: {
  value: number;
  locale?: "en-US" | "hi-IN";
  options?: Intl.NumberFormatOptions;
  useShortForm?: boolean;
}): string {
  if (useShortForm) {
    // Handle large numbers for short form (e.g., 1k, 1M, etc.)
    const absValue = Math.abs(value); // Ensure logic works for negative numbers
    if (absValue >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`; // Million
    } else if (absValue >= 1_000) {
      return `${(value / 1_000).toFixed(1)}k`; // Thousand
    }
  }

  const defaultOptions: Intl.NumberFormatOptions = {
    style: "decimal", // Change to "currency" if needed
    currency: "INR", // Currency defaults to INR for India
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  // Merge user options with default options
  const formatterOptions = { ...defaultOptions, ...options };

  // Create formatter with locale and options
  const formatter = new Intl.NumberFormat(locale, formatterOptions);

  return formatter.format(value);
}

export const generateDateRange = (
  range: string,
  customFrom?: string, // ISO format: '2025-04-01'
  customTo?: string
): string[] => {
  let start: DateTime;
  let end = DateTime.now().startOf("day");

  if (range === "7d") {
    start = end.minus({ days: 6 }); // last 7 days including today
  } else if (range === "30d") {
    start = end.minus({ days: 29 }); // last 30 days including today
  } else if (range === "custom" && customFrom && customTo) {
    start = DateTime.fromISO(customFrom).startOf("day");
    const parsedEnd = DateTime.fromISO(customTo);
    if (parsedEnd.isValid) {
      end = parsedEnd.startOf("day");
    } else {
      throw new Error("Invalid customTo date format");
    }
  } else {
    return [];
  }

  const dates: string[] = [];

  for (let dt = start; dt <= end; dt = dt.plus({ days: 1 })) {
    dates.push(dt.toFormat("yyyy-MM-dd")); // Or 'dd-MM-yyyy' if needed for display
  }

  return dates;
};

export const parseJsonInArray = (
  data: string | any
): { name: string; url: string }[] => {
  try {
    return [JSON.parse(data)].map((item: { name: string; url: string }) => ({
      name: item.name,
      url: item.url,
    }));
  } catch (e) {
    console.log(e);

    return [];
  }
};

export const passwordConfirmPasswrodValidator = (pass, cpass) => {
  if (pass === cpass) {
    return undefined;
  }
  return "Passwords do not match.";
};

export function isValidURL(url: string) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

export const encryptPassword = (password: string): string => {
  const secret = "JDKNSOoaidjfnosada12312";
  const data = {
    password: password,
  };
  return encode(data, secret);
};

export const decryptPassword = (password: string): { password: string } => {
  return jwtDecode(password);
};
