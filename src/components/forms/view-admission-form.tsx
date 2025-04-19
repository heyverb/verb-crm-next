"use client";

import { Control, useFieldArray, useFormContext } from "react-hook-form";
import CommonInput from "../common/CommonInput";
import ControlledSelect from "../common/ControlledSelect";
import { CreateAdmissionSchema } from "@/appwrite/schema/admission.schema";
import * as z from "zod";
import CommonDatepicker from "../common/CommonDatepicker";
import { Separator } from "../ui/separator";
import { enumToArray } from "@/lib/utils";
import {
  BloodgroupEnum,
  CastEnum,
  GenderEnum,
  GuardianDocumentTypeEnum,
  ReligionEnum,
  StudentDocumentTypeEnum,
} from "@/appwrite/interface/admission.interface";
import { getCity, getState } from "@/lib/place.helper";
import { useEffect } from "react";
import ControlledFileWithSelectInput from "../shared/ControlledFileWithSelectInput";

export interface CreateAdmissionType
  extends z.infer<typeof CreateAdmissionSchema> {
  id?: string;
}

type AdmissionFormProps = {
  control?: Control<CreateAdmissionType>;
};

export function ViewUpdateAdmissionForm({ control }: AdmissionFormProps) {
  const { watch } = useFormContext();

  const {
    fields: guardianField,
    append: guardianAppend,
    remove: guardianRemove,
  } = useFieldArray({
    control: control,
    name: "guardian_document",
  });

  const {
    fields: studentField,
    append: studentAppend,
    remove: studentRemove,
  } = useFieldArray({
    control: control,
    name: "student_document",
  });

  useEffect(() => {});

  return (
    <div className="mt-2 space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Student Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <CommonInput<CreateAdmissionType, "fname">
            control={control}
            name="fname"
            label="First Name"
            placeholder="Mayank"
          />

          <CommonInput<CreateAdmissionType, "lname">
            control={control}
            name="lname"
            label="Last Name"
            placeholder="Thakur"
          />

          <CommonDatepicker<CreateAdmissionType, "dob">
            control={control}
            name="dob"
            label="Date of Birth"
            placeholder="Date of Birth"
          />

          <ControlledSelect<CreateAdmissionType, "gender">
            control={control}
            name="gender"
            label="Gender"
            placeholder="Gender"
            options={enumToArray(GenderEnum)}
          />
          <ControlledSelect<CreateAdmissionType, "cast">
            control={control}
            name="cast"
            label="Cast"
            placeholder="Cast"
            options={enumToArray(CastEnum)}
          />
          <ControlledSelect<CreateAdmissionType, "religion">
            control={control}
            name="religion"
            label="Religion"
            placeholder="Religion"
            options={enumToArray(ReligionEnum)}
          />
          <ControlledSelect<CreateAdmissionType, "bloodgroup">
            control={control}
            name="bloodgroup"
            label="Blood group"
            placeholder="Blood group"
            options={enumToArray(BloodgroupEnum)}
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Guardian Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <CommonInput<CreateAdmissionType, "guardian_first_name">
            control={control}
            name="guardian_first_name"
            label="Guardian First Name"
            placeholder="Guardians First Name"
          />

          <CommonInput<CreateAdmissionType, "guardian_last_name">
            control={control}
            name="guardian_last_name"
            label="Guardian Last Name"
            placeholder="Guardians Last Name"
          />

          <CommonInput<CreateAdmissionType, "guardian_phone">
            control={control}
            name="guardian_phone"
            label="Guardian Phone"
            placeholder="1234567890"
            type="tel"
          />

          <CommonInput<CreateAdmissionType, "guardian_email">
            control={control}
            name="guardian_email"
            label="Guardian Email"
            placeholder="guardian@wayverb.com"
            type="email"
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Address Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <CommonInput<CreateAdmissionType, "flat_no">
            control={control}
            name="flat_no"
            label="Flat No (optional)"
            placeholder="eg. 101"
          />

          <CommonInput<CreateAdmissionType, "address_line1">
            control={control}
            name="address_line1"
            label="Address line1"
            placeholder="eg. address line1"
          />

          <CommonInput<CreateAdmissionType, "address_line2">
            control={control}
            name="address_line2"
            label="Address line2 (optional)"
            placeholder="eg. address line2"
          />

          <CommonInput<CreateAdmissionType, "pincode">
            control={control}
            name="pincode"
            label="Pincode"
            placeholder="eg. 202020"
          />

          <ControlledSelect<CreateAdmissionType, "state">
            control={control}
            name="state"
            label="State"
            placeholder="State"
            options={getState()}
          />

          <ControlledSelect<CreateAdmissionType, "city">
            control={control}
            name="city"
            label="City"
            placeholder="City"
            options={getCity(watch("state"))}
            disabled={!watch("state")}
          />
        </div>
      </div>

      <Separator />
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Guardian Document Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-1">
          {guardianField.map((item, index: number) => (
            <ControlledFileWithSelectInput
              key={item.id}
              index={index}
              control={control}
              fileName={`guardian_document.${index}.url` as const}
              selectName={`guardian_document.${index}.name`}
              selectOptions={enumToArray(GuardianDocumentTypeEnum)}
              append={() => guardianAppend({ name: "", url: "" })}
              remove={() => guardianRemove(index)}
            />
          ))}
        </div>
      </div>

      <Separator />
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Student Document Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-1">
          {studentField.map((item, index: number) => (
            <ControlledFileWithSelectInput
              key={item.id}
              index={index}
              control={control}
              fileName={`student_document.${index}.url` as const}
              selectName={`student_document.${index}.name`}
              selectOptions={enumToArray(StudentDocumentTypeEnum)}
              append={() => studentAppend({ name: "", url: "" })}
              remove={() => studentRemove(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
