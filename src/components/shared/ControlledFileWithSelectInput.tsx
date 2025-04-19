import React, { FC } from "react";
import ControlledSelect from "../common/ControlledSelect";
import { CreateAdmissionType } from "../forms/admission-form";
import CommonFileInput from "../common/CommonFileInput";
import { Button } from "../ui/button";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import LinkButton from "../common/LinkButton";

interface ControlledFileWithSelectInputProps {
  control?: any;
  selectName: string;
  fileName: string;
  selectOptions: any;
  append: () => void;
  remove: () => void;
  index: number;
}
const ControlledFileWithSelectInput: FC<ControlledFileWithSelectInputProps> = ({
  control,
  selectName,
  fileName,
  selectOptions,
  append,
  remove,
  index,
}) => {
  const { watch } = useFormContext();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <ControlledSelect<
        CreateAdmissionType, //@ts-expect-error am using index
        selectName
      >
        control={control}
        name={selectName}
        placeholder="Select type"
        options={selectOptions}
        disabled={watch(fileName)}
      />
      {watch(fileName) ? (
        <LinkButton
          href={watch(fileName)}
          target="_blank"
          name={watch(selectName)}
        />
      ) : (
        <>
          <CommonFileInput<
            CreateAdmissionType,
            //@ts-expect-error am using index
            fileName
          >
            control={control}
            name={fileName}
          />
          <div className=" space-x-2">
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
              variant="outline"
              type="button"
              onClick={append}
            >
              <CirclePlus />
              <span className="sr-only">Add document</span>
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
              variant="outline"
              type="button"
              onClick={remove}
              disabled={index === 0}
            >
              <CircleMinus />
              <span className="sr-only">Remove document</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ControlledFileWithSelectInput;
