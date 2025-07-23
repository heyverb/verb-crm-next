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
} from "@/appwrite/services/admission.service";
import { getErrorMessage } from "@/lib/error.helper";
import { ViewUpdateAdmissionForm } from "@/components/forms/view-admission-form";
import ModalSheetWithTrigger from "@/components/common/ModalSheetWithTrigger";
import { cn, parseJsonInArray } from "@/lib/utils";
import { AdmissionStatusEnum } from "@/appwrite/interface/admission.interface";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";
import { useState } from "react";
import StatusCell from "@/components/common/StatusCell";
import { ExternalLink } from "lucide-react";

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

  async function handleSubmit(values: CreateAdmissionType) {
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
        status: AdmissionStatusEnum.ACCEPTED,
      });
      setModalState(!modalState);
      toast.success("Admission approved successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function rejectAdmission(values: CreateAdmissionType) {
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
        status: AdmissionStatusEnum.REJECTED,
      });
      setModalState(!modalState);
      toast.success("Admission rejected successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const viewStudent = async () => {
    console.log(item.$id);
  };

  return (
    <ModalSheetWithTrigger
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.fname + " " + item.lname}
        </Button>
      }
      title={
        <div className="flex gap-2">
          {item.fname + " " + item.lname}
          <StatusCell message status={item.status!} />
        </div>
      }
      description={`Admission details for ${item.fname + " " + item.lname}`}
      footer={[
        item.status === AdmissionStatusEnum.ACCEPTED ||
        item.status === AdmissionStatusEnum.REJECTED
          ? [
              <Button
                key={"view"}
                onClick={form.handleSubmit(viewStudent)}
                className={cn(
                  "w-full",
                  item.status === AdmissionStatusEnum.ACCEPTED
                    ? "border border-green-600!"
                    : "border border-red-600!"
                )}
                variant="secondary"
                disabled={isLoading}
              >
                View {item.fname + " " + item.lname}
                <ExternalLink />
              </Button>,
            ]
          : [
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
            ],
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
