"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import useApi from "@/hooks/useApi";
import { getErrorMessage } from "@/lib/error.helper";
import { toast } from "sonner";
import { getCity, getState } from "@/lib/place.helper";
import {
  SchoolDefaultValues,
  SchoolModel,
  SchoolSchema,
} from "@/appwrite/schema/school.schema";

import ControlledSelect from "@/components/common/ControlledSelect";
import Loader from "@/components/common/Loader";
import { OnboardingInterface } from "./SignupPage";
import { CreateUser } from "@/appwrite/services/user.service";
import { CreateSchool } from "@/appwrite/services/schools.service";
import ControlledInput from "@/components/controlled/ControlledInput";

export interface CreateAdmissionType extends z.infer<typeof SchoolSchema> {
  id?: string;
}

type AdmissionFormProps = {
  onSubmit?: (data: CreateAdmissionType) => void;
  defaultValues?: CreateAdmissionType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOnboarding: React.Dispatch<
    React.SetStateAction<OnboardingInterface | null>
  >;
  onboardingData?: OnboardingInterface | null;
};

export function SetupSchoolProfile({
  setStep,
  onboardingData,
}: AdmissionFormProps) {
  const form = useForm<CreateAdmissionType>({
    resolver: zodResolver(SchoolSchema),
    defaultValues: SchoolDefaultValues,
    mode: "all",
  });

  const { mutation: schoolMutation, isLoading: schoolLoading } =
    useApi(CreateSchool);

  const { mutation: userMutation, isLoading: userLoading } = useApi(CreateUser);

  async function handleSubmit(values: SchoolModel) {
    try {
      console.log({ ...values, ...onboardingData });

      const userres = await userMutation.mutateAsync(onboardingData);
      await schoolMutation.mutateAsync({
        ...values,
        user: userres.$id,
      });

      toast.success("Admission created successfully");
      // setStep((step) => step + 1);
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  }

  console.log(onboardingData);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-2 space-y-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create school profile</h1>
          <p className="text-balance text-sm text-muted-foreground">
            To start using VERB, you need to create your school profile.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledInput<CreateAdmissionType, "school_name">
              control={form.control}
              name="school_name"
              label="School Name"
              placeholder="example school"
            />

            <ControlledInput<CreateAdmissionType, "pincode">
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

        <Button
          type="submit"
          className="w-full"
          disabled={schoolLoading || userLoading}
        >
          {(schoolLoading || userLoading) && <Loader />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
