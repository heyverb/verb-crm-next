import React, { FC } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { UseControllerProps } from "react-hook-form";

export interface ControlledOtpInputProps extends UseControllerProps<any> {
  label?: string | React.ReactElement;
  required?: boolean;
}

const ControlledOtpInput: FC<ControlledOtpInputProps> = ({
  control,
  name,
  label,
  required,
}) => {
  return (
    <div className="w-full">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && (
              <FormLabel className="flex items-center gap-0.5">
                {label}
                {required && <span className="font-bold text-red-600">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <InputOTP maxLength={6} {...field} pattern="[0-9]*">
                <InputOTPGroup className="w-full">
                  <InputOTPSlot index={0} className="w-full" />
                  <InputOTPSlot index={1} className="w-full" />
                  <InputOTPSlot index={2} className="w-full" />
                  <InputOTPSlot index={3} className="w-full" />
                  <InputOTPSlot index={4} className="w-full" />
                  <InputOTPSlot index={5} className="w-full" />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ControlledOtpInput;
