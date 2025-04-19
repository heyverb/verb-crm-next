"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CommonInput from "../common/CommonInput";
import ControlledSelect from "../common/ControlledSelect";
import {
  CreateAdmissionDefaultValues,
  CreateAdmissionSchema,
} from "@/appwrite/schema/admission.schema";
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
import CommonFileInput from "../common/CommonFileInput";
import { CircleMinus, CirclePlus } from "lucide-react";
import useApi from "@/hooks/useApi";
import { CreateAdmission } from "@/appwrite/services/admission";
import { getErrorMessage } from "@/lib/error.helper";
import Loader from "../common/Loader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface CreateAdmissionType
  extends z.infer<typeof CreateAdmissionSchema> {
  id?: string;
}

type AdmissionFormProps = {
  admission?: string;
  onSubmit?: (data: CreateAdmissionType) => void;
  defaultValues?: CreateAdmissionType;
  type?: "create" | "update";
};

export function AdmissionForm({
  admission,
  defaultValues,
}: AdmissionFormProps) {
  const router = useRouter();
  const form = useForm<CreateAdmissionType>({
    resolver: zodResolver(CreateAdmissionSchema),
    defaultValues: defaultValues || CreateAdmissionDefaultValues,
    mode: "all",
  });

  const {
    fields: guardianField,
    append: guardianAppend,
    remove: guardianRemove,
  } = useFieldArray({
    control: form.control,
    name: "guardian_document",
  });

  const {
    fields: studentField,
    append: studentAppend,
    remove: studentRemove,
  } = useFieldArray({
    control: form.control,
    name: "student_document",
  });

  const { mutation, isLoading } = useApi(CreateAdmission);

  async function handleSubmit(values: z.infer<typeof CreateAdmissionSchema>) {
    console.log(values);

    try {
      await mutation.mutateAsync({
        ...values,
        student_document: values.student_document.map((item) =>
          JSON.stringify(item)
        ),
        guardian_document: values.guardian_document.map((item) =>
          JSON.stringify(item)
        ),
      });
      toast.success("Admission created successfully");
      router.replace("/dashboard/admissions/applications");
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-2 space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Student Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <CommonInput<CreateAdmissionType, "fname">
              control={form.control}
              name="fname"
              label="First Name"
              placeholder="Mayank"
            />

            <CommonInput<CreateAdmissionType, "lname">
              control={form.control}
              name="lname"
              label="Last Name"
              placeholder="Thakur"
            />

            <CommonDatepicker<CreateAdmissionType, "dob">
              control={form.control}
              name="dob"
              label="Date of Birth"
              placeholder="Date of Birth"
            />

            <ControlledSelect<CreateAdmissionType, "gender">
              control={form.control}
              name="gender"
              label="Gender"
              placeholder="Gender"
              options={enumToArray(GenderEnum)}
            />
            <ControlledSelect<CreateAdmissionType, "cast">
              control={form.control}
              name="cast"
              label="Cast"
              placeholder="Cast"
              options={enumToArray(CastEnum)}
            />
            <ControlledSelect<CreateAdmissionType, "religion">
              control={form.control}
              name="religion"
              label="Religion"
              placeholder="Religion"
              options={enumToArray(ReligionEnum)}
            />
            <ControlledSelect<CreateAdmissionType, "bloodgroup">
              control={form.control}
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
              control={form.control}
              name="guardian_first_name"
              label="Guardian First Name"
              placeholder="Guardians First Name"
            />

            <CommonInput<CreateAdmissionType, "guardian_last_name">
              control={form.control}
              name="guardian_last_name"
              label="Guardian Last Name"
              placeholder="Guardians Last Name"
            />

            <CommonInput<CreateAdmissionType, "guardian_phone">
              control={form.control}
              name="guardian_phone"
              label="Guardian Phone"
              placeholder="1234567890"
              type="tel"
            />

            <CommonInput<CreateAdmissionType, "guardian_email">
              control={form.control}
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
              control={form.control}
              name="flat_no"
              label="Flat No (optional)"
              placeholder="eg. 101"
            />

            <CommonInput<CreateAdmissionType, "address_line1">
              control={form.control}
              name="address_line1"
              label="Address line1"
              placeholder="eg. address line1"
            />

            <CommonInput<CreateAdmissionType, "address_line2">
              control={form.control}
              name="address_line2"
              label="Address line2 (optional)"
              placeholder="eg. address line2"
            />

            <CommonInput<CreateAdmissionType, "pincode">
              control={form.control}
              name="pincode"
              label="Pincode"
              placeholder="eg. 202020"
            />

            <ControlledSelect<CreateAdmissionType, "state">
              control={form.control}
              name="state"
              label="State"
              placeholder="State"
              options={getState()}
            />

            <ControlledSelect<CreateAdmissionType, "city">
              control={form.control}
              name="city"
              label="City"
              placeholder="City"
              options={getCity(form.watch("state"))}
              disabled={!form.watch("state")}
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
              <div key={item.id} className="grid gap-4 sm:grid-cols-3">
                <ControlledSelect<
                  CreateAdmissionType, //@ts-expect-error am using index
                  `guardian_document.${index}.name`
                >
                  control={form.control}
                  name={`guardian_document.${index}.name` as const}
                  placeholder="Select type"
                  options={enumToArray(GuardianDocumentTypeEnum)}
                />

                <CommonFileInput<
                  CreateAdmissionType,
                  //@ts-expect-error am using index
                  `guardian_document.${index}.url`
                >
                  control={form.control}
                  name={`guardian_document.${index}.url` as const}
                />
                <div className=" space-x-2">
                  <Button
                    size="icon"
                    className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                    variant="outline"
                    type="button"
                    onClick={() => guardianAppend({ name: "", url: "" })}
                  >
                    <CirclePlus />
                    <span className="sr-only">Add document</span>
                  </Button>
                  <Button
                    size="icon"
                    className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                    variant="outline"
                    type="button"
                    onClick={() => guardianRemove(index)}
                    disabled={index === 0}
                  >
                    <CircleMinus />
                    <span className="sr-only">Remove document</span>
                  </Button>
                </div>
              </div>
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
              <div key={item.id} className="grid gap-4 sm:grid-cols-3">
                <ControlledSelect<
                  CreateAdmissionType, //@ts-expect-error am using index
                  `student_document.${index}.name`
                >
                  control={form.control}
                  name={`student_document.${index}.name` as const}
                  placeholder="Select type"
                  options={enumToArray(StudentDocumentTypeEnum)}
                />
                <CommonFileInput<
                  CreateAdmissionType,
                  //@ts-expect-error am using index
                  `student_document.${index}.url`
                >
                  control={form.control}
                  name={`student_document.${index}.url` as const}
                />
                <div className=" space-x-2">
                  <Button
                    size="icon"
                    className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                    variant="outline"
                    type="button"
                    onClick={() => studentAppend({ name: "", url: "" })}
                  >
                    <CirclePlus />
                    <span className="sr-only">Add document</span>
                  </Button>
                  <Button
                    size="icon"
                    className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                    variant="outline"
                    type="button"
                    onClick={() => studentRemove(index)}
                    disabled={index === 0}
                  >
                    <CircleMinus />
                    <span className="sr-only">Remove document</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader />}
          {admission ? "Update Admission" : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
