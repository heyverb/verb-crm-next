import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { Input } from "@/components/ui/input";

type InputBaseProps = Omit<
  React.ComponentProps<"input">,
  "name" | "defaultValue"
>;

export interface ControlledInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName>,
    InputBaseProps {
  label: string | React.ReactElement;
  placeholder: string;
  required?: boolean;
}

const ControlledInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  props: ControlledInputProps<TFieldValues, TName>
) => {
  const { control, name, label, placeholder, required, ...rest } = props;

  return (
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
            <Input placeholder={placeholder} {...field} {...rest} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ControlledInput;
