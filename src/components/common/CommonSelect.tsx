import React, { FC } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";

export interface InputProps {
  label: string;
  disabled?: boolean;
  options: { value: string; label: string }[];
  className?: string;
}

const CommonSelect: FC<InputProps> = (props) => {
  const { label, options, disabled } = props;
  return (
    <Select disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={label} />
      </SelectTrigger>

      <SelectContent>
        {options &&
          options.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default CommonSelect;
