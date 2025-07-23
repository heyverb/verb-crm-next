import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { InputFile } from "../ui/fileInput";

type InputBaseProps = Omit<
  React.ComponentProps<"input">,
  "name" | "defaultValue"
>;

export interface InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName>,
    InputBaseProps {
  label?: string;
  required?: boolean;
}

const CommonFileInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  props: InputProps<TFieldValues, TName>
) => {
  const { control, name, label, required, ...rest } = props;

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
            <InputFile
              value=""
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={field.disabled}
              name={field.name}
              ref={field.ref}
              {...rest}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CommonFileInput;
