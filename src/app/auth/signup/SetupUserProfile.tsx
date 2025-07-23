"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/error.helper";
import { toast } from "sonner";
import {
  SchoolAdminDefaultValues,
  SchoolAdminModel,
  SchoolAdminSchema,
} from "@/appwrite/schema/school.schema";
import { enumToArray } from "@/lib/utils";
import ControlledSelect from "@/components/common/ControlledSelect";
import { SchoolAdminRole } from "@/appwrite/interface/school.interface";
import ControlledPassworInput from "@/components/common/ControlledPassworInput";
import { OnboardingInterface } from "./SignupPage";
import ControlledInput from "@/components/controlled/ControlledInput";

export interface CreateAdmissionType extends SchoolAdminModel {
  id?: string;
}

type AdmissionFormProps = {
  onSubmit?: (data: CreateAdmissionType) => void;
  defaultValues?: CreateAdmissionType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOnboarding: React.Dispatch<
    React.SetStateAction<OnboardingInterface | null>
  >;
};

export function SetupUserProfile({
  setStep,
  setOnboarding,
}: AdmissionFormProps) {
  const form = useForm<CreateAdmissionType>({
    resolver: zodResolver(SchoolAdminSchema),
    defaultValues: SchoolAdminDefaultValues,
    mode: "all",
  });

  async function handleSubmit(values: SchoolAdminModel) {
    console.log(values);

    try {
      setOnboarding((onboarded) => ({ ...onboarded!, ...values }));

      toast.success("Profile created successfully");
      setStep((step) => step + 1);
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  }

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-2 space-y-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to VERB.</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Let&apos;s setup your profile, tell us a bit about yourself.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledInput<CreateAdmissionType, "fname">
              control={form.control}
              name="fname"
              label="First Name"
              placeholder="Mayank"
            />

            <ControlledInput<CreateAdmissionType, "lname">
              control={form.control}
              name="lname"
              label="Last Name"
              placeholder="Thakur"
            />

            <ControlledInput<CreateAdmissionType, "email">
              control={form.control}
              name="email"
              label="Email"
              placeholder="abc@wayverb.com"
            />

            <ControlledSelect<CreateAdmissionType, "role">
              control={form.control}
              name="role"
              label="Role"
              placeholder="Admin"
              options={enumToArray(SchoolAdminRole)}
            />

            <ControlledPassworInput<CreateAdmissionType, "password">
              control={form.control}
              name="password"
              label="Password"
              placeholder="*** *** ***"
            />

            <ControlledPassworInput<CreateAdmissionType, "confirmpassword">
              control={form.control}
              name="confirmpassword"
              label="Confirm Password"
              placeholder="*** *** ***"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </Form>
  );
}
