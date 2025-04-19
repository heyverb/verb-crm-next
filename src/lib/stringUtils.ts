export const WEBSITE_REGEX =
  /^((https?):\/\/)?((www.)?)[a-zA-Z0-9]+([-/_.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?\s*$/;

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PHONE_REGEX = /^[6-9]\d{9}$/;

export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

export const ALPHA_NUMERIC_REGEX_NO_SPACE = /^[a-zA-Z0-9]*$/;

export const ALPHA_NUMERIC_REGEX = /[a-zA-Z0-9]/;

export const NAME_REGEX = /^[a-z0-9 ,.'-]+$/i;

export const NUMBER_REGEX = /^[0-9]+$/;

export const WHITESPACE_REGEX = /\s/;

export const DATE_REGEX =
  /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/;

export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
