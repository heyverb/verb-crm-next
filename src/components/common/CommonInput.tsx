import React, { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string | React.ReactElement;
  placeholder: string;
  required?: boolean;
}

const CommonInput: FC<InputProps> = (props) => {
  const { label, placeholder, required, ...rest } = props;

  return (
    <div className="w-full">
      {label && (
        <Label className="flex items-center gap-0.5">
          {label}
          {required && <span className="font-bold text-red-600">*</span>}
        </Label>
      )}
      <Input placeholder={placeholder} {...rest} />
    </div>
  );
};

export default CommonInput;
