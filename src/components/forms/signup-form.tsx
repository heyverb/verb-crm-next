"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  ReligionEnum,
} from "@/appwrite/interface/admission.interface";
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

export function SignupForm({ admission, defaultValues }: AdmissionFormProps) {
  const router = useRouter();
  const form = useForm<CreateAdmissionType>({
    resolver: zodResolver(CreateAdmissionSchema),
    defaultValues: defaultValues || CreateAdmissionDefaultValues,
    mode: "all",
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
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create school profile</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter required details below
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Personal Information
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader />}
          {admission ? "Update Admission" : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
