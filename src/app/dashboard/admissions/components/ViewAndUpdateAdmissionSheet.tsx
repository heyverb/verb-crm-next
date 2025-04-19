"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CreateAdmissionSchema } from "@/appwrite/schema/admission.schema";
import * as z from "zod";

import useApi from "@/hooks/useApi";
import {
  CreateAdmissionType,
  UpdateAdmission,
} from "@/appwrite/services/admission";
import { getErrorMessage } from "@/lib/error.helper";
import { ViewUpdateAdmissionForm } from "@/components/forms/view-admission-form";
import ModalSheetWithTrigger from "@/components/common/ModalSheetWithTrigger";
import { parseJsonInArray } from "@/lib/utils";
import { StatusEnum } from "@/appwrite/interface/admission.interface";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";
import { useState } from "react";

type AdmissionFormProps = {
  item: CreateAdmissionType;
};

export function ViewUpdateAdmissionFormSheet({ item }: AdmissionFormProps) {
  const [modalState, setModalState] = useState(false);
  const defaultValues = {
    ...item,
    student_document: parseJsonInArray(item.student_document),
    guardian_document: parseJsonInArray(item.guardian_document),
  };

  const form = useForm<CreateAdmissionType>({
    resolver: zodResolver(CreateAdmissionSchema),
    defaultValues: defaultValues,
    mode: "all",
  });

  const { mutation, isLoading } = useApi(UpdateAdmission);
  const { mutation: rejectMutation, isLoading: rejectLoading } =
    useApi(UpdateAdmission);

  async function handleSubmit(values: z.infer<typeof CreateAdmissionSchema>) {
    try {
      await mutation.mutateAsync({
        ...values,
        $id: item.$id,
        student_document: values.student_document.map((item) =>
          JSON.stringify(item)
        ),
        guardian_document: values.guardian_document.map((item) =>
          JSON.stringify(item)
        ),
        status: StatusEnum.Accepted,
      });
      setModalState(!modalState);
      toast.success("Admission updated successfully");
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  }

  async function rejectAdmission(
    values: z.infer<typeof CreateAdmissionSchema>
  ) {
    try {
      await rejectMutation.mutateAsync({
        ...values,
        $id: item.$id,
        student_document: values.student_document.map((item) =>
          JSON.stringify(item)
        ),
        guardian_document: values.guardian_document.map((item) =>
          JSON.stringify(item)
        ),
        status: StatusEnum.Rejected,
      });
      setModalState(!modalState);
      toast.success("Admission rejected successfully");
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  }

  return (
    <ModalSheetWithTrigger
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.fname + " " + item.lname}
        </Button>
      }
      title={item.fname + " " + item.lname}
      description={`Admission details for ${item.fname + " " + item.lname}`}
      footer={[
        <Button
          key={"submit"}
          onClick={form.handleSubmit(handleSubmit)}
          className="w-full bg-green-700 text-white hover:bg-green-900 hover:text-white"
          variant="outline"
          disabled={isLoading}
        >
          {isLoading && <Loader />}
          Approve
        </Button>,
        <Button
          onClick={form.handleSubmit(rejectAdmission)}
          key={"cancel"}
          variant="outline"
          className="w-full border border-red-600 text-red-600 hover:text-red-600"
          disabled={rejectLoading}
        >
          {rejectLoading && <Loader />}
          Reject
        </Button>,
      ]}
    >
      <Form {...form}>
        <form>
          <ViewUpdateAdmissionForm control={form.control} />
        </form>
      </Form>
    </ModalSheetWithTrigger>
  );
}
