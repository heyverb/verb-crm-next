import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";

type InputBaseProps = Omit<
  React.ComponentProps<"input">,
  "name" | "defaultValue"
>;

export interface InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName>,
    InputBaseProps {
  label: string;
  placeholder: string;
  required?: boolean;
}

const ControlledPassworInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  props: InputProps<TFieldValues, TName>
) => {
  const [isPassword, setIsPassword] = useState(true);
  const { control, name, label, required, placeholder, ...rest } = props;

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
          <div className=" relative">
            <FormControl>
              <Input
                type={isPassword ? "password" : "text"}
                placeholder={placeholder}
                {...field}
                {...rest}
              />
            </FormControl>
            {isPassword ? (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                type="button"
                onClick={() => setIsPassword(!isPassword)}
              >
                <EyeOff size={15} />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                type="button"
                onClick={() => setIsPassword(!isPassword)}
              >
                <Eye size={15} />
              </Button>
            )}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ControlledPassworInput;
